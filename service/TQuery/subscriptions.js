import { supabase } from '../../lib/supabase'

/** Данные создателя */
export async function getCreatorDataTQ({ creatorId }) {
  if (!creatorId) return null
  const { data, error } = await supabase
    .from('users') // таблица профилей, поправь если у тебя другая
    .select('id, user_name, avatar, subscribers')
    .eq('id', creatorId)
    .limit(1)

  if (error) throw new Error(error.message)
  const row = data?.[0]
  if (!row) return null
  return {
    creatorId: row.id,
    creatorName: row.user_name,
    creatorAvatar: row.avatar,
    creatorSubscribers: row.subscribers ?? 0,
  }
}

/** Подписан ли пользователь на автора */
export async function isSubscribedTQ({ subscriberId, creatorId }) {
  if (!subscriberId || !creatorId) return false
  const { data, error } = await supabase
    .from('subscriptions')
    .select('creator_id')
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
    .limit(1)

  if (error) throw new Error(error.message)
  return (data?.length ?? 0) > 0
}

/** Подписка */
export async function subscribeTQ({ subscriberId, creatorId }) {
  const { error } = await supabase.from('subscriptions').insert({
    subscriber_id: subscriberId,
    creator_id: creatorId,
  })
  if (error) throw new Error(error.message)
  return true
}

/** Отписка */
export async function unsubscribeTQ({ subscriberId, creatorId }) {
  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('subscriber_id', subscriberId)
    .eq('creator_id', creatorId)
  if (error) throw new Error(error.message)
  return true
}
