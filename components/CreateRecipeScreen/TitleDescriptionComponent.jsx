import { StyleSheet, Text, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { useThemeColors } from '../../stores/themeStore'

function TitleDescriptionComponent({
  slyleWrapper,
  titleVisual = false,
  styleTitle,
  titleText,
  descriptionVisual = false,
  stileDescripton,
  descriptionText,
}) {
  const colors = useThemeColors()
  return (
    <View style={[styles.wrapper, slyleWrapper]}>
      {titleVisual && (
        <Text style={[styles.title, styleTitle, { color: colors.textColor }]}>
          {titleText}
        </Text>
      )}

      {descriptionVisual && (
        <Text
          style={[
            styles.description,
            stileDescripton,
            { color: colors.secondaryTextColor },
          ]}
        >
          {descriptionText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  title: {
    fontSize: hp(2),
    fontWeight: 'bold',
    paddingLeft: 5,
    marginBottom: 5,
  },
  description: {
    fontSize: 12,
    // fontWeight: "n",
    paddingLeft: 5,
  },
})

export default TitleDescriptionComponent
