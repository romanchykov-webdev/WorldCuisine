import { supabase } from '../../lib/supabase'

/** Обновить профиль пользователя в таблице users */
export async function updateUserTQ({ userId, data }) {
  const { error } = await supabase.from('users').update(data).eq('id', userId)
  if (error) throw new Error(error.message)
  return data // вернём что записали
}

/** Удалить пользователя из таблицы users (каскад за триггером) */
export async function deleteUserTQ({ userId }) {
  const { error } = await supabase.from('users').delete().eq('id', userId)
  if (error) throw new Error(error.message)
  return true
}
