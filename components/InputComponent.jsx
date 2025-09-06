import React, { forwardRef, memo, useMemo } from 'react'
import { Text, TextInput, View } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { useThemeColors } from '../stores/themeStore'

/**
 * Универсальный инпут с иконкой.
 *
 * Props:
 * - icon: ReactNode слева
 * - value, onChangeText
 * - placeholder
 * - type: 'text' | 'email' | 'password'  (задаёт keyboardType, autoCapitalize и т.д.)
 * - secureTextEntry (перекрывает поведение type='password', если нужно)
 * - containerStyle, inputStyle
 * - errorText?: string
 * - disabled?: boolean
 * - ...rest — любые пропсы TextInput
 */
const InputComponent = forwardRef(function InputComponent(
  {
    icon,
    value,
    onChangeText,
    placeholder,
    type = 'text',
    secureTextEntry,
    containerStyle,
    inputStyle,
    errorText,
    disabled = false,
    ...rest
  },
  ref,
) {
  const colors = useThemeColors()

  // Подбираем настройки по типу
  const config = useMemo(() => {
    switch (type) {
      case 'email':
        return {
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
          textContentType: 'emailAddress',
          autoComplete: 'email',
          secure: false,
        }
      case 'password':
        return {
          keyboardType: 'default',
          autoCapitalize: 'none',
          autoCorrect: false,
          textContentType: 'password',
          autoComplete: 'password',
          secure: true,
        }
      default:
        return {
          keyboardType: 'default',
          autoCapitalize: 'sentences',
          autoCorrect: true,
          textContentType: 'none',
          autoComplete: 'off',
          secure: false,
        }
    }
  }, [type])

  const isSecure = secureTextEntry ?? config.secure

  return (
    <View style={containerStyle}>
      <View
        className="flex-row items-center rounded-2xl border px-5 mb-2 gap-2"
        style={{
          borderColor: '#404040',
          backgroundColor: 'transparent',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {!!icon && <View className="pr-1">{icon}</View>}

        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="grey"
          editable={!disabled}
          style={[
            { fontSize: hp(2), color: colors.textColor, paddingVertical: 16, flex: 1 },
            inputStyle,
          ]}
          keyboardType={config.keyboardType}
          autoCapitalize={config.autoCapitalize}
          autoCorrect={config.autoCorrect}
          autoComplete={config.autoComplete}
          textContentType={config.textContentType}
          secureTextEntry={isSecure}
          returnKeyType={rest.returnKeyType ?? 'done'}
          {...rest}
        />
      </View>

      {!!errorText && (
        <Text className="mt-1" style={{ color: '#ef4444', fontSize: hp(1.6) }}>
          {errorText}
        </Text>
      )}
    </View>
  )
})

// лёгкая мемоизация по базовым пропсам
export default memo(InputComponent)
