// queries/favorites.js
import { useQuery, useMemo } from '@tanstack/react-query'
import {
  getFavoriteIdsTQ,
  getFavoritesListTQ,
  getCategoriesMasonryTQ,
} from '../service/TQuery/favorites'
import {
  createCategoryPointObject,
  filterCategoryRecipesBySubcategories,
} from '../utils/categoryFilters' // переместил в utils

export function useFavoriteIds(userId) {
  return useQuery({
    queryKey: ['favoriteIds', userId],
    queryFn: () => getFavoriteIdsTQ({ userId }),
    enabled: !!userId,
    staleTime: 60_000,
  })
}

export function useFavoriteRecipes(recipeIds) {
  return useQuery({
    queryKey: ['favoriteRecipes', recipeIds],
    queryFn: () => getFavoritesListTQ({ recipeIds }),
    enabled: Array.isArray(recipeIds) && recipeIds.length > 0,
    staleTime: 60_000,
  })
}

/** Категории, отфильтрованные «по избранному» */
export function useFavoriteCategories(lang, favoriteRecipes) {
  const pointsObject = useMemo(
    () => createCategoryPointObject(favoriteRecipes || []),
    [favoriteRecipes],
  )

  return useQuery({
    queryKey: ['favoriteCategories', lang, pointsObject],
    queryFn: async () => {
      const all = await getCategoriesMasonryTQ({ lang })
      return filterCategoryRecipesBySubcategories(all, pointsObject)
    },
    enabled: !!lang && Array.isArray(favoriteRecipes) && favoriteRecipes.length > 0,
    staleTime: 60_000,
  })
}
