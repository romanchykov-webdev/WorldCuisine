import * as ImagePicker from 'expo-image-picker'

export function getMediaTypeImages() {
  // SDK 52+
  // @ts-ignore: на старых версиях свойства может не быть
  if (ImagePicker?.MediaType?.Images) return ImagePicker.MediaType.Images
  // Старые SDK
  if (ImagePicker?.MediaTypeOptions?.Images) {
    return ImagePicker.MediaTypeOptions.Images
  }
  return undefined
}
