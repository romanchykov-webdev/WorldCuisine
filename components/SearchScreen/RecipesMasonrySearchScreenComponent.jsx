import { useState } from 'react'
import MasonryList from '@react-native-seoul/masonry-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {
  ArrowUturnLeftIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  HeartIcon,
  PlayCircleIcon,
  StarIcon,
} from 'react-native-heroicons/outline'
import Animated, { FadeInDown } from 'react-native-reanimated'

import AvatarCustom from '../AvatarCustom'

import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack, shadowText } from '../../constants/shadow'
import { useThemeStore } from '../../stores/themeStore'
import { useCategories } from '../../queries/recipes'
import LoadingComponent from '../loadingComponent'
import {
  createCategoryPointObject,
  filterCategoryRecipesBySubcategories,
} from '../../utils/categoryFilters'
import { formatNumber } from '../../utils/numberFormat'

// === Вьюшки для карточек ===
function CategoryView({ item, index, onCategorySelect }) {
  const isEven = index % 3 === 0
  const imageHeight = isEven ? hp(25) : hp(35)

  return (
    <Animated.View
      entering={FadeInDown.delay((index + 4) * 200)
        .springify()
        .damping(30)}
      className="flex justify-center mb-[10] gap-y-1 p-[2]"
      style={[shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 1, radius: 3 })]}
    >
      <TouchableOpacity
        onPress={() => onCategorySelect(item.point)}
        style={{ width: '100%' }}
        className="rounded-full relative items-center"
      >
        {!!item.image && (
          <AvatarCustom
            uri={item.image}
            style={{ borderWidth: 0.2, width: '100%', height: imageHeight }}
            rounded={35}
          />
        )}

        <LinearGradient
          colors={['transparent', '#18181b']}
          style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 35 }}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}
        />

        <View className="absolute bottom-[20] items-center justify-around">
          <Text className="text-white font-medium text-center mb-2" style={shadowText()}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

// SubCategory
function SubCategoryView({ item, index, onSubcategorySelect }) {
  const isEven = index % 3 === 0
  const imageHeight = isEven ? hp(25) : hp(35)

  return (
    <Animated.View
      entering={FadeInDown.delay((index + 4) * 200)
        .springify()
        .damping(30)}
      className="flex justify-center mb-[10] gap-y-1 p-[2]"
      style={[shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 1, radius: 3 })]}
    >
      <TouchableOpacity
        onPress={() => onSubcategorySelect(item.point)}
        style={{ width: '100%' }}
        className="rounded-full relative items-center"
      >
        {!!item.image && (
          <AvatarCustom
            uri={item.image}
            style={{ borderWidth: 0.2, width: '100%', height: imageHeight }}
            rounded={35}
          />
        )}

        <LinearGradient
          colors={['transparent', '#18181b']}
          style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 35 }}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}
        />

        <View className="absolute bottom-[20] items-center justify-around">
          <Text className="text-white font-medium text-center mb-2" style={shadowText()}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

