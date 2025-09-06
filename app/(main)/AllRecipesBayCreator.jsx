import React, { useMemo, useState } from 'react'
import { Platform, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import i18n from '../../lang/i18n'

import WrapperComponent from '../../components/WrapperComponent'
import RecipesList from '../../components/RecipesList'
import LoadingComponent from '../../components/loadingComponent'
import { HEADER_HEIGHT } from '../../constants/constants'

import { useCreatorRecipesInfinite } from '../../queries/creators'
import { useAuthStore } from '../../stores/authStore'
import { useLangStore } from '../../stores/langStore'

function AllRecipesBayCreator() {
  const { creatorId } = useLocalSearchParams()

  const [sort, setSort] = useState({ sortBy: 'created_at', ascending: false })

  const user = useAuthStore((s) => s.user)
  const langApp = useLangStore((s) => s.lang)

  const isOwn = user?.id === creatorId

  // список рецептов автора (infinite)
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isRefetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useCreatorRecipesInfinite(creatorId ?? user.id, sort)

  const recipes = useMemo(() => (data?.pages || []).flat(), [data])

  // первичная загрузка (когда данных ещё нет)
  const loadingInitial = isLoading || (isFetching && recipes.length === 0)

  // «пусто» = не грузимся и массив пуст
  const isEmpty = !loadingInitial && recipes.length === 0

  return (
    <WrapperComponent scroll={false} marginTopAnd={Platform.OS === 'ios' ? 10 : 10}>
      <RecipesList
        title={isOwn ? i18n.t('Your recipes') : i18n.t('Recipes')}
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
        contentTopPadding={HEADER_HEIGHT + 14}
      />
    </WrapperComponent>
  )
}

export default AllRecipesBayCreator
