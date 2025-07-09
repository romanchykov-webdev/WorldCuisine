import { Stack, usePathname, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'

import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../service/userService'
import '../global.css'

// translate
// import i18n from'../i18n'

function _layout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  )
}

function RootLayout() {
  const router = useRouter()

  // const { setAuth, setUserData } = useAuth();
  const pathname = usePathname()
  const { setAuth } = useAuth() // Изменено: используем только setAuth

  const [isLoading, setIsLoading] = useState(true)

  const [initialRoute, setInitialRoute] = useState(null) // Храним начальный маршрут

  useEffect(() => {
    // console.log("useEffect triggered, pathname:", pathname);
    let isMounted = true

    const checkInitialSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        // console.log("Initial session:", session);

        if (!isMounted)
          return

        let authData = null
        const route = '/homeScreen'

        if (session) {
          const res = await getUserData(session.user.id)
          authData = res.success ? { ...session.user, ...res.data } : session.user
          // route = "/homeScreen";
          // console.log("Setting auth with:", authData);
        }

        // Объединяем setState для минимизации ререндеров
        setAuth(authData)
        setInitialRoute(route)
        setTimeout(() => {
          setIsLoading(false)
        }, 3000)
      }
      catch (error) {
        console.error('Error checking initial session:', error)
        if (!isMounted)
          return
        setAuth(null)
        setInitialRoute('/homeScreen') // Даже при ошибке перенаправляем на homeScreen
        // setInitialRoute("/(main)/welcome");
        setTimeout(() => {
          setIsLoading(false)
        }, 3000)
      }
    }

    checkInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // console.log("onAuthStateChange event:", _event, "session:", session);

      if (!isMounted)
        return

      if (_event === 'SIGNED_IN' && session && _event !== 'INITIAL_SESSION') {
        try {
          const res = await getUserData(session.user.id)
          const authData = res.success ? { ...session.user, ...res.data } : session.user
          // console.log("Setting auth with:", authData);
          setAuth(authData)
          if (pathname === '/' || pathname === '/(main)/welcome') {
            router.replace('/homeScreen')
          }
        }
        catch (error) {
          console.error('Error updating user data on sign in:', error)
        }
      }
      else if (_event === 'SIGNED_OUT') {
        setAuth(null)
        if (pathname !== '/(main)/welcome') {
          router.replace('/(main)/welcome')
        }
      }
    })

    return () => {
      // console.log("Unsubscribing from auth listener");
      isMounted = false
      authListener.subscription.unsubscribe()
    }
  }, [pathname, setAuth])

  // Добавляем useEffect для перенаправления после загрузки
  useEffect(() => {
    if (!isLoading) {
      router.replace('/homeScreen') // Перенаправляем всех на homeScreen после завершения загрузки
    }
  }, [isLoading])

  // Если ещё загружаемся, показываем только индексный экран
  if (isLoading) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    )
  }

  /*
	 *	Пропс initialRouteName в <Stack>
	 *	задаёт начальный маршрут, основанный
	 *	на результате проверки сессии.
	 */

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
