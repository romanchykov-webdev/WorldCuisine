import React, { useMemo } from 'react'
import { View } from 'react-native'
import WrapperComponent from '../../components/WrapperComponent'
import HeaderScreenComponent from '../../components/HeaderScreenComponent'
import LoadingComponent from '../../components/loadingComponent'

import { useAuthStore } from '../../stores/authStore'
import { useLangStore } from '../../stores/langStore'
import { useFavoriteIds, useFavoriteRecipes, useLazyLoadRecipes } from '../../queries/favorites'
import i18n from '../../lang/i18n'
import RecipePointItemComponent from '../../components/RecipesMasonry/AllRecipesPoint/RecipePointItemComponent'
import MasonryList from '@react-native-seoul/masonry-list'

function FavoriteScreen() {
  const user = useAuthStore((s) => s.user)
  const lang = useLangStore((s) => s.lang)

  // 1) IDs
  const { data: ids = [], isLoading: l1, isError: e1 } = useFavoriteIds(user?.id)

  // 2) Рецепты по 10, infinite
  const {
    data,
    isLoading: l2,
    isFetching: f2,
    isError: e2,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useLazyLoadRecipes(ids, 10)

  const recipes = useMemo(() => (data?.pages || []).flat(), [data])
  const loading = l1 || f2

  return (
    <WrapperComponent>
      <View style={{ flex: 1 }}>
        <View>
          <HeaderScreenComponent titleScreanText={i18n.t('Liked')} />
        </View>

        {loading ? (
          <LoadingComponent color="green" />
        ) : (
          // Список рецептов
          <MasonryList
            data={recipes}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            contentContainerStyle={{ marginBottom: 50 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, i }) => (
              <RecipePointItemComponent item={item} index={i} langApp={lang} />
            )}
            onEndReachedThreshold={0.2}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) fetchNextPage()
            }}
            ListFooterComponent={isFetchingNextPage ? <LoadingComponent color="green" /> : null}
            refreshing={f2 && !isFetchingNextPage}
            onRefresh={refetch}
          />
        )}
      </View>
    </WrapperComponent>
  )
}

export default FavoriteScreen
