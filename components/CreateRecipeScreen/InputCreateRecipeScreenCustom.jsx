import { useEffect, useState } from 'react'
import { TextInput, View } from 'react-native'
import { useDebounce } from '../../constants/halperFunctions'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import StərɪskCustomComponent from '../StərɪskCustomComponent'

function InputCreateRecipeScreenCustom({
  styleInput,
  placeholderText,
  placeholderColor,
  totalLangRecipe,
  setTotalRecipe,
}) {
  // console.log("totalLangRecipe", totalLangRecipe);
  const { currentTheme } = useAuth()
  // Инициализируем состояние как объект
  const [inputValues, setInputValues] = useState({})

  // Добавляем дебонсированное значение
  const debouncedInputValue = useDebounce(inputValues, 1000) // 1000мс = 1 секунда

  // Инициализация начальных значений
  useEffect(() => {
    if (totalLangRecipe && totalLangRecipe.length > 0) {
      const initialValues = {}
      totalLangRecipe.forEach((lang) => {
        initialValues[lang] = ''
      })
      setInputValues(initialValues)
    }
  }, [totalLangRecipe])

  useEffect(() => {
    setTotalRecipe(prevRecipe => ({
      ...prevRecipe,
      area: debouncedInputValue,
    }))
  }, [debouncedInputValue, setTotalRecipe])

  // Обработчик изменения значения для конкретного языка
  const handleInputChange = (value, lang) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [lang]: value,
    }))
  }

  // console.log("inputValues", inputValues);

  return (
    <View className="mb-2">
      {totalLangRecipe?.map((lang, index) => (
        <View key={index} className="mb-3">
          <StərɪskCustomComponent />
          <TextInput
            // className="bg-red-500"
            value={inputValues[lang]}
            style={[styleInput, { color: themes[currentTheme]?.textColor }]}
            onChangeText={value => handleInputChange(value, lang)}
            placeholder={`${placeholderText} ${lang}`}
            placeholderTextColor={placeholderColor}
          />
        </View>
      ))}
    </View>
  )
}

export default InputCreateRecipeScreenCustom
