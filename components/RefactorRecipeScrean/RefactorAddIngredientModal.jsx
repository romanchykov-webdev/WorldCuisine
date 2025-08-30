import { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'

/**
 * props:
 * - visible, onClose, onSave
 * - quontityLang: string[]   // список языков, например ['en','es','it','ru','ua']
 * - measurement: [ { en:{key:label}, es:{}, ... } ]
 * - validateIngredientData: (obj, langs[]) => boolean // ожидает новый формат
 */
function RefactorAddIngredientModal({
  visible,
  onClose,
  onSave,
  quontityLang = [],
  measurement,
  validateIngredientData,
}) {
  const { language: appLang, currentTheme } = useAuth()

  // value по языкам
  const [namesByLang, setNamesByLang] = useState({})
  // количество
  const [ves, setVes] = useState('1')
  // ключ единицы (mera)
  const [meraKey, setMeraKey] = useState('')
  // список единиц для текущего языка [{key,val}]
  const [unitsForLang, setUnitsForLang] = useState([])

  // init при открытии
  useEffect(() => {
    if (!visible) return
    const init = {}
    quontityLang.forEach((l) => {
      init[l] = ''
    })
    setNamesByLang(init)
    setVes('1')
    setMeraKey('')
  }, [visible, quontityLang])

  // подготовка списка единиц для текущего языка
  useEffect(() => {
    const map = Array.isArray(measurement) && measurement[0] ? measurement[0] : {}
    const dict = map?.[appLang] || {}
    const list = Object.entries(dict).map(([key, val]) => ({ key, val }))
    setUnitsForLang(list)
  }, [measurement, appLang])

  const handleNameChange = (langItem, value) => {
    setNamesByLang((prev) => ({ ...prev, [langItem]: value }))
  }

  const handleSelectUnit = (key /*, val*/) => {
    // сохраняем именно ключ!
    setMeraKey(key)
  }

  const handleSave = () => {
    const newIngredient = {
      ves: Number(ves),
      lang: appLang,
      mera: meraKey,
      value: { ...namesByLang },
    }
    if (validateIngredientData(newIngredient, quontityLang)) {
      onSave(newIngredient)
      onClose()
    }
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: themes[currentTheme]?.backgroundColor }]}
        >
          <Text style={[styles.modalTitle, { color: themes[currentTheme]?.textColor }]}>
            {i18n.t('Add new ingredient')}
          </Text>

          {/* названия по языкам */}

          <FlatList
            data={quontityLang}
            keyExtractor={(item) => item}
            style={{ maxHeight: hp(25), width: '100%', marginBottom: 5 }}
            renderItem={({ item }) => (
              <View className="mb-1 ">
                <TextInput
                  style={[styles.input, { color: themes[currentTheme]?.textColor }]}
                  value={namesByLang[item] || ''}
                  onChangeText={(v) => handleNameChange(item, v)}
                  autoFocus={item === quontityLang[0]}
                  placeholder={`${item.toUpperCase()}`}
                />
              </View>
            )}
          />

          {/* количество */}
          <TextInput
            value={ves}
            onChangeText={(value) => {
              if (/^\d*\.?\d*$/.test(value)) setVes(value)
            }}
            keyboardType="numeric"
            style={[styles.input, { color: themes[currentTheme]?.textColor }]}
            className="text-center"
            placeholder={i18n.t('Quantity')}
          />

          {/* список единиц для текущего языка (отображаем подписи, сохраняем ключ) */}
          <FlatList
            data={unitsForLang}
            keyExtractor={(item) => item.key}
            style={{ maxHeight: hp(25), width: '100%', marginBottom: 5 }}
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
                    meraKey === item.key
                      ? { color: themes[currentTheme]?.isActiveColorText }
                      : { color: themes[currentTheme]?.textColor },
                  ]}
                >
                  {item.val}
                </Text>
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText]}>{i18n.t('Save')}</Text>
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
    marginBottom: 20,
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
})

export default RefactorAddIngredientModal
