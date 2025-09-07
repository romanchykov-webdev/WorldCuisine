// components/CreateRecipeScreen/SelectRecipeMetrics.jsx
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  ClockIcon,
  FireIcon,
  Square3Stack3DIcon,
  UsersIcon,
} from 'react-native-heroicons/mini'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import ModalCreateRecipe from './ModalCreateRecipe'
import { useDebounce } from '../../utils/useDebounce'
import { isEqualMetrics } from '../../helpers/isEqualMetrics'
import i18n from '../../lang/i18n'

// безопасные дефолты
const DEFAULT_METRICS = { time: 0, serv: 0, cal: 0, level: 'easy' }
const LEVELS = ['easy', 'medium', 'hard']

function clamp(n, min, max) {
  const x = Number(n) || 0
  if (min != null && x < min) return min
  if (max != null && x > max) return max
  return x
}

/** маленькая карточка метрики */
const MetricCard = React.memo(function MetricCard({ icon, label, value, unit, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="relative">
      <View
        className="flex rounded-full bg-amber-300 p-1 items-center"
        style={[{ height: 120 }, shadowBoxBlack()]}
      >
        <View className="justify-between flex-col pb-2 flex-1">
          <View
            className="bg-white rounded-full flex items-center justify-around"
            style={{ width: hp(6.5), height: hp(6.5) }}
          >
            {icon}
          </View>
          <View className="flex items-center py-2 gap-y-1">
            <Text className="font-bold text-neutral-700">{value}</Text>
            {!!unit && (
              <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
                {unit}
              </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
})

/**
 * Контролируемый компонент метрик рецепта
 * props:
 *  - value: { time, serv, cal, level }
 *  - onChange: (next) => void
 */
export default function SelectRecipeMetrics({ value, onChange }) {
  const debounced = useDebounce(value, 300)

  const safe = React.useMemo(
    () => ({
      time: clamp(value?.time, 0, 10000),
      serv: clamp(value?.serv, 0, 200),
      cal: clamp(value?.cal, 0, 100000),
      level: String(value?.level || DEFAULT_METRICS.level).toLowerCase(),
    }),
    [value],
  )

  const [state, setState] = React.useState(safe)

  // подхватываем внешние правки (редактирование)
  React.useEffect(() => {
    if (!isEqualMetrics(state, safe)) {
      setState(safe)
    }
  }, [safe])

  React.useEffect(() => {
    if (!isEqualMetrics(debounced, value)) {
      onChange?.(debounced)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, value])

  // модалка выбора
  const [modal, setModal] = React.useState({
    open: false,
    title: '',
    description: '',
    range: [0, 0],
    list: [],
    type: null,
  })

  const openNumeric = React.useCallback((type, min, max, title, description) => {
    setModal({ open: true, type, title, description, range: [min, max], list: [] })
  }, [])
  const openList = React.useCallback((type, list, title, description) => {
    setModal({ open: true, type, title, description, list, range: [0, 0] })
  }, [])

  const closeModal = React.useCallback(() => setModal((m) => ({ ...m, open: false })), [])

  // применить выбор из модалки
  const applyFromModal = React.useCallback(
    (nextValue) => {
      setState((prev) => {
        switch (modal.type) {
          case 'time':
            return { ...prev, time: clamp(nextValue, modal.range[0], modal.range[1]) }
          case 'serv':
            return { ...prev, serv: clamp(nextValue, 1, 200) }
          case 'cal':
            return { ...prev, cal: clamp(nextValue, modal.range[0], modal.range[1]) }
          case 'level':
            return { ...prev, level: String(nextValue || 'medium').toLowerCase() }
          default:
            return prev
        }
      })
      // closeModal()
    },
    [modal, closeModal],
  )

  return (
    <View>
      <Text style={styles.title}>{i18n.t('Short description')}</Text>
      <Text style={styles.caption}>
        {i18n.t('Mark how long it takes to prepare the recipe')}
      </Text>

      <View className="flex-row justify-around">
        <MetricCard
          icon={<ClockIcon size={hp(4)} strokeWidth={2.5} color="gray" />}
          label="time"
          value={state.time}
          unit={i18n.t('Mins')}
          onPress={() =>
            openNumeric(
              'time',
              1,
              300,
              'Cooking time.',
              'Here you can specify the approximate time to cook the dish.',
            )
          }
        />

        <MetricCard
          icon={<UsersIcon size={hp(4)} strokeWidth={2.5} color="gray" />}
          label="serv"
          value={state.serv}
          unit={i18n.t('Person')}
          onPress={() =>
            openList(
              'serv',
              Array.from({ length: 10 }, (_, i) => String(i + 1)),
              'Select number of servings',
              'Choose how many persons your recipe serves.',
            )
          }
        />

        <MetricCard
          icon={<FireIcon size={hp(4)} strokeWidth={2.5} color="gray" />}
          label="cal"
          value={state.cal}
          unit={i18n.t('Cal')}
          onPress={() =>
            openNumeric('cal', 1, 3000, 'Select calories.', 'Choose dish calories.')
          }
        />

        <MetricCard
          icon={<Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="gray" />}
          label="level"
          value={state.level}
          unit=""
          onPress={() =>
            openList(
              'level',
              LEVELS.map((x) => x[0].toUpperCase() + x.slice(1)),
              'Select difficulty.',
              'Choose cooking difficulty.',
            )
          }
        />
      </View>

      {/*{modal.open && (*/}
      <ModalCreateRecipe
        open={modal.open}
        onClose={closeModal}
        title={modal.title}
        description={modal.description}
        mode={modal.list.length ? 'list' : 'numeric'}
        value={state[modal.type]} // для numeric
        min={modal.range[0]}
        max={modal.range[1]}
        step={modal.type === 'time' ? 5 : 5}
        items={modal.list}
        formatValue={
          modal.type === 'time'
            ? undefined
            : (n) => `${n} ${modal.type === 'cal' ? i18n.t('Cal') || 'cal' : ''}`
        }
        onChange={(next) => applyFromModal(next)}
      />
      {/*)}*/}
    </View>
  )
}

const styles = StyleSheet.create({
  title: { fontWeight: '700', color: '#111827', fontSize: hp(2.1), marginBottom: 4 },
  caption: { color: '#6b7280', marginBottom: 12 },
})
