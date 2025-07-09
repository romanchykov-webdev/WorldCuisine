import { useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { XCircleIcon } from 'react-native-heroicons/mini'
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { shadowBoxBlack } from '../constants/shadow'
import ButtonSmallCustom from './Buttons/ButtonSmallCustom'

function ButtonClearInputCustomComponent({ inputValue, setInputValue, top = 0, left = 0, right = 0, bottom = 0 }) {
  // const [inputValue, setInputValue] = useState("");

  // opacity for animatio
  const opacity = useSharedValue(0)
  // Создаем стиль для анимации
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  useEffect(() => {
    opacity.value = withTiming(inputValue.length > 0 ? 1 : 0, { duration: 100 })
  }, [inputValue])

  return (
    <View
      style={{ position: 'absolute', top, left, right, bottom }}
      // className="absolute top-[-15] left-[-5]"
      // className="absolute top-2 left-2"
    >
      <Animated.View
        style={{ animatedStyle }}
        entering={FadeInDown.springify()}
        exiting={FadeOutDown}

        // key={inputValue} // Пересоздает компонент при каждом изменении inputValue
      >
        <TouchableOpacity
          onPress={() => setInputValue('')}
          className=" w-[30] h-[30]  justify-center items-center "
          style={shadowBoxBlack()}
        >
          <ButtonSmallCustom
            icon={XCircleIcon}
            color="red"
            w={20}
            h={20}
            styleWrapperButton={{ borderRadius: 100 }}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default ButtonClearInputCustomComponent
