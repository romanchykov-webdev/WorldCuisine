import * as SplashScreen from 'expo-splash-screen'

// гарантируем один вызов preventAutoHide на процесс
let __splashPrepared = false
async function prepareSplashOnce() {
  if (__splashPrepared) return
  __splashPrepared = true
  try {
    await SplashScreen.preventAutoHideAsync()
  } catch (e) {}
}
prepareSplashOnce()

import { Stack } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts, Nunito_400Regular, Nunito_700Bold } from '@expo-google-fonts/nunito'
import React from 'react'

import { queryClient } from '../lib/queryClient'
import '../global.css'

// наши новые хуки
import { useAppFocus } from '../hooks/useAppFocus'
import { useI18nLocale } from '../hooks/useI18nLocale'
import { useAuthBootstrap } from '../hooks/useAuthBootstrap'
import { View } from 'react-native'
import Toast from 'react-native-toast-message'

// SplashScreen.preventAutoHideAsync()

function _layout() {
  // 1) Шрифты
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  })

  // safety: если шрифты не загрузились за N сек, всё равно спрячь сплэш
  const safetyRef = React.useRef(false)
  React.useEffect(() => {
    if (safetyRef.current) return
    safetyRef.current = true
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {})
    }, 4000) // 4s таймаут
    return () => clearTimeout(t)
  }, [])

  const onLayoutRootView = React.useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {})
    }
  }, [fontsLoaded])

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <QueryClientProvider client={queryClient}>
        <RootLayout fontsReady={fontsLoaded} />
        <Toast topOffset={50} />
      </QueryClientProvider>
    </View>
  )
}

function RootLayout({ fontsReady }) {
  // 2) Фокус React Query
  useAppFocus()

  // 3) I18n обновление locale
  useI18nLocale()

  // 4) useAuthBootstrap Инициализирует сессию, подтягивает профиль, ставит тему/язык
  const { isBootstrapping } = useAuthBootstrap()

  if (!fontsReady || isBootstrapping) {
    return (
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="homeScreen" options={{ headerShown: false }} />
      <Stack.Screen name="RecipeDetailsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/LogInScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/RegistrationScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/editProfile" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/CreateRecipeScreen" options={{ headerShown: false }} />
      <Stack.Screen
        name="(main)/AllRecipesPointScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(main)/AllRecipesBayCreator" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/FavoriteScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/NewCommentsScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/NewLikesScreen" options={{ headerShown: false }} />
      <Stack.Screen name="(main)/SearchRecipeScreen" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout
