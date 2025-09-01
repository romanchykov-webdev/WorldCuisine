import { CogIcon } from 'react-native-heroicons/outline'
import i18n from '../lang/i18n'
import SelectCustom from './SelectCustom'
import { useThemeStore } from '../stores/themeStore'

function ThemeWrapper({ theme, setTheme }) {
  const setPreferredTheme = useThemeStore((s) => s.setPreferredTheme)
  const applyTheme = useThemeStore((s) => s.applyTheme)

  const items = {
    auto: 'Auto',
    light: 'Light',
    dark: 'Dark',
  }

  const handleChange = (key) => {
    setPreferredTheme(key) // сохраним выбор пользователя
    applyTheme(key) // применим визуально
    setTheme?.(key) // положим в форму профиля
  }

  return (
    <SelectCustom
      title={i18n.t('Theme App:')}
      items={items}
      defaultValue={theme}
      setItems={handleChange}
      icon={CogIcon}
    />
  )
}

export default ThemeWrapper
