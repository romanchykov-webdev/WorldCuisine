// components/ThemeWrapper.jsx
import { useEffect } from 'react'
import { Appearance, StyleSheet } from 'react-native'
import { CogIcon } from 'react-native-heroicons/outline'
import i18n from '../lang/i18n'
import SelectCustom from './SelectCustom'
import { useThemeStore } from '../stores/themeStore'

function ThemeWrapper({ theme, setTheme }) {
  const preferredTheme = useThemeStore((s) => s.preferredTheme)
  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)

  useEffect(() => {
    if (preferredTheme === 'auto') {
      const device = Appearance.getColorScheme()
      // просто применяем текущую схему устройства
      applyTheme()
    } else {
      applyTheme()
    }
  }, [preferredTheme, applyTheme])

  const themesValue = {
    auto: 'Auto',
    dark: 'Dark',
    light: 'Light',
  }

  return (
    <SelectCustom
      title={i18n.t('Theme App:')}
      items={themesValue}
      defaultValue={preferredTheme}
      setItems={(v) => setPreferredTheme(v)}
      icon={CogIcon}
    />
  )
}

const styles = StyleSheet.create({})
export default ThemeWrapper
