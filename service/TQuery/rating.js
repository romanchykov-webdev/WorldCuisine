import { supabase } from '../../lib/supabase'

/** Установка / обновление рейтинга пользователя для рецепта */
export async function upsertRatingTQ({ recipeId, userId, rating }) {
  if (!recipeId || !userId) throw new Error('No recipeId or userId')
  const { error } = await supabase.from('recipe_ratings').upsert(
    {
      recipe_id: recipeId,
      user_id: userId,
      number_of_ratings: rating,
      updated_at: new Date().toISOString(),
    },
    { onConflict: ['recipe_id', 'user_id'] },
  )
  if (error) throw new Error(error.message)
  return true
}
