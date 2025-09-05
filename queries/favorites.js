import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  getFavoriteIdsTQ,
  getFavoritesListTQ,
  getCategoriesMasonryTQ,
  getFavoriteRecipesPageTQ,
} from '../service/TQuery/favorites'
import {
  createCategoryPointObject,
  filterCategoryRecipesBySubcategories,
} from '../utils/categoryFilters'
import { useMemo } from 'react'

export function useLazyLoadRecipes(recipeIds, pageSize = 1) {
  const ids = Array.isArray(recipeIds) ? [...recipeIds].sort() : []
  const enabled = ids.length > 0

  return useInfiniteQuery({
    queryKey: ['favoriteRecipesInfinite', ids, pageSize],
    // pageParam — это offset; по умолчанию 0
    queryFn: ({ pageParam = 0 }) =>
      getFavoritesListTQ({
        recipeIds: ids,
        limit: pageSize,
        offset: pageParam,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // если назад пришло меньше, чем pageSize — страниц больше нет
      if (!lastPage || lastPage.length < pageSize) return undefined
      // следующий offset
      return allPages.length * pageSize
    },
    enabled,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })
}

// export function useFavoriteIds(userId) {
//   return useQuery({
//     queryKey: ['favoriteIds', userId],
//     queryFn: () => getFavoriteIdsTQ({ userId }),
//     enabled: !!userId,
//     // staleTime: 60_000,
//   })
// }
/** Хук: получить IDs избранного */
export function useFavoriteIds(userId) {
  return useQuery({
    queryKey: ['favoriteIds', userId],
    enabled: !!userId,
    queryFn: () => getFavoriteIdsTQ(userId),
  })
}
/** Хук: бесконечная подгрузка избранных рецептов по 6 шт. */
export function useFavoriteRecipesInfinite(ids = [], pageSize = 8) {
  return useInfiniteQuery({
    queryKey: ['favoriteRecipesInfinite', ids, pageSize],
    enabled: Array.isArray(ids) && ids.length > 0,
    initialPageParam: 0, // offset
    queryFn: ({ pageParam }) =>
      getFavoriteRecipesPageTQ({ ids, offset: pageParam, limit: pageSize }),

    // если последняя страница вернула limit элементов — значит ещё могут быть
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + (p?.length || 0), 0)
      return lastPage?.length === pageSize && loaded < ids.length ? loaded : undefined
    },

    refetchOnWindowFocus: false,
  })
}

export function useFavoriteRecipes(recipeIds) {
  const ids = Array.isArray(recipeIds) ? [...recipeIds].sort() : []

  const enabled = ids.length > 0

  return useQuery({
    queryKey: ['favoriteRecipes', ids], // ключ зависит от самих ID
    queryFn: () => getFavoritesListTQ({ recipeIds: ids }),
    enabled,
    // placeholderData показывает скелет/плейсхолдер, но статус остаётся "loading"
    placeholderData: [],
    // чтобы при повторном заходе точно дёрнулся рефетч
    refetchOnMount: 'always',
    // в RN обычно не нужен рефетч при возврате в приложение
    refetchOnWindowFocus: false,
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
