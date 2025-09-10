const cloudinary_cloud_name = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME
const cloudinary_upload_preset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET

/**
 * Загружает ТОЛЬКО изображение в Cloudinary.
 * @param {string} filePath  - путь в облаке (используется для folder/public_id/расширения)
 * @param {string} fileUri   - локальный URI (expo: file://...)
 * @param {string|null} oldFilePath - опционально: старый путь в облаке для удаления
 * @param {{ signal?: AbortSignal, deleteFile?: (path:string)=>Promise<{success:boolean,msg?:string}>, maxRetries?:number }} [opts]
 * @returns {Promise<{success:boolean,data?:string,msg?:string}>}
 */
// export async function uploadImageTQ(filePath, fileUri, oldFilePath = null, opts = {}) {
//   if (!cloudinary_cloud_name || !cloudinary_upload_preset) {
//     return { success: false, msg: 'Cloudinary env vars are missing' }
//   }
//   const { signal, deleteFile, maxRetries = 3 } = opts
//
//   const checkAbort = () => {
//     if (signal?.aborted) {
//       const err = new Error('Aborted')
//       err.name = 'AbortError'
//       throw err
//     }
//   }
//
//   // (опционально) удалить старый
//   if (oldFilePath && typeof deleteFile === 'function' && oldFilePath !== filePath) {
//     try {
//       const del = await deleteFile(oldFilePath)
//       // if (!del?.success) console.warn('uploadImageTQ: delete old failed:', del?.msg)
//     } catch (e) {
//       // console.warn('uploadImageTQ: delete old threw:', e?.message || e)
//     }
//   }
//
//   // разбор путей/имен/расширений
//   const folder = filePath.split('/').slice(0, -1).join('/') || undefined
//   const rawName =
//     (filePath.split('/').pop() || '').replace(/\.[^.]+$/, '') || `file_${Date.now()}`
//   const publicId = rawName.replace(/[^\w.-]/g, '_')
//
//   const extFromPath = (filePath.split('.').pop() || '').toLowerCase()
//   const extFromUri = (fileUri.split('.').pop() || '').toLowerCase()
//   const ext = extFromPath || extFromUri || 'jpg'
//
//   // допустимые расширения/типы для изображений
//   const MIME_MAP = {
//     jpg: 'image/jpeg',
//     jpeg: 'image/jpeg',
//     png: 'image/png',
//     webp: 'image/webp',
//     heic: 'image/heic',
//     gif: 'image/gif',
//   }
//   const mime = MIME_MAP[ext] || 'image/jpeg'
//   if (!mime.startsWith('image/')) {
//     return { success: false, msg: 'Only image files are allowed' }
//   }
//
//   // RN File объект (без base64)
//   const file = { uri: fileUri, name: `${publicId}.${ext}`, type: mime }
//
//   const formData = new FormData()
//   formData.append('file', file)
//   formData.append('upload_preset', cloudinary_upload_preset)
//   if (folder) formData.append('folder', folder)
//   formData.append('public_id', publicId)
//
//   const endpoint = `https://api.cloudinary.com/v1_1/${cloudinary_cloud_name}/image/upload`
//
//   const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
//
//   let attempt = 0
//   while (attempt <= maxRetries) {
//     try {
//       checkAbort()
//       const res = await fetch(endpoint, { method: 'POST', body: formData, signal })
//       const json = await res.json()
//
//       if (!res.ok || json?.error) {
//         const code = json?.error?.http_code || res.status
//         const msg = json?.error?.message || res.statusText || 'Cloudinary upload error'
//         if ([429, 500, 502, 503, 504].includes(code) && attempt < maxRetries) {
//           attempt += 1
//           await sleep(400 * attempt ** 2)
//           continue
//         }
//         return { success: false, msg }
//       }
//
//       const url = json.secure_url || json.url
//       if (!url) return { success: false, msg: 'No URL returned from Cloudinary' }
//       return { success: true, data: url }
//     } catch (e) {
//       if (e?.name === 'AbortError') return { success: false, msg: 'Aborted' }
//       if (attempt < maxRetries) {
//         attempt += 1
//         await sleep(400 * attempt ** 2)
//         continue
//       }
//       return { success: false, msg: e?.message || 'Upload failed' }
//     }
//   }
//
//   return { success: false, msg: 'Upload failed after retries' }
// }
