import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import {
  ArrowLeftEndOnRectangleIcon,
  CreditCardIcon,
  HeartIcon,
  PencilSquareIcon,
  ChatBubbleOvalLeftIcon,
  HandThumbUpIcon,
} from 'react-native-heroicons/mini'
import AvatarCustom from '../components/AvatarCustom'
import ButtonBack from '../components/ButtonBack'
import TitleScreen from '../components/TitleScreen'
import WrapperComponent from '../components/WrapperComponent'
import { wp } from '../constants/responsiveScreen'
import { shadowBoxBlack, shadowBoxWhite } from '../constants/shadow'
import { themes } from '../constants/themes'
import i18n from '../lang/i18n'

import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { logoutTQ } from '../service/TQuery/auth'
import { formatNumber } from '../utils/numberFormat'
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
} from 'react-native-reanimated'
import { useNotificationsStore } from '../stores/notificationsStore'

function ProfileScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const signOutLocal = useAuthStore((s) => s.signOutLocal)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  // counter comments
  const unreadCommentsCount = useNotificationsStore((s) => s.unreadCommentsCount)
  // counter likes
  const unreadLikesCount = useNotificationsStore((s) => s.unreadLikesCount)

  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(!!user)
  }, [user])

  const handleLogOut = () => {
    Alert.alert('Confirm', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'LogOut',
        style: 'destructive',
        onPress: async () => {
          try {
            await logoutTQ()
          } finally {
            signOutLocal()
            router.replace('/')
          }
        },
      },
    ])
  }

  const handleMyRecipes = () => {
    router.push({
      pathname: '(main)/AllRecipesBayCreator',
      params: { creator_id: user?.id },
    })
  }

  const handleMyLiked = () => {
    router.push('(main)/FavoriteScreen')
  }

  const updateProfile = () => {
    router.push('/(main)/editProfile')
  }

  const goToLikesScreen = () => {
    router.push('/(main)/NewLikesScreen')
  }
  const goToCommentsScreen = () => {
    router.push('/(main)/NewCommentsScreen')
  }

  return (
    <WrapperComponent>
      {isAuth ? (
        <>
          {/* header */}
          <View className="flex-row justify-between items-center">
            {/*button back*/}
            <Animated.View entering={FadeInLeft.delay(200).springify()}>
              <ButtonBack />
            </Animated.View>

            {/*title*/}
            <Animated.View entering={FadeInDown.delay(300).springify()}>
              <TitleScreen title={i18n.t('Profile')} />
            </Animated.View>

            {/*log out*/}
            <Animated.View entering={FadeInRight.delay(400).springify()}>
              <TouchableOpacity
                onPress={handleLogOut}
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="bg-white p-3 border border-neutral-300 rounded-full"
              >
                <ArrowLeftEndOnRectangleIcon size={30} color="red" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* avatar + name */}
          <Animated.View entering={FadeInUp.delay(500).springify()}>
            <View className="gap-y-5 items-center mb-5">
              <View className="relative">
                <View
                  style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                >
                  <AvatarCustom
                    uri={user?.avatar}
                    size={wp(50)}
                    style={{ borderWidth: 0.2 }}
                    rounded={150}
                  />
                </View>
                <View
                  className="absolute bottom-5 right-5"
                  style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                >
                  <TouchableOpacity
                    onPress={updateProfile}
                    className="bg-white p-2 border border-neutral-300 rounded-full"
                  >
                    <PencilSquareIcon size={30} color="grey" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={{ color: themes[currentTheme]?.textColor }}>
                {user?.user_name}
              </Text>
            </View>
          </Animated.View>

          {/* actions */}
          <View className="flex-row flex-wrap gap-8 mb-5 items-center justify-around">
            {/*'My recipes'*/}
            <Animated.View entering={FadeInDown.delay(1000).springify()}>
              <TouchableOpacity
                onPress={handleMyRecipes}
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around relative"
              >
                <CreditCardIcon size={45} color="green" />
                <Text numberOfLines={1} style={{ fontSize: 8 }}>
                  {i18n.t('My recipes')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/*'Create recipe'*/}
            <Animated.View entering={FadeInDown.delay(1200).springify()}>
              <TouchableOpacity
                onPress={() => router.push('(main)/CreateRecipeScreen')}
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around"
              >
                <PencilSquareIcon size={45} color="gold" />
                <Text numberOfLines={1} style={{ fontSize: 8 }}>
                  {i18n.t('Create recipe')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/*'Liked'*/}
            <Animated.View entering={FadeInDown.delay(1400).springify()}>
              <TouchableOpacity
                onPress={handleMyLiked}
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around"
              >
                <HeartIcon size={45} color="red" />
                <Text numberOfLines={1} style={{ fontSize: 8 }}>
                  {i18n.t('Liked')}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/*'Comments'*/}
            <Animated.View entering={FadeInDown.delay(1600).springify()}>
              <TouchableOpacity
                onPress={goToCommentsScreen}
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around relative"
              >
                <ChatBubbleOvalLeftIcon size={45} color="gray" />
                <Text numberOfLines={1} style={{ fontSize: 8 }}>
                  {i18n.t('Last Comments')}
                </Text>
                <View
                  style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                  className=" w-[30px] h-[30px] bg-violet-500 rounded-full absolute left-0 -top-1 flex items-center justify-center "
                >
                  <Text style={{ fontSize: 12, lineHeight: 14 }}>
                    {formatNumber(unreadCommentsCount)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/*'likes'*/}
            <Animated.View entering={FadeInDown.delay(1800).springify()}>
              <TouchableOpacity
                onPress={goToLikesScreen}
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around relative"
              >
                <HandThumbUpIcon size={45} color="blue" />
                <Text numberOfLines={1} style={{ fontSize: 8 }}>
                  {i18n.t('Last_likes')}
                </Text>
                <View
                  style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                  className=" w-[30px] h-[30px] bg-violet-500 rounded-full absolute left-0 -top-1 flex items-center justify-center"
                >
                  <Text style={{ fontSize: 12, lineHeight: 14 }}>
                    {formatNumber(unreadLikesCount)}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </>
      ) : (
        <>
          <ButtonBack />
          <View className="flex-1 justify-center gap-10">
            <TouchableOpacity
              onPress={() => router.push('/(auth)/LogInScreen')}
              style={shadowBoxBlack()}
              className="p-5 w-full items-center justify-center border border-neutral-300 rounded-full bg-amber-300"
            >
              <Text>{i18n.t('Log In')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(auth)/RegistrationScreen')}
              style={shadowBoxBlack()}
              className="p-5 w-full items-center justify-center border border-neutral-300 rounded-full bg-amber-300"
            >
              <Text>{i18n.t('Sign Up')}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </WrapperComponent>
  )
}

export default ProfileScreen
