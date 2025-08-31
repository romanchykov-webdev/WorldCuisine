import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, Easing, I18nManager, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

export default function Shimmer({
  width = '100%',
  height = 16,
  borderRadius = 8,
  style,
  duration = 1200,
  highlightWidthRatio = 0.7, // ширина блика относительно контейнера
  baseColor = 'rgba(0,0,0,0.07)',
  highlightColor = 'rgba(255,255,255,0.35)',
}) {
  const [containerW, setContainerW] = useState(
    typeof width === 'number' ? width : 0, // если число — можно сразу задать
  )

  const translateX = useRef(new Animated.Value(0)).current

  // измеряем ширину, если пришла строка ('100%') или style её влияет
  const onLayout = useCallback(
    (e) => {
      if (typeof width === 'number' && width > 0) return
      const w = e.nativeEvent.layout.width
      if (w && w !== containerW) setContainerW(w)
    },
    [width, containerW],
  )

  useEffect(() => {
    if (!containerW) return

    const stripeW = containerW * highlightWidthRatio
    // старт слева за краем и уход вправо за край
    const from = I18nManager.isRTL ? containerW : -stripeW
    const to = I18nManager.isRTL ? -stripeW : containerW

    translateX.setValue(from)

    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: to,
        duration,
        easing: Easing.linear, // линейная плавная анимация
        useNativeDriver: true,
      }),
    )

    anim.start()
    return () => anim.stop()
  }, [containerW, translateX, duration, highlightWidthRatio])

  // когда ширина ещё неизвестна, просто рисуем базовый блок
  const stripeW = containerW * highlightWidthRatio || 0

  return (
    <View
      onLayout={onLayout}
      style={[
        { width, height, borderRadius, overflow: 'hidden' },
        { backgroundColor: baseColor },
        style,
      ]}
    >
      {/* бегущая полоса */}
      {containerW > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { width: stripeW, transform: [{ translateX }] }]}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.0)', highlightColor, 'rgba(255,255,255,0.0)']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  )
}
