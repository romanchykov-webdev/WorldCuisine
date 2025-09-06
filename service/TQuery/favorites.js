import { supabase } from '../../lib/supabase'

/** IDs избранных рецептов пользователя */
export async function getFavoriteIdsTQ(userId) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('recipes_likes')
    .select('recipe_id_like')
    .eq('user_id_like', userId)

  if (error) throw new Error(error.message)
  return (data || []).map((r) => r.recipe_id_like)
}

/**
 * Получить избранные рецепты по массиву IDs с пагинацией и сортировкой.
 *
 * @param {Object} p
 * @param {string[]} p.ids     - массив full_recipe_id (избранные рецепты пользователя)
 * @param {number} p.offset    - смещение (0, pageSize, 2*pageSize...)
 * @param {number} p.limit     - размер страницы (кол-во рецептов на одну подгрузку)
 * @param {Object} p.sort      - объект сортировки
 * @param {string} p.sort.sortBy - поле для сортировки ('created_at' | 'likes' | 'rating')
 * @param {boolean} p.sort.ascending - направление сортировки (true = по возрастанию)
 *
 * @returns {Promise<Array>}   - массив рецептов с учётом пагинации и сортировки
 */
export async function getFavoriteRecipesPageTQ({
  ids = [],
  offset = 0,
  limit = 8,
  sort,
}) {
  if (!ids.length) return []

  const sortBy = sort?.sortBy || 'created_at'
  const ascending = !!sort?.ascending

  const { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .in('full_recipe_id', ids) // фильтруем по ВСЕМ избранным
    .order(sortBy, { ascending }) // основная сортировка
    .order('id', { ascending: true }) // стабильная вторичная сортировка
    .range(offset, offset + limit - 1) // страница

  if (error) throw new Error(error.message)
  return Array.isArray(data) ? data : []
}
