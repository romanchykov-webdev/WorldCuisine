import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from 'react-native-heroicons/outline'
import { StarIcon } from 'react-native-star-rating-widget'
import { hp } from '../../../constants/responsiveScreen'
import { shadowBoxBlack, shadowText } from '../../../constants/shadow'
import AvatarCustom from '../../AvatarCustom'
import { PlayCircleIcon } from 'react-native-heroicons/solid'
import { formatNumber } from '../../../utils/numberFormat'
import React from 'react' // если есть иконка play

function RecipePointItemComponent({ item, index, langApp }) {
  const router = useRouter()
  // высоты  для "кладки"
  const heightBuckets = [hp(24), hp(35)]

  function hashToBucket(key) {
    const s = String(key)
    let h = 0
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
    return h % heightBuckets.length
  }

  const bucket = hashToBucket(item.full_recipe_id ?? item.id ?? index)
  const imageHeight = heightBuckets[bucket]
  const categoryTitle = item.title?.[langApp] || item.title?.en || item.title[0]
  return (
    <Animated.View
      entering={FadeInDown.delay((index % 10) * 100)
        .springify()
        .damping(30)}
      key={item.id}
      style={[
        styles.container,
        shadowBoxBlack({
          offset: { width: 1, height: 1 },
          opacity: 1,
          radius: 3,
        }),
      ]}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: 'RecipeDetailsScreen',
            params: { id: item.full_recipe_id, langApp },
          })
        }
        style={styles.touchable}
      >
        {/* Верхний блок видео и аватар пользователя */}
        <View
          style={[
            styles.topInfo,
            item?.video ? styles.topInfoWithVideo : styles.topInfoNoVideo,
            shadowBoxBlack({
              offset: { width: 1, height: 1 },
              opacity: 1,
              radius: 1,
              elevation: 3,
            }),
          ]}
        >
          {item?.video && <PlayCircleIcon size={25} color="red" />}
          {item?.published_user && (
            <View style={styles.userBlock}>
              <AvatarCustom
                uri={item.published_user.avatar}
                size={25}
                style={{ borderWidth: 0.2 }}
                rounded={50}
              />
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {item.published_user.user_name}
              </Text>
            </View>
          )}
        </View>

        {/* Изображение */}
        {item.image_header && (
          <AvatarCustom
            uri={item.image_header}
            style={{
              width: '100%',
              height: imageHeight,
              borderWidth: 0.2,
            }}
            rounded={35}
          />
        )}

        {/* Градиент */}
        {/*<View*/}
        {/*  style={[*/}
        {/*    StyleSheet.absoluteFill,*/}
        {/*    { borderRadius: 35, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },*/}
        {/*  ]}*/}
        {/*></View>*/}
        <LinearGradient
          colors={['transparent', '#18181b']}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: 35,
          }}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}
        />

        {/* Нижний блок с названием и иконками */}
        <View style={styles.bottomBlock}>
          <Text style={[styles.categoryTitle, shadowText()]}>{categoryTitle}</Text>

          <View style={styles.iconsRow}>
            {item.likes > 0 && (
              <View style={styles.iconBlock}>
                <HeartIcon size={25} color="gray" />
                <Text style={styles.iconText}>{formatNumber(item.likes)}</Text>
              </View>
            )}
            {item.comments > 0 && (
              <View style={styles.iconBlock}>
                <ChatBubbleOvalLeftEllipsisIcon size={25} color="gray" />
                <Text style={styles.iconText}>{formatNumber(item.comments)}</Text>
              </View>
            )}
            {item.rating > 0 && (
              <View style={styles.iconBlock}>
                <StarIcon size={25} color="gray" />
                <Text style={styles.iconText}>{item.rating}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 2,
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    borderRadius: 35,
  },
  topInfo: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 10,
    paddingHorizontal: 5,
    alignItems: 'flex-start',
  },
  topInfoWithVideo: {
    justifyContent: 'space-between',
  },
  topInfoNoVideo: {
    justifyContent: 'flex-end',
  },
  userBlock: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 6,
    maxWidth: 20,
    textAlign: 'center',
    overflow: 'hidden',
    color: 'white',
  },
  bottomBlock: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  categoryTitle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  iconsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    minHeight: 25,
  },
  iconBlock: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 8,
    maxWidth: 25,
    textAlign: 'center',
    color: 'white',
  },
})

export default RecipePointItemComponent
