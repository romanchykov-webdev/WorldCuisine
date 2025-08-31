import { StyleSheet, Text, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { shadowTextSmall } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import LoadingComponent from '../loadingComponent'
import ImageCustom from './ImageCustom'
import ImageSliderCustom from './ImageSliderCustom'

function RecipeInstructions({ instructions, langDev, currentTheme }) {
  if (!instructions || instructions.length === 0) {
    return <LoadingComponent />
  }

  return (
    <View>
      <Text
        style={[
          {
            fontSize: hp(2.5),
            color: themes[currentTheme]?.secondaryTextColor,
          },
          shadowTextSmall(),
        ]}
        className="font-bold px-4 mb-3"
      >
        {i18n.t('Recipe Description')}
      </Text>

      {instructions.map((item, index) => {
        const text = item[langDev] || item['en'] || ''
        const imgs = Array.isArray(item.images) ? item.images.filter(Boolean) : []
        return (
          <View key={index} className="w-full mb-5">
            <Text
              className="flex-wrap mb-3 px-4"
              style={{
                fontSize: hp(2.3),
                color: themes[currentTheme]?.secondaryTextColor,
              }}
            >
              <Text className="text-amber-500">{index + 1}) </Text>
              {text}
            </Text>

            {imgs.length > 0 &&
              (imgs.length === 1 ? (
                <ImageCustom image={item.images} />
              ) : (
                <ImageSliderCustom images={item.images} />
              ))}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({})

export default RecipeInstructions
