import { useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PlusIcon, ScaleIcon } from 'react-native-heroicons/mini'
import { useDebounce } from '../../../constants/halperFunctions'
import { shadowBoxBlack } from '../../../constants/shadow'
import { themes } from '../../../constants/themes'
import { useAuth } from '../../../contexts/AuthContext'
import i18n from '../../../lang/i18n'

import ButtonSmallCustom from '../../Buttons/ButtonSmallCustom'
import ModalCustom from '../../ModalCustom'
import StərɪskCustomComponent from '../../StərɪskCustomComponent'
import TitleDescriptionComponent from '../TitleDescriptionComponent'
import ListIngredientsCreateRecipe from './ListIngredientsCreateRecipe'

/// …импорты те же

const getMeasurementByLang = (measurement, lang) => {
  const data = Array.isArray(measurement) ? measurement[0] : measurement
  return data?.[lang] ?? {}
}

function IngredientsCreateRecipe({
  currentTheme,
  styleInput,
  placeholderText,
  placeholderColor,
  langApp,
  measurement,
  totalLangRecipe,
  setTotalRecipe,
  ingredientsForUpdate,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false)

  // список единиц текущего языка (для модалки выбора)
  const [measurementLangApp, setMeasurementLangApp] = useState([])

  // ====== ИСТОЧНИК ПРАВДЫ: НОВЫЙ ФОРМАТ ======
  const [items, setItems] = useState([])
  const debouncedItems = useDebounce(items, 400)

  // ====== DERIVED STATE ДЛЯ ОТОБРАЖЕНИЯ: byLang ======
  const [byLang, setByLang] = useState({})

  // форма добавления нового ингредиента
  const [ingredient, setIngredient] = useState({
    unit: totalLangRecipe.reduce((acc, l) => ({ ...acc, [l]: '' }), {}),
    quantity: '1',
    ingredient: totalLangRecipe.reduce((acc, l) => ({ ...acc, [l]: '' }), {}),
  })
  const [unitKey, setUnitKey] = useState('')

  // локализация списка мер
  useEffect(() => {
    const dict = getMeasurementByLang(measurement, langApp)
    setMeasurementLangApp(Object.entries(dict).map(([key, val]) => ({ key, val })))
  }, [measurement, langApp])

  // гидратация из props (ОДИН РАЗ)
  const hydratedOnce = useRef(false)
  useEffect(() => {
    if (hydratedOnce.current) return
    if (Array.isArray(ingredientsForUpdate) && ingredientsForUpdate.length > 0) {
      setItems(ingredientsForUpdate) // уже правильный формат
      hydratedOnce.current = true
    }
  }, [ingredientsForUpdate])

  // пробрасываем в родителя только новый формат
  useEffect(() => {
    setTotalRecipe((prev) => ({ ...prev, ingredients: debouncedItems }))
  }, [debouncedItems, setTotalRecipe])

  // пересобираем byLang каждый раз, когда меняются items/языки/measurement
  useEffect(() => {
    const langs = totalLangRecipe?.length ? totalLangRecipe : ['en', 'es', 'it', 'ru', 'ua']
    const dictByLang = Object.fromEntries(
      langs.map((l) => [l, getMeasurementByLang(measurement, l)]),
    )

    const nextByLang = {}
    langs.forEach((l) => (nextByLang[l] = []))

    items.forEach((it, idx) => {
      langs.forEach((l) => {
        nextByLang[l].push({
          ingredient: it.value?.[l] ?? '',
          quantity: String(it.ves ?? ''),
          unitLabel: dictByLang[l]?.[it.mera] || it.mera,
          unitKey: it.mera,
          sourceIndex: idx,
        })
      })
    })

    setByLang(nextByLang)
  }, [items, totalLangRecipe, measurement])

  // добавление нового
  const addIngredient = () => {
    const hasEmptyName = Object.values(ingredient.ingredient).some((v) => v.trim() === '')
    if (hasEmptyName) {
      Alert.alert(i18n.t('You forgot') + '!', i18n.t('Write the name of the ingredient'))
      return
    }
    if (!ingredient.quantity.trim()) {
      Alert.alert(i18n.t('You forgot') + '!', i18n.t('Choose the quantity of the ingredient'))
      return
    }
    if (!unitKey) {
      Alert.alert(
        i18n.t('You forgot') + '!',
        i18n.t('Select the measurement unit for the ingredient'),
      )
      return
    }

    const newItem = {
      ves: Number(ingredient.quantity) || 0,
      lang: langApp,
      mera: unitKey,
      value: { ...ingredient.ingredient },
    }
    setItems((prev) => [...prev, newItem])

    // сбрасываем форму
    setIngredient({
      unit: totalLangRecipe.reduce((acc, l) => ({ ...acc, [l]: '' }), {}),
      quantity: '1',
      ingredient: totalLangRecipe.reduce((acc, l) => ({ ...acc, [l]: '' }), {}),
    })
    setUnitKey('')
  }

  const handleInputChange = (lang, value) => {
    setIngredient((prev) => ({ ...prev, ingredient: { ...prev.ingredient, [lang]: value } }))
  }

  const handleSelectUnit = (key) => {
    const updatedUnit = totalLangRecipe.reduce((acc, l) => {
      const dict = getMeasurementByLang(measurement, l)
      acc[l] = dict[key] || ''
      return acc
    }, {})
    setIngredient((prev) => ({ ...prev, unit: updatedUnit }))
    setUnitKey(key)
  }

  // УДАЛЕНИЕ: на вход приходит язык и индекс в списке этого языка.
  // Берём sourceIndex — и удаляем по нему из items.
  const removeIngredient = (lang, index) => {
    const row = byLang?.[lang]?.[index]
    if (!row) return
    const idx = row.sourceIndex
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <View>
      <TitleDescriptionComponent
        titleVisual
        titleText={i18n.t('Ingredients')}
        descriptionVisual
        descriptionText={i18n.t(
          'Add all the ingredients and their quantities to prepare the recipe',
        )}
      />

      {Object.keys(byLang).length > 0 && (
        <View>
          <ListIngredientsCreateRecipe
            ingredients={byLang} // <- передаём уже БЕЗ .lang
            totalLangRecipe={totalLangRecipe}
            currentTheme={currentTheme}
            removeIngredient={removeIngredient}
          />
        </View>
      )}

      <View className="flex-col gap-2 mb-5">
        <View className="flex-1 gap-y-2 mb-3">
          {totalLangRecipe.map((l) => (
            <View key={l}>
              <StərɪskCustomComponent />
              <TextInput
                style={[styleInput, { color: themes[currentTheme]?.textColor }]}
                value={ingredient.ingredient[l] || ''}
                onChangeText={(v) => handleInputChange(l, v)}
                placeholder={`${placeholderText} ${l}`}
                placeholderTextColor={placeholderColor}
              />
            </View>
          ))}
        </View>

        <View className="flex-row gap-x-2 items-center">
          <TouchableOpacity
            onPress={() => setIsModalVisible(true)}
            style={shadowBoxBlack()}
            className="flex-1"
          >
            <ButtonSmallCustom w="100%" h={60} icon={ScaleIcon} size={20} tupeButton="refactor" />
          </TouchableOpacity>

          <TouchableOpacity style={shadowBoxBlack()} onPress={addIngredient} className="flex-1">
            <ButtonSmallCustom w="100%" h={60} icon={PlusIcon} size={20} tupeButton="add" />
          </TouchableOpacity>
        </View>
      </View>

      <ModalCustom
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        animationType="fade"
        ingredient={ingredient}
        setIngredient={setIngredient}
        array={measurementLangApp}
        onPressHandler={handleSelectUnit}
        langApp={langApp}
      />
    </View>
  )
}

export default IngredientsCreateRecipe
