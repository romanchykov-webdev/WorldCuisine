import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotificationsPage,
  markNotificationAsRead,
  subscribeToNotifications,
  fetchUnreadCount,
} from '../service/TQuery/notifications'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNotificationsStore } from '../stores/notificationsStore'

// ключи
const key = (userId, type) => ['notifications', userId || 'nouser', type || 'all']

/**
 *
 * @param userId
 * @param type
 * @returns {UseInfiniteQueryResult<unknown[], DefaultError>}
 */
export function useNotificationsInfinite(userId, type) {
  return useInfiniteQuery({
    queryKey: key(userId, type),
    enabled: !!userId,
    initialPageParam: null, // after cursor (created_at)
    queryFn: async ({ pageParam }) => {
      const page = await fetchNotificationsPage({
        userId,
        after: pageParam || undefined,
        type,
      })
      const nextCursor = page.length ? page[page.length - 1].created_at : null
      return { page, nextCursor }
    },
    // getNextPageParam: (last) => last.nextCursor,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((p) => p.page),
  })
}

/**
 *
 * @param userId
 * @param type
 * @returns {UseMutationResult<void, DefaultError, void, {prev: unknown}>}
 */
export function useMarkAsReadMutation(userId, type) {
  const qc = useQueryClient()
  const k = key(userId, type)
  return useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: k })
      const prev = qc.getQueryData(k)
      if (prev) {
        qc.setQueryData(
          k,
          prev.filter((n) => n.id !== id),
        )
      }
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(k, ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: k })
    },
  })
}

// Реалтайм мост: аккуратный merge без лишних refetch
/**
 *
 * @param userId
 * @param type
 */
export function useNotificationsRealtime(userId, type) {
  const qc = useQueryClient()
  // const setUnread = useAuthStore((s) => s.setRequiredFields)
  useEffect(() => {
    if (!userId) return
    const unsub = subscribeToNotifications(userId, async (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload

      const k = key(userId, type)
      const list = qc.getQueryData(k)

      // Фильтруем по типу, если он задан
      const inScope = (row) => {
        if (!row) return false
        if (type) return row.type === type
        return true
      }

      if (eventType === 'INSERT' && newRow && !newRow.is_read && inScope(newRow)) {
        // Вставляем сверху (список у нас уже отсортирован asc, но UX — ок добавить в конец тоже)
        if (Array.isArray(list)) {
          const exists = list.some((n) => n.id === newRow.id)
          if (!exists) {
            qc.setQueryData(k, [...list, newRow])
          }
        } else {
          // если данных нет, просто инвалидация
          qc.invalidateQueries({ queryKey: k })
        }
      }

      if (eventType === 'UPDATE') {
        // если стало прочитанным — убрать
        const row = newRow || oldRow
        if (row && row.is_read && inScope(row)) {
          if (Array.isArray(list)) {
            qc.setQueryData(
              k,
              list.filter((n) => n.id !== row.id),
            )
          } else {
            qc.invalidateQueries({ queryKey: k })
          }
        }
        // если апдейт по тексту и оно непрочитанное — можно заменить
        if (newRow && !newRow.is_read && inScope(newRow) && Array.isArray(list)) {
          qc.setQueryData(
            k,
            list.map((n) => (n.id === newRow.id ? { ...n, ...newRow } : n)),
          )
        }
      }

      if (eventType === 'DELETE' && oldRow && inScope(oldRow)) {
        if (Array.isArray(list)) {
          qc.setQueryData(
            k,
            list.filter((n) => n.id !== oldRow.id),
          )
        } else {
          qc.invalidateQueries({ queryKey: k })
        }
      }

      // Опционально — подтягивать счётчик (лучше отдельным store-экшеном)
      // Здесь только пример вызова: await fetchUnreadCount(userId, type)
      // Рекомендуется хранить счетчики в zustand и вызвать там setUnread(type, count)
    })
    return unsub
  }, [userId, type, qc])
}

/**
 *
 * @param userId
 */
export function useUnreadCounters(userId) {
  const setUnread = useNotificationsStore((s) => s.setUnread)

  useEffect(() => {
    let isMounted = true
    if (!userId) return

    // первичная загрузка
    Promise.all([
      fetchUnreadCount(userId, 'comment').then(
        (c) => isMounted && setUnread('comment', c),
      ),
      fetchUnreadCount(userId, 'like').then((c) => isMounted && setUnread('like', c)),
    ]).catch(() => {})

    // realtime обновление (любой INSERT/UPDATE/DELETE)
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
