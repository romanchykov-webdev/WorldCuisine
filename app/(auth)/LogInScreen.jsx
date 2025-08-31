import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { EnvelopeIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline'

import ButtonBack from '../../components/ButtonBack'
import InputComponent from '../../components/InputComponent'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { useLogin } from '../../queries/users'
import { useAuthStore } from '../../stores/authStore'
import { useThemeColors } from '../../stores/themeStore'
import WrapperComponent from '../../components/WrapperComponent'
import i18n from '../../lang/i18n'

function LogInScreen() {
  const router = useRouter()
  const colors = useThemeColors()
  const setAuth = useAuthStore((s) => s.setAuth)

  const passwordRef = useRef(null)

  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [form, setForm] = useState({ email: '', password: '' })

  const { mutateAsync, isPending } = useLogin()

  const submitting = async () => {
    const email = form.email.trim()
    const password = form.password.trim()
    if (!email || !password) {
      Alert.alert('Log In', 'Please fill all the fields!')
      return
    }

    try {
      const user = await mutateAsync({ email, password, withProfile: true })
      setAuth(user)
      setForm({ email: '', password: '' })
      router.replace('/homeScreen')
    } catch (e) {
      Alert.alert('Log In', e?.message || 'Unknown error')
    }
  }

  return (
    <WrapperComponent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="h-full">
          <View className="mb-10">
            <ButtonBack />
          </View>

          {/* welcome text */}
          <View className="mb-5">
            <Text
              className="font-bold tracking-widest"
              style={{ fontSize: hp(4), color: colors.textColor }}
            >
              Hey,
            </Text>
            <Text
              className="font-bold tracking-widest"
              style={{ fontSize: hp(4), color: colors.textColor }}
            >
              Welcome Back
            </Text>
          </View>

          {/* form */}
          <View className="gap-5">
            <Text
              className="text-neutral-500"
              style={{ fontSize: hp(1.5), color: colors.secondaryTextColor }}
            >
              Please login to continue
            </Text>

            <InputComponent
              type="email"
              icon={<EnvelopeIcon size={30} color="grey" />}
              placeholder={i18n.t('Email')}
              value={form.email}
              onChangeText={(v) => setForm((s) => ({ ...s, email: v }))}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <InputComponent
              ref={passwordRef}
              type="password"
              icon={
                <TouchableOpacity onPress={() => setSecureTextEntry((p) => !p)}>
                  {secureTextEntry ? (
                    <EyeSlashIcon size={30} color="grey" />
                  ) : (
                    <EyeIcon size={30} color="grey" />
                  )}
                </TouchableOpacity>
              }
              placeholder={i18n.t('Password')}
              value={form.password}
              onChangeText={(v) => setForm((s) => ({ ...s, password: v }))}
              secureTextEntry={secureTextEntry}
              returnKeyType="done"
              onSubmitEditing={submitting}
            />

            <TouchableOpacity
              disabled={isPending}
              onPress={submitting}
              className="px-10 p-5 rounded-full items-center mb-5 bg-neutral-300"
              style={shadowBoxBlack({
                offset: { width: 0, height: 1 },
                radius: 2,
                elevation: 2,
                opacity: isPending ? 0.7 : 1,
              })}
            >
              {isPending ? (
                <ActivityIndicator size={30} color="white" />
              ) : (
                <Text className="text-xl font-bold text-neutral-700">{i18n.t('Log In')}</Text>
              )}
            </TouchableOpacity>

            <View className="w-full flex-row justify-center items-center">
              <Text className="text-xs" style={{ color: colors.secondaryTextColor }}>
                {i18n.t("If you don't have an account,")}
              </Text>
              <Text
                onPress={() => router.push('/(auth)/RegistrationScreen')}
                className="ml-2 font-bold"
                style={{ color: colors.isActiveColorText }}
              >
                {i18n.t('Sign Up')}
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </WrapperComponent>
  )
}

export default LogInScreen
