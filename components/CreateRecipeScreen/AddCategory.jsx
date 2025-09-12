import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ArrowUturnLeftIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/mini'
import i18n from '../../lang/i18n'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import LoadingComponent from '../loadingComponent'
import ModalClearCustom from '../ModalClearCustom'
import { useCategories } from '../../queries/recipes'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'

/**
 * props:
 *  - colors
 *  - langApp
 *  - value: { category_id, point }
 *  - onChange: (next:{category_id, point}) => void
 */
export default function AddCategory({ colors, langApp, value, onChange }) {
  const { data: categories = [], isLoading } = useCategories(langApp)

  // локально держим выбранные id (для UI)
  const [selectedCatId, setSelectedCatId] = useState(value?.category_id ?? null)
  const [selectedPoint, setSelectedPoint] = useState(value?.point ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [level, setLevel] = useState('cat') // 'cat' | 'sub'

  // синхронизация входных пропсов -> локал
  useEffect(() => {
    setSelectedCatId(value?.category_id ?? null)
    setSelectedPoint(value?.point ?? null)
  }, [value])

  const selectedCat = useMemo(
    () => categories.find((c) => c.point === selectedCatId) || null,
    [categories, selectedCatId],
  )

  const open = useCallback(() => {
    setLevel('cat')
    setModalOpen(true)
  }, [])

  const close = useCallback(() => {
    setModalOpen(false)
  }, [])

  const clear = useCallback(() => {
    setSelectedCatId(null)
    setSelectedPoint(null)
    onChange?.({ category_id: null, point: null })
  }, [onChange])

  const pickCat = useCallback(
    (cat) => {
      setSelectedCatId(cat.point)
      setLevel('sub')
      // сбросим подкатегорию до выбора
      setSelectedPoint(null)
      onChange?.({ category_id: cat.point, point: null })
    },
    [onChange],
  )

  const pickSub = useCallback(
    (sub) => {
      setSelectedPoint(sub.point)
      onChange?.({ category_id: selectedCatId, point: sub.point })
      setModalOpen(false)
    },
    [onChange, selectedCatId],
  )

  return (
    <View style={styles.wrap}>
      {selectedCatId && selectedPoint ? (
        <View style={styles.chosenRow}>
          <View style={styles.chosenTextWrap}>
            <Text style={[styles.chosenLabel, { color: colors.textColor }]}>
              {i18n.t('Category')} :{' '}
            </Text>
            <Text style={[styles.chosenStrong, { color: colors.textColor }]}>
              {selectedCat?.name} {' -> '}
            </Text>
            <Text style={[styles.chosenValue, { color: colors.textColor }]}>
              {selectedCat?.subcategories?.find((s) => s.point === selectedPoint)?.name ||
                selectedPoint}
            </Text>
          </View>
          <TouchableOpacity onPress={clear}>
            <ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={open}
        style={styles.addBtn}
        className="flex-row gap-x-2 items-center"
      >
        <ButtonSmallCustom
          buttonText
          tupeButton="add"
          h={60}
          title={i18n.t('Add category')}
          icon={PlusIcon}
          styleWrapperButton={[styles.fullW, styles.rowGap]}
        />
        {/*<StərɪskCustomComponent />*/}
      </TouchableOpacity>

      <ModalClearCustom
        colors={colors}
        isModalVisible={modalOpen}
        animationType="fade"
        handleSave={close}
        closeModal={close}
        titleHeader={i18n.t(
          'To add a recipe to your favorites you must log in or create an account',
        )}
        textButton={i18n.t('Save')}
        childrenSubheader={
          <View className="flex-row items-center mb-5">
            {level === 'sub' && (
              <TouchableOpacity onPress={() => setLevel('cat')} style={{ zIndex: 10 }}>
                <ButtonSmallCustom
                  icon={ArrowUturnLeftIcon}
                  color="grey"
                  styleWrapperButton={{ borderRadius: 999 }}
                />
              </TouchableOpacity>
            )}
            <Text className="flex-1 text-center" style={{ color: colors.textColor }}>
              {level === 'cat' && selectedCat?.name}
            </Text>
          </View>
        }
      >
        <View style={{ maxHeight: hp(60) }}>
          {isLoading ? (
            <View style={{ marginBottom: 20 }}>
              <LoadingComponent />
            </View>
          ) : level === 'cat' ? (
            <FlatList
              data={categories}
              keyExtractor={(item) => String(item.point)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => pickCat(item)}
                  style={[styles.item, shadowBoxBlack()]}
                >
                  <Text style={[styles.itemText, { color: colors.textColor }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <FlatList
              data={selectedCat?.subcategories || []}
              keyExtractor={(item) => String(item.point)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => pickSub(item)}
                  style={[styles.item, shadowBoxBlack()]}
                >
                  <Text style={[styles.itemText, { color: colors.textColor }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ModalClearCustom>
    </View>
  )
}
const styles = StyleSheet.create({
  wrap: { marginBottom: 20 },
  chosenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  chosenTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '80%',
  },
  chosenLabel: { fontSize: 18, fontWeight: 'bold' },
  chosenStrong: { fontSize: 18, fontWeight: '800' },
  chosenValue: { fontSize: 18, fontWeight: '500' },
  addBtn: { justifyContent: 'center', alignItems: 'center' },
  fullW: { width: '100%' },
  rowGap: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  item: {
    borderWidth: 2,
    borderRadius: 15,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  itemText: { fontSize: 20, textAlign: 'center' },
})
