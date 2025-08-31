import { supabase } from '../../lib/supabase'
import { getUserData } from '../userService' // если нужно подтянуть профиль из БД

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
    const res = await getUserData(user.id) // ваша существующая функция
    return res?.success ? { ...user, ...res.data } : user
  } catch {
    // даже если профиль не подтянули — всё равно логинимся
    return user
  }
}
/**
 * Регистрация через Supabase Auth.
 * В metadata сразу кладём user_name, lang, theme.
 * Возвращаем user (и при авто-логине session), но имей в виду:
 * если включено подтверждение e-mail в проекте Supabase, session может быть null до подтверждения.
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

  // Если confirm email включён — data.session будет null, а data.user есть
  // Если выключен — будет и session.
  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
  }
}
