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
 * Страница рецептов по массиву IDs (offset/limit).
 * Возвращает не более `limit` рецептов, начиная с `offset`.
 * ВАЖНО: фильтруем по full_recipe_id, т.к. в likes хранится именно он.
 */
export async function getFavoriteRecipesPageTQ({ ids = [], offset = 0, limit = 8 }) {
  if (!ids.length) return []

  const slice = ids.slice(offset, offset + limit)
  if (!slice.length) return []

  // грузим рецепты по этим FULL IDs
  const { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .in('full_recipe_id', slice)
    .order('id', { ascending: true })

  if (error) throw new Error(error.message)

  // восстанавливаем порядок как в slice
  const byFullId = new Map((data || []).map((r) => [r.full_recipe_id, r]))
  return slice.map((fid) => byFullId.get(fid)).filter(Boolean)
}

/** Список избранных рецептов по массиву ID (поддержка full_recipe_id и fullRecipeId) */
export async function getFavoritesListTQ({ recipeIds }) {
  if (!recipeIds?.length) return []

  // 1) пробуем snake_case
  let { data, error } = await supabase
    .from('short_desc')
    .select('*')
    .in('full_recipe_id', recipeIds)

  if (error) throw new Error(error.message)

  // 2) если пусто — пробуем camelCase
  if (!data || data.length === 0) {
    const fallback = await supabase
      .from('short_desc')
      .select('*')
      .in('fullRecipeId', recipeIds)

    if (fallback.error) throw new Error(fallback.error.message)
    data = fallback.data || []
  }

  return data
}

/** Категории Masonry для языка */
export async function getCategoriesMasonryTQ({ lang }) {
  const { data, error } = await supabase
    .from('categories_masonry')
    .select('*')
    .eq('lang', lang)

  if (error) throw new Error(error.message)
  return data?.[0]?.title ?? []
}
