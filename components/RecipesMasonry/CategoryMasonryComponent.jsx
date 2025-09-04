import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import AvatarCustom from '../AvatarCustom'
import React from 'react'

function CategoryMasonryComponent({ item, index, onPress, langApp }) {
  const isEven = index % 3 === 0
  const imageHeight = isEven ? hp(25) : hp(35)

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 200).springify()} // Задержка анимации
      className="flex mb-[10] gap-y-1 p-[2]"
      style={[
        shadowBoxBlack({
          offset: { width: 1, height: 1 },
          opacity: 1,
          radius: 3,
        }),
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(item)}
        className="rounded-full relative items-center"
      >
        <AvatarCustom
          uri={item.image}
          style={{
            borderWidth: 0.2,
            width: '100%',
            height: imageHeight,
          }}
          rounded={35}
        />
        <View
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: 35, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
          ]}
        ></View>
        {/*<LinearGradient*/}
        {/*  colors={['transparent', '#18181b']}*/}
        {/*  style={{*/}
        {/*    width: '100%',*/}
        {/*    height: '100%',*/}
        {/*    position: 'absolute',*/}
        {/*    borderRadius: 35,*/}
        {/*  }}*/}
        {/*  start={{ x: 0.5, y: 0.2 }}*/}
        {/*  end={{ x: 0.5, y: 1 }}*/}
        {/*/>*/}
        <Text className="absolute bottom-[20] text-white font-semibold">{item.name}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({})

export default CategoryMasonryComponent
