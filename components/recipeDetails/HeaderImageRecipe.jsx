import React from 'react'
import { shadowBoxBlack } from '../../constants/shadow'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import { Image } from 'expo-image'
import { hp, wp } from '../../constants/responsiveScreen'
import AvatarCustom from '../AvatarCustom'
import { LinearGradient } from 'expo-linear-gradient'
import ButtonBack from '../ButtonBack'
import ButtonLike from '../ButtonLike'
import { Text, TouchableOpacity, View } from 'react-native'
import { ChatBubbleOvalLeftIcon, StarIcon } from 'react-native-heroicons/outline'

export const HeaderImageRecipe = ({
  isPreview,
  imageHeader,
  recipeId,
  totalCountLike,
  rating,
  scrollToComments,
  recipeComments,
}) => {
  return (
    <View className="flex-row justify-center items-center relative" style={shadowBoxBlack()}>
      <Animated.View entering={FadeInUp.duration(400).delay(100)}>
        {isPreview ? (
          <Image
            source={{ uri: imageHeader }}
            transition={100}
            style={{
              width: wp(98),
              height: hp(50),
              borderRadius: 40,
              marginTop: wp(1),
              borderWidth: 0.5,
              borderColor: 'gray',
            }}
          />
        ) : (
          <AvatarCustom
            uri={imageHeader}
            style={{
              width: wp(98),
              height: hp(50),
              borderRadius: 40,
              marginTop: wp(1),
              borderWidth: 0.5,
              borderColor: 'gray',
            }}
          />
        )}
      </Animated.View>

      <LinearGradient
        colors={['transparent', '#18181b']}
        style={{
          width: wp(98),
          height: '20%',
          position: 'absolute',
          top: wp(1),
          borderRadius: 40,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        }}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      />

      {/* back + like */}
      <Animated.View
        entering={FadeInUp.duration(400).delay(500)}
        className="absolute flex-row justify-between top-[60] pl-5 pr-5 w-full"
      >
        <ButtonBack />

        <ButtonLike isPreview={isPreview} recipeId={recipeId} totalCountLike={totalCountLike} />
      </Animated.View>

      {/* rating + comments */}
      <Animated.View
        entering={FadeInDown.duration(400).delay(500)}
        className="absolute flex-row justify-between bottom-[20] pl-5 pr-5 w-full"
      >
        {/* rating badge */}
        <View
          className="items-center justify-center flex-row w-[60] h-[60] rounded-full relative"
          style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
        >
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {rating}
            </Text>
          </View>
          <StarIcon size={45} color="gold" />
        </View>

        {/* comments badge */}
        <View
          className="items-center justify-center flex-row w-[60] h-[60] rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
        >
          <TouchableOpacity
            className="items-center justify-center flex-row"
            onPress={scrollToComments}
          >
            <ChatBubbleOvalLeftIcon size={45} color="gray" />
            <Text style={{ fontSize: 8 }} className="text-neutral-700 absolute">
              {recipeComments}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}
