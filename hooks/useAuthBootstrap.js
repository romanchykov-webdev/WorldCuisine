import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'expo-router'
import { supabase } from '../lib/supabase'
import { getDeviceLang, useLangStore } from '../stores/langStore'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { getUserDataTQ } from '../service/TQuery/auth'
import {
  registerForPushNotificationsAsync,
  upsertUserPushToken,
} from '../lib/pushNotifications'

/**
 * Инициализирует сессию, подтягивает профиль, ставит тему/язык,
 * и подписывается на onAuthStateChange (с авто-очисткой).
 * Возвращает isBootstrapping (true во время первичной загрузки).
 */
export function useAuthBootstrap() {
  const router = useRouter()
  const pathname = usePathname()

  const setLang = useLangStore((s) => s.setLang)
  const setAuth = useAuthStore((s) => s.setAuth)
  // const setUserData = useAuthStore((s) => s.setUserData)

  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)
  const subscribeToSystemTheme = useThemeStore((s) => s.subscribeToSystemTheme)

  const [isBootstrapping, setIsBootstrapping] = useState(true)

  const mountedRef = useRef(true)

  const safeApplyTheme = useCallback(() => {
    try {
      applyTheme()
    } catch {}
  }, [applyTheme])

  // Вспомогательная: загрузить профиль и применить настройки + пуш-токен
  const hydrateFromSession = useCallback(
    async (session) => {
      const userId = session?.user?.id
      if (!userId) throw new Error('No user in session')

      // профиль из public.users
      const res = await getUserDataTQ(userId)
      const row = res?.success ? res.data : null

      const meta = session.user?.user_metadata ?? {}
      const finalTheme = row?.theme ?? meta?.theme ?? 'auto'
      const finalLang = row?.app_lang ?? meta?.lang ?? getDeviceLang()

      const authData = row ? { ...session.user, ...row } : session.user

      setAuth(authData)
      setPreferredTheme(finalTheme)
      safeApplyTheme()
      setLang(finalLang)

      // Регистрация/сохранение push-токена
      try {
        const token = await registerForPushNotificationsAsync()
        if (token) await upsertUserPushToken(userId, token)
      } catch {}
    },
    [setAuth, setPreferredTheme, safeApplyTheme, setLang],
  )

  // useEffect(() => {
  //   let isMounted = true
  //   const unsubscribeTheme = subscribeToSystemTheme()
  //
  //   const init = async () => {
  //     try {
  //       // применить текущую тему сразу
  //       applyTheme()
  //
  //       const {
  //         data: { session },
  //       } = await supabase.auth.getSession()
  //       if (!isMounted) return
  //
  //       if (session) {
  //         const res = await getUserDataTQ(session.user.id)
  //         const row = res?.success ? res.data : null
  //
  //         // 1) данные из public.users (если уже есть строка)
  //         const fromDbTheme = row?.theme
  //         const fromDbLang = row?.app_lang
  //
  //         // 2) резерв — из auth.user_metadata
  //         const meta = session.user?.user_metadata ?? {}
  //         const fromMetaTheme = meta?.theme
  //         const fromMetaLang = meta?.lang
  //
  //         // 3) итоговые значения
  //         const finalTheme = fromDbTheme ?? fromMetaTheme ?? 'auto'
  //         const finalLang = fromDbLang ?? fromMetaLang ?? getDeviceLang()
  //
  //         const authData = row ? { ...session.user, ...row } : session.user
  //
  //         setAuth(authData)
  //         setUserData(authData)
  //
  //         setPreferredTheme(finalTheme)
  //         applyTheme()
  //
  //         setLang(finalLang)
  //       } else {
  //         setAuth(null)
  //         setLang(getDeviceLang())
  //         setPreferredTheme('auto')
  //         applyTheme()
  //       }
  //
  //       setIsBootstrapping(false)
  //     } catch (e) {
  //       console.error('init session error:', e)
  //       if (!isMounted) return
  //       setAuth(null)
  //       setLang(getDeviceLang())
  //       setPreferredTheme('auto')
  //       applyTheme()
  //       setIsBootstrapping(false)
  //     }
  //   }
  //
  //   init()
  //
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(async (event, session) => {
  //     if (!isMounted) return
  //     // console.log('[auth] event=', event, 'pathname=', pathname)
  //     if (event === 'SIGNED_IN' && session && event !== 'INITIAL_SESSION') {
  //       try {
  //         const res = await getUserDataTQ(session.user.id)
  //         const row = res?.success ? res.data : null
  //
  //         const fromDbTheme = row?.theme
  //         const fromDbLang = row?.app_lang
  //
  //         const meta = session.user?.user_metadata ?? {}
  //         const fromMetaTheme = meta?.theme
  //         const fromMetaLang = meta?.lang
  //
  //         const finalTheme = fromDbTheme ?? fromMetaTheme ?? 'auto'
  //         const finalLang = fromDbLang ?? fromMetaLang ?? getDeviceLang()
  //
  //         const authData = row ? { ...session.user, ...row } : session.user
  //
  //         setAuth(authData)
  //         setUserData(authData)
  //
  //         setPreferredTheme(finalTheme)
  //         applyTheme()
  //
  //         setLang(finalLang)
  //       } catch (err) {
  //         console.error('onAuthStateChange SIGNED_IN error:', err)
  //       }
  //     }
  //
  //     if (event === 'SIGNED_OUT') {
  //       setAuth(null)
  //       setLang(getDeviceLang())
  //       setPreferredTheme('auto')
  //       applyTheme()
  //       if (pathname !== '/') {
  //         router.replace('/')
  //       }
  //     }
  //   })
  //
  //   return () => {
  //     isMounted = false
  //     subscription?.unsubscribe?.()
  //     unsubscribeTheme?.()
  //   }
  //   // зависимостей нет: это одноразовая инициализация
  // }, [])

  useEffect(() => {
    mountedRef.current = true
    const unsubscribeTheme = subscribeToSystemTheme()

    ;(async () => {
      try {
        // Применим текущую тему сразу (если сохранена локально)
        safeApplyTheme()

        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!mountedRef.current) return

        if (session) {
          await hydrateFromSession(session)
        } else {
          setAuth(null)
          setLang(getDeviceLang())
          setPreferredTheme('auto')
          safeApplyTheme()
        }

        setIsBootstrapping(false)
      } catch (e) {
        console.error('init session error:', e)
        if (!mountedRef.current) return
        setAuth(null)
        setLang(getDeviceLang())
        setPreferredTheme('auto')
        safeApplyTheme()
        setIsBootstrapping(false)
      }
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mountedRef.current) return
      // Возможные события: INITIAL_SESSION | SIGNED_IN | SIGNED_OUT | TOKEN_REFRESHED | USER_UPDATED
      try {
        if (event === 'INITIAL_SESSION') {
          if (session) await hydrateFromSession(session)
          else {
            setAuth(null)
            setLang(getDeviceLang())
            setPreferredTheme('auto')
            safeApplyTheme()
          }
        }

        if (event === 'SIGNED_IN' && session) {
          await hydrateFromSession(session)
        }

        if (event === 'USER_UPDATED' && session) {
          // На случай смены метаданных профиля (язык/тема)
          await hydrateFromSession(session)
        }

        if (event === 'SIGNED_OUT') {
          setAuth(null)
          setLang(getDeviceLang())
          setPreferredTheme('auto')
          safeApplyTheme()
          if (pathname !== '/') router.replace('/')
        }
      } catch (err) {
        console.error('onAuthStateChange error:', err)
      }
    })

    return () => {
      mountedRef.current = false
      subscription?.unsubscribe?.()
      unsubscribeTheme?.()
    }
  }, [
    pathname,
    subscribeToSystemTheme,
    safeApplyTheme,
    hydrateFromSession,
    setAuth,
    setLang,
    setPreferredTheme,
    router,
  ])

  return { isBootstrapping }
}
