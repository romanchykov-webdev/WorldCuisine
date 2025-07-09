import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'

function LoadingComponent(props) {
  const { currentTheme } = useAuth()
  const { size, color } = props
  // Если размер передан как число, приводим его к строковому типу для ActivityIndicator
  const activityIndicatorSize = typeof size === 'number' ? size : 'large'
  return (
    <View
      className="flex-1 flex justify-center items-center  h-[100]
    {/*bg-red-500*/}
    "
      style={{ backgroundColor: themes[currentTheme]?.backgroundColor }}
    >

      <ActivityIndicator size={activityIndicatorSize} color={color} {...props} />
    </View>
  )
}

const styles = StyleSheet.create({})

export default LoadingComponent
