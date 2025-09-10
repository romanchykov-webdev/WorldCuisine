import * as FileSystem from 'expo-file-system'
import { supabase } from '../../lib/supabase'
import { normalizeToStoragePath, getSupabasePublicUrl } from '../../utils/storage'

const BUCKET = 'uploads_image'

// карта контент-тайпов
const MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  heic: 'image/heic',
}

function pickExt(uri, fallback = 'jpg') {
  const clean = String(uri).split('?')[0].split('#')[0]
  const dot = clean.lastIndexOf('.')
  if (dot === -1) return fallback
  const ext = clean.slice(dot + 1).toLowerCase()
  return ext || fallback
}

/**
 * Загружает новый аватар и удаляет старый.
 * @param {string} userId
 * @param {string} fileUri  // expo file://... (или asset uri)
 * @param {string|null} oldValue // старое значение (полный URL или относительный путь)
 */
export async function uploadAvatarSupabase(userId, fileUri, oldValue, opts = {}) {
  try {
    if (!userId || !fileUri)
      return { success: false, msg: 'userId or fileUri is missing' }

    // 1) убедимся, что файл существует и не пустой
    const info = await FileSystem.getInfoAsync(fileUri, { size: true })
    if (!info.exists) return { success: false, msg: 'Local file does not exist' }

    if (typeof info.size === 'number' && info.size === 0) {
      return { success: false, msg: 'Local file is empty (0 bytes)' }
    }

    // 2) читаем как ArrayBuffer (надёжнее, чем blob() в RN)
    const res = await fetch(fileUri)
    if (!res.ok) {
      return { success: false, msg: `Failed to read file (${res.status})` }
    }
    const bytes = await res.arrayBuffer()

    // 3) имя и contentType
    const ext = pickExt(fileUri, 'jpg')
    const contentType = MIME[ext] || 'image/jpeg'
    const ts = Date.now()
    const path = `profiles/${userId}_${ts}.${ext}`

    // 4) upload
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType })

    if (uploadErr) return { success: false, msg: uploadErr.message }

    const url = getSupabasePublicUrl(path)

    // 5) удалим старый (только после успешной загрузки)
    const oldPath = normalizeToStoragePath(oldValue)
    if (oldPath && oldPath !== path) {
      await supabase.storage
        .from(BUCKET)
        .remove([oldPath])
        .catch(() => {})
    }

    return { success: true, path, url }
  } catch (e) {
    return { success: false, msg: e?.message || 'Upload failed' }
  }
}
