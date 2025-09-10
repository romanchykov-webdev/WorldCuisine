import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { getImageUrl } from '../utils/storage'

function AvatarCustom({
  uri,
  size = hp(4.5),
  style = {},
  RefactorImageHeader = false,
  isOpenImageInModal,

  rounded = size / 2,
}) {
  // console.log("AvatarCustom uri", uri);

  const imageUri = typeof uri === 'string' ? uri : uri?.uri

  const isLocalFile = imageUri?.startsWith('file://')
  const isFullUrl = /^https?:\/\//i.test(imageUri || '')

  const source =
    isLocalFile || isFullUrl || RefactorImageHeader ? imageUri : getImageUrl(imageUri)

  return (
    <Image
      source={source}
      // cachePolicy="none" // ВАРИАНТ 1: Полностью отключить кэш
      // recyclingKey={imageUri} // ВАРИАНТ 2: Или использовать ключ, чтобы принудительно перерисовывать
      transition={100}
      className="rounded-full"
      style={[
        styles.avatar,
        { height: size, width: size, borderRadius: rounded, overflow: 'hidden' },
        style,
      ]}
      contentFit={isOpenImageInModal ? 'contain' : 'cover'}
    />
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
  },
})

export default AvatarCustom
