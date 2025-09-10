import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { TrashIcon } from 'react-native-heroicons/mini'
import { shadowBoxBlack } from '../../../constants/shadow'
import { themes } from '../../../constants/themes'
import ButtonSmallCustom from '../../Buttons/ButtonSmallCustom'

function ListIngredientsCreateRecipe({
  ingredients,
  totalLangRecipe,
  colors,
  removeIngredient,
}) {
  const [changeLang, setChangeLang] = useState(totalLangRecipe[0])
  const handleChangeLang = (item) => {
    setChangeLang(item)
  }
  // console.log('changeLang', changeLang)
  return (
    <View className="mb-5">
      {/* Блок выбора языка */}
      {totalLangRecipe.length > 1 && (
        <View className="mb-5">
          <Text className="mb-5 text-xl text-neutral-700 font-bold">
            Вид на языке <Text className="capitalize text-amber-500"> {changeLang}</Text>
          </Text>

          <View className="flex-row flex-wrap gap-x-2 mb-2 items-center justify-around">
            {totalLangRecipe.map((item, index) => {
              return (
                <TouchableOpacity
                  style={changeLang === item ? shadowBoxBlack() : null}
                  className={`border-[1px] border-neutral-500 rounded-2xl px-5 py-2 ${
                    changeLang === item ? `bg-amber-500` : `bg-transparent`
                  } `}
                  key={index}
                  onPress={() => {
                    handleChangeLang(item)
                  }}
                >
                  <Text
                    style={{
                      textTransform: 'capitalize',
                      color: item === changeLang ? 'black' : colors?.textColor,
                    }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      )}

      <View>
        {Array.isArray(ingredients?.[changeLang]) ? (
          ingredients[changeLang].map((row, index) => (
            <View key={index} className="flex-row gap-x-4 items-center mb-2 ">
              <View
                style={{ height: 20, width: 20 }}
                className="bg-amber-300 rounded-full"
              />
              <View className="flex-row flex-1 gap-x-2">
                <Text
                  style={{ fontSize: 16, color: colors?.textColor }}
                  className="font-extrabold"
                >
                  {row.ingredient}
                </Text>
                <Text
                  style={{ fontSize: 16, color: colors?.textColor }}
                  className="font-medium"
                >
                  - {row.quantity}
                </Text>
                <Text
                  style={{ fontSize: 16, color: colors?.textColor }}
                  className="font-medium capitalize"
                >
                  {row.unitLabel}
                </Text>
              </View>
              <View className="flex-row gap-x-3">
                <TouchableOpacity
                  style={shadowBoxBlack()}
                  onPress={() => removeIngredient(changeLang, index)}
                >
                  <ButtonSmallCustom icon={TrashIcon} size={20} tupeButton="remove" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text>Нет ингредиентов для этого языка</Text>
        )}
      </View>
    </View>
  )
}
export default ListIngredientsCreateRecipe
