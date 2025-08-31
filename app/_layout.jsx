import { Stack, usePathname, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { QueryClientProvider, focusManager } from '@tanstack/react-query'
import * as Localization from 'expo-localization'

import { supabase } from '../lib/supabase'
import { queryClient } from '../lib/queryClient'
import { getUserData } from '../service/userService'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { getDeviceLang, useLangStore } from '../stores/langStore'
import '../global.css'
import i18n from '../lang/i18n'

function _layout() {
  const lang = useLangStore((s) => s.lang)

  // Effect #1: фокус для React Query
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active')
    })
    return () => sub.remove()
  }, [])

  // Effect #2: обновляем i18n при смене lang
  useEffect(() => {
    i18n.locale = lang
  }, [lang])

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayout />
    </QueryClientProvider>
  )
}

function RootLayout() {
  const router = useRouter()
  const pathname = usePathname()

  const setLang = useLangStore((s) => s.setLang)
  const setAuth = useAuthStore((s) => s.setAuth)
  const setUserData = useAuthStore((s) => s.setUserData)

  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)
  const subscribeToSystemTheme = useThemeStore((s) => s.subscribeToSystemTheme)

  const [isLoading, setIsLoading] = useState(true)
  const [initialRoute, setInitialRoute] = useState('/homeScreen')

  // Effect #3: инициализация (сессия + подписки)
  useEffect(() => {
    let isMounted = true
    const unsubscribeTheme = subscribeToSystemTheme() // одна подписка на системную тему

    const init = async () => {
      try {
        // применим текущую тему немедленно
        applyTheme()

        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!isMounted) return

        if (session) {
          const res = await getUserData(session.user.id)
          const authData = res.success ? { ...session.user, ...res.data } : session.user

          setAuth(authData)
          setUserData(authData)

          // тема из профиля или auto
          setPreferredTheme(authData?.theme || 'auto')
          applyTheme()

          // язык из профиля или язык устройства
          setLang(authData?.app_lang || getDeviceLang())
        } else {
          setAuth(null)
          setLang(getDeviceLang())
          setPreferredTheme('auto')
          applyTheme()
        }

        setIsLoading(false)
      } catch (e) {
        console.error('init session error:', e)
        if (!isMounted) return
        setAuth(null)
        setLang(getDeviceLang())
        setPreferredTheme('auto')
        applyTheme()
        setIsLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return

      if (_event === 'SIGNED_IN' && session && _event !== 'INITIAL_SESSION') {
        try {
          const res = await getUserData(session.user.id)
          const authData = res.success ? { ...session.user, ...res.data } : session.user

          setAuth(authData)
          setUserData(authData)

          setPreferredTheme(authData?.theme || 'auto')
          applyTheme()

          setLang(authData?.app_lang || getDeviceLang())

          if (pathname === '/' || pathname === '/(main)/welcome') {
            router.replace('/homeScreen')
          }
        } catch (error) {
          console.error('onAuthStateChange SIGNED_IN error:', error)
        }
      }

      if (_event === 'SIGNED_OUT') {
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
      subscription.unsubscribe()
      unsubscribeTheme()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]) // router не обязателен, Expo Router стабилен

  // Небольшой эффект редиректа после загрузки
  useEffect(() => {
    if (!isLoading) router.replace('/homeScreen')
  }, [isLoading, router])

  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <Stack initialRouteName={initialRoute}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/welcome" options={{ headerShown: false }} />
      <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RecipeDetailsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/LogInScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/RegistrationScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/CreateRecipeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/RefactorRecipeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/AllRecipesPointScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/AllRecipesBayCreator" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/FavoriteScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/NewCommentsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/NewLikesScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/SearchRecipeScreen" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout
