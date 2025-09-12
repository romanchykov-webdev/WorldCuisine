import Toast from 'react-native-toast-message'

function normalizeTitle(defaultTitle, title) {
  if (title === null) return undefined
  if (title === undefined) return defaultTitle // дефолт
  return title // свой текст
}

const defaultOptions = {
  visibilityTime: 2500,
}

export const toast = {
  success: (title, message, options = {}) =>
    Toast.show({
      type: 'success',
      text1: normalizeTitle('Success', title),
      text2: message,
      ...defaultOptions,
      ...options,
    }),
  error: (title, message, options = {}) =>
    Toast.show({
      type: 'error',
      text1: normalizeTitle('Error', title),
      text2: message,
      ...defaultOptions,
      ...options,
    }),
  info: (title, message, options = {}) =>
    Toast.show({
      type: 'info',
      text1: normalizeTitle('Info', title),
      text2: message,
      ...defaultOptions,
      ...options,
    }),
}
