import React, { useMemo, useState } from 'react'
import WrapperComponent from '../../components/WrapperComponent'

import { useAuthStore } from '../../stores/authStore'
import { useLangStore } from '../../stores/langStore'
import { useFavoriteIds, useFavoriteRecipesInfinite } from '../../queries/favorites'
import i18n from '../../lang/i18n'
import RecipesList from '../../components/RecipesList'

function FavoriteScreen() {
  const user = useAuthStore((s) => s.user)

  const langApp = useLangStore((s) => s.lang)

  const [sort, setSort] = useState({ sortBy: 'created_at', ascending: false })

  // 1) тянем IDs
  const { data: ids = [], isLoading: idsLoading } = useFavoriteIds(user?.id)

  // 2) бесконечная загрузка рецептов по этим IDs (по 6)
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFavoriteRecipesInfinite(ids, sort)

  // расплющил страницы в один массив
  const recipes = useMemo(() => (data?.pages || []).flat(), [data])

  // первичная загрузка (когда данных ещё нет)
  const loadingInitial = isLoading || (isFetching && recipes.length === 0)

  // «пусто» = не грузимся и массив пуст
  const isEmpty = !loadingInitial && recipes.length === 0

  return (
    <WrapperComponent scroll={false} marginTopAnd={10}>
      <RecipesList
        title={i18n.t('Liked')}
        data={recipes}
        isLoading={isLoading}
        showEmpty={isEmpty}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isFetching={isFetching}
        isFetchingNextPage={isFetchingNextPage}
        isRefetching={isRefetching}
        refetch={refetch}
        langApp={langApp}
        sort={sort}
        setSort={setSort}
      />
    </WrapperComponent>
  )
}

export default FavoriteScreen
