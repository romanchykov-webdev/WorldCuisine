// queries/recipes.js
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getCategoriesTQ } from '../service/TQuery/getCategories'
import { searchRecipesByTagTQ } from '../service/TQuery/search'
import { getTopRecipesTQ } from '../service/TQuery/topRecipes'
import { getRecipesByPointTQ } from '../service/TQuery/getRecipesByPoint'
import { getMeasurementTQ } from '../service/TQuery/getMeasurement'

// categoryMasonry рецепты по текущему языку
export function useCategories(lang) {
  return useQuery({
    queryKey: ['categoryMasonry', lang],
    queryFn: () => getCategoriesTQ(lang),
    enabled: !!lang,
  })
}

// useMeasurement рецепты по текущему языку
// export function useMeasurement() {
//   return useQuery({
//     queryKey: ['measurement'],
//     queryFn: () => getMeasurementTQ(),
//     initialData: {},
//   })
// }
export function useMeasurement() {
  return useQuery({
    queryKey: ['measurement'],
    queryFn: getMeasurementTQ,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}

// поиск рецептов по запросу
export function useSearchRecipes(query) {
  const q = (query || '').trim()

  return useQuery({
    queryKey: ['search', q],
    queryFn: () => searchRecipesByTagTQ(q),
    enabled: q.length > 0, // запрос не уходит пока нет текста
    staleTime: 30 * 1000, // можно подправить стратегию
  })
}
//  топ рецептов
export function useTopRecipes(limit = 50) {
  return useQuery({
    queryKey: ['topRecipes', limit],
    queryFn: () => getTopRecipesTQ(limit),
    staleTime: 60 * 1000, // 1 мин кэш
  })
}

/**
 * Бесконечный список рецептов по point
 * @param {string} point
 * @param {{sortBy:string, ascending:boolean}} sort
 * @param {number} pageSize
 */
export function useRecipesByPointInfinite(point, sort, pageSize = 6) {
  return useInfiniteQuery({
    queryKey: ['recipesByPoint', point, sort, pageSize],
    enabled: !!point,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
    initialPageParam: 0, // offset
    queryFn: ({ pageParam }) =>
      getRecipesByPointTQ({ point, offset: pageParam, limit: pageSize, sort }),

    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((a, p) => a + (p?.length || 0), 0)
      // console.log('lastPage len:', lastPage?.length, 'loaded so far:', loaded, 'point:', point)
      return lastPage?.length === pageSize ? loaded : undefined
    },
  })
}
