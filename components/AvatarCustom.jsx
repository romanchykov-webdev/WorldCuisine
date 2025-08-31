import { Image } from 'expo-image'
import { StyleSheet } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { getUserImageSrc } from '../service/imageServices'

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
  const isFullUrl = imageUri?.startsWith('http://') || imageUri?.startsWith('https://')

  const source =
    isLocalFile || isFullUrl || RefactorImageHeader ? imageUri : getUserImageSrc(imageUri)

  return (
    <Image
      // source={isPreview || RefactorImageHeader ? uri : getUserImageSrc(uri)}
      source={source}
      transition={100}
      className="rounded-full"
      style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
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
