import { StyleSheet, Text, View } from 'react-native'

// Объект с соответствиями значений tupeButton и цветов
const buttonTypeColors = {
  remove: 'red',
  refactor: 'purple',
  add: 'green',
  default: 'white', // цвет по умолчанию, если tupeButton не указан или не соответствует
}

function ButtonSmallCustom({
  styleWrapperButton,
  w = 40,
  h = 40,
  icon: Icon,
  size = 20,
  color = 'white',
  bg = 'white',
  title,
  styleText,
  styleIcon,
  buttonText = false,
  iconVisual = false,
  tupeButton = false,
}) {
  // Определяем цвет фона: если tupeButton задан и есть в buttonTypeColors, берем его, иначе bg
  const backgroundColor = tupeButton && buttonTypeColors[tupeButton] ? buttonTypeColors[tupeButton] : bg
  return (
    <View
      className="border-2  border-neutral-300 rounded-[10] justify-center items-center flex-row overflow-hidden bg-red-500"
      style={{
        backgroundColor,
        width: w,
        height: h,
        ...styleWrapperButton,
      }}
    >
      <View style={[styles.icon, styleIcon]}>{Icon && <Icon size={size} color={color} />}</View>

      {buttonText && (
        <Text numberOfLines={1} style={[styles.buttonText, styleText]}>
          {title}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {},
  buttonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    // textAlign: "center",
  },
})

export default ButtonSmallCustom
