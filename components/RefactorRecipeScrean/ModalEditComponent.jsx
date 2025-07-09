import { useEffect, useState } from 'react'
import { FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { hp } from '../../constants/responsiveScreen'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'

function ModalEditComponent({
  visible,
  initialData,
  lang,
  type,
  onSave,
  onClose,
  measurement,
  quontityLang,
  validateIngredientData,
}) {
  // console.log("ModalEditComponent lang", lang);
  // Для простого текста (например, теги, заголовки)
  const { language: appLang, currentTheme } = useAuth()
  const [text, setText] = useState('')
  // Для ингредиентов
  const [ingredient, setIngredient] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [unit, setUnit] = useState('')
  const [measurementLangApp, setMeasurementLangApp] = useState([])

  // Обновляем состояние в зависимости от типа данных
  useEffect(() => {
    if (!visible)
      return

    if (type === 'ingredients' && initialData) {
      setIngredient(initialData.ingredient || '')
      setQuantity(initialData.quantity || '1')
      setUnit(initialData.unit || '')
    }
    else if (initialData) {
      setText(initialData || '')
    }
  }, [initialData, visible, type])

  // Обновление единиц измерения для текущего языка
  useEffect(() => {
    if (measurement && lang && measurement[appLang]) {
      setMeasurementLangApp(
        Object.entries(measurement[appLang]).map(([key, val]) => ({
          key,
          val,
        })),
      )
    }
    else {
      setMeasurementLangApp([]) // Устанавливаем пустой массив, если measurement или lang недоступны
    }
  }, [measurement, appLang])

  const handleSave = () => {
    if (type === 'ingredients') {
      // Для ингредиентов возвращаем объект
      const updatedIngredient = {
        ingredient,
        quantity,
        unit,
      }

      if (validateIngredientData(updatedIngredient, quontityLang)) {
        onSave(updatedIngredient, lang)
        onClose()
      }
      // console.log("ModalEditComponent handleSave updatedIngredient", updatedIngredient);
      // console.log("ModalEditComponent handleSave lang", lang);

      // onSave(updatedIngredient, lang);
    }
    else {
      // Для других типов возвращаем текст
      onSave(text, lang)
      onClose()
    }
  }

  const handleSelectUnit = (key, val) => {
    setUnit(val) // Устанавливаем выбранную единицу измерения
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
  // console.log("ModalEditComponent measurement", measurement);
  // console.log("ModalEditComponent lang", lang);
  // console.log("ModalEditComponent text", text);
  // console.log("ModalEditComponent type", type);
  // console.log("ModalEditComponent initialData", initialData);

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: themes[currentTheme]?.backgroundColor }]}>
          {/*  */}
          <Text style={[styles.modalTitle, { color: themes[currentTheme]?.textColor }]}>{titleModal}</Text>
          {/*  */}
          {type === 'ingredients' ? (
            <View className="w-full">
              {/* Поле для редактирования названия ингредиента */}
              <TextInput
                style={[styles.input, { color: themes[currentTheme]?.secondaryTextColor }]}
                value={ingredient}
                onChangeText={setIngredient}
                autoFocus
              />

              {/* Поле для редактирования количества */}
              <TextInput
                value={quantity}
                onChangeText={(value) => {
                  // Разрешаем только цифры
                  if (/^\d*$/.test(value)) {
                    setQuantity(value)
                  }
                }}
                keyboardType="numeric"
                style={[styles.input, { color: themes[currentTheme]?.secondaryTextColor }]}
                className="text-center"
              />

              {/* Список для выбора единицы измерения */}
              <FlatList
                data={measurementLangApp}
                keyExtractor={item => item.key}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      index === measurementLangApp.length - 1 && {
                        borderBottomColor: 'transparent',
                      },
                    ]}
                    onPress={() => handleSelectUnit(item.key, item.val)}
                  >
                    <Text
                      style={[
                        styles.langText,
                        {
                          color:
														unit === item.val
														  ? themes[currentTheme]?.isActiveColorText
														  : themes[currentTheme]?.secondaryTextColor,
                        },
                      ]}
                      // className={`${
                      // 	unit === item.val ? "text-amber-500 font-bold" : "text-neutral-900"
                      // }`}
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
          {/*  */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleSave}>
              <Text style={styles.buttonText}>{i18n.t('Save')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: 'violet' }]} onPress={onClose}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    // backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: hp(2),
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    // backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2),
    fontWeight: 'bold',
  },
  langOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  langText: {
    fontSize: 16,
    textAlign: 'center',
  },
  flatList: {
    maxHeight: hp(40), // Ограничиваем высоту до 60% экрана
  },
})

export default ModalEditComponent
