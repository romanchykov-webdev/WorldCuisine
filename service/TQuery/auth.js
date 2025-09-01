//TQuery
import { supabase } from '../../lib/supabase'
import { getUserData } from '../userService'

/**
 * Логин через Supabase Auth + (опционально) подкачка профиля.
 * Возвращает объединённый объект пользователя для стора.
 */
export async function loginUserTQ({ email, password, withProfile = true }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)

  const user = data?.user
  if (!user) throw new Error('No user session returned')

  if (!withProfile) return user

  try {
    const res = await getUserData(user.id)
    return res?.success ? { ...user, ...res.data } : user
  } catch {
    // даже если профиль не подтянули — всё равно логинимся
    return user
  }
}

/**
 * Регистрация через Supabase Auth.
 * В metadata сразу кладём user_name, lang, theme.
 * Возвращает user и session.
 * NB: если в Supabase включено подтверждение e-mail — session=null до подтверждения.
 */
export async function signUpUserTQ({ email, password, userName, lang, theme }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        user_name: userName,
        lang,
        theme,
        avatar: null,
      },
    },
  })

  if (error) throw new Error(error.message)

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
  }
}

/** Разлогиниться в Supabase */
export async function logoutTQ() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
    return { success: true }
  } catch (e) {
    return { success: false, message: e?.message ?? 'Logout failed' }
  }
}
