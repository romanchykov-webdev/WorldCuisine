import Animated, {
  Easing,
  cancelAnimation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { hp } from '../constants/responsiveScreen'

export default function PulseRing({ active, size = hp(2.5) + 50 }) {
  // progress: 0..1 повторяется по кругу
  const progress = useSharedValue(0)

  useEffect(() => {
    if (active) {
      // сброс и запуск бесконечного цикла
      progress.value = 0
      progress.value = withRepeat(
        withTiming(1, { duration: 1600, easing: Easing.linear }),
        -1, // бесконечно
        false,
      )
    } else {
      cancelAnimation(progress)
      progress.value = 0
    }
  }, [active, progress])

  // превращаем progress в scale / opacity
  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 0.5, 1], [0, 1, 0])
    const opacity = interpolate(progress.value, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    return { transform: [{ scale }], opacity }
  })

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: 100,
          borderWidth: 15,
          borderColor: 'rgba(0,0,0,0.1)',
          backgroundColor: 'transparent',
        },
        rStyle,
      ]}
    />
  )
}
