import { supabase } from '../../lib/supabase'

const TABLE = 'notifications'
const PAGE_SIZE = 10

export async function fetchNotificationsPage({ userId, after, type }) {
  let q = supabase
    .from(TABLE)
    .select(
      `
      id, recipe_id, message, created_at, is_read, type, actor_id, user_id,
      users!actor_id(user_name, avatar),
      all_recipes_description(title, image_header)
    `,
    )
    .eq('user_id', userId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE)

  if (type) q = q.eq('type', type)
  if (after) q = q.lt('created_at', after)

  const { data, error } = await q
  if (error) throw error
  return Array.isArray(data) ? data : []
}

export async function markNotificationAsRead(id) {
  const { error } = await supabase.from(TABLE).update({ is_read: true }).eq('id', id)
  if (error) throw error
}

// Подписка на realtime (INSERT/UPDATE/DELETE по конкретному пользователю)
export function subscribeToNotifications(userId, handler) {
  if (!userId) return () => {}
  const channel = supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      handler,
    )
    .subscribe()
  return () => supabase.removeChannel(channel)
}

// Хелпер для head-count непрочитанных по типу
export async function fetchUnreadCount(userId, type) {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)
    .eq('type', type)
  if (error) throw error
  return count || 0
}
