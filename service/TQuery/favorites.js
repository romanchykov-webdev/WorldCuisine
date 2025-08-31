import { supabase } from '../../lib/supabase'

/** IDs избранных рецептов пользователя */
export async function getFavoriteIdsTQ({ userId }) {
  if (!userId) return []
  const { data, error } = await supabase
    .from('recipes_likes')
    .select('recipe_id_like')
    .eq('user_id_like', userId)

  if (error) throw new Error(error.message)
  return (data || []).map((r) => r.recipe_id_like)
}

/** Список избранных рецептов по массиву ID */
export async function getFavoritesListTQ({ recipeIds }) {
  if (!recipeIds?.length) return []
  const { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .in('full_recipe_id', recipeIds)

  if (error) throw new Error(error.message)
  return data || []
}

/** Категории Masonry для языка */
export async function getCategoriesMasonryTQ({ lang }) {
  const { data, error } = await supabase.from('categories_masonry').select('*').eq('lang', lang)

  if (error) throw new Error(error.message)
  // в вашей схеме title — это объект со списком
  return data?.[0]?.title ?? []
}
