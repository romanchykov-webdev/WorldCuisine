import { supabase } from '../../lib/supabase'
import * as FileSystem from 'expo-file-system'

const BUCKET = 'uploads_image'
const MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

function extFromUri(uri, fallback = 'jpg') {
  const clean = String(uri).split('?')[0].split('#')[0]
  const dot = clean.lastIndexOf('.')
  if (dot === -1) return fallback
  const ext = clean.slice(dot + 1).toLowerCase()
  return ext || fallback
}

/**
 * Кладёт файл в Supabase Storage по заданному пути (relative path внутри бакета).
 * Возвращает { success, path, url } где path — относительный путь в бакете.
 */
export async function uploadImageSupabase(
  filePath,
  fileUri,
  { contentType, upsert = true } = {},
) {
  try {
    // проверим локальный файл
    const info = await FileSystem.getInfoAsync(fileUri, { size: true })
    if (!info.exists) return { success: false, msg: 'Local file does not exist' }

    // читаем байты (надёжнее, чем blob() в RN)
    const res = await fetch(fileUri)
    if (!res.ok) return { success: false, msg: `Failed to read file (${res.status})` }
    const bytes = await res.arrayBuffer()

    // content-type
    const ext = extFromUri(fileUri, 'jpg')
    const ct = contentType || MIME[ext] || 'image/jpeg'

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, bytes, { contentType: ct, upsert })

    if (error) return { success: false, msg: error.message }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
    return { success: true, path: filePath, url: data?.publicUrl }
  } catch (e) {
    return { success: false, msg: e?.message || 'Upload failed' }
  }
}
