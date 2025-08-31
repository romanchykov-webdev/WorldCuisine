// components/LanguagesWrapper.jsx
import { StyleSheet } from 'react-native'
import { LanguageIcon } from 'react-native-heroicons/outline'
import i18n from '../lang/i18n'
import SelectCustom from './SelectCustom'
import { useLangStore } from '../stores/langStore'

function LanguagesWrapper({ setLang, lang }) {
  // const lang = useLangStore((s) => s.lang)
  // const setLang = useLangStore((s) => s.setLang)

  const languageNames = {
    en: 'English',
    ru: 'Русский',
    it: 'Italiano',
    ua: 'Українська',
    es: 'Español',
  }

  return (
    <SelectCustom
      title={i18n.t('Language App:')}
      items={languageNames}
      defaultValue={lang}
      icon={LanguageIcon}
      setItems={(selectedLang) => {
        setLang(selectedLang)
        i18n.locale = selectedLang
      }}
    />
  )
}

const styles = StyleSheet.create({})
export default LanguagesWrapper
