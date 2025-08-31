import { useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { MagnifyingGlassIcon } from 'react-native-heroicons/mini'

import i18n from '../lang/i18n'
import { hp } from '../constants/responsiveScreen'
import { shadowBoxBlack } from '../constants/shadow'
import ButtonClearInputCustomComponent from './ButtonClearInputCustomComponent'
import { useThemeColors } from '../stores/themeStore'
import PulseRing from './PulseRing'
import { useDebounce } from '../utils/useDebounce'

function SearchComponent({ mode = 'home', initialValue = '', onSearchChange }) {
  const colors = useThemeColors()
  const router = useRouter()
  const [value, setValue] = useState(initialValue)

  // вычисляем текущий режим: домашний или экран поиска с результатами
  const effectiveMode = mode

  // debounce для live-поиска
  const debounced = useDebounce(value, 1000)

  // есть ли введённый текст
  const hasText = value.trim().length > 0

  // live-обновление наверх на экране результатов
  useEffect(() => {
    if (effectiveMode === 'results' && onSearchChange) {
      onSearchChange(debounced.trim())
    }
  }, [debounced, effectiveMode, onSearchChange])

  // переход на экран поиска (домашний режим)
  const goToSearchScreen = () => {
    if (effectiveMode !== 'home') return
    const q = value.trim()
    if (!q) return

    router.push({
      pathname: '(main)/SearchRecipeScreen',
      params: { searchQuery: q },
    })

    // лёгкий UX-ресет
    setTimeout(() => setValue(''), 100)
  }

  return (
    <View style={[shadowBoxBlack(), styles.wrapper, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
      <View className="flex-row items-center rounded-full bg-transparent">
        <TextInput
          placeholder={i18n.t('Search any food')}
          placeholderTextColor="gray"
          style={[styles.input, { color: colors.textColor }]}
          value={value}
          onChangeText={setValue}
          returnKeyType={effectiveMode === 'home' ? 'search' : 'done'}
          onSubmitEditing={effectiveMode === 'home' ? goToSearchScreen : undefined}
          autoCorrect={false}
          autoCapitalize="none"
        />

        {effectiveMode === 'home' && (
          <TouchableOpacity
            onPress={goToSearchScreen}
            className="bg-white rounded-full p-5 overflow-hidden"
          >
            <View style={styles.iconContainer}>
              <PulseRing active={hasText} />
              <MagnifyingGlassIcon size={hp(2.5)} color="gray" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {!!value && (
        <ButtonClearInputCustomComponent
          top={-15}
          left={-5}
          inputValue={value}
          setInputValue={setValue}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 999,
    padding: 6,
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    fontSize: hp(1.7),
    flex: 1,
    padding: 12,
    marginBottom: 4,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default SearchComponent
