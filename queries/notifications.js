import { useEffect } from 'react'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotificationsPage,
  fetchUnreadCount,
  markNotificationAsRead,
  subscribeToNotifications,
} from '../service/TQuery/notifications'
import { useNotificationsStore } from '../stores/notificationsStore'

/** Бесконечный список уведомлений (в кэше храним плоский массив). */
export function useNotificationsInfinite(userId, type) {
  return useInfiniteQuery({
    queryKey: ['notifications', userId || 'nouser', type || 'all'],
    enabled: !!userId,
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const res = await fetchNotificationsPage({
        userId,
        after: pageParam || undefined,
        type,
      })
      const page = Array.isArray(res) ? res : []
      const nextCursor = page.length ? page[page.length - 1].created_at : null
      return { page, nextCursor }
    },
    getNextPageParam: (last) => last?.nextCursor ?? undefined,
    // В КОМПОНЕНТ отдаем плоский массив, но в кэше остаётся {pages, pageParams}
    select: (data) => (data?.pages ?? []).flatMap((p) => p?.page ?? []),
  })
}

export function useMarkAsReadMutation(userId, type) {
  const qc = useQueryClient()
  const k = ['notifications', userId || 'nouser', type || 'all']

  // методы стора
  const { decUnread, incUnread } = useNotificationsStore.getState()

  return useMutation({
    mutationFn: (id) => markNotificationAsRead(id, userId),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: k })
      const prev = qc.getQueryData(k)

      // вычищаем из страниц
      qc.setQueryData(k, (old) => {
        if (!old || !Array.isArray(old.pages)) return old
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            page: (p.page ?? []).filter((n) => String(n.id) !== String(id)),
          })),
        }
      })

      // уменьшаем счётчик
      decUnread(type, 1)

      return { prev }
    },

    onError: (_e, _id, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(k, ctx.prev)
      // откат счётчика
      incUnread(type, 1)
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: k })
    },
  })
}

/** Реалтайм-мост: аккуратный merge без лишних refetch. */
export function useNotificationsRealtime(userId, type) {
  const qc = useQueryClient()
  const k = ['notifications', userId || 'nouser', type || 'all']

  useEffect(() => {
    if (!userId) return

    const unsub = subscribeToNotifications(
      userId,
      ({ eventType, new: newRow, old: oldRow }) => {
        const inScope = (row) => !!row && (!type || row.type === type)

        // helper’ы
        const pushIfNotExists = (arr, item) =>
          arr.some((n) => String(n.id) === String(item.id)) ? arr : [...arr, item]

        qc.setQueryData(k, (old) => {
          if (!old || !Array.isArray(old.pages)) return old
          const pages = old.pages.map((p) => ({ ...p, page: [...(p.page ?? [])] }))

          if (eventType === 'INSERT' && newRow && !newRow.is_read && inScope(newRow)) {
            // добавим в первую страницу (или последнюю — как вам удобнее)
            pages[0] = {
              ...pages[0],
              page: pushIfNotExists(pages[0]?.page ?? [], newRow),
            }
          }

          if (eventType === 'UPDATE') {
            const row = newRow || oldRow
            if (!row || !inScope(row)) return { ...old, pages }

            if (row.is_read) {
              // удалить из всех страниц
              for (const p of pages) {
                p.page = p.page.filter((n) => String(n.id) !== String(row.id))
              }
            } else if (newRow) {
              // обновить на месте
              for (const p of pages) {
                p.page = p.page.map((n) =>
                  String(n.id) === String(newRow.id) ? { ...n, ...newRow } : n,
                )
              }
            }
          }

          if (eventType === 'DELETE' && oldRow && inScope(oldRow)) {
            for (const p of pages) {
              p.page = p.page.filter((n) => String(n.id) !== String(oldRow.id))
            }
          }

          return { ...old, pages }
        })
      },
    )

    return unsub
  }, [userId, type, qc])
}
/** Счётчики непрочитанных (комменты/лайки) + realtime обновление. */
export function useUnreadCounters(userId) {
  const setUnread = useNotificationsStore((s) => s.setUnread)

  useEffect(() => {
    let isMounted = true
    if (!userId) return

    Promise.all([
      fetchUnreadCount(userId, 'comment').then(
        (c) => isMounted && setUnread('comment', c),
      ),
      fetchUnreadCount(userId, 'like').then((c) => isMounted && setUnread('like', c)),
    ]).catch(() => {})

    const unsub = subscribeToNotifications(userId, async () => {
      try {
        const [c1, c2] = await Promise.all([
          fetchUnreadCount(userId, 'comment'),
          fetchUnreadCount(userId, 'like'),
        ])
        if (!isMounted) return
        setUnread('comment', c1)
        setUnread('like', c2)
      } catch {}
    })

    return () => {
      isMounted = false
      unsub && unsub()
    }
  }, [userId, setUnread])
}
