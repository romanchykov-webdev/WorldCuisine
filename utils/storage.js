import { supabaseUrl } from '../constants/supabaseIndex'

const BUCKET = 'uploads_image'

export function isHttpUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s)
}

// приводим значение к относительному пути внутри бакета или null
export function normalizeToStoragePath(v) {
  if (!v) return null
  if (isHttpUrl(v)) {
    // вырежем путь после `/object/public/<bucket>/`
    const m = v.match(/\/object\/public\/([^/]+)\/(.+)$/)
    if (m && m[1] === BUCKET) return m[2] // relative path inside bucket
    return null
  }
  return String(v) // уже относительный путь
}

export function getSupabasePublicUrl(path) {
  if (!path) return null
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`
}

// универсально получить URL картинки (относительный путь или https)
export function getImageUrl(maybePath) {
  if (!maybePath) return null
  return isHttpUrl(maybePath) ? maybePath : getSupabasePublicUrl(maybePath)
}
