import { useQuery } from '@tanstack/react-query'
import {
  getFavoriteIdsTQ,
  getFavoritesListTQ,
  getCategoriesMasonryTQ,
} from '../service/TQuery/favorites'
import {
  createCategoryPointObject,
  filterCategoryRecipesBySubcategories,
} from '../utils/categoryFilters'
import { useMemo } from 'react'

export function useFavoriteIds(userId) {
  return useQuery({
    queryKey: ['favoriteIds', userId],
    queryFn: () => getFavoriteIdsTQ({ userId }),
    enabled: !!userId,
    staleTime: 60_000,
  })
}

export function useFavoriteRecipes(recipeIds) {
  const enabled = Array.isArray(recipeIds) && recipeIds.length > 0
  return useQuery({
    queryKey: ['favoriteRecipes', enabled ? recipeIds.length : 0],
    queryFn: () => getFavoritesListTQ({ recipeIds }),
    enabled,
    staleTime: 60_000,
    initialData: [],
  })
}

/** Категории, отфильтрованные «по избранному» */
export function useFavoriteCategories(lang, favoriteRecipes) {
  const pointsObject = useMemo(
    () => createCategoryPointObject(favoriteRecipes || []),
    [favoriteRecipes],
  )

  // стабильный “штамп” для queryKey
  const stamp = useMemo(() => {
    const ids = (favoriteRecipes || [])
      .map((r) => r.full_recipe_id ?? r.id)
      .filter(Boolean)
      .sort()
    return ids.join('|') // строка
  }, [favoriteRecipes])

  return useQuery({
    queryKey: ['favoriteCategories', lang, stamp],
    queryFn: async () => {
      const all = await getCategoriesMasonryTQ({ lang })
      return filterCategoryRecipesBySubcategories(all, pointsObject)
    },
    enabled: !!lang && (favoriteRecipes?.length ?? 0) > 0,
    staleTime: 60_000,
    initialData: [],
  })
}
