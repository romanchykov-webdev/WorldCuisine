// components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Alert, View, TouchableOpacity } from 'react-native'
import { PlusIcon, ScaleIcon } from 'react-native-heroicons/mini'
import { useDebounce } from '../../../constants/halperFunctions'
import { shadowBoxBlack } from '../../../constants/shadow'
import i18n from '../../../lang/i18n'

import ButtonSmallCustom from '../../Buttons/ButtonSmallCustom'
import ModalCustom from '../../ModalCustom'
import TitleDescriptionComponent from '../TitleDescriptionComponent'
import ListIngredientsCreateRecipe from './ListIngredientsCreateRecipe'
import InputComponent from '../../InputComponent'
import { toast } from '../../../lib/toast' // ← используем общий инпут

// --- helpers ----------------------------------------------------------
const getMeasurementByLang = (measurement, lang) => {
  const data = Array.isArray(measurement) ? measurement[0] : measurement
  return data?.[lang] ?? {}
}
const makeLangMap = (langs, fill = '') =>
  langs.reduce((acc, l) => ((acc[l] = fill), acc), {})

// --- component --------------------------------------------------------
function IngredientsCreateRecipe({
  colors,
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

  // ====== SOURCE OF TRUTH: items (новый формат) =======================
  const [items, setItems] = useState([])
  const debouncedItems = useDebounce(items, 350)

  // языки (с фолбэком)
  const langs = useMemo(
    () => (totalLangRecipe?.length ? totalLangRecipe : ['en', 'es', 'it', 'ru', 'ua']),
    [totalLangRecipe],
  )

  // ====== форма добавления ===========================================
  const blankIngredient = useMemo(
    () => ({
      unit: makeLangMap(langs, ''),
      quantity: '1',
      ingredient: makeLangMap(langs, ''),
    }),
    [langs],
  )
  const [ingredient, setIngredient] = useState(blankIngredient)
  const [unitKey, setUnitKey] = useState('')

  // синхронизация формы при изменении набора языков
  useEffect(() => {
    setIngredient((prev) => ({
      unit: { ...makeLangMap(langs, ''), ...prev.unit },
      quantity: prev.quantity ?? '1',
      ingredient: { ...makeLangMap(langs, ''), ...prev.ingredient },
    }))
  }, [langs])

  // список единиц для текущего языка (для модалки)
  const measurementLangApp = useMemo(() => {
    const dict = getMeasurementByLang(measurement, langApp)
    return Object.entries(dict).map(([key, val]) => ({ key, val }))
  }, [measurement, langApp])

  // представление для UI “по языкам”
  const byLang = useMemo(() => {
    const dictByLang = Object.fromEntries(
      langs.map((l) => [l, getMeasurementByLang(measurement, l)]),
    )
    const result = langs.reduce((acc, l) => ((acc[l] = []), acc), {})
    items.forEach((it, idx) => {
      langs.forEach((l) => {
        result[l].push({
          ingredient: it.value?.[l] ?? '',
          quantity: String(it.ves ?? ''),
          unitLabel: dictByLang[l]?.[it.mera] || it.mera,
          unitKey: it.mera,
          sourceIndex: idx,
        })
      })
    })
    return result
  }, [items, langs, measurement])

  // гидратация из props (один раз)
  const hydratedOnce = useRef(false)
  useEffect(() => {
    if (hydratedOnce.current) return
    if (Array.isArray(ingredientsForUpdate) && ingredientsForUpdate.length > 0) {
      setItems(ingredientsForUpdate)
      hydratedOnce.current = true
    }
  }, [ingredientsForUpdate])

  // проброс в родителя (после debounce)
  useEffect(() => {
    setTotalRecipe((prev) =>
      prev.ingredients === debouncedItems
        ? prev
        : { ...prev, ingredients: debouncedItems },
    )
  }, [debouncedItems, setTotalRecipe])

  // ====== handlers ====================================================
  const handleInputChange = useCallback((lang, value) => {
    setIngredient((prev) => ({
      ...prev,
      ingredient: { ...prev.ingredient, [lang]: value },
    }))
  }, [])

  const handleSelectUnit = useCallback(
    (key) => {
      const updatedUnit = langs.reduce((acc, l) => {
        const dict = getMeasurementByLang(measurement, l)
        acc[l] = dict[key] || ''
        return acc
      }, {})
      setIngredient((prev) => ({ ...prev, unit: updatedUnit }))
      setUnitKey(key)
    },
    [langs, measurement],
  )

  const addIngredient = useCallback(() => {
    const hasEmptyName = Object.values(ingredient.ingredient).some((v) => v.trim() === '')
    if (hasEmptyName) {
      // Alert.alert(i18n.t('You forgot') + '!', i18n.t('Write the name of the ingredient'))
      toast.info(i18n.t('You forgot') + '!', i18n.t('Write the name of the ingredient'))

      return
    }
    if (!String(ingredient.quantity).trim()) {
      // Alert.alert(
      //   i18n.t('You forgot') + '!',
      //   i18n.t('Choose the quantity of the ingredient'),
      // )
      toast.info(
        i18n.t('You forgot') + '!',
        i18n.t('Choose the quantity of the ingredient'),
      )
      return
    }
    if (!unitKey) {
      // Alert.alert(
      //   i18n.t('You forgot') + '!',
      //   i18n.t('Select the measurement unit for the ingredient'),
      // )
      toast.info(
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

    setIngredient(blankIngredient)
    setUnitKey('')
  }, [ingredient, unitKey, langApp, blankIngredient])

  const removeIngredient = useCallback(
    (lang, index) => {
      const row = byLang?.[lang]?.[index]
      if (!row) return
      setItems((prev) => prev.filter((_, i) => i !== row.sourceIndex))
    },
    [byLang],
  )

  // ====== render ======================================================
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
            ingredients={byLang}
            totalLangRecipe={langs}
            currentTheme={currentTheme}
            colors={colors}
            removeIngredient={removeIngredient}
          />
        </View>
      )}

      <View className="flex-col gap-2 mb-5">
        <View className="flex-1 gap-y-2 mb-3">
          {langs.map((l) => (
            <View key={l}>
              <InputComponent
                value={ingredient.ingredient[l] || ''}
                onChangeText={(v) => handleInputChange(l, v)} // ← API InputComponent
                placeholder={`${placeholderText} ${l}`}
                placeholderTextColor={placeholderColor}
                // на всякий случай совместимость:
                onChange={(v) => handleInputChange(l, v?.target?.value ?? v)}
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
            <ButtonSmallCustom
              w="100%"
              h={60}
              icon={ScaleIcon}
              size={20}
              tupeButton="refactor"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={shadowBoxBlack()}
            onPress={addIngredient}
            className="flex-1"
          >
            <ButtonSmallCustom
              w="100%"
              h={60}
              icon={PlusIcon}
              size={20}
              tupeButton="add"
            />
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
