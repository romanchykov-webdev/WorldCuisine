import { supabase } from '../../lib/supabase'

/**
 * Возвращает рецепты по поисковому запросу (тегам) через RPC.
 * @param {string} query
 * @returns {Promise<Array>} Массив рецептов (или пустой массив)
 */
export async function searchRecipesByTagTQ(query) {
  const q = (query || '').trim()
  if (!q) return []

  const { data, error } = await supabase.rpc('search_recipes_by_tag', {
    tag_query: q,
  })

  if (error) {
    // пробрасываем вверх — TanStack Query сам обработает
    throw new Error(error.message)
  }

  return Array.isArray(data) ? data : []
}
