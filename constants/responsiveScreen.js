import { Dimensions } from 'react-native'

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window')

// Ширина устройства в процентах
export function wp(percentage) {
  // const width = deviceWidth;
  // return (percentage * width) / 100
  return (percentage * deviceWidth) / 100
}

// Высота устройства в процентах
export function hp(percentage) {
  // const height = deviceHeight;
  // return (percentage * height) / 100
  return (percentage * deviceHeight) / 100
}
