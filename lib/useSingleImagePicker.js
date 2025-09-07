// import React from 'react'
// import * as ImagePicker from 'expo-image-picker'
// import { compressImage100 } from './imageUtils'
//
// export function useSingleImagePicker() {
//   const [isLoading, setIsLoading] = React.useState(false)
//
//   const pickOne = async () => {
//     try {
//       setIsLoading(true)
//
//       const res = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [1, 1],
//         quality: 1,
//       })
//
//       if (res.canceled || !res.assets?.length) {
//         return null
//       }
//
//       const originalUri = res.assets[0].uri
//       //  компрессия
//       const compressed = await compressImage100(originalUri, 0.3)
//       return compressed.uri
//       // return originalUri
//     } catch (e) {
//       console.error('useSingleImagePicker error:', e)
//       return null
//     } finally {
//       setIsLoading(false)
//     }
//   }
//
//   return { pickOne, isLoading }
// }
import React from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { compressImage100 } from './imageUtils'
import { toast } from './toast'
import i18n from '../lang/i18n'

function toMB(bytes) {
  if (!Number.isFinite(bytes)) return 0
  return bytes / (1024 * 1024)
}
function fmtMB(bytes, digits = 2) {
  return `${toMB(bytes).toFixed(digits)} MB`
}

export function useSingleImagePicker({ showToast = true } = {}) {
  const [isLoading, setIsLoading] = React.useState(false)

  const pickOne = async () => {
    try {
      setIsLoading(true)

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (res.canceled || !res.assets?.length) return null

      const originalUri = res.assets[0].uri

      // вес ДО
      const beforeInfo = await FileSystem.getInfoAsync(originalUri, { size: true })
      const beforeBytes = beforeInfo?.size ?? 0

      // компрессия (0.3 ≈ 30% качества — можно подстроить)
      const compressed = await compressImage100(originalUri, 0.3)
      const afterUri = compressed.uri

      // вес ПОСЛЕ
      const afterInfo = await FileSystem.getInfoAsync(afterUri, { size: true })
      const afterBytes = afterInfo?.size ?? 0

      const saved = Math.max(beforeBytes - afterBytes, 0)
      const savedPct = beforeBytes > 0 ? Math.round((saved / beforeBytes) * 100) : 0

      if (showToast) {
        toast.success(
          null,
          // пример: "Compressed 3.15 MB → 0.92 MB (-71%)"
          `Compressed ${fmtMB(beforeBytes)} → ${fmtMB(afterBytes)} (${savedPct ? `-${savedPct}%` : '0%'})`,
        )
      }

      // вернём подробный результат
      return {
        uri: afterUri,
        beforeBytes,
        afterBytes,
        beforeMB: toMB(beforeBytes),
        afterMB: toMB(afterBytes),
        savedBytes: saved,
        savedMB: toMB(saved),
        savedPct,
      }
    } catch (e) {
      console.error('useSingleImagePicker error:', e)
      toast.error(null, 'Image selection failed')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { pickOne, isLoading }
}
