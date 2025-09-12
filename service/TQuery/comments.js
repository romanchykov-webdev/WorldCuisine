import { supabase } from '../../lib/supabase'

/** Базовый fetch комментариев  */
async function _fetchComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, user_id_commented, comment, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return data || []
}

/** Дотягиваем пользователей пачкой и мёржим */
async function _fetchUsersByIds(ids) {
  if (!ids?.length) return []
  const { data, error } = await supabase
    .from('users')
    .select('id, avatar, user_name')
    .in('id', ids)
  if (error) throw new Error(error.message)
  return data || []
}

/** Публичная функция: комментарии + данные юзеров */
export async function getCommentsWithUsers(postId) {
  const comments = await _fetchComments(postId)
  const uniqIds = Array.from(
    new Set(comments.map((c) => c.user_id_commented).filter(Boolean)),
  )
  const users = await _fetchUsersByIds(uniqIds)
  const usersMap = new Map(users.map((u) => [u.id, u]))
  return comments.map((c) => ({
    ...c,
    user: usersMap.get(c.user_id_commented) || null, // { id, avatar, user_name }
  }))
}

// add comment
export async function addComment({ postId, userId, text }) {
  const { data, error } = await supabase
    .from('comments')
    .insert([{ post_id: postId, user_id_commented: userId, comment: text }])
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

//delete comment
export async function deleteComment(commentId) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  if (error) throw new Error(error.message)
  return true
}
