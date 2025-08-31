// app/(main)/FavoriteScreen.jsx
import { useState, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import WrapperComponent from '../../components/WrapperComponent'
import HeaderScreenComponent from '../../components/HeaderScreenComponent'
import ToggleListCategoryComponent from '../../components/profile/ToggleListCategoryComponent'
import LoadingComponent from '../../components/loadingComponent'
import RecipesMasonrySearchScreenComponent from '../../components/SearchScreen/RecipesMasonrySearchScreenComponent'
import AllRecipesPointScreen from './AllRecipesPointScreen' // оставим как есть для варианта «список»
import i18n from '../../lang/i18n'

import { useAuthStore } from '../../stores/authStore'
import { useLangStore } from '../../stores/langStore'
import { useFavoriteIds, useFavoriteRecipes, useFavoriteCategories } from '../../queries/favorites'

function FavoriteScreen() {
  const user = useAuthStore((s) => s.user)
  const lang = useLangStore((s) => s.lang)
  const [showFolders, setShowFolders] = useState(false)

  // 1) IDs
  const { data: ids = [], isLoading: l1, isError: e1 } = useFavoriteIds(user?.id)

  // 2) Сами рецепты
  const { data: recipes = [], isLoading: l2, isError: e2 } = useFavoriteRecipes(ids)

  // 3) Категории, отфильтрованные по избранному
  const { data: categories = [], isLoading: l3, isError: e3 } = useFavoriteCategories(lang, recipes)

  const loading = l1 || l2 || (showFolders && l3)
  const hasError = e1 || e2 || (showFolders && e3)

  const hasRecipes = (recipes || []).length > 0

  return (
    <WrapperComponent>
      <View style={{ flex: 1 }}>
        <View className="mb-5">
          <HeaderScreenComponent titleScreanText={i18n.t('Liked')} />
          <ToggleListCategoryComponent
            toggleFolderList={showFolders}
            onToggleChange={setShowFolders}
            hasRecipes={hasRecipes}
          />
        </View>

        {loading ? (
          <LoadingComponent color="green" />
        ) : hasError ? (
          <View style={{ paddingVertical: 16 }}>{/* можно показать тост/ошибку */}</View>
        ) : !hasRecipes ? (
          <View style={{ paddingVertical: 16 }}>{/* пустое состояние */}</View>
        ) : showFolders ? (
          // папки (категории из Masonry, уже отфильтрованные по избранному)
          <RecipesMasonrySearchScreenComponent
            // этот компонент у тебя отображает masonry по массиву рецептов;
            // если нужен именно masonry-категорий — используй свой RecipesMasonryComponent
            recipes={recipes}
            langApp={lang}
          />
        ) : (
          // список: переиспользуем AllRecipesPointScreen, но ему нужен массив
          <AllRecipesPointScreen
            allFavoriteRecipes={recipes}
            isFavoriteScrean
            isScreanAlrecipeBayCreatore={false}
            titleVisible={false}
          />
        )}
      </View>
    </WrapperComponent>
  )
}

const styles = StyleSheet.create({})
export default FavoriteScreen
