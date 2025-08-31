import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { Cog6ToothIcon } from 'react-native-heroicons/mini'
import EvilIcon from 'react-native-vector-icons/EvilIcons'
import { hp } from '../constants/responsiveScreen'
import { shadowBoxBlack } from '../constants/shadow'
import i18n from '../lang/i18n'
import AvatarCustom from './AvatarCustom'
import { useRouter } from 'expo-router'
import { truncateText } from '../utils/truncateText'

function HeaderComponent({ isAuth, user, colors, unreadCommentsCount, unreadLikesCount }) {
  const router = useRouter()

  const hasUnread = (unreadCommentsCount ?? 0) > 0 || (unreadLikesCount ?? 0) > 0

  return (
    <View>
      <View className="flex-row  justify-between items-center mb-5">
        <View className="flex-row items-center">
          <Image
            source={require('../assets/img/ratatouille.png')}
            className="w-[25] h-[25] rounded-full mr-1"
            resizeMode="cover"
          />
          <Text style={{ fontSize: 24, color: colors.textColor }}>Ratatouille</Text>
        </View>
        <View>
          {isAuth ? (
            <TouchableOpacity
              style={shadowBoxBlack({
                offset: { width: 2, height: 2 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
                opacity: 0.3, // Прозрачность тени (по умолчанию 30%)
                radius: 5,
              })}
              onPress={() => router.push('/ProfileScreen')}
            >
              <View className=" relative">
                <AvatarCustom
                  uri={user?.avatar}
                  size={hp(4.3)}
                  style={{ borderWidth: 0.2 }}
                  rounded={50}
                />
                {hasUnread && (
                  <View className="absolute left-[-10] top-[-5px] gap-y-5">
                    {unreadCommentsCount > 0 && <EvilIcon name="comment" size={20} color="red" />}
                    {unreadLikesCount > 0 && <EvilIcon name="heart" size={20} color="red" />}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ) : (
            <View className="flex-row">
              {/*    sign to settings */}
              <TouchableOpacity onPress={() => router.push('/ProfileScreen')} className="p-2">
                <Cog6ToothIcon size={hp(3)} color="gray" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      {isAuth && (
        <View className="flex-row">
          <Text style={{ fontSize: hp(1.7), color: colors.textColor }}>{i18n.t('Hello')}, </Text>
          <Text style={{ fontSize: hp(1.7), color: colors.textColor }} className=" capitalize">
            {truncateText(user?.user_name, 7, true)}
          </Text>
        </View>
      )}
    </View>
  )
}

export default HeaderComponent
