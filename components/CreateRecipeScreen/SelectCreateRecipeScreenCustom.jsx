import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/mini'
import { useDebounce } from '../../constants/halperFunctions'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import StərɪskCustomComponent from '../StərɪskCustomComponent'
import ModalCreateRecipe from './ModalCreateRecipe'
import TitleDescriptionComponent from './TitleDescriptionComponent'

function SelectCreateRecipeScreenCustom({
  setTotalRecipe,
  recipeDish = {},
  reafctorScrean = false,
  recipeMetricsForUpdate,
}) {
  const [modalTitle, setModalTitle] = useState('')
  const [modalDescription, setModalDescription] = useState('')
  const [modalArray, setModalArray] = useState([])
  const [modalType, setModalType] = useState(undefined)

  // правильные ключи
  const [modalSelectItem, setModalSelectItem] = useState({
    time: 1,
    serv: 1,
    cal: 1,
    level: 'easy',
  })

  // если редактирование
  useEffect(() => {
    if (reafctorScrean && recipeDish?.recipe_metrics) {
      const { time, serv, cal, level } = recipeDish.recipe_metrics
      setModalSelectItem({
        time: Number(recipeMetricsForUpdate?.time ?? time) || 1,
        serv: Number(recipeMetricsForUpdate?.serv ?? serv) || 1,
        cal: Number(recipeMetricsForUpdate?.cal ?? cal) || 1,
        level: String(recipeMetricsForUpdate?.cal ?? level ?? 'easy').toLowerCase(),
      })
    }
  }, [reafctorScrean, recipeDish])

  const [isModalVisible, setIsModalVisible] = useState(false)
  const debouncedValue = useDebounce(modalSelectItem, 300)

  const openModalLevel = ({ title, description, array, type }) => {
    setModalTitle(title)
    setModalDescription(description)
    setModalArray(array)
    setModalType(type)
    setIsModalVisible(true)
  }

  // финальная передача наверх
  useEffect(() => {
    setTotalRecipe((prev) => ({
      ...prev,
      recipe_metrics: {
        time: Number(debouncedValue.time) || 0,
        serv: Number(debouncedValue.serv) || 0,
        cal: Number(debouncedValue.cal) || 0,
        level: String(debouncedValue.level || 'medium').toLowerCase(),
      },
    }))
  }, [debouncedValue, setTotalRecipe])

  return (
    <View>
      <TitleDescriptionComponent
        titleVisual
        titleText={i18n.t('Short description')}
        descriptionVisual
        descriptionText={i18n.t('Mark how long it takes to prepare the recipe')}
      />

      <View className="flex-row justify-around ">
        {/* time */}
        <TouchableOpacity
          onPress={() =>
            openModalLevel({
              title: 'Время приготовления.',
              description: 'Здесь вы можете указать примерное время приготовления блюда.',
              array: [1, 300],
              type: 'time',
            })
          }
          className="relative"
        >
          <View
            className="flex rounded-full bg-amber-300 p-1 items-center"
            style={[{ height: 120 }, shadowBoxBlack()]}
          >
            <View className="justify-between flex-col pb-2 flex-1">
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{ width: hp(6.5), height: hp(6.5) }}
              >
                <StərɪskCustomComponent top={-5} right={-5} />
                <ClockIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>
              <View className="flex items-center py-2 gap-y-1">
                <Text className="font-bold text-neutral-700">{modalSelectItem.time}</Text>
                <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
                  {i18n.t('Mins')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* servings */}
        <TouchableOpacity
          onPress={() =>
            openModalLevel({
              title: 'Выберите количество персон.',
              description:
                'Здесь вы можете выбрать на какое количество персон рассчитан ваш рецепт.',
              array: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
              type: 'serv',
            })
          }
        >
          <View
            className="flex rounded-full bg-amber-300 p-1 items-center"
            style={[{ height: 120 }, shadowBoxBlack()]}
          >
            <View className="justify-between flex-col pb-2 flex-1">
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{ width: hp(6.5), height: hp(6.5) }}
              >
                <StərɪskCustomComponent top={-5} right={-5} />
                <UsersIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>
              <View className="flex items-center py-2 gap-y-1">
                <Text className="font-bold text-neutral-700">{modalSelectItem.serv}</Text>
                <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
                  {i18n.t('Person')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* calories */}
        <TouchableOpacity
          onPress={() =>
            openModalLevel({
              title: 'Выберите калорийность.',
              description: 'Здесь вы можете выбрать уровень калорийности блюда.',
              array: [1, 3000],
              type: 'cal',
            })
          }
        >
          <View
            className="flex rounded-full bg-amber-300 p-1 items-center "
            style={[{ height: 120 }, shadowBoxBlack()]}
          >
            <View className="justify-between flex-col pb-2 flex-1">
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{ width: hp(6.5), height: hp(6.5) }}
              >
                <StərɪskCustomComponent top={-5} right={-5} />
                <FireIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>
              <View className="flex items-center py-2 gap-y-1">
                <Text className="font-bold text-neutral-700">{modalSelectItem.cal}</Text>
                <Text style={{ fontSize: hp(1.2) }} className="font-bold text-neutral-500">
                  {i18n.t('Cal')}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* level */}
        <TouchableOpacity
          onPress={() =>
            openModalLevel({
              title: 'Выберите сложность.',
              description: 'Здесь вы можете выбрать уровень сложности приготовления рецепта.',
              array: ['Easy', 'Medium', 'Hard'],
              type: 'level',
            })
          }
        >
          <View
            className="flex rounded-full bg-amber-300 p-1 items-center"
            style={[{ height: 120 }, shadowBoxBlack()]}
          >
            <View className="justify-between flex-col pb-2 flex-1">
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{ width: hp(6.5), height: hp(6.5) }}
              >
                <StərɪskCustomComponent top={-5} right={-5} />
                <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>
              <View className="flex items-center py-2 gap-y-1">
                <Text style={[styles.text, { fontSize: 8 }]} numberOfLines={1} ellipsizeMode="tail">
                  {modalSelectItem.level}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {isModalVisible && (
          <ModalCreateRecipe
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            title={modalTitle}
            description={modalDescription}
            array={modalArray}
            setModalSelectItem={setModalSelectItem}
            modalSelectItem={modalSelectItem}
            modalType={modalType}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  text: { fontWeight: '700', color: '#111827' },
})

export default SelectCreateRecipeScreenCustom
