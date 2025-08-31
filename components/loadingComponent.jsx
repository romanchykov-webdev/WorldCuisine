import { ActivityIndicator, StyleSheet, View } from 'react-native'

function LoadingComponent(props) {
  const { size, color } = props
  const activityIndicatorSize = typeof size === 'number' ? size : 'large'
  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: themes[currentTheme]?.backgroundColor,
          height: '100%',
        },
      ]}
    >
      <ActivityIndicator size={activityIndicatorSize} color={color} {...props} />
    </View>
  )
}

export default LoadingComponent
