import { supabase } from '../../lib/supabase'

/**
 * Получить рецепты автора по его ID с пагинацией (offset-based).
 *
 * @param {Object} p
 * @param {string} p.creatorId         - ID автора (published_id)
 * @param {number} p.offset            - сдвиг (0, pageSize, 2*pageSize...)
 * @param {number} p.limit             - размер страницы (по умолчанию 6)
 * @param {Object} p.sort              - параметры сортировки
 * @param {string} p.sort.sortBy       - поле сортировки ('created_at' | 'likes' | 'rating')
 * @param {boolean} p.sort.ascending   - направление сортировки (true = по возрастанию)
 * @returns {Promise<Array>}           - массив рецептов (short_desc)
 */
export async function getCreatorRecipesPageTQ({
  creatorId,
  offset = 0,
  limit = 8,
  sort = { sortBy: 'created_at', ascending: false },
}) {
  if (!creatorId) return []

  const sortBy = sort?.sortBy || 'created_at'
  const ascending = !!sort?.ascending

  const { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .eq('published_id', creatorId)
    .order(sortBy, { ascending }) // основная сортировка
    .order('id', { ascending: true }) // вторичная для стабильности
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)
  return Array.isArray(data) ? data : []
}
