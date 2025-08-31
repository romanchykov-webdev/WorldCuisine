import { Stack, usePathname, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Appearance, AppState } from 'react-native'
import { QueryClientProvider, focusManager } from '@tanstack/react-query'
//
import { AuthProvider, useAuth } from '../contexts/AuthContext'
//
import { supabase } from '../lib/supabase'
//
import { queryClient } from '../lib/queryClient'
import { getUserData } from '../service/userService'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'

import '../global.css'
import i18n from '../lang/i18n'

function _layout() {
  //
  const lang = useLangStore((s) => s.lang)

  // Подсказка фокусу для RN: активное состояние приложения = "focused"
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active')
    })
    return () => sub.remove()
  }, [])

  // lang
  useEffect(() => {
    i18n.locale = lang
  }, [lang])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    </QueryClientProvider>
  )
}

function RootLayout() {
  const setLang = useLangStore((s) => s.setLang)
  const router = useRouter()
  const pathname = usePathname()

  // CONTEXT (временно, для совместимости экранов)
  const { setAuth: setAuthCtx } = useAuth()

  // ZUSTAND
  const setAuth = useAuthStore((s) => s.setAuth)
  const setUserData = useAuthStore((s) => s.setUserData)

  const preferredTheme = useThemeStore((s) => s.preferredTheme)
  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)

  const [isLoading, setIsLoading] = useState(true)
  const [initialRoute, setInitialRoute] = useState(null)

  // sync device theme when 'auto'
  useEffect(() => {
    if (preferredTheme !== 'auto') return
    const listener = Appearance.addChangeListener(() => {
      applyTheme()
    })
    return () => listener.remove()
  }, [preferredTheme, applyTheme])

  useEffect(() => {
    let isMounted = true

    const checkInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!isMounted) return

        let authData = null
        const route = '/homeScreen'

        if (session) {
          const res = await getUserData(session.user.id)
          authData = res.success ? { ...session.user, ...res.data } : session.user

          // ZUSTAND: записываем пользователя
          setAuth(authData)
          // ТЕМА: берём из профиля если есть, иначе auto
          const userTheme = authData?.theme || 'auto'
          setPreferredTheme(userTheme)
          applyTheme()

          setLang(authData?.app_lang || 'en')
          // CONTEXT: для совместимости
          setAuthCtx(authData)
        } else {
          setAuth(null)
          setAuthCtx(null)
        }

        setInitialRoute(route)
        setTimeout(() => setIsLoading(false), 3000)
      } catch (error) {
        console.error('Error checking initial session:', error)
        if (!isMounted) return
        setAuth(null)
        setAuthCtx(null)
        setInitialRoute('/homeScreen')
        setTimeout(() => setIsLoading(false), 3000)
      }
    }

    checkInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return

      if (_event === 'SIGNED_IN' && session && _event !== 'INITIAL_SESSION') {
        try {
          const res = await getUserData(session.user.id)
          const authData = res.success ? { ...session.user, ...res.data } : session.user

          // ZUSTAND
          setAuth(authData)
          setUserData(authData) // опционально, если нужно дополнить
          const userTheme = authData?.theme || 'auto'
          setPreferredTheme(userTheme)
          applyTheme()
          setLang(authData?.app_lang || 'en')
          // CONTEXT (временно)
          setAuthCtx(authData)

          if (pathname === '/' || pathname === '/(main)/welcome') {
            router.replace('/homeScreen')
          }
        } catch (error) {
          console.error('Error updating user data on sign in:', error)
        }
      } else if (_event === 'SIGNED_OUT') {
        setAuth(null)
        setAuthCtx(null)
        setLang('en')
        if (pathname !== '/(main)/welcome') {
          router.replace('/(main)/welcome')
        }
      }
    })

    return () => {
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [pathname, router, setAuth, setUserData, setPreferredTheme, applyTheme, setAuthCtx, setLang])

  useEffect(() => {
    if (!isLoading) {
      router.replace('/homeScreen')
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    )
  }
  // useAuthStore.getState()
  // console.log('layout useAuthStore', useAuthStore.getState())
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
      <Stack.Screen name="(main)/RefactorRecipeScrean" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/AllRecipesPointScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/AllRecipesBayCreator" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/FavoriteScrean" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/NewCommentsScrean" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/NewLikesScrean" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/SearchRecipeScrean" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout
