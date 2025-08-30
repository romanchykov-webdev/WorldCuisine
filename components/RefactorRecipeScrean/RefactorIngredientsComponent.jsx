import { useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PlusIcon, TrashIcon } from 'react-native-heroicons/outline'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import TitleDescriptionComponent from '../CreateRecipeScreen/TitleDescriptionComponent'
import ModalEditComponent from './ModalEditComponent'
import RefactorAddIngredientModal from './RefactorAddIngredientModal'

/**
 * ingredients (новый формат): Array<{
 *   ves: number,
 *   lang: string,          // язык автора/основной
 *   mera: string,          // ключ единицы: 'g' | 'kg' | ...
 *   value: Record<string,string> // {en:'...', ru:'...'}
 * }>
 * measurement (новый формат): [ { en:{key->label}, es:{}, it:{}, ru:{}, ua:{} } ]
 */
function RefactorIngredientsComponent({
  langApp,
  ingredients = [],
  updateIngredients,
  iconRefactor,
  measurement,
}) {
  const { currentTheme } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)

  // measurement map
  const measurementMap = Array.isArray(measurement) && measurement[0] ? measurement[0] : {}
  const unitsList = Object.entries(measurementMap?.[langApp] || {}).map(([key, val]) => ({
    key,
    val,
  }))

  // список языков из первого ингредиента или дефолт
  const langs = ingredients[0]?.value
    ? Object.keys(ingredients[0].value)
    : ['en', 'es', 'it', 'ru', 'ua']

  const validateIngredientData = (data) => {
    if (!data) return false
    const namesOk = langs.every((lng) => data.value?.[lng]?.trim())
    const vesOk = Number(data.ves) > 0
    const meraOk = !!data.mera
    const langOk = !!data.lang
    const ok = namesOk && vesOk && meraOk && langOk
    if (!ok) {
      Alert.alert(i18n.t('Attention'), i18n.t('Please fill in all fields'))
    }
    return ok
  }

  const refactorIngredient = (ingredient, index) => {
    setSelectedIngredient(ingredient)
    setSelectedIndex(index)
    setModalVisible(true)
  }

  const handleSave = (updated) => {
    if (!validateIngredientData(updated)) return
    const next = ingredients.map((it, idx) => (idx === selectedIndex ? updated : it))
    updateIngredients(next)
    setModalVisible(false)
  }

  const handleAddSave = (newIng) => {
    if (!validateIngredientData(newIng)) return
    updateIngredients([...ingredients, newIng])
    setAddModalVisible(false)
  }

  const handleDelete = (index) => {
    updateIngredients(ingredients.filter((_, i) => i !== index))
  }

  const getUnitLabel = (meraKey) => measurementMap?.[langApp]?.[meraKey] || meraKey

  return (
    <View className="mb-5">
      <TitleDescriptionComponent titleVisual titleText={i18n.t('Ingredients')} />

      <View className="mb-5">
        {ingredients.map((ing, index) => (
          <View key={`${ing.mera}-${index}`} className="flex-row gap-x-4 items-center mb-2">
            <View className="flex-1 flex-row flex-wrap gap-x-2 items-center">
              <Text style={{ color: themes[currentTheme]?.secondaryTextColor, fontWeight: 'bold' }}>
                {ing.value?.[langApp]}
              </Text>
              <Text style={{ color: themes[currentTheme]?.secondaryTextColor }}>
                {' - '}
                {ing.ves} {getUnitLabel(ing.mera)}
              </Text>
            </View>

            <TouchableOpacity
              style={shadowBoxBlack()}
              onPress={() => refactorIngredient(ing, index)}
            >
              <ButtonSmallCustom icon={iconRefactor} size={20} tupeButton="refactor" />
            </TouchableOpacity>

            <TouchableOpacity style={shadowBoxBlack()} onPress={() => handleDelete(index)}>
              <ButtonSmallCustom icon={TrashIcon} size={20} tupeButton="remove" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={shadowBoxBlack()} onPress={() => setAddModalVisible(true)}>
        <ButtonSmallCustom tupeButton="add" w="100%" h={60} icon={PlusIcon} size={40} />
      </TouchableOpacity>

      {/* модалки */}
      <ModalEditComponent
        visible={modalVisible}
        initialData={selectedIngredient}
        lang={langApp}
        type="ingredients"
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
        measurement={measurement}
        langs={langs}
      />

      <RefactorAddIngredientModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={handleAddSave}
        quontityLang={langs}
        measurement={measurement}
      />
    </View>
  )
}

export default RefactorIngredientsComponent
