import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'expo-router'
import { supabase } from '../lib/supabase'
import { getUserData } from '../service/userService'
import { getDeviceLang, useLangStore } from '../stores/langStore'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

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
  const setUserData = useAuthStore((s) => s.setUserData)

  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)
  const subscribeToSystemTheme = useThemeStore((s) => s.subscribeToSystemTheme)

  const [isBootstrapping, setIsBootstrapping] = useState(true)

  useEffect(() => {
    let isMounted = true
    const unsubscribeTheme = subscribeToSystemTheme()

    const init = async () => {
      try {
        // применить текущую тему сразу
        applyTheme()

        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!isMounted) return

        if (session) {
          const res = await getUserData(session.user.id)
          const authData = res?.success ? { ...session.user, ...res.data } : session.user

          setAuth(authData)
          setUserData(authData)

          setPreferredTheme(authData?.theme || 'auto')
          applyTheme()

          setLang(authData?.app_lang || getDeviceLang())
        } else {
          setAuth(null)
          setLang(getDeviceLang())
          setPreferredTheme('auto')
          applyTheme()
        }

        setIsBootstrapping(false)
      } catch (e) {
        console.error('init session error:', e)
        if (!isMounted) return
        setAuth(null)
        setLang(getDeviceLang())
        setPreferredTheme('auto')
        applyTheme()
        setIsBootstrapping(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return

      if (event === 'SIGNED_IN' && session && event !== 'INITIAL_SESSION') {
        try {
          const res = await getUserData(session.user.id)
          const authData = res?.success ? { ...session.user, ...res.data } : session.user

          setAuth(authData)
          setUserData(authData)

          setPreferredTheme(authData?.theme || 'auto')
          applyTheme()

          setLang(authData?.app_lang || getDeviceLang())

          if (pathname === '/' || pathname === '/(main)/welcome') {
            router.replace('/homeScreen')
          }
        } catch (err) {
          console.error('onAuthStateChange SIGNED_IN error:', err)
        }
      }

      if (event === 'SIGNED_OUT') {
        setAuth(null)
        setLang(getDeviceLang())
        setPreferredTheme('auto')
        applyTheme()
        if (pathname !== '/(main)/welcome') {
          router.replace('/(main)/welcome')
        }
      }
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe?.()
      unsubscribeTheme?.()
    }
    // зависимостей нет: это одноразовая инициализация
  }, [])

  return { isBootstrapping }
}
