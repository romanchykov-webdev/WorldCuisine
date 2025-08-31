// queries/recipes.js
import { useQuery } from '@tanstack/react-query'
import { getCategoriesTQ } from '../service/TQuery/getCategories'
import { searchRecipesByTagTQ } from '../service/TQuery/search'

// categoryMasonry рецепты по текущему языку
export function useCategories(lang) {
  return useQuery({
    queryKey: ['categoryMasonry', lang],
    queryFn: () => getCategoriesTQ(lang),
    enabled: !!lang,
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
