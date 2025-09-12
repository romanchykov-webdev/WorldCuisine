import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { TrashIcon } from 'react-native-heroicons/mini'
import i18n from '../../lang/i18n'
import { useDebounce } from '../../utils/useDebounce'
import { langArray } from '../../constants/langArray'
import AddLangComponent from './AddLangComponent'
import InputComponent from '../InputComponent'
import { deepEqual } from '../../helpers/deepEqual'

export default function InputCustomComponent({
  colors,
  appLang,
  value = {},
  onChange,
  selectedLangs = [],
  onLangsChange,
  styleTextDesc,
  styleInput,
}) {
  const [languages] = React.useState(() => langArray)
  const [translations, setTranslations] = React.useState({ ...value })
  const [modalVisible, setModalVisible] = React.useState(false)

  // подхватываем внешние правки value только при реальном изменении
  React.useEffect(() => {
    if (!deepEqual(value || {}, translations || {})) {
      setTranslations(value || {})
    }
  }, [value])

  // репортим родителю с debounce
  const debounced = useDebounce(translations, 300)
  React.useEffect(() => {
    if (!onChange) return
    if (!deepEqual(debounced || {}, value || {})) onChange(debounced)
  }, [debounced, value, onChange])

  // добавить язык
  const addLang = (obj) => {
    if (!obj?.code) return
    const code = obj.code
    if (!selectedLangs.includes(code)) {
      onLangsChange?.([...selectedLangs, code])
    }
    if (translations[code] == null) {
      setTranslations((p) => ({ ...p, [code]: '' }))
    }
    setModalVisible(false)
  }

  // удалить язык (кроме первого — базового appLang)
  const removeLang = (code) => {
    if (selectedLangs[0] === code) return
    onLangsChange?.(selectedLangs.filter((c) => c !== code))
    setTranslations((p) => {
      if (p[code] == null) return p
      const next = { ...p }
      delete next[code]
      return next
    })
  }

  // отрисовываем в порядке selectedLangs
  return (
    <View>
      <Text style={[styleTextDesc, { color: colors.textColor }]}>
        {i18n.t('Dish Name')}
      </Text>

      {selectedLangs.map((code) => {
        const langName =
          languages.find((l) => l.code === code)?.name || code.toUpperCase()
        return (
          <View key={code} className="mb-5">
            <Text
              style={[styleTextDesc, { fontSize: 12, color: colors.textColor }]}
              className="mt-2"
            >
              {langName}
            </Text>
            <View className="flex-row items-center">
              <View className="relative flex-1">
                <InputComponent
                  placeholder={i18n.t('Enter recipe name')}
                  value={translations[code] ?? ''}
                  onChangeText={(t) => setTranslations((p) => ({ ...p, [code]: t }))}
                  inputStyle={styleInput}
                  returnKeyType="done"
                />
              </View>

              {selectedLangs[0] !== code && (
                <TouchableOpacity
                  onPress={() => removeLang(code)}
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
        colors={colors}
        languages={languages}
        selectedNames={selectedLangs.map(
          (c) => languages.find((l) => l.code === c)?.name ?? c,
        )}
        devLangCode={appLang}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSelect={addLang}
      />
    </View>
  )
}
