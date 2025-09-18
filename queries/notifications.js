import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotificationsPage,
  markNotificationAsRead,
  subscribeToNotifications,
  fetchUnreadCount,
} from '../service/TQuery/notifications'
import { useEffect } from 'react'
import { useNotificationsStore } from '../stores/notificationsStore'

// ключи
const key = (userId, type) => ['notifications', userId || 'nouser', type || 'all']

/**
 *
 * @param userId
 * @param type
 * @returns {UseInfiniteQueryResult<unknown[], DefaultError>}
 */
// export function useNotificationsInfinite(userId, type) {
//   return useInfiniteQuery({
//     queryKey: key(userId, type),
//     enabled: !!userId,
//     initialPageParam: null, // after cursor (created_at)
//     queryFn: async ({ pageParam }) => {
//       const page = await fetchNotificationsPage({
//         userId,
//         after: pageParam || undefined,
//         type,
//       })
//       const nextCursor = page.length ? page[page.length - 1].created_at : null
//       return { page, nextCursor }
//     },
//     // getNextPageParam: (last) => last.nextCursor,
//     // getNextPageParam: (last) => last.nextCursor ?? undefined,
//     // select: (data) => data.pages.flatMap((p) => p.page),
//     getNextPageParam: (last) => last.nextCursor ?? undefined,
//   })
// }
export function useNotificationsInfinite(userId, type) {
  return useInfiniteQuery({
    queryKey: key(userId, type),
    enabled: !!userId,
    initialPageParam: null,
    queryFn: async ({ pageParam }) => {
      const page = await fetchNotificationsPage({
        userId,
        after: pageParam || undefined,
        type,
      })
      const nextCursor = page.length ? page[page.length - 1].created_at : null
      return { page, nextCursor }
    },
    getNextPageParam: (last) => last.nextCursor ?? undefined,

    //возвращаем плоский массив!
    select: (data) => data.pages.flatMap((p) => p.page),
  })
}

/**
 *
 * @param userId
 * @param type
 * @returns {UseMutationResult<void, DefaultError, void, {prev: unknown}>}
 */
