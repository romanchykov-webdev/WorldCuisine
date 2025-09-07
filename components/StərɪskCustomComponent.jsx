import { Text, View } from 'react-native'

function StərɪskCustomComponent({ size = 30, color = 'red', top = 0, left, right = 0 }) {
  return (
    <View
      style={{
        position: 'absolute',
        top,
        left,
        right,
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: size, color, textAlign: 'center' }}>*</Text>
    </View>
  )
}

export default StərɪskCustomComponent
