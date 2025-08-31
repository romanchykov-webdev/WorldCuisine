import { supabase } from '../../lib/supabase'

/** Описание рецепта по id */
export async function getRecipeDetailsTQ({ id }) {
  const { data, error } = await supabase.from('all_recipes_description').select('*').eq('id', id)

  if (error) throw new Error(error.message)
  return data?.[0] ?? null
}

/** Только поле comments (для обновления счётчика) */
export async function getRecipeCommentsCountTQ({ id }) {
  const { data, error } = await supabase
    .from('all_recipes_description')
    .select('comments')
    .eq('id', id)

  if (error) throw new Error(error.message)
  return data?.[0]?.comments ?? 0
}
