import React, { useMemo } from 'react'
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import Slider from '@react-native-community/slider'
import i18n from '../lang/i18n'
import TitleDescriptionComponent from './CreateRecipeScreen/TitleDescriptionComponent'
import { useThemeColors } from '../stores/themeStore'

function ModalCustom({
  isModalVisible,
  setIsModalVisible,
  animationType = 'fade',
  ingredient,
  setIngredient,
  array,
  onPressHandler,
  langApp = '',
  closeOnOverlayPress = true,
}) {
  const colors = useThemeColors()

  const selectedLabel = useMemo(
    () => ingredient?.unit?.[langApp] ?? '',
    [ingredient?.unit, langApp],
  )

  const close = () => setIsModalVisible(false)

  return (
    <Modal
      animationType={animationType}
      transparent
      visible={isModalVisible}
      onRequestClose={close} // Android back
    >
      {/* ВНЕШНИЙ слой – клик по оверлею закрывает */}
      <TouchableWithoutFeedback onPress={closeOnOverlayPress ? close : undefined}>
        <View style={styles.overlay}>
          {/* ВНУТРЕННИЙ слой – перехватывает тапы, чтобы не закрывать модалку */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.card, { backgroundColor: colors.backgroundColor }]}>
              <TitleDescriptionComponent
                titleVisual
                styleTitle={{ textAlign: 'center' }}
                titleText={i18n.t('Choose')}
                descriptionVisual
                stileDescripton={{ textAlign: 'center' }}
                descriptionText={i18n.t('Select the unit of measurement')}
              />

              {/* Слайдер количества */}
              <View style={{ marginTop: 8 }}>
                <Text
                  style={{
                    color: colors.textColor,
                    textAlign: 'center',
                    marginBottom: 8,
                    fontSize: 18,
                    fontWeight: '600',
                  }}
                >
                  {ingredient.quantity}
                </Text>

                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={1}
                  maximumValue={1000}
                  step={1}
                  value={Number.parseInt(String(ingredient.quantity || 1), 10)}
                  minimumTrackTintColor={colors.textColor || '#111827'}
                  maximumTrackTintColor={colors.secondaryTextColor || '#d1d5db'}
                  onValueChange={(v) =>
                    setIngredient((prev) => ({
                      ...prev,
                      quantity: String(Math.round(v)),
                    }))
                  }
                />
              </View>

              {/* Список единиц */}
              <FlatList
                data={array}
                keyExtractor={(item) => item.key}
                contentContainerStyle={{ paddingTop: 8 }}
                renderItem={({ item, index }) => {
                  const isSelected = selectedLabel === item.val
                  return (
                    <TouchableOpacity
                      style={[
                        styles.row,
                        index === array.length - 1 && {
                          borderBottomColor: 'transparent',
                        },
                      ]}
                      onPress={() => onPressHandler?.(item.key)}
                    >
                      <Text
                        style={[
                          styles.rowText,
                          {
                            color: isSelected
                              ? '#f59e0b' /* amber-500 */
                              : colors.textColor,
                            fontWeight: isSelected ? '700' : '500',
                          },
                        ]}
                      >
                        {item.val}
                      </Text>
                    </TouchableOpacity>
                  )
                }}
              />

              {/* Кнопка закрытия */}
              <TouchableOpacity style={styles.closeBtn} onPress={close}>
                <Text style={styles.closeText}>{i18n.t('Save')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default ModalCustom

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 12,
    padding: 16,
    elevation: 5,
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  rowText: { fontSize: 16 },
  closeBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
