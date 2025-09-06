import React, { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import WrapperComponent from '../../components/WrapperComponent'
import LoadingComponent from '../../components/loadingComponent'

import { useAuthStore } from '../../stores/authStore'
import { useLangStore } from '../../stores/langStore'
import { useFavoriteIds, useFavoriteRecipesInfinite } from '../../queries/favorites'
import i18n from '../../lang/i18n'
import RecipePointItemComponent from '../../components/RecipesMasonry/AllRecipesPoint/RecipePointItemComponent'
import MasonryList from '@react-native-seoul/masonry-list'
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated'
import { useThemeColors } from '../../stores/themeStore'
import { BlurView } from 'expo-blur'
import ButtonBack from '../../components/ButtonBack'
import TitleScreen from '../../components/TitleScreen'
import { HEADER_HEIGHT } from '../../constants/constants'

function FavoriteScreen() {
  const user = useAuthStore((s) => s.user)
  const lang = useLangStore((s) => s.lang)
  const colors = useThemeColors()

  // 1) тянем IDs
  const { data: ids = [], isLoading: idsLoading } = useFavoriteIds(user?.id)

  // 2) бесконечная загрузка рецептов по этим IDs (по 6)
  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFavoriteRecipesInfinite(ids)

  // расплющил страницы в один массив
  const recipes = useMemo(() => (data?.pages || []).flat(), [data])
  // console.log('FavoriteScreen recipes', recipes)

  const showLoading = idsLoading || isLoading || (isFetching && recipes.length === 0)
  const showEmpty = !showLoading && recipes.length === 0

  return (
    <WrapperComponent scroll={false} marginTopAnd={10}>
      <View style={styles.container}>
        {/* header */}
        <BlurView
          intensity={30}
          tint="dark"
          reducedTransparencyFallbackColor="rgba(0,0,0,0.06)"
          style={[styles.headerWrap]}
        >
          <Animated.View
            entering={FadeInLeft.delay(200).springify().damping(30)}
            style={{ position: 'absolute', left: 2, zIndex: 10 }}
          >
            <ButtonBack />
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(300).springify().damping(30)}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <TitleScreen title={i18n.t('Liked')} />
          </Animated.View>
        </BlurView>

        {showLoading ? (
          <LoadingComponent size="large" color="green" />
        ) : showEmpty ? (
          <Animated.View entering={FadeInDown.delay(300).springify()}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.textColor,
                fontSize: 18,
                paddingTop: 100,
              }}
            >
              There are no recipes yet
            </Text>
          </Animated.View>
        ) : (
          // Список рецептов
          <View style={styles.listWrap}>
            <MasonryList
              showsVerticalScrollIndicator={false}
              data={recipes}
              keyExtractor={(item) => String(item.id)}
              numColumns={2}
              contentContainerStyle={{ paddingTop: 70 }}
              renderItem={({ item, i }) => (
                <RecipePointItemComponent item={item} index={i} langApp={lang} />
              )}
              onEndReachedThreshold={0.2}
              onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
              ListFooterComponent={
                isFetchingNextPage ? <LoadingComponent color="green" /> : null
              }
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={() => {
                refetch()
              }}
            />
          </View>
        )}
      </View>
    </WrapperComponent>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  // СТЕКЛЯННЫЙ ХЕДЕР
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    height: HEADER_HEIGHT,
    width: '100%',
    paddingHorizontal: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    // Полупрозрачность + скругление
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    // backgroundColor: 'red',
  },

  listWrap: {
    flex: 1,
    // paddingTop: HEADER_HEIGHT + 8,
  },
})

export default FavoriteScreen
