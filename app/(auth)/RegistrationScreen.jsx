// app/(auth)/RegistrationScreen.jsx
import { useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import { ActivityIndicator, Alert, Text, TouchableOpacity, View } from 'react-native'
import { EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon } from 'react-native-heroicons/outline'

import ButtonBack from '../../components/ButtonBack'
import InputComponent from '../../components/InputComponent'
import LanguagesWrapper from '../../components/LanguagesWrapper'
import ThemeWrapper from '../../components/ThemeWrapper'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'

import { useSignUp, useLogin } from '../../queries/users'
import { useThemeColors, useThemeStore } from '../../stores/themeStore'
import { useLangStore } from '../../stores/langStore'
import { useAuthStore } from '../../stores/authStore'
import WrapperComponent from '../../components/WrapperComponent'

function RegistrationScreen() {
  const router = useRouter()
  const colors = useThemeColors()

  // Zustand
  const lang = useLangStore((s) => s.lang)
  const setLang = useLangStore((s) => s.setLang)
  const setAuth = useAuthStore((s) => s.setAuth)

  const preferredTheme = useThemeStore((s) => s.preferredTheme)
  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)

  const passwordRef = useRef(null)
  const repeatPasswordRef = useRef(null)

  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    repeatPassword: '',
  })

  const { mutateAsync: signUp, isPending: isSigningUp } = useSignUp()
  const { mutateAsync: login, isPending: isLoggingIn } = useLogin()

  const submitting = async () => {
    const email = form.email.trim()
    const userName = form.userName.trim()
    const password = form.password.trim()
    const repeatPassword = form.repeatPassword.trim()

    if (!email || !password || !repeatPassword || !userName) {
      Alert.alert('Sign Up', 'Please fill all the fields!')
      return
    }
    if (password !== repeatPassword) {
      Alert.alert('Sign Up', 'Enter two identical passwords!')
      return
    }

    try {
      // Регистрируем с метаданными (язык/тема)
      const { user, session } = await signUp({
        email,
        password,
        userName,
        lang,
        theme: preferredTheme ?? 'auto',
      })

      // Если проект Supabase требует подтверждение email — session === null
      if (!session) {
        // Попробуем авто-логин (сработает, если подтверждение не требуется)
        try {
          const loggedIn = await login({ email, password, withProfile: false })
          // применяем тему/язык из metadata
          const metadata = loggedIn?.user_metadata ?? {}
          const metaTheme = metadata?.theme || 'auto'
          const metaLang = metadata?.lang || lang

          setPreferredTheme(metaTheme)
          applyTheme()
          setLang(metaLang)
          i18n.locale = metaLang

          setAuth(loggedIn)
          router.replace('/homeScreen')
          return
        } catch {
          // Если не удалось — значит нужно подтверждение email
          Alert.alert(
            'Sign Up',
            'Check your inbox to confirm your email. After confirmation you can log in.',
          )
          router.replace('/(auth)/LogInScreen')
          return
        }
      }

      // Если session есть — сразу авторизуем и настраиваем тему/язык
      const metadata = user?.user_metadata ?? {}
      const metaTheme = metadata?.theme || 'auto'
      const metaLang = metadata?.lang || lang

      setPreferredTheme(metaTheme)
      applyTheme()
      setLang(metaLang)
      i18n.locale = metaLang

      setAuth(user)
      router.replace('/homeScreen')
    } catch (e) {
      Alert.alert('Sign Up', e?.message || 'Unknown error')
    } finally {
      setForm({ userName: '', email: '', password: '', repeatPassword: '' })
    }
  }

  const loading = isSigningUp || isLoggingIn

  return (
    <WrapperComponent>
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
            {i18n.t('Let`s,')}
          </Text>
          <Text
            className="font-bold tracking-widest"
            style={{ fontSize: hp(3.9), color: colors.textColor }}
          >
            {i18n.t('Get Started')}
          </Text>
        </View>

        {/* form */}
        <View className="gap-5">
          <Text
            className="text-neutral-500"
            style={{ fontSize: hp(1.2), color: colors.secondaryTextColor }}
          >
            {i18n.t('Please fill the details to create an account')}
          </Text>

          {/* user name */}
          <InputComponent
            icon={<UserCircleIcon size={30} color="grey" />}
            placeholder={i18n.t('User name')}
            value={form.userName}
            onChangeText={(v) => setForm((s) => ({ ...s, userName: v }))}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {/* email */}
          <InputComponent
            type="email"
            icon={<EnvelopeIcon size={30} color="grey" />}
            placeholder={i18n.t('Email')}
            value={form.email}
            onChangeText={(v) => setForm((s) => ({ ...s, email: v }))}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />

          {/* password */}
          <InputComponent
            ref={passwordRef}
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
            returnKeyType="next"
            onSubmitEditing={() => repeatPasswordRef.current?.focus()}
          />

          {/* repeat password */}
          <InputComponent
            ref={repeatPasswordRef}
            icon={
              <TouchableOpacity onPress={() => setSecureTextEntry((p) => !p)}>
                {secureTextEntry ? (
                  <EyeSlashIcon size={30} color="grey" />
                ) : (
                  <EyeIcon size={30} color="grey" />
                )}
              </TouchableOpacity>
            }
            placeholder={i18n.t('Please repeat password')}
            value={form.repeatPassword}
            onChangeText={(v) => setForm((s) => ({ ...s, repeatPassword: v }))}
            secureTextEntry={secureTextEntry}
            returnKeyType="done"
            onSubmitEditing={submitting}
          />

          <LanguagesWrapper lang={lang} setLang={setLang} />
          <ThemeWrapper lang={lang} setLang={setLang} />

          {/* submit */}
          <TouchableOpacity
            disabled={loading}
            style={shadowBoxBlack({
              offset: { width: 0, height: 1 },
              radius: 2,
              elevation: 2,
              opacity: loading ? 0.7 : 1,
            })}
            onPress={submitting}
            className="px-10 p-5 rounded-full items-center mb-5 bg-green-500"
          >
            {loading ? (
              <ActivityIndicator size={30} color="white" />
            ) : (
              <Text className="text-xl font-bold text-neutral-700">{i18n.t('Sign Up')}</Text>
            )}
          </TouchableOpacity>

          <View className="w-full flex-row justify-center items-center">
            <Text className="text-xs" style={{ color: colors.secondaryTextColor }}>
              {i18n.t('Already have an account,')}
            </Text>
            <Text
              onPress={() => router.push('/(auth)/LogInScreen')}
              className="ml-2 font-bold"
              style={{ color: colors.isActiveColorText }}
            >
              {i18n.t('Log In')}
            </Text>
          </View>
        </View>
      </View>
    </WrapperComponent>
  )
}

export default RegistrationScreen
