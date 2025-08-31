import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { hp } from '../../constants/responsiveScreen'
import { themes } from '../../constants/themes'
import { shadowTextSmall } from '../../constants/shadow'

export const TitleAreaRecipe = ({ titleText, areaText, currentTheme }) => {
  return (
    <Animated.View entering={FadeInDown.delay(600)} className="px-4 flex justify-between gap-y-5">
      <View className="gap-y-2">
        <Text
          style={[{ fontSize: hp(2.7), color: themes[currentTheme]?.textColor }, shadowTextSmall()]}
          className="font-bold"
        >
          {titleText}
        </Text>
        <Text
          style={{ fontSize: hp(1.8), color: themes[currentTheme]?.secondaryTextColor }}
          className="font-medium text-neutral-500"
        >
          {areaText}
        </Text>
      </View>
    </Animated.View>
  )
}
