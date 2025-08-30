import { useEffect, useRef, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { useDebounce } from '../../constants/halperFunctions'
import { themes } from '../../constants/themes'
import StərɪskCustomComponent from '../StərɪskCustomComponent'

function InputCreateRecipeScreenCustom({
  styleTextDesc,
  styleInput,
  placeholderText,
  placeholderColor,
  totalLangRecipe,
  setTotalRecipe,
  currentTheme,
  areaForUpdate = null,
}) {
  // локальное состояние: { en:'', ru:'', ... }
  const hydratedFromUpdate = useRef(false) // чтобы не перезаписывать ввод пользователя

  const [inputValues, setInputValues] = useState(() => {
    const init = {}
    totalLangRecipe?.forEach((lang) => {
      init[lang] = ''
    })
    return init
  })
  console.log('areaForUpdate', areaForUpdate)

  // 1) Гидратация из areaForUpdate один раз (или когда areaForUpdate поменялся на валидный объект)
  useEffect(() => {
    if (areaForUpdate && typeof areaForUpdate === 'object' && !hydratedFromUpdate.current) {
      setInputValues(areaForUpdate) // заполняем локальные инпуты
      hydratedFromUpdate.current = true
    }
  }, [areaForUpdate])

  // дебаунс чтобы не дёргать родителя каждую букву
  const debouncedValues = useDebounce(inputValues, 500)

  // обновляем родителя
  useEffect(() => {
    setTotalRecipe((prev) => ({
      ...prev,
      area: debouncedValues, // отдаём ровно { en:'', ru:'', ... }
    }))
  }, [debouncedValues, setTotalRecipe])

  // обновление конкретного языка
  const handleInputChange = (lang, value) => {
    setInputValues((prev) => ({
      ...prev,
      [lang]: value,
    }))
  }

  return (
    <View className="mb-2">
      {totalLangRecipe?.map((lang) => (
        <View key={lang} className="mb-3">
          <Text
            style={[styleTextDesc, { fontSize: 12, color: themes[currentTheme]?.textColor }]}
            className="mt-2"
          >
            {placeholderText} {lang}
          </Text>
          <View>
            <StərɪskCustomComponent />
            <TextInput
              value={inputValues[lang]}
              style={[styleInput, { color: themes[currentTheme]?.textColor }]}
              onChangeText={(val) => handleInputChange(lang, val)}
              placeholder={`${placeholderText} ${lang}`}
              placeholderTextColor={placeholderColor}
            />
          </View>
        </View>
      ))}
    </View>
  )
}

export default InputCreateRecipeScreenCustom
