import { LanguageIcon } from 'react-native-heroicons/outline'
import i18n from '../lang/i18n'
import SelectCustom from './SelectCustom'

function LanguagesWrapper({ setLang, lang }) {
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

export default LanguagesWrapper
