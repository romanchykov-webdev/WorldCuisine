import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'expo-router'
import { supabase } from '../lib/supabase'
import { getDeviceLang, useLangStore } from '../stores/langStore'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { getUserDataTQ } from '../service/TQuery/auth'

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
          const res = await getUserDataTQ(session.user.id)
          const row = res?.success ? res.data : null

          // 1) данные из public.users (если уже есть строка)
          const fromDbTheme = row?.theme
          const fromDbLang = row?.app_lang

          // 2) резерв — из auth.user_metadata
          const meta = session.user?.user_metadata ?? {}
          const fromMetaTheme = meta?.theme
          const fromMetaLang = meta?.lang

          // 3) итоговые значения
          const finalTheme = fromDbTheme ?? fromMetaTheme ?? 'auto'
          const finalLang = fromDbLang ?? fromMetaLang ?? getDeviceLang()

          const authData = row ? { ...session.user, ...row } : session.user

          setAuth(authData)
          setUserData(authData)

          setPreferredTheme(finalTheme)
          applyTheme()

          setLang(finalLang)
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
      // console.log('[auth] event=', event, 'pathname=', pathname)
      if (event === 'SIGNED_IN' && session && event !== 'INITIAL_SESSION') {
        try {
          const res = await getUserDataTQ(session.user.id)
          const row = res?.success ? res.data : null

          const fromDbTheme = row?.theme
          const fromDbLang = row?.app_lang

          const meta = session.user?.user_metadata ?? {}
          const fromMetaTheme = meta?.theme
          const fromMetaLang = meta?.lang

          const finalTheme = fromDbTheme ?? fromMetaTheme ?? 'auto'
          const finalLang = fromDbLang ?? fromMetaLang ?? getDeviceLang()

          const authData = row ? { ...session.user, ...row } : session.user

          setAuth(authData)
          setUserData(authData)

          setPreferredTheme(finalTheme)
          applyTheme()

          setLang(finalLang)
        } catch (err) {
          console.error('onAuthStateChange SIGNED_IN error:', err)
        }
      }

      if (event === 'SIGNED_OUT') {
        setAuth(null)
        setLang(getDeviceLang())
        setPreferredTheme('auto')
        applyTheme()
        if (pathname !== '/') {
          router.replace('/')
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
