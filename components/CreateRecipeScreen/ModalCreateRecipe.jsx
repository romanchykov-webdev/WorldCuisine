import React from 'react'
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Slider from '@react-native-community/slider'
import i18n from '../../lang/i18n'
import { useThemeColors } from '../../stores/themeStore'

export default function ModalCreateRecipe({
  open,
  onClose,
  title,
  description,
  mode = 'numeric',
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  items = [],
  onChange,
  formatValue,
}) {
  const colors = useThemeColors()

  const defaultFormat = React.useCallback((n) => {
    const v = Number(n) || 0
    if (v < 60) return `${v} ${i18n.t('Mins')}`
    const h = Math.floor(v / 60)
    const m = v % 60
    const hoursLabel = i18n.t('Hours') || 'h'
    const minsLabel = i18n.t('Mins') || 'min'
    return `${h} ${hoursLabel}${m ? ` ${m} ${minsLabel}` : ''}`
  }, [])

  const showValue = mode === 'numeric' ? (formatValue || defaultFormat)(value) : undefined

  return (
    <Modal animationType="slide" transparent visible={open} onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Карточка — перехватывает тапы, чтобы они не падали на подложку */}
        <View style={[styles.card, { backgroundColor: colors.backgroundColor }]}>
          {!!title && (
            <Text style={[styles.title, { color: colors.textColor }]}>{title}</Text>
          )}
          {!!description && (
            <Text style={[styles.desc, { color: colors.textColor }]}>{description}</Text>
          )}

          {mode === 'numeric' ? (
            <View style={{ marginTop: 6 }}>
              <Text
                style={[
                  styles.valueText,
                  { color: colors.textColor, textAlign: 'center', marginBottom: 8 },
                ]}
              >
                {showValue}
              </Text>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={Number(value) || 0}
                minimumTrackTintColor={colors.accent || '#10b981'}
                maximumTrackTintColor={colors.border || '#d1d5db'}
                onValueChange={(v) => onChange?.(Math.round(v))}
              />
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item, idx) => `${item}-${idx}`}
              contentContainerStyle={{ paddingVertical: 4 }}
              renderItem={({ item }) => {
                const isSelected =
                  String(item).toLowerCase() === String(value).toLowerCase()

                return (
                  <TouchableOpacity style={styles.row} onPress={() => onChange?.(item)}>
                    <Text
                      style={[
                        styles.rowText,
                        {
                          color: isSelected ? '#fcd34d' : colors.textColor, // amber-300
                          fontWeight: isSelected ? '700' : '400',
                        },
                      ]}
                    >
                      {String(item)}
                    </Text>
                  </TouchableOpacity>
                )
              }}
            />
          )}

          {/* Кнопка закрытия */}
          <TouchableOpacity
            style={[styles.closeBtn, { backgroundColor: '#ef4444' }]}
            onPress={onClose}
          >
            <Text style={styles.closeText}>{'Close'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

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
  title: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  desc: { fontSize: 12, textAlign: 'center', marginBottom: 10 },
  valueText: { fontSize: 16, fontWeight: '600' },
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
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
