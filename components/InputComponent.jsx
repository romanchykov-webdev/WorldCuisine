import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Platform, Pressable, Text, TextInput, View } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { useThemeColors } from '../stores/themeStore'

/**
 * Универсальный инпут с иконками и состояниями.
 *
 * Props:
 * - value, onChangeText, placeholder
 * - type: 'text' | 'email' | 'password' | 'number'
 * - secureTextEntry?: boolean (переопределяет type='password')
 * - label?: string
 * - helperText?: string
 * - errorText?: string
 * - disabled?: boolean
 * - maxLength?: number (покажет счётчик если передан)
 * - left?: ReactNode (левый аксессуар)
 * - right?: ReactNode | ({secure, setSecure}) => ReactNode (правый аксессуар / тулза)
 * - showPasswordToggle?: boolean (показать глаз для password)
 * - containerStyle, inputStyle, labelStyle, helperStyle
 * - onSubmitEditing, returnKeyType, blurOnSubmit, ...rest
 *
 * Ref:
 * - { focus(), blur(), clear(), setSecure(next:boolean), isFocused(): boolean }
 */
const InputComponent = forwardRef(function InputComponent(
  {
    value,
    onChangeText,
    placeholder,
    type = 'text',
    secureTextEntry,
    label,
    helperText,
    errorText,
    disabled = false,
    maxLength,
    left,
    right,
    showPasswordToggle = true,
    showCounter = false,

    containerStyle,
    inputStyle,
    labelStyle,
    helperStyle,

    returnKeyType = 'done',
    blurOnSubmit = true,

    ...rest
  },
  ref,
) {
  const colors = useThemeColors()
  const inputRef = useRef(null)

  const [focused, setFocused] = useState(false)
  const [secure, setSecure] = useState(
    secureTextEntry ?? (type === 'password' ? true : false),
  )

  // базовая конфигурация по типу
  const config = useMemo(() => {
    switch (type) {
      case 'email':
        return {
          keyboardType: 'email-address',
          autoCapitalize: 'none',
          autoCorrect: false,
          textContentType: 'emailAddress',
          autoComplete: 'email',
        }
      case 'password':
        return {
          keyboardType: 'default',
          autoCapitalize: 'none',
          autoCorrect: false,
          textContentType: 'password',
          autoComplete: 'password',
        }
      case 'number':
        return {
          keyboardType: Platform.select({
            ios: 'numbers-and-punctuation',
            android: 'numeric',
          }),
          autoCapitalize: 'none',
          autoCorrect: false,
          textContentType: 'none',
          autoComplete: 'off',
        }
      default:
        return {
          keyboardType: 'default',
          autoCapitalize: 'sentences',
          autoCorrect: true,
          textContentType: 'none',
          autoComplete: 'off',
        }
    }
  }, [type])

  // цвета рамки по состоянию
  const borderColor = useMemo(() => {
    if (disabled) return '#737373' // neutral-500
    if (errorText) return '#ef4444' // red-500
    if (focused) return '#22c55e' // green-500
    return '#404040' // neutral-700
  }, [disabled, errorText, focused])

  // ref API наружу
  useImperativeHandle(
    ref,
    () => ({
      focus: () => inputRef.current?.focus(),
      blur: () => inputRef.current?.blur(),
      clear: () => inputRef.current?.clear(),
      setSecure: (next) => setSecure(!!next),
      isFocused: () => !!inputRef.current?.isFocused?.(),
    }),
    [],
  )

  // глаз для пароля (минималистичный)
  const PasswordToggle = useCallback(() => {
    if (!(type === 'password' && showPasswordToggle)) return null
    return (
      <Pressable
        onPress={() => setSecure((s) => !s)}
        hitSlop={8}
        style={{ paddingHorizontal: 4, paddingVertical: 8 }}
      >
        <Text style={{ color: colors.textColor }}>
          {secure ? '👁️‍🗨️' : '👁️'}
          {/* замените на свою иконку при желании */}
        </Text>
      </Pressable>
    )
  }, [colors.textColor, secure, type, showPasswordToggle])

  // правый аксессуар — если передали функцию, даём управление secure
  const RightAccessory = useMemo(() => {
    if (!right && !(type === 'password' && showPasswordToggle)) return null
    if (typeof right === 'function') return right({ secure, setSecure })
    if (right) return right
    return <PasswordToggle />
  }, [right, PasswordToggle, secure, setSecure, type, showPasswordToggle])

  const showMeta =
    !!errorText || !!helperText || (showCounter && typeof maxLength === 'number')

  return (
    <View style={containerStyle}>
      {!!label && (
        <Text
          style={[
            { marginBottom: 6, fontSize: hp(1.8), color: colors.textColor },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        className="flex-row items-center rounded-2xl border px-4"
        style={{
          borderColor,
          backgroundColor: 'transparent',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {!!left && <View style={{ paddingRight: colors.radiusSM }}>{left}</View>}

        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af" // neutral-400
          editable={!disabled}
          style={[
            {
              fontSize: hp(2),
              color: colors.textColor,
              paddingVertical: 14,
              flex: 1,
              minHeight: 44,
            },
            inputStyle,
          ]}
          keyboardType={config.keyboardType}
          autoCapitalize={config.autoCapitalize}
          autoCorrect={config.autoCorrect}
          autoComplete={config.autoComplete}
          textContentType={config.textContentType}
          secureTextEntry={secure}
          returnKeyType={returnKeyType}
          blurOnSubmit={blurOnSubmit}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {!!RightAccessory && <View style={{ paddingLeft: 6 }}>{RightAccessory}</View>}
      </View>

      {/* счётчик символов + ошибки / подсказки */}
      {showMeta && (
        <View
          style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' }}
        >
          <View style={{ flexShrink: 1, paddingRight: 8 }}>
            {!!errorText ? (
              <Text style={{ color: '#ef4444', fontSize: hp(1.6) }}>{errorText}</Text>
            ) : !!helperText ? (
              <Text style={[{ color: colors.textColor, fontSize: hp(1.6) }, helperStyle]}>
                {helperText}
              </Text>
            ) : null}
          </View>

          {showCounter && typeof maxLength === 'number' && (
            <Text style={{ color: colors.textColor, fontSize: hp(1.5) }}>
              {value?.length ?? 0}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  )
})

// Точная мемоизация по ключевым пропсам
function areEqual(prev, next) {
  return (
    prev.value === next.value &&
    prev.placeholder === next.placeholder &&
    prev.type === next.type &&
    prev.secureTextEntry === next.secureTextEntry &&
    prev.errorText === next.errorText &&
    prev.disabled === next.disabled &&
    prev.maxLength === next.maxLength &&
    prev.label === next.label &&
    prev.helperText === next.helperText &&
    prev.returnKeyType === next.returnKeyType &&
    prev.blurOnSubmit === next.blurOnSubmit
  )
}

export default memo(InputComponent, areEqual)
