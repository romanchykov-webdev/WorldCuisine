// queries/recipes.js
import { useQuery } from '@tanstack/react-query'
import { getCategoriesTQ } from '../service/TQuery/getCategories'

// categoryMasonry рецепты по текущему языку
export function useCategories(lang) {
  return useQuery({
    queryKey: ['categoryMasonry', lang],
    queryFn: () => getCategoriesTQ(lang),
    enabled: !!lang,
  })
}
