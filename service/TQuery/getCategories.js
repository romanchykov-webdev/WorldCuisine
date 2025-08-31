import { supabase } from '../../lib/supabase'

/**
 * Возвращает заголовки Masonry категорий для указанного языка.
 * @param {string} lang - код языка (например, "en", "ru")
 * @returns {Promise<Object>} объект title (ключи категорий -> подписи)
 */
export async function getCategoriesTQ(lang) {
  if (!lang) throw new Error('getCategoryRecipeMasonry: "lang" is required')

  // пробуем найти запись для нужного языка
  let { data, error } = await supabase
    .from('categories_masonry')
    .select('title')
    .eq('lang', lang)
    .maybeSingle()

  if (error) {
    throw new Error(`getCategoryRecipeMasonry: ${error.message}`)
  }

  // опциональный fallback на английский, если нет записи для lang
  if (!data?.title && lang !== 'en') {
    const fallback = await supabase
      .from('categories_masonry')
      .select('title')
      .eq('lang', 'en')
      .maybeSingle()

    if (fallback.error) {
      throw new Error(`getCategoryRecipeMasonry fallback: ${fallback.error.message}`)
    }
    return fallback.data?.title || {}
  }

  return data?.title || {}
}
