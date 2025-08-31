import { supabase } from '../../lib/supabase'

/**
 * Получить рецепты по point с пагинацией (offset-based).
 * @param {Object} p
 * @param {string} p.point
 * @param {number} p.offset  - сдвиг (0, pageSize, 2*pageSize...)
 * @param {number} p.limit   - размер страницы
 * @param {Object} p.sort    - { sortBy: 'created_at'|'likes'|'rating', ascending: boolean }
 * @returns {Promise<Array>}
 */
export async function getRecipesByPointTQ({ point, offset = 0, limit = 20, sort }) {
  if (!point) return []

  const sortBy = sort?.sortBy || 'created_at'
  const ascending = !!sort?.ascending

  const { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .eq('point', point)
    .order(sortBy, { ascending })
    .range(offset, offset + limit - 1)

  if (error) throw new Error(error.message)
  return Array.isArray(data) ? data : []
}
