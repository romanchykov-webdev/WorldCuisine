import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { hp } from '../constants/responsiveScreen'
import { shadowBoxBlack } from '../constants/shadow'
import ButtonBack from './ButtonBack'
import TitleScrean from './TitleScrean'

function HeaderScreanComponent({
  headerAllCeripe = false,
  titleScreanText,
  fontSizeTitle = 4,
  styleWrapper,
  styleWrapperButton,
  styleWrapperTitleScrean,
}) {
  return (
    <View
      className={`relative  ${
        headerAllCeripe ? ' flex-1 w-full' : 'flex-row mb-5'
      } items-center justify-center   flex-1 `}
      style={styleWrapper || []}
    >
      {/*  */}
      <Animated.View
        entering={FadeInDown.springify().delay(100)}
        className={`${headerAllCeripe ? 'mb-10 self-start' : 'absolute left-0'}`}
        style={[shadowBoxBlack(), styleWrapperButton]}
      >
        <ButtonBack />
      </Animated.View>
      {/* Остальные элементы */}
      {!headerAllCeripe && (
        <Animated.View entering={FadeInDown.springify().delay(200)} style={styleWrapperTitleScrean}>
          <TitleScrean
            title={titleScreanText}
            styleTitle={{ textAlign: 'center', fontSize: hp(fontSizeTitle) }}
          />
        </Animated.View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({})

export default HeaderScreanComponent
