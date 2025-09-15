import { supabase } from '../../lib/supabase'

/** Обновить профиль пользователя в таблице users */
export async function updateUserTQ({ userId, data }) {
  const { error } = await supabase.from('users').update(data).eq('id', userId)
  if (error) throw new Error(error.message)
  return data // вернём что записали
}

/** Удалить пользователя из таблицы users (каскад за триггером) */
export async function deleteUserTQ({ userId }) {
  if (!userId) throw new Error('userId is required')

  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession()

  if (sessErr) throw new Error(sessErr.message)
  if (!session?.access_token) throw new Error('Not authenticated')

  const { data, error } = await supabase.functions.invoke('delete-user', {
    body: { userId },
    headers: { Authorization: `Bearer ${session.access_token}` },
  })

  if (error) throw error
  return { success: true }
}
