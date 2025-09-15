import { supabase } from '../../lib/supabase'

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
    const res = await getUserDataTQ(user.id)
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
  // console.log('[signUpUserTQ] sending', { email, userName, lang, theme })
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

/**
 * Получает данные пользователя из базы данных по его идентификатору
 * @param {string} userId - Идентификатор пользователя
 * @returns {Promise<{success: boolean, data?: object, msg?: string}>} - Результат запроса с данными пользователя или сообщением об ошибке
 */
export async function getUserDataTQ(userId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single()

    if (error) {
      return { success: false, msg: error?.message }
    }

    return { success: true, data }
  } catch (error) {
    console.log('error', error)
    return { success: false, msg: error.message }
  }
}