// export function useMarkAsReadMutation(userId, type) {
//   const qc = useQueryClient()
//   const k = key(userId, type)
//   const dec = useNotificationsStore((s) => s.setUnread)
//
//   return useMutation({
//     mutationFn: (id) => markNotificationAsRead(id, userId),
//     onMutate: async (id) => {
//       await qc.cancelQueries({ queryKey: k })
//       const prev = qc.getQueryData(k)
//
//       if (Array.isArray(prev)) {
//         qc.setQueryData(
//           k,
//           prev.filter((n) => String(n.id) !== String(id)),
//         )
//       }
//       qc.setQueryData(k, (old) => {
//         if (!old || !old.pages) return old
//         return {
//           ...old,
//           pages: old.pages.map((pg) => ({
//             ...pg,
//             page: Array.isArray(pg.page)
//               ? pg.page.filter((n) => String(n.id) !== String(id))
//               : pg.page,
//           })),
//         }
//       })
//
//       // оптимистично уменьшаем счётчик (если хочешь)
//       if (type === 'comment')
//         dec(
//           'comment',
//           Math.max(0, useNotificationsStore.getState().unreadCommentsCount - 1),
//         )
//       if (type === 'like')
//         dec('like', Math.max(0, useNotificationsStore.getState().unreadLikesCount - 1))
//
//       return { prev }
//     },
//     onError: (_e, _id, ctx) => {
//       if (ctx?.prev !== undefined) qc.setQueryData(k, ctx.prev)
//     },
//     onSettled: () => {
//       qc.invalidateQueries({ queryKey: k })
//     },
//   })
// }
export function useMarkAsReadMutation(userId, type) {
  const qc = useQueryClient()
  const k = key(userId, type)
  return useMutation({
    mutationFn: (id) => markNotificationAsRead(id, userId),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: k })
      const prev = qc.getQueryData(k) // здесь prev — уже ПЛОСКИЙ массив
      if (Array.isArray(prev)) {
        qc.setQueryData(
          k,
          prev.filter((n) => n.id !== id),
        )
      }
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(k, ctx.prev)
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

// export function useNotificationsRealtime(userId, type) {
//   const qc = useQueryClient()
//   useEffect(() => {
//     if (!userId) return
//     const unsub = subscribeToNotifications(userId, async (payload) => {
//       const { eventType, new: newRow, old: oldRow } = payload
//       const k = key(userId, type)
//
//       const inScope = (row) => {
//         if (!row) return false
//         return type ? row.type === type : true
//       }
//
//       if (eventType === 'INSERT' && newRow && !newRow.is_read && inScope(newRow)) {
//         qc.setQueryData(k, (old) => {
//           if (!old || !old.pages) return old
//           // добавим во вторую (последнюю) страницу или в первую — реши сам.
//           // Здесь добавим в первую страницу (начало списка).
//           const first = old.pages[0]
//           const exists = old.pages
//             .flatMap((p) => p.page || [])
//             .some((n) => n.id === newRow.id)
//           if (exists) return old
//           const newFirst = {
//             ...first,
//             page: [newRow, ...(first?.page || [])],
//           }
//           return { ...old, pages: [newFirst, ...old.pages.slice(1)] }
//         })
//       }
//
//       if (eventType === 'UPDATE') {
//         const row = newRow || oldRow
//         if (!row) return
//         if (row.is_read && inScope(row)) {
//           qc.setQueryData(k, (old) => {
//             if (!old || !old.pages) return old
//             return {
//               ...old,
//               pages: old.pages.map((pg) => ({
//                 ...pg,
//                 page: Array.isArray(pg.page)
//                   ? pg.page.filter((n) => n.id !== row.id)
//                   : pg.page,
//               })),
//             }
//           })
//         } else if (newRow && !newRow.is_read && inScope(newRow)) {
//           qc.setQueryData(k, (old) => {
//             if (!old || !old.pages) return old
//             return {
//               ...old,
//               pages: old.pages.map((pg) => ({
//                 ...pg,
//                 page: Array.isArray(pg.page)
//                   ? pg.page.map((n) => (n.id === newRow.id ? { ...n, ...newRow } : n))
//                   : pg.page,
//               })),
//             }
//           })
//         }
//       }
//
//       if (eventType === 'DELETE' && oldRow && inScope(oldRow)) {
//         qc.setQueryData(k, (old) => {
//           if (!old || !old.pages) return old
//           return {
//             ...old,
//             pages: old.pages.map((pg) => ({
//               ...pg,
//               page: Array.isArray(pg.page)
//                 ? pg.page.filter((n) => n.id !== oldRow.id)
//                 : pg.page,
//             })),
//           }
//         })
//       }
//     })
//     return unsub
//   }, [userId, type, qc])
// }
export function useNotificationsRealtime(userId, type) {
  const qc = useQueryClient()
  const k = key(userId, type)

  React.useEffect(() => {
    if (!userId) return
    const unsub = subscribeToNotifications(userId, (payload) => {
      const { eventType, new: newRow, old: oldRow } = payload
      const list = qc.getQueryData(k) || []

      const inScope = (row) => (!row ? false : !type || row.type === type)

      if (eventType === 'INSERT' && newRow && !newRow.is_read && inScope(newRow)) {
        const exists = list.some((n) => n.id === newRow.id)
        if (!exists) qc.setQueryData(k, [...list, newRow])
      }

      if (eventType === 'UPDATE') {
        const row = newRow || oldRow
        if (row && row.is_read && inScope(row)) {
          qc.setQueryData(
            k,
            list.filter((n) => n.id !== row.id),
          )
        } else if (newRow && !newRow.is_read && inScope(newRow)) {
          qc.setQueryData(
            k,
            list.map((n) => (n.id === newRow.id ? { ...n, ...newRow } : n)),
          )
        }
      }

      if (eventType === 'DELETE' && oldRow && inScope(oldRow)) {
        qc.setQueryData(
          k,
          list.filter((n) => n.id !== oldRow.id),
        )
      }
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
