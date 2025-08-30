import { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'

/**
 * props:
 * - visible, onClose, onSave
 * - initialData: { ves, lang, mera, value:{...} }   // новый формат ингредиента
 * - lang: string           // текущий язык интерфейса (для заголовка модалки)
 * - type: 'ingredients' | ...
 * - measurement: [ { en:{key:label}, ... } ]
 * - langs: string[]        // список языков, которые должны быть в value
 * - validateIngredientData: (obj, langs[]) => boolean
 */
function ModalEditComponent({
  visible,
  initialData,
  lang,
  type,
  onSave,
  onClose,
  measurement,
  langs = ['en', 'es', 'it', 'ru', 'ua'],
  validateIngredientData,
}) {
  const { language: appLang, currentTheme } = useAuth()

  // для нового формата
  const [namesByLang, setNamesByLang] = useState({})
  const [ves, setVes] = useState('1')
  const [meraKey, setMeraKey] = useState('')

  const [text, setText] = useState('') // для прочих типов (tags/title/area и т.п.)
  const [unitsForLang, setUnitsForLang] = useState([])

  // Инициализация по типу
  useEffect(() => {
    if (!visible) return

    if (type === 'ingredients' && initialData) {
      // наполняем состояние из объекта нового формата
      const values = initialData.value || {}
      const initNames = {}
      langs.forEach((l) => {
        initNames[l] = values[l] || ''
      })
      setNamesByLang(initNames)
      setVes(typeof initialData.ves === 'number' ? String(initialData.ves) : initialData.ves || '1')
      setMeraKey(initialData.mera || '')
    } else if (initialData) {
      setText(typeof initialData === 'string' ? initialData : '')
    }
  }, [visible, initialData, type])

  // список единиц для текущего языка
  useEffect(() => {
    const map = Array.isArray(measurement) && measurement[0] ? measurement[0] : {}
    const dict = map?.[appLang] || {}
    const list = Object.entries(dict).map(([key, val]) => ({ key, val }))
    setUnitsForLang(list)
  }, [measurement, appLang])

  const handleSelectUnit = (key /*, val */) => {
    setMeraKey(key) // храним ключ
  }

  const handleNameChange = (lng, value) => {
    setNamesByLang((prev) => ({ ...prev, [lng]: value }))
  }

  const handleSave = () => {
    if (type === 'ingredients') {
      const updated = {
        ves: Number(ves),
        lang: initialData?.lang || appLang,
        mera: meraKey,
        value: { ...namesByLang },
      }
      onSave(updated, lang)
      onClose()
      // if (validateIngredientData(updated, langs)) {
      //   onSave(updated, lang)
      //   onClose()
      // }
    } else {
      onSave(text, lang)
      onClose()
    }
  }

  let titleModal = ''
  switch (type) {
    case 'tags':
      titleModal = `${i18n.t('Add new tag')}`
      break
    case 'ingredients':
      titleModal = `${i18n.t('Edit Ingredient')} (${lang?.toUpperCase() || ''})`
      break
    default:
      titleModal = `${i18n.t('Edit')} ${lang?.toUpperCase() || ''}`
      break
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: themes[currentTheme]?.backgroundColor }]}
        >
          <Text style={[styles.modalTitle, { color: themes[currentTheme]?.textColor }]}>
            {titleModal}
          </Text>

          {type === 'ingredients' ? (
            <View className="w-full">
              {/* названия на всех языках */}
              <FlatList
                data={langs}
                keyExtractor={(item) => item}
                style={{ maxHeight: hp(30), width: '100%', marginBottom: 10 }}
                renderItem={({ item }) => (
                  <TextInput
                    style={[styles.input, { color: themes[currentTheme]?.secondaryTextColor }]}
                    value={namesByLang[item] || ''}
                    onChangeText={(v) => handleNameChange(item, v)}
                    placeholder={item.toUpperCase()}
                  />
                )}
              />

              {/* количество */}
              <TextInput
                value={ves}
                onChangeText={(value) => {
                  if (/^\d*\.?\d*$/.test(value)) setVes(value)
                }}
                keyboardType="numeric"
                style={[styles.input, { color: themes[currentTheme]?.secondaryTextColor }]}
                className="text-center"
                placeholder={i18n.t('Quantity')}
              />

              {/* единицы (подпись — на текущем языке, сохраняем ключ) */}

              <FlatList
                data={unitsForLang}
                keyExtractor={(item) => item.key}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      index === unitsForLang.length - 1 && { borderBottomColor: 'transparent' },
                    ]}
                    onPress={() => handleSelectUnit(item.key)}
                  >
                    <Text
                      style={[
                        styles.langText,
                        {
                          color:
                            meraKey === item.key
                              ? themes[currentTheme]?.isActiveColorText
                              : themes[currentTheme]?.secondaryTextColor,
                        },
                      ]}
                    >
                      {item.val}
                    </Text>
                  </TouchableOpacity>
                )}
                style={styles.flatList}
              />
            </View>
          ) : (
            <TextInput
              style={[styles.input, { color: themes[currentTheme]?.secondaryTextColor }]}
              value={text}
              onChangeText={setText}
              autoFocus
            />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>{i18n.t('Save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'violet' }]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>{i18n.t('Cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: { width: '80%', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: hp(2.5), fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: hp(2),
    marginBottom: 12,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  button: { padding: 10, borderRadius: 5, width: '45%', alignItems: 'center' },
  buttonText: { color: 'white', fontSize: hp(2), fontWeight: 'bold' },
  langOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  langText: { fontSize: 16, textAlign: 'center' },
  flatList: { maxHeight: hp(40) },
})

export default ModalEditComponent
