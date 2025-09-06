import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getCreatorRecipesPageTQ } from '../service/TQuery/creator'

/**
 * Хук для бесконечной подгрузки рецептов конкретного автора с сортировкой.
 *
 * @param {string} creatorId - ID автора (published_id)
 * @param {{sortBy:string, ascending:boolean}} sort - параметры сортировки
 * @param {number} pageSize - количество рецептов за страницу (по умолчанию 6)
 *
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult<Array, Error>}
 *   - результат useInfiniteQuery (data.pages, fetchNextPage, hasNextPage и статусы загрузки)
 */
export function useCreatorRecipesInfinite(
  creatorId,
  sort = { sortBy: 'created_at', ascending: false },
  pageSize = 6,
) {
  return useInfiniteQuery({
    queryKey: ['creatorRecipesInfinite', creatorId, sort, pageSize],
    enabled: !!creatorId,
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getCreatorRecipesPageTQ({ creatorId, offset: pageParam, limit: pageSize, sort }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + (p?.length || 0), 0)
      return lastPage?.length === pageSize ? loaded : undefined
    },
    refetchOnWindowFocus: false,
  })
}

/** категории для “папок” — обёртка в стиле TQ.
 *  Если у вас уже есть рабочая функция getCategoryRecipeMasonryMyDB(lang),
 *  можно временно вызвать её внутри, а потом заменить прямым SQL/РС.
 */
export async function getCategoryRecipeMasonryTQ(fetcherFn, lang) {
  const res = await fetcherFn(lang)
  if (!res?.data) return []
  return res.data
}
