import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { CameraIcon } from 'react-native-heroicons/mini'

import AvatarCustom from '../../components/AvatarCustom'
import ButtonBack from '../../components/ButtonBack'
import LanguagesWrapper from '../../components/LanguagesWrapper'
import ThemeWrapper from '../../components/ThemeWrapper'
import TitleScreen from '../../components/TitleScreen'
import WrapperComponent from '../../components/WrapperComponent'

import { wp } from '../../constants/responsiveScreen'
import { shadowBoxBlack, shadowBoxWhite } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import i18n from '../../lang/i18n'

import { compressImage } from '../../lib/imageUtils'
import { getUserImageSrc, uploadFile } from '../../service/imageServices'

import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { useLangStore } from '../../stores/langStore'
import { useUpdateUser, useDeleteUser, useLogout } from '../../queries/users'

function EditProfile() {
  const router = useRouter()

  // Zustand stores
  const currentUser = useAuthStore((s) => s.user)
  const setUserData = useAuthStore((s) => s.setUserData)
  const signOutLocal = useAuthStore((s) => s.signOutLocal)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const appLang = useLangStore((s) => s.lang)

  // Локальный стейт формы
  const [form, setForm] = useState(() => ({
    user_name: currentUser?.user_name,
    app_lang: currentUser?.app_lang,
    theme: currentUser?.theme,
    avatar: currentUser?.avatar,
  }))

  // мутации
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()
  const logoutMutation = useLogout()

  const isSubmitting = updateMutation.isPending
  const isDeleting = deleteMutation.isPending

  // Выбор и сжатие изображения
  const pickAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(i18n.t('Permission'), i18n.t('Permission to access photos is required.'))
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (result.canceled) return

      const uri = result.assets?.[0]?.uri
      if (!uri) return

      const compressed = await compressImage(uri, 0.7, 600, 600)
      setForm((prev) => ({ ...prev, avatar: { uri: compressed.uri } }))
    } catch (e) {
      console.error('pickAvatar error', e)
      Alert.alert(i18n.t('Error'), i18n.t('Failed to pick image.'))
    }
  }

  const onSubmit = async () => {
    if (!currentUser?.id) return
    try {
      let avatarField = form.avatar

      // Если пришёл объект {uri} — грузим и заменяем на строку пути
      if (avatarField && typeof avatarField === 'object' && avatarField.uri) {
        const uniqueFilePath = `profiles/${currentUser.id}/${Date.now()}.jpg`
        const uploaded = await uploadFile(
          uniqueFilePath,
          avatarField.uri,
          true,
          currentUser?.avatar,
        )
        if (!uploaded?.success) {
          Alert.alert(i18n.t('Error'), i18n.t('Failed to upload avatar.'))
          // оставляем старый avatar
          avatarField = currentUser?.avatar ?? null
        } else {
          avatarField = uploaded.data // строка пути/URL
        }
      }

      const payload = {
        userId: currentUser.id,
        data: {
          user_name: form.user_name?.trim() || currentUser.user_name,
          app_lang: form.app_lang,
          theme: form.theme,
          avatar: form.avatar,
        },
      }

      await updateMutation.mutateAsync(payload)

      // Обновим Zustand (если мутация не сделала этого сама onSuccess)
      if (typeof setUserData === 'function') {
        setUserData(payload.data)
      }

      Alert.alert(i18n.t('Success'), i18n.t('Profile updated'))
      router.back()
    } catch (e) {
      console.error('update profile error', e)
      Alert.alert(i18n.t('Error'), e?.message ?? 'Failed to update profile')
    }
  }

  const onDeleteAccount = () => {
    Alert.alert(i18n.t('Confirm'), i18n.t('Are you sure you want to DELETE ACCOUNT?'), [
      { text: i18n.t('Cancel'), style: 'cancel' },
      {
        text: i18n.t('DELETE'),
        style: 'destructive',
        onPress: async () => {
          try {
            if (!currentUser?.id) return
            await deleteMutation.mutateAsync({ userId: currentUser.id })
            // после удаления выходим из сессии
            await logoutMutation.mutateAsync()
            signOutLocal()
            router.replace('/homeScreen')
          } catch (e) {
            console.error('delete account error', e)
            Alert.alert(i18n.t('Error'), e?.message ?? 'Failed to delete account')
          }
        },
      },
    ])
  }

  return (
    <WrapperComponent>
      {/* header */}
      <View className="flex-row items-center justify-center pt-5 pb-5 ">
        <View className="absolute left-0" style={shadowBoxBlack()}>
          <ButtonBack />
        </View>
        <TitleScreen title={`${i18n.t('Edit Profile')} !`} styleTitle={[{ fontSize: 20 }]} />
      </View>

      {/* avatar */}
      <View className="gap-y-5 items-center mb-5 ">
        <View style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}>
          <AvatarCustom uri={form?.avatar} size={wp(50)} style={{ borderRadius: 100 }} />
          <View
            className="absolute bottom-5 right-5"
            style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
          >
            <TouchableOpacity
              onPress={pickAvatar}
              className="bg-white p-2 border-[1px] border-neutral-300 rounded-full"
            >
              <CameraIcon size={30} color="grey" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* name */}
      <View
        className="mb-5 border-[0.5px] border-neutral-700  rounded-xl pb-2"
        style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
      >
        <TextInput
          value={form?.user_name}
          onChangeText={(v) => setForm((p) => ({ ...p, user_name: v }))}
          className=" text-xl p-3"
          placeholder={i18n.t('Your name')}
          placeholderTextColor="#9CA3AF"
          style={{ color: themes[currentTheme]?.textColor }}
        />
      </View>

      {/* language */}
      <View className="mb-5">
        <LanguagesWrapper
          lang={form?.app_lang}
          setLang={(newLang) => setForm((p) => ({ ...p, app_lang: newLang }))}
        />
      </View>

      {/* theme */}
      <View className="mb-5">
        <ThemeWrapper
          theme={form?.theme}
          setTheme={(newTheme) => setForm((p) => ({ ...p, theme: newTheme }))}
        />
      </View>

      {/* update */}
      <TouchableOpacity
        onPress={onSubmit}
        disabled={isSubmitting}
        style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
        className="bg-green-500 rounded-full w-full p-5 mb-10 items-center justify-center"
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" size={20} />
        ) : (
          <Text className="text-white text-xl">{i18n.t('Update your Profile')}</Text>
        )}
      </TouchableOpacity>

      {/* delete */}
      <TouchableOpacity
        onPress={onDeleteAccount}
        disabled={isDeleting}
        style={shadowBoxBlack()}
        className="bg-rose-500 rounded-full w-full p-5 mb-10 items-center justify-center mt-20"
      >
        {isDeleting ? (
          <ActivityIndicator color="white" size={20} />
        ) : (
          <Text className="text-white text-xl">{i18n.t('Delete your Profile')} ?</Text>
        )}
      </TouchableOpacity>
    </WrapperComponent>
  )
}

export default EditProfile
