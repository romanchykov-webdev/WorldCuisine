// import * as FileSystem from 'expo-file-system'
// import { supabaseUrl } from '../constants/supabaseIndex'
// import { supabase } from '../lib/supabase'
//
// /**
//  * Получает ссылку на изображение пользователя или возвращает иконку по умолчанию
//  * @param {string|null} imagePath - Путь к изображению в хранилище Supabase
//  * @returns {object} - Объект с URI изображения или локальным ресурсом
//  */
// export function getUserImageSrc(imagePath) {
//   if (imagePath) {
//     // return {uri: imagePath};
//     return getSupabaseFileUrl(imagePath)
//   } else {
//     return require('../assets/img/user_icon.png')
//   }
// }
//
// /**
//  * Формирует полный публичный URL к файлу в хранилище Supabase
//  * @param {string} filePath - Относительный путь к файлу в бакете
//  * @returns {string|null} - Публичный URL файла или null
//  */
// export function getSupabaseFileUrl(filePath) {
//   if (filePath) {
//     return `${supabaseUrl}/storage/v1/object/public/uploads_image/${filePath}`
//   }
//   return null
// }
//
// //--------------  Удаляет файл из Cloudinary через серверную функцию Supabase
//
// /**
//  * Удаляет файл из Cloudinary через серверную функцию Supabase
//  * @param {string} filePath - Путь к файлу в Cloudinary (например, полный URL или путь вроде 'recipes_images/Snacks/Sandwiches/2025_04_25_12_27_24_1b17d89f-441f-490e-bde8-d05453cc7493/header.jpg')
//  * @returns {Promise<{success: boolean, msg?: string}>} - Результат удаления
//  */
// export async function deleteFile(filePath) {
//   try {
//     // Извлекаем public_id из filePath
//     let publicId = filePath
//
//     if (filePath.startsWith('https://res.cloudinary.com')) {
//       const urlParts = filePath.split('/image/upload/')[1]
//       const pathWithoutVersion = urlParts.split('/').slice(1).join('/') // Убираем версию (v1745587070) и ratatouille_images
//       publicId = pathWithoutVersion.split('.').slice(0, -1).join('.') // Убираем расширение файла
//     } else {
//       publicId = filePath
//         .replace(/^ratatouille_images\//, '') // Удаляем префикс, если он есть
//         .split('.')
//         .slice(0, -1)
//         .join('.')
//     }
//
//     console.log('deleteFile: Deleting file with public_id:', publicId)
//
//     // Вызываем серверную функцию Supabase
//     const { data, error } = await supabase.rpc('delete_cloudinary_images', {
//       public_ids: [publicId],
//     })
//
//     if (error) {
//       console.error('deleteFile: Error deleting file:', error.message)
//       return { success: false, msg: error.message }
//     }
//
//     if (!data.success) {
//       console.error('deleteFile: Error deleting file:', data.error)
//       return { success: false, msg: data.error || 'Failed to delete file' }
//     }
//
//     console.log('deleteFile: File deleted successfully:', data)
//     return { success: true }
//   } catch (error) {
//     console.error('deleteFile: Error:', error)
//     return { success: false, msg: error.message }
//   }
// }
//
// // ---------------------------
//
// /**
//  * Загружает файл (изображение или видео) в хранилище Supabase
//  * @param {string} filePath - Путь директории внутри cloudinary (например, 'users' или 'recipes')
//  * @param {string} fileUri - Локальный URI файла
//  * @param {boolean} [isImage] - Является ли файл изображением
//  * @param {string|null} [oldFilePath] - Путь к предыдущему файлу для удаления (если есть)
//  * @returns {Promise<{success: boolean, data?: string, msg?: string}>} - Результат загрузки
//  */
// export async function uploadFileTQ(
//   filePath,
//   fileUri,
//   isImage = true,
//   oldFilePath = null,
// ) {
//   try {
//     if (oldFilePath && oldFilePath !== filePath) {
//       console.log('uploadFile: Deleting old file at:', oldFilePath)
//       const deleteResult = await deleteFile(oldFilePath)
//       if (!deleteResult.success) {
//         console.error('uploadFile: Error deleting old file:', deleteResult.msg)
//       } else {
//         console.log('uploadFile: Old file deleted successfully:', oldFilePath)
//       }
//     }
//
//     console.log('uploadFile: Uploading file to:', filePath)
//
//     // Читаем файл как base64
//     const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
//       encoding: FileSystem.EncodingType.Base64,
//     })
//
//     // Формируем FormData для отправки в Cloudinary
//     const formData = new FormData()
//     formData.append('file', `data:image/jpeg;base64,${fileBase64}`) // Для изображений
//     formData.append('upload_preset', 'ratatouille-app-upload') // Имя Upload Preset
//
//     // Извлекаем путь к папке из filePath
//     const folderPath = filePath.split('/').slice(0, -1).join('/')
//     formData.append('folder', folderPath) // Указываем только путь, например: recipes_images/Dessert/Cakes/15c5d29d-e68c-44b0-b876-6914f1f9a3ba
//
//     // Задаём public_id как имя файла без расширения
//     const fileName = filePath.split('/').pop().split('.').slice(0, -1).join('.')
//     formData.append('public_id', fileName) // Только имя файла, например: header
//
//     // Отправляем файл в Cloudinary
//     const response = await fetch(
//       'https://api.cloudinary.com/v1_1/dq0ymjvhx/image/upload',
//       {
//         method: 'POST',
//         body: formData,
//       },
//     )
//
//     const result = await response.json()
//
//     if (result.error) {
//       console.error('uploadFile: File upload error:', result.error.message)
//       return { success: false, msg: result.error.message }
//     }
//
//     // Получаем URL загруженного файла
//     const fileUrl = result.secure_url
//     console.log('uploadFile: File uploaded successfully:', fileUrl)
//     return { success: true, data: fileUrl } // Возвращаем полный URL
//   } catch (error) {
//     console.error('uploadFile: File upload error:', error)
//     return { success: false, msg: 'Could not upload media' }
//   }
// }
