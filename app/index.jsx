import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { ActivityIndicator, View } from 'react-native'

import Animated, {
  Easing,
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { hp } from '../constants/responsiveScreen'
import { shadowText } from '../constants/shadow'
import { useAuthStore } from '../stores/authStore'

function Index() {
  const router = useRouter()

  const user = useAuthStore((s) => s.user)

  // // reanimated shared values
  const ring1Padding = useSharedValue(0)
  const ring2Padding = useSharedValue(0)
  //
  // // refs для таймеров и «однократности»
  const didNavigateRef = React.useRef(false)
  const t1Ref = React.useRef(null)
  const t2Ref = React.useRef(null)
  const navRef = React.useRef(null)

  React.useEffect(() => {
    // старт анимаций
    ring1Padding.value = 0
    ring2Padding.value = 0

    // запуск бесконечной пульсации
    ring1Padding.value = withRepeat(
      withTiming(hp(7), { duration: 600, easing: Easing.linear }),
      -1, // -1 → бесконечно
      true, // true → реверс
    )

    ring2Padding.value = withRepeat(
      withTiming(hp(4), { duration: 600, easing: Easing.linear }),
      -1,
      true,
    )

    // безопасная навигация один раз
    navRef.current = setTimeout(() => {
      if (!didNavigateRef.current) {
        didNavigateRef.current = true
        router.replace('/homeScreen')
      }
    }, 3000)

    return () => {
      if (t1Ref.current) clearTimeout(t1Ref.current)
      if (t2Ref.current) clearTimeout(t2Ref.current)
      if (navRef.current) clearTimeout(navRef.current)
    }
  }, [user])

  return (
    <View className="flex-1 bg-amber-500 pb-36">
      <StatusBar style="dark" />

      {/*  logo image  with rings */}
      <View className="flex-1 justify-center items-center">
        <Animated.View
          className="bg-white/20 rounded-full"
          style={{ padding: ring2Padding }}
        >
          <Animated.View
            className="bg-white/20 rounded-full"
            style={{ padding: ring1Padding }}
          >
            <Image
              source={require('../assets/img/logoBig2.png')}
              style={{ width: hp(20), height: hp(20) }}
              contentFit="cover"
              transition={1000}
            />
          </Animated.View>
        </Animated.View>
      </View>

      {/*  title and punchline */}
      <View className="items-center justify-end ">
        <Animated.Text
          entering={FadeInRight.delay(1200).duration(300).springify()}
          style={[{ fontSize: hp(7) }, shadowText()]}
          className="font-bold text-white tracking-widest text-6xl"
        >
          Food
        </Animated.Text>
        <Animated.Text
          entering={FadeInLeft.delay(1400).duration(300).springify()}
          style={[{ fontSize: hp(2) }, shadowText()]}
          className="font-bold text-white tracking-widest text-lg mb-10"
        >
          Food is always right
        </Animated.Text>
        <Animated.View entering={FadeInDown.delay(1600).springify()}>
          <ActivityIndicator size={30} color="yellow" />
        </Animated.View>
      </View>
    </View>
  )
}

export default Index
