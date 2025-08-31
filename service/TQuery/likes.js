import { supabase } from '../../lib/supabase'

/** Проверка: лайкнул ли пользователь рецепт */
export async function isRecipeLikedTQ({ recipeId, userId }) {
  if (!recipeId || !userId) return false
  const { data, error } = await supabase
    .from('recipes_likes')
    .select('recipe_id_like')
    .eq('recipe_id_like', recipeId)
    .eq('user_id_like', userId)
    .limit(1)

  if (error) throw new Error(error.message)
  return (data?.length ?? 0) > 0
}

/** Тоггл лайка (вставка/удаление) + возвращаем дельту лайков (+1|-1|0) */
export async function toggleLikeTQ({ recipeId, userId }) {
  // есть ли запись?
  const liked = await isRecipeLikedTQ({ recipeId, userId })
  if (liked) {
    const { error } = await supabase
      .from('recipes_likes')
      .delete()
      .eq('recipe_id_like', recipeId)
      .eq('user_id_like', userId)
    if (error) throw new Error(error.message)
    return { liked: false, delta: -1 }
  } else {
    const { error } = await supabase
      .from('recipes_likes')
      .insert({ recipe_id_like: recipeId, user_id_like: userId })
    if (error) throw new Error(error.message)
    return { liked: true, delta: +1 }
  }
}
