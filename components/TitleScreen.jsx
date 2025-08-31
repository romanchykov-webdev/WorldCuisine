import { StyleSheet, Text } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { shadowText } from '../constants/shadow'
import { useThemeColors } from '../stores/themeStore'

function TitleScreen({ title, styleTitle }) {
  const colors = useThemeColors()
  return (
    <Text
      style={[
        { fontSize: hp(4), color: colors.textColor },
        shadowText({ color: 'rgba(0,0,0,0.4)', offset: { width: 1.5, height: 1.5 }, radius: 1 }),
        styleTitle,
      ]}
      className="font-semibold  "
    >
      {title}
    </Text>
  )
}

const styles = StyleSheet.create({})

export default TitleScreen
