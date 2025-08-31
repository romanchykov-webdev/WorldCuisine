import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import {
  ArrowLeftEndOnRectangleIcon,
  CreditCardIcon,
  HeartIcon,
  PencilSquareIcon,
} from 'react-native-heroicons/mini'
import Icon from 'react-native-vector-icons/EvilIcons'
import AvatarCustom from '../components/AvatarCustom'
import ButtonBack from '../components/ButtonBack'
import TitleScreen from '../components/TitleScreen'
import WrapperComponent from '../components/WrapperComponent'
import { wp } from '../constants/responsiveScreen'
import { shadowBoxBlack, shadowBoxWhite } from '../constants/shadow'
import { themes } from '../constants/themes'
import i18n from '../lang/i18n'

import { logOut } from '../service/userService'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'

function ProfileScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const resetAuth = useAuthStore((s) => s.resetAuth)
  const currentTheme = useThemeStore((s) => s.currentTheme)

  // демо-данные; лучше вынести в notificationsStore
  const unreadCommentsCount = 0
  const unreadLikesCount = 0

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
          await logOut()
          resetAuth()
          router.replace('/(auth)/LogInScreen')
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

  return (
    <WrapperComponent>
      {isAuth ? (
        <>
          {/* header */}
          <View className="flex-row justify-between items-center">
            <ButtonBack />
            <TitleScreen title={i18n.t('Profile')} />
            <TouchableOpacity
              onPress={handleLogOut}
              style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
              className="bg-white p-3 border border-neutral-300 rounded-full"
            >
              <ArrowLeftEndOnRectangleIcon size={30} color="red" />
            </TouchableOpacity>
          </View>

          {/* avatar + name */}
          <View className="gap-y-5 items-center mb-5">
            <View className="relative">
              <View style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}>
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
            <Text style={{ color: themes[currentTheme]?.textColor }}>{user?.user_name}</Text>
          </View>

          {/* actions */}
          <View className="flex-row mb-5 items-center justify-around">
            <TouchableOpacity
              onPress={handleMyRecipes}
              style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
              className="items-center p-2 bg-neutral-200 rounded-[15] w-[80] h-[80] justify-around relative"
            >
              <CreditCardIcon size={45} color="green" />
              <Text numberOfLines={1} style={{ fontSize: 8 }}>
                {i18n.t('My recipes')}
              </Text>
              <View className="absolute top-[-10] flex-row w-full items-center justify-between">
                {unreadCommentsCount > 0 && <Icon name="comment" size={25} color="red" />}
                {unreadLikesCount > 0 && <Icon name="heart" size={25} color="red" />}
              </View>
            </TouchableOpacity>

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
