import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { shadowBoxBlack } from '../../constants/shadow'
import { hp } from '../../constants/responsiveScreen'
import { ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/mini'
import i18n from '../../lang/i18n'

export const MetricsRecipe = ({ time, serv, cal, level }) => {
  return (
    <Animated.View entering={FadeInDown.delay(700)} className="flex-row justify-around">
      {/* time */}
      <View className="flex rounded-full bg-amber-300 p-1 items-center" style={shadowBoxBlack()}>
        <View
          className="bg-white rounded-full flex items-center justify-around"
          style={{ width: hp(6.5), height: hp(6.5) }}
        >
          <ClockIcon size={hp(4)} strokeWidth={2.5} color="gray" />
        </View>
        <View className="flex items-center py-2 gap-y-1">
          <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
            {time}
          </Text>
          <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
            {i18n.t('Mins')}
          </Text>
        </View>
      </View>

      {/* persons */}
      <View className="flex rounded-full bg-amber-300 p-1 items-center" style={shadowBoxBlack()}>
        <View
          className="bg-white rounded-full flex items-center justify-around"
          style={{ width: hp(6.5), height: hp(6.5) }}
        >
          <UsersIcon size={hp(4)} strokeWidth={2.5} color="gray" />
        </View>
        <View className="flex items-center py-2 gap-y-1">
          <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
            {serv}
          </Text>
          <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
            {i18n.t('Person')}
          </Text>
        </View>
      </View>

      {/* calories */}
      <View className="flex rounded-full bg-amber-300 p-1 items-center" style={shadowBoxBlack()}>
        <View
          className="bg-white rounded-full flex items-center justify-around"
          style={{ width: hp(6.5), height: hp(6.5) }}
        >
          <FireIcon size={hp(4)} strokeWidth={2.5} color="gray" />
        </View>
        <View className="flex items-center py-2 gap-y-1">
          <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">
            {cal}
          </Text>
          <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
            {i18n.t('Cal')}
          </Text>
        </View>
      </View>

      {/* level */}
      <View className="flex rounded-full bg-amber-300 p-1 items-center" style={shadowBoxBlack()}>
        <View
          className="bg-white rounded-full flex items-center justify-around"
          style={{ width: hp(6.5), height: hp(6.5) }}
        >
          <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="gray" />
        </View>
        <View className="flex items-center py-2 gap-y-1">
          <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700" />
          <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
            {i18n.t(`${level}`)}
          </Text>
        </View>
      </View>
    </Animated.View>
  )
}
