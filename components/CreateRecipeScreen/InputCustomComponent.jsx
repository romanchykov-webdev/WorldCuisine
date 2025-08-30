import { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { TrashIcon } from 'react-native-heroicons/mini'
import { useDebounce } from '../../constants/halperFunctions'
import { langArray } from '../../constants/langArray'
import i18n from '../../lang/i18n'
import StərɪskCustomComponent from '../StərɪskCustomComponent'
import AddLangComponent from './AddLangComponent'

function InputCustomComponent({
  styleTextDesc,
  styleInput,
  langDev,
  setTotalLangRecipe,
  totalLangRecipe,
  setTotalRecipe,
  totalRecipe,
  themes,
  currentTheme,
  initialTitle = {},
  titleForUpdate = null,
}) {
  console.log('titleForUpdate', titleForUpdate)
  console.log('totalLangRecipe', totalLangRecipe)

  const [languages, setLanguages] = useState([])
  // отображаемые в UI названия языков (чипсы)
  const [totLang, setTotLang] = useState([]) // ['Русский','English',...]
  // сами переводы: { en: 'Asado', ru: 'Асадо', ... }
  const [translations, setTranslations] = useState(initialTitle || {})
  const [modalVisible, setModalVisible] = useState(false)

  // дебаунсим объект переводов
  const debouncedTranslations = useDebounce(translations, 500)

  // 1) поднимаем список всех языков (code+name)
  useEffect(() => {
    setLanguages(langArray) // [{ code:'ru', name:'Русский' }, ...]
  }, [])

  // 2) инициализируем выбранные языки (чипсы) и коды
  useEffect(() => {
    if (!languages.length) return
    // показать в чипсах язык dev первым
    const devLangObj = languages.find((l) => l.code.toLowerCase() === (langDev || '').toLowerCase())
    const initialNames = devLangObj ? [devLangObj.name] : []
    // если уже есть totalLangRecipe, добавим их видимые имена
    const more = (totalLangRecipe || [])
      .map((code) => languages.find((l) => l.code === code)?.name)
      .filter(Boolean)
      .filter((name) => !initialNames.includes(name))
    setTotLang([...initialNames, ...more])
    // гарантируем, что в codes есть dev-язык
    if (devLangObj && !totalLangRecipe?.includes(devLangObj.code)) {
      setTotalLangRecipe((prev) => [...(prev || []), devLangObj.code])
    }
    // гарантируем, что translations имеет ключ dev
    if (devLangObj && translations[devLangObj.code] == null) {
      setTranslations((prev) => ({ ...prev, [devLangObj.code]: '' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages])

  // 1) При монтировании или при изменении titleForUpdate — один раз заливаем его в локальный state
  useEffect(() => {
    if (titleForUpdate && Object.keys(titleForUpdate).length > 0) {
      setTranslations(titleForUpdate)
    }
  }, [titleForUpdate])

  // 2) Синхронизируем translations с totalRecipe (только после debounce)
  useEffect(() => {
    setTotalRecipe((prev) => ({
      ...prev,
      title: debouncedTranslations,
    }))
  }, [debouncedTranslations, setTotalRecipe])

  // выбор нового языка из модалки
  const selectLanguage = (lang) => {
    // lang = { code, name }
    if (!totLang.some((n) => n.toLowerCase() === lang.name.toLowerCase())) {
      setTotLang((prev) => [...prev, lang.name])
    }
    if (!totalLangRecipe.includes(lang.code)) {
      setTotalLangRecipe((prev) => [...prev, lang.code])
    }
    if (translations[lang.code] == null) {
      setTranslations((prev) => ({ ...prev, [lang.code]: '' }))
    }
    setModalVisible(false)
  }

  // удаление языка
  const removeLang = (langName) => {
    // убрать из видимых имён
    setTotLang((prev) => prev.filter((n) => n !== langName))
    // найти код и убрать из codes + translations
    const langObj = languages.find((l) => l.name === langName)
    if (!langObj) return
    setTotalLangRecipe((prev) => prev.filter((code) => code !== langObj.code))
    setTranslations((prev) => {
      const copy = { ...prev }
      delete copy[langObj.code]
      return copy
    })
  }

  // изменение текста
  const handleTextChange = (langCode, value) => {
    setTranslations((prev) => ({ ...prev, [langCode]: value }))
  }

  return (
    <View>
      <Text style={[styleTextDesc, { color: themes[currentTheme]?.textColor }]}>
        {i18n.t('Dish Name')}
      </Text>

      {totLang.map((langName) => {
        const langCode = languages.find((l) => l.name === langName)?.code
        if (!langCode) return null
        return (
          <View key={langName} className="mb-5">
            <Text
              style={[styleTextDesc, { fontSize: 12, color: themes[currentTheme]?.textColor }]}
              className="mt-2"
            >
              {langName}
            </Text>
            <View className="flex-row items-center">
              <View className="relative flex-1">
                <StərɪskCustomComponent />
                <TextInput
                  value={translations[langCode] ?? ''}
                  onChangeText={(value) => handleTextChange(langCode, value)}
                  style={[styleInput, { color: themes[currentTheme]?.textColor }]}
                  placeholder={i18n.t('Enter recipe name')}
                  placeholderTextColor="grey"
                />
              </View>

              {/* кнопку удаления прячем для первого (дефолтного) языка */}
              {totLang[0] !== langName && (
                <TouchableOpacity
                  onPress={() => removeLang(langName)}
                  className="w-[60] h-[60] ml-2 bg-red-500 border-[1px] border-neutral-300 rounded-[10] justify-center items-center"
                >
                  <TrashIcon color="white" size={30} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )
      })}

      <AddLangComponent
        languages={languages}
        selectLanguage={selectLanguage}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        totLang={totLang}
        langDev={langDev}
      />
    </View>
  )
}

export default InputCustomComponent
