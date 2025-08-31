import { supabase } from '../../lib/supabase'

/**
 * Топ рецептов для домашнего экрана, отсортированных по лайкам.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getTopRecipesTQ(limit = 50) {
  const { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .gt('likes', 0)
    .order('likes', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return Array.isArray(data) ? data : []
}
