import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  FolderOpenIcon,
  HeartIcon,
  ListBulletIcon,
  StarIcon,
} from 'react-native-heroicons/mini'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'

import ButtonBack from '../../components/ButtonBack'
import ButtonSmallCustom from '../../components/Buttons/ButtonSmallCustom'
import LoadingComponent from '../../components/loadingComponent'
import SearchComponent from '../../components/SearchComponent'
import RecipeListSearchScreenComponent from '../../components/SearchScreen/RecipeListSearchScreenComponent'
import RecipesMasonrySearchScreenComponent from '../../components/SearchScreen/RecipesMasonrySearchScreenComponent'
import TitleScreen from '../../components/TitleScreen'
import WrapperComponent from '../../components/WrapperComponent'
import { shadowBoxBlack, shadowBoxWhite } from '../../constants/shadow'
import i18n from '../../lang/i18n'

import { useSearchRecipes } from '../../queries/recipes'
import { useThemeStore } from '../../stores/themeStore'
import { useLangStore } from '../../stores/langStore'

function SearchRecipeScreen() {
  //
  const router = useRouter()
  //
  const { searchQuery } = useLocalSearchParams()
  //
  const currentTheme = useThemeStore((s) => s.currentTheme)

  //
  const lang = useLangStore((s) => s.lang)
  // локальный текст запроса (инициализируем из параметра ссылки)
  const [currentQuery, setCurrentQuery] = useState(searchQuery || '')

  // какой режим рендера
  const [displayFilters, setDisplayFilters] = useState('list') // 'list' | 'folder'

  // флаги сортировок (активны только в режиме 'list')
  const [filterRatingFavorite, setFilterRatingFavorite] = useState({
    rating: false,
    favorite: false,
  })

  // подгружаем данные через TanStack Query
  const { data: recipes = [], isLoading, isFetching } = useSearchRecipes(currentQuery)

  // анимационные пресеты
  const customFadeIn = (typeAnimation, numDuration, delayMs) =>
    typeAnimation.duration(numDuration).delay(delayMs)

  // мемоизированная сортировка — без лишних setState/useEffect
  const filteredRecipes = useMemo(() => {
    if (displayFilters !== 'list') return recipes

    // clone один раз
    let arr = [...recipes]

    if (filterRatingFavorite.rating) {
      arr.sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0))
    } else if (filterRatingFavorite.favorite) {
      arr.sort((a, b) => (b?.likes ?? 0) - (a?.likes ?? 0))
    }
    return arr
  }, [recipes, displayFilters, filterRatingFavorite])

  // обработчики переключений
  const handleFolder = () => {
    setDisplayFilters('folder')
    setFilterRatingFavorite({ rating: false, favorite: false })
  }

  const handleList = () => {
    setDisplayFilters('list')
  }

  return (
    <WrapperComponent>
      {/* header section */}
      <View className="mb-5 justify-center p-2">
        {/* back to home screen */}
        <Animated.View
          entering={customFadeIn(FadeInUp, 500, 100)}
          className="absolute z-10"
        >
          <TouchableOpacity onPress={() => router.replace('homeScreen')}>
            <ButtonBack />
          </TouchableOpacity>
        </Animated.View>

        {/* title screen */}
        <Animated.View
          entering={customFadeIn(FadeInUp, 500, 200)}
          className="flex-1 items-center"
        >
          <TitleScreen title={i18n.t('Search')} />
        </Animated.View>
      </View>

      {/* block search */}
      <Animated.View entering={customFadeIn(FadeInDown, 500, 400)}>
        <SearchComponent
          mode="results"
          initialValue={currentQuery}
          onSearchChange={setCurrentQuery}
        />
      </Animated.View>

      {/* block filters */}
      <Animated.View
        entering={customFadeIn(FadeInDown, 500, 700)}
        className="py-5 mb-5 flex-row justify-around"
      >
        {/* folder */}
        <TouchableOpacity
          style={
            displayFilters === 'list'
              ? null
              : currentTheme === 'light'
                ? shadowBoxBlack()
                : shadowBoxWhite()
          }
          onPress={handleFolder}
        >
          <ButtonSmallCustom
            w={60}
            h={60}
            size={40}
            icon={FolderOpenIcon}
            color={displayFilters === 'list' ? 'grey' : 'white'}
            bg={displayFilters === 'list' ? 'white' : 'grey'}
          />
        </TouchableOpacity>

        {/* list */}
        <TouchableOpacity
          style={
            displayFilters === 'list'
              ? currentTheme === 'light'
                ? shadowBoxBlack()
                : shadowBoxWhite()
              : null
          }
          onPress={handleList}
        >
          <ButtonSmallCustom
            w={60}
            h={60}
            size={40}
            icon={ListBulletIcon}
            color={displayFilters === 'list' ? 'white' : 'grey'}
            bg={displayFilters === 'list' ? 'grey' : 'white'}
          />
        </TouchableOpacity>

        {/* rating */}
        <TouchableOpacity
          onPress={() =>
            setFilterRatingFavorite((prev) => ({
              ...prev,
              rating: !prev.rating,
              favorite: false,
            }))
          }
          style={
            displayFilters === 'list'
              ? filterRatingFavorite.rating &&
                (currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite())
              : { opacity: 0.3 }
          }
        >
          <ButtonSmallCustom
            w={60}
            h={60}
            size={40}
            icon={StarIcon}
            color="gold"
            bg="white"
          />
        </TouchableOpacity>

        {/* likes */}
        <TouchableOpacity
          onPress={() =>
            setFilterRatingFavorite((prev) => ({
              ...prev,
              favorite: !prev.favorite,
              rating: false,
            }))
          }
          style={
            displayFilters === 'list'
              ? filterRatingFavorite.favorite &&
                (currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite())
              : { opacity: 0.3 }
          }
        >
          <ButtonSmallCustom
            w={60}
            h={60}
            size={40}
            icon={HeartIcon}
            color="red"
            bg="white"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* block render query */}
      <View className="flex-1">
        {isLoading || isFetching ? (
          <LoadingComponent color="green" />
        ) : displayFilters === 'folder' ? (
          <RecipesMasonrySearchScreenComponent recipes={filteredRecipes} langApp={lang} />
        ) : (
          <RecipeListSearchScreenComponent recipes={filteredRecipes} langApp={lang} />
        )}
      </View>
    </WrapperComponent>
  )
}

export default SearchRecipeScreen
