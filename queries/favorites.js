import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getFavoriteIdsTQ, getFavoriteRecipesPageTQ } from '../service/TQuery/favorites'

/** Хук: получить IDs избранного */
export function useFavoriteIds(userId) {
  return useQuery({
    queryKey: ['favoriteIds', userId],
    enabled: !!userId,
    queryFn: () => getFavoriteIdsTQ(userId),
  })
}

/**
 * Хук для бесконечной подгрузки избранных рецептов с пагинацией и сортировкой.
 *
 * @param {string[]} ids        - массив full_recipe_id (избранные рецепты пользователя)
 * @param {Object} sort         - параметры сортировки
 * @param {string} sort.sortBy  - поле сортировки ('created_at' | 'likes' | 'rating')
 * @param {boolean} sort.ascending - направление сортировки (true = по возрастанию)
 * @param {number} pageSize     - количество рецептов, загружаемых за один запрос
 *
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult<Array, Error>}
 *   - результат работы useInfiniteQuery:
 *     - data.pages: массив страниц с рецептами
 *     - fetchNextPage: функция для загрузки следующей страницы
 *     - hasNextPage: есть ли ещё данные
 *     - isLoading, isFetching, isFetchingNextPage: статусы загрузки
 */
export function useFavoriteRecipesInfinite(
  ids = [],
  sort = { sortBy: 'created_at', ascending: false },
  pageSize = 8,
) {
  return useInfiniteQuery({
    queryKey: ['favoriteRecipesInfinite', ids, sort, pageSize],
    enabled: Array.isArray(ids) && ids.length > 0,
    initialPageParam: 0, // offset
    queryFn: ({ pageParam }) =>
      getFavoriteRecipesPageTQ({ ids, offset: pageParam, limit: pageSize, sort }),

    // если страница вернула limit элементов — значит ещё есть
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + (p?.length || 0), 0)
      return lastPage?.length === pageSize ? loaded : undefined
    },

    refetchOnWindowFocus: false,
  })
}
