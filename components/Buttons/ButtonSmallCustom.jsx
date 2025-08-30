import { StyleSheet, Text, View } from 'react-native'

// соответствие типа → цвет
const buttonTypeColors = {
  remove: '#EF4444', // red-500
  refactor: '#8B5CF6', // violet-500
  add: '#22C55E', // green-500
  default: '#FFFFFF',
}

function ButtonSmallCustom({
  styleWrapperButton,
  w = 40,
  h = 40,
  icon: Icon,
  size = 20,
  color = 'white',
  bg,
  title,
  styleText,
  styleIcon,
  buttonText = false,
  iconVisual = false,
  tupeButton = false,
  fullWidth = false, // если true → игнорируем w и растягиваем
}) {
  const backgroundColor =
    (tupeButton && buttonTypeColors[tupeButton]) || bg || buttonTypeColors.default

  let widthStyle = {}
  if (fullWidth || w === '100%') {
    widthStyle = { alignSelf: 'stretch' } // на всю ширину контейнера
  } else if (typeof w === 'number') {
    widthStyle = { width: w }
  }

  return (
    <View style={[styles.wrapper, { backgroundColor, height: h }, widthStyle, styleWrapperButton]}>
      {Icon && (
        <View style={[styles.icon, styleIcon]}>
          <Icon size={size} color={color} />
        </View>
      )}

      {buttonText && (
        <Text numberOfLines={1} style={[styles.buttonText, styleText]}>
          {title}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  icon: {},
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
  },
})

export default ButtonSmallCustom
