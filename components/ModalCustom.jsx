import Slider from '@react-native-community/slider'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'
import i18n from '../lang/i18n'
import TitleDescriptionComponent from './CreateRecipeScreen/TitleDescriptionComponent'

function ModalCustom({
  isModalVisible,
  setIsModalVisible,
  animationType = 'fade',
  ingredient,
  setIngredient,
  array, // [{key,val}]
  onPressHandler, // (key) => void
  langApp = '',
  // новое:
  showNameInput = false,
  nameLabelLang = '', // какой язык редактируем по имени
  onSave, // сохранить (кастомный хендлер)
}) {
  const { currentTheme } = useAuth()
  return (
    <Modal
      animationType={animationType}
      transparent={true}
      visible={isModalVisible}
      // onRequestClose={() => setIsModalVisible(false)}
      // onRequestClose={closeModal}
    >
      {/*<TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>*/}
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themes[currentTheme]?.backgroundColor },
            ]}
          >
            <View>
              <TitleDescriptionComponent
                titleVisual={true}
                styleTitle={{ textAlign: 'center' }}
                titleText={i18n.t('Choose')}
                descriptionVisual={true}
                stileDescripton={{ textAlign: 'center' }}
                descriptionText={i18n.t('Select the unit of measurement')}
              />

              <Text
                className="text-xl text-center mb-2"
                style={{ color: themes[currentTheme]?.textColor }}
              >
                {ingredient.quantity}
              </Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={1000}
                step={1} // Шаг перемещения
                value={Number.parseInt(ingredient.quantity, 1)} // Текущее значение
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#CCCCCC"
                onValueChange={(value) =>
                  setIngredient((prev) => ({
                    ...prev,
                    quantity: value.toString(),
                  }))
                }
              />
            </View>

            <FlatList
              data={array}
              keyExtractor={(item) => item.key}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.langOption,
                      index === array.length - 1 && { borderBottomColor: 'transparent' },
                    ]}
                    onPress={() => onPressHandler(item.key)}
                  >
                    <Text
                      style={[
                        styles.langText,
                        {
                          color:
                            ingredient.unit?.[langApp] === item.val
                              ? '#f59e0b' // amber-500
                              : themes[currentTheme]?.textColor,
                        },
                      ]}
                    >
                      {item.val}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />

            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 12,
    color: 'gray',
  },
  langOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  langText: {
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f44336',
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  selectedLangText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
  },
})

export default ModalCustom