// Компонент для отображения одного рецепта
function RecipePointItem({ item, index, langApp }) {
  const router = useRouter()
  const isEven = index % 3 === 0
  const imageHeight = isEven ? hp(25) : hp(35)

  const categoryTitle = Array.isArray(item.title?.lang)
    ? item.title.lang.find((it) => it.lang === langApp)?.name || item.title.strTitle
    : item.title?.strTitle

  return (
    <Animated.View
      entering={FadeInDown.delay((index + 4) * 200)
        .springify()
        .damping(30)}
      className="flex justify-center mb-[10] gap-y-1 p-[2]"
      style={[shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 1, radius: 3 })]}
    >
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: 'RecipeDetailsScreen',
            params: { id: item.full_recipe_id, langApp },
          })
        }
        style={{ width: '100%' }}
        className="rounded-full relative items-center"
      >
        <View
          style={shadowBoxBlack({
            offset: { width: 1, height: 1 },
            opacity: 1,
            radius: 1,
            elevation: 3,
          })}
          className={`${item?.video ? 'justify-between' : 'justify-end'} items-start flex-row w-full absolute top-2 left-0 z-10 px-5`}
        >
          {!!item?.video && <PlayCircleIcon size={25} color="red" />}
          {!!item?.published_user && (
            <View className="items-center">
              <AvatarCustom
                uri={item?.published_user?.avatar}
                size={25}
                style={{ borderWidth: 0.2 }}
                rounded={50}
              />
              <Text
                style={{ fontSize: 6, maxWidth: 20, overflow: 'hidden', textAlign: 'center' }}
                numberOfLines={1}
              >
                {item?.published_user?.user_name}
              </Text>
            </View>
          )}
        </View>

        {!!item.image_header && (
          <AvatarCustom
            uri={item.image_header}
            style={{ borderWidth: 0.2, width: '100%', height: imageHeight }}
            rounded={35}
          />
        )}

        <LinearGradient
          colors={['transparent', '#18181b']}
          style={{ width: '100%', height: '100%', position: 'absolute', borderRadius: 35 }}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 0.5, y: 1 }}
        />

        <View className="absolute bottom-[20] items-center justify-around">
          <Text className="text-white font-medium text-center mb-2" style={shadowText()}>
            {categoryTitle}
          </Text>

          <View className="flex-row items-center justify-around w-full min-h-[25px]">
            {item.likes > 0 && (
              <View className="items-center">
                <HeartIcon size={25} color="gray" />
                <Text
                  style={{ fontSize: 8, maxWidth: 25, overflow: 'hidden', textAlign: 'center' }}
                  className="text-white"
                  numberOfLines={1}
                >
                  {formatNumber(item.likes)}
                </Text>
              </View>
            )}

            {item.comments > 0 && (
              <View className="items-center">
                <ChatBubbleOvalLeftEllipsisIcon size={25} color="gray" />
                <Text
                  style={{ fontSize: 8, maxWidth: 25, overflow: 'hidden', textAlign: 'center' }}
                  className="text-white"
                  numberOfLines={1}
                >
                  {formatNumber(item.comments)}
                </Text>
              </View>
            )}

            {item.rating > 0 && (
              <View className="items-center">
                <StarIcon size={25} color="gray" />
                <Text style={{ fontSize: 8 }} className="text-white">
                  {item.rating}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

// === Основной компонент «Папки» ===
function RecipesMasonrySearchScreenComponent({ recipes, langApp }) {
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const { data: categories, isLoading } = useCategories(langApp) // <-- TanStack Query

  // 1) строим объект разрешённых подкатегорий по результатам поиска
  const obFilterCategory = createCategoryPointObject(recipes)
  // 2) фильтруем структуру категорий (если нет данных — пустой массив)
  const categoryRecipes = categories
    ? filterCategoryRecipesBySubcategories(categories, obFilterCategory)
    : []

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState(null)
  const numColumns = 2

  // заголовки
  const selectedCategoryName =
    selectedCategory && categoryRecipes.length > 0
      ? categoryRecipes.find((cat) => cat.point === selectedCategory)?.name || 'Unknown Category'
      : null

  const selectedSubcategoryName =
    selectedSubcategory && categoryRecipes.length > 0
      ? categoryRecipes
          .flatMap((cat) => cat.subcategories || [])
          .find((subcat) => subcat.point === selectedSubcategory)?.name || 'Unknown Subcategory'
      : null

  if (isLoading) {
    return <LoadingComponent color="green" />
  }

  return (
    <View className="flex-1">
      {selectedSubcategory ? (
        <Animated.View entering={FadeInDown.duration(300)}>
          <View className="flex-row items-center justify-center mb-5 mt-5 h-[50px]">
            <TouchableOpacity
              onPress={() => setSelectedSubcategory(null)}
              style={shadowBoxBlack()}
              className="w-[50] h-[50] absolute left-0 z-10 justify-center items-center bg-white rounded-full"
            >
              <ArrowUturnLeftIcon size={30} color="gray" />
            </TouchableOpacity>

            <Text
              className="flex-1 text-center font-semibold text-xl"
              style={{ color: currentTheme === 'light' ? '#404040' : '#D4D4D4' }}
            >
              {selectedSubcategoryName}
            </Text>
          </View>

          {recipes.filter((r) => r.point === selectedSubcategory).length > 0 ? (
            <MasonryList
              data={recipes.filter((r) => r.point === selectedSubcategory)}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => (
                <RecipePointItem item={item} index={i} langApp={langApp} />
              )}
              onEndReachedThreshold={0.1}
            />
          ) : (
            <Text className="text-center mt-5">No recipes found for this subcategory</Text>
          )}
        </Animated.View>
      ) : selectedCategory ? (
        <Animated.View entering={FadeInDown.duration(300)}>
          <View className="flex-row items-center justify-center mb-5 mt-5 h-[50px]">
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              style={shadowBoxBlack()}
              className="w-[50] h-[50] absolute left-0 z-10 justify-center items-center bg-white rounded-full"
            >
              <ArrowUturnLeftIcon size={30} color="gray" />
            </TouchableOpacity>

            <Text
              className="flex-1 text-center font-semibold text-xl"
              style={{ color: currentTheme === 'light' ? '#404040' : '#D4D4D4' }}
            >
              {selectedCategoryName}
            </Text>
          </View>

          {(categoryRecipes.find((c) => c.point === selectedCategory)?.subcategories?.length ?? 0) >
          0 ? (
            <MasonryList
              data={categoryRecipes.find((c) => c.point === selectedCategory).subcategories}
              keyExtractor={(item, index) => `${item.point}-${index}`}
              numColumns={numColumns}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => (
                <SubCategoryView
                  item={item}
                  index={i}
                  onSubcategorySelect={setSelectedSubcategory}
                />
              )}
              onEndReachedThreshold={0.1}
            />
          ) : (
            <Text className="text-center mt-5">No subcategories found</Text>
          )}
        </Animated.View>
      ) : categoryRecipes.length > 0 ? (
        <MasonryList
          data={categoryRecipes}
          keyExtractor={(item, index) => `${item.point}-${index}`}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => (
            <CategoryView item={item} index={i} onCategorySelect={setSelectedCategory} />
          )}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <Text className="text-center mt-5">No categories found for the search results</Text>
      )}
    </View>
  )
}

export default RecipesMasonrySearchScreenComponent
