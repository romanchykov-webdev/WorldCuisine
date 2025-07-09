import { useEffect } from 'react'
import { Appearance, StyleSheet } from 'react-native'
import { CogIcon } from 'react-native-heroicons/outline'
import { useAuth } from '../contexts/AuthContext'

// translate
import i18n from '../lang/i18n'
import SelectCustom from './SelectCustom'

function ThemeWrapper({ theme, setTheme }) {
  { /* theme, setTheme */ }
  const { setCurrentTheme } = useAuth()
  // items, defaultValue, setItems

  // const {changeTheme} =useAuth()

  useEffect(() => {
    if (theme !== 'auto') {
      console.log('ThemeWrapper', theme)
      setCurrentTheme(theme)
    }
    if (theme === 'auto') {
      setCurrentTheme(Appearance.getColorScheme())
    }
  }, [theme])

  const themesValue = {
    auto: 'Auto',
    dark: 'Dark',
    light: 'Light',
  }
  console.log('Appearance.getColorScheme()', Appearance.getColorScheme())
  // console.log(theme)
  return (
    <SelectCustom title={i18n.t('Theme App:')} items={themesValue} defaultValue={theme} setItems={setTheme} icon={CogIcon} />
    // <SelectCustom
    //     title={i18n.t('Theme App:')}
    //     items={themesValue}
    //     defaultValue={theme}
    //     setItems={changeTheme}
    //     icon={CogIcon}
    // />

  // <SelectCustom title={'Change language:'} items={languageNames} defaultValue={lang} setItems={setLang} />
  )
}

const styles = StyleSheet.create({})

export default ThemeWrapper
