import { StyleSheet, Text } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { shadowText } from '../constants/shadow'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'

function TitleScrean({ title, styleTitle }) {
  const { currentTheme } = useAuth()
  return (
    <Text
      style={[
        { fontSize: hp(4), color: themes[currentTheme]?.textColor },
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

export default TitleScrean
