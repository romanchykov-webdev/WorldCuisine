import { memo, useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ChevronDownIcon, ChevronUpIcon } from 'react-native-heroicons/outline'
import { shadowBoxBlack } from '../constants/shadow'
import { useThemeColors } from '../stores/themeStore'

function SelectCustom({ title, items, defaultValue, setItems, icon }) {
  const colors = useThemeColors()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(defaultValue)

  // нормализуем entries один раз
  const entries = useMemo(() => Object.entries(items || {}), [items])

  // синхронизируем локальный selectedValue, если defaultValue изменился снаружи
  useEffect(() => {
    setSelectedValue(defaultValue)
  }, [defaultValue])

  const handleSelect = (key) => {
    setSelectedValue(key)
    setItems?.(key)
    setIsOpen(false)
  }

  return (
    <View
      style={[
        styles.container,
        shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 0.3, radius: 1, elevation: 1 }),
      ]}
    >
      {/* header */}
      <TouchableOpacity onPress={() => setIsOpen((o) => !o)}>
        <View style={[styles.header, { backgroundColor: colors.backgroundColor }]}>
          <View style={styles.iconWrapper}>{icon ? icon({ size: 24, color: 'blue' }) : null}</View>
          <Text style={[styles.headerText, { color: colors.textColor }]}>{title}</Text>

          <View style={styles.textValueWrapper}>
            <Text style={{ color: colors.textColor }}>{items?.[selectedValue] ?? ''}</Text>
          </View>

          <View style={styles.chevronWrapper}>
            {isOpen ? (
              <ChevronUpIcon size={30} color="grey" />
            ) : (
              <ChevronDownIcon size={30} color="grey" />
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* dropdown */}
      {isOpen && (
        <View style={[styles.dropdown, { backgroundColor: colors.backgroundColor }]}>
          {entries.map(([key, name], index) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.item,
                index === entries.length - 1 && { borderBottomColor: 'transparent' },
              ]}
              onPress={() => handleSelect(key)}
            >
              <Text style={[styles.itemText, { color: colors.textColor }]}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { borderRadius: 10, margin: 1 },
  header: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: { marginRight: 5 },
  headerText: { fontWeight: 'bold' },
  textValueWrapper: { flex: 1, alignItems: 'center' },
  chevronWrapper: { marginLeft: 'auto' },
  dropdown: { marginTop: 5, borderRadius: 10, overflow: 'hidden' },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: 'gainsboro' },
  itemText: { textTransform: 'capitalize' },
})

export default memo(SelectCustom)
