import React, { useCallback, useMemo, useRef, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { PlusIcon, TrashIcon } from 'react-native-heroicons/mini'
import i18n from '../../lang/i18n'
import InputComponent from '../InputComponent'
import TitleDescriptionComponent from './TitleDescriptionComponent'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import { shadowBoxBlack } from '../../constants/shadow'
import { useThemeColors } from '../../stores/themeStore'
import { toast } from '../../lib/toast'

/** helper: нормализуем тег */
function normalizeTag(s) {
  return String(s || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase()
}

/** чип одного тега */
const TagChip = React.memo(function TagChip({ label, onRemove }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
      <TouchableOpacity onPress={() => onRemove?.(label)} style={styles.chipRemove}>
        <TrashIcon color="white" size={16} />
      </TouchableOpacity>
    </View>
  )
})

/**
 * Props:
 *  - value: string[]             // текущие теги (контролируемое значение)
 *  - onChange: (next: string[])  // сообщаем наверх
 *  - maxTags?: number            // лимит на кол-во
 *  - maxLen?: number             // лимит на длину одного тега
 *  - descriptionVisible?: boolean
 */
export default function TagsCustom({ value = [], onChange, descriptionVisible = true }) {
  const colors = useThemeColors()
  const [input, setInput] = useState('')
  const inputRef = useRef(null)

  const tagsSet = useMemo(() => new Set(value.map(normalizeTag)), [value])

  const addTag = useCallback(
    (raw) => {
      const tag = normalizeTag(raw)
      if (!tag) {
        toast.error(null, i18n.t('Please enter the tag'))
        return
      }

      if (tagsSet.has(tag)) {
        toast.info(null, i18n.t('This tag already exists'))
        return
      }
      onChange?.([...value, tag])
      setInput('')
    },
    [onChange, value, tagsSet],
  )

  const removeTag = useCallback(
    (tag) => {
      const norm = normalizeTag(tag)
      onChange?.(value.filter((t) => normalizeTag(t) !== norm))
    },
    [onChange, value],
  )

  const handleChange = useCallback(
    (text) => {
      if (/[,\s]$/.test(text)) {
        addTag(text.slice(0, -1))
      } else {
        setInput(text)
      }
    },
    [addTag],
  )

  return (
    <View style={{ marginBottom: 20 }}>
      {value?.length > 0 && (
        <View style={styles.chipsWrap}>
          {value.map((t) => (
            <TagChip key={t} label={t} onRemove={removeTag} />
          ))}
        </View>
      )}

      <TitleDescriptionComponent
        titleVisual
        titleText={i18n.t('Tags')}
        descriptionVisual={descriptionVisible}
        descriptionText={i18n.t(
          'Tags improve recipe search in the database because: They allow you to quickly find recipes by key characteristics',
        )}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          // backgroundColor: 'red',
        }}
      >
        <View style={{ flex: 1 }}>
          <InputComponent
            ref={inputRef}
            placeholder={i18n.t('Enter tag')}
            value={input}
            onChangeText={handleChange}
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={shadowBoxBlack()} onPress={() => addTag(input)}>
          <ButtonSmallCustom w={56} h={56} bg="green" icon={PlusIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a', // green-600
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    gap: 8,
  },
  chipText: { color: 'white', fontWeight: '600' },
  chipRemove: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
