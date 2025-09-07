import { Text, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { themes } from '../../constants/themes'
import { useCategories, useMeasurement } from '../../queries/recipes'

function RecipeIngredients({ recIng, langDev, currentTheme, measurement }) {
  // console.log('RecipeIngredients recIng', recIng)

  // Удобная функция перевода меры
  const tMera = (meraKey) => {
    if (!measurement) return meraKey
    const dict = measurement?.[langDev] || measurement?.en || {}
    return dict?.[meraKey] || meraKey
  }
  return (
    <View className="px-4">
      {recIng?.map((item, i) => {
        // получаем название ингредиента на текущем языке, fallback на 'en'
        const ingredientName = item.value[langDev] || item.value['en']

        //  перевод меру
        const measureLabel = tMera(item?.mera)

        return (
          <View key={i} className="flex-row gap-x-4 items-center mb-2">
            {/* маркер */}
            <View
              style={{ height: 20, width: 20 }}
              className="bg-amber-300 rounded-full"
            />

            {/* текст ингредиента и количество */}
            <View className="flex-row gap-x-2">
              <Text
                style={{
                  fontSize: hp(2),
                  color: themes[currentTheme]?.secondaryTextColor,
                }}
                className="font-extrabold"
              >
                {ingredientName} -
              </Text>
              <Text
                style={{
                  fontSize: hp(2),
                  color: themes[currentTheme]?.secondaryTextColor,
                }}
                className="font-medium text-neutral-600"
              >
                {item.ves} {measureLabel}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default RecipeIngredients
