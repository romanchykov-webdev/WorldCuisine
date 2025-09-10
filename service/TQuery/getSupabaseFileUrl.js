import { supabaseUrl } from '../../constants/supabaseIndex'

export function getSupabaseFileUrl(filePath) {
  if (filePath) {
    return `${supabaseUrl}/storage/v1/object/public/uploads_image/${filePath}`
  }
  return null
}
