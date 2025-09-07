import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import i18n from '../../lang/i18n'
import { useLangStore } from '../../stores/langStore'
import { useRecipesByPointInfinite } from '../../queries/recipes'

import { HEADER_HEIGHT } from '../../constants/constants'
import WrapperComponent from '../../components/WrapperComponent'
import RecipesList from '../../components/RecipesList'

function AllRecipesPointScreen() {
  const { point } = useLocalSearchParams()
  const langApp = useLangStore((s) => s.lang)

  // сорт по умолчанию — новые сверху
  const [sort, setSort] = React.useState({ sortBy: 'created_at', ascending: false })

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useRecipesByPointInfinite(point, sort)

  const pages = data?.pages ?? []
  const recipes = React.useMemo(() => pages.flat(), [pages])

  // первичная загрузка (когда данных ещё нет)
  const loadingInitial = isLoading || (isFetching && recipes.length === 0)

  // «пусто» = не грузимся и массив пуст
  const isEmpty = !loadingInitial && recipes.length === 0

  return (
    <WrapperComponent scroll={false} marginTopAnd={10}>
      <RecipesList
        title={i18n.t('Recipes')}
        data={recipes}
        isLoading={isLoading}
        showEmpty={isEmpty}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        refetch={refetch}
        langApp={langApp}
        isRefetching={isRefetching}
        contentTopPadding={HEADER_HEIGHT + 14}
        sort={sort}
        setSort={setSort}
      />
    </WrapperComponent>
  )
}

export default AllRecipesPointScreen
