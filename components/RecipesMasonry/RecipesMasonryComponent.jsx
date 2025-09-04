// components/RecipesMasonry/RecipesMasonryComponent.jsx
import React, { useCallback, useMemo, useState } from 'react'
import MasonryList from '@react-native-seoul/masonry-list'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { ArrowUturnLeftIcon } from 'react-native-heroicons/outline'

import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import AvatarCustom from '../AvatarCustom'
import { useThemeColors } from '../../stores/themeStore'
import Shimmer from '../Skeleton/Shimmer'

// ===== Skeletons =====
const ShimmerCard = React.memo(function ShimmerCard({ index }) {
  const isEven = index % 3 === 0
  const h = isEven ? hp(25) : hp(35)
  return (
    <View style={[styles.card, { marginHorizontal: 2.5 }, shadowBoxBlack({ opacity: 0.25 })]}>
      <Shimmer width="100%" height={h} borderRadius={35} />
    </View>
  )
})

const ShimmerGrid = React.memo(function ShimmerGrid({ count = 6 }) {
  const data = useMemo(() => Array.from({ length: count }, (_, i) => i), [count])
  return (
    <View style={{ marginTop: 10 }}>
      <MasonryList
        data={data}
        keyExtractor={(i) => `sk-${i}`}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: i }) => <ShimmerCard index={i} />}
      />
    </View>
  )
})

// ===== Category card =====
const CategoryCard = React.memo(function CategoryCard({ item, index, onPress }) {
  const isEven = index % 3 === 0
  const imageHeight = isEven ? hp(25) : hp(35)

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 120).springify()}
      style={[
        styles.card,
        { marginHorizontal: 2, borderRadius: 35 },
        shadowBoxBlack({ offset: { width: 1, height: 2 }, opacity: 1, radius: 3 }),
      ]}
    >
      <TouchableOpacity onPress={() => onPress?.(item)} activeOpacity={0.8}>
        <CardImageShell uri={item?.image} height={imageHeight} radius={35} />
        <Text
          className="absolute bottom-[20] text-white font-semibold text-lg"
          numberOfLines={1}
          style={{ textAlign: 'center', width: '100%' }}
        >
          {item?.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

// ===== Subcategory card =====
const SubCategoryCard = React.memo(function SubCategoryCard({ item, index, onOpen }) {
  const isEven = index % 3 === 0
  const imageHeight = isEven ? hp(25) : hp(35)

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 120).springify()}
      style={[
        styles.card,
        { marginHorizontal: 2, borderRadius: 35 },
        shadowBoxBlack({ offset: { width: 1, height: 2 }, opacity: 1, radius: 3 }),
      ]}
    >
      <TouchableOpacity onPress={() => onOpen?.(item)} activeOpacity={0.8}>
        <CardImageShell uri={item?.image} height={imageHeight} radius={35} />
        <Text
          className="absolute bottom-[20] text-white font-semibold text-lg"
          numberOfLines={1}
          style={{ textAlign: 'center', width: '100%' }}
        >
          {item?.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
})

/**
 * @param {Array}  categoryRecipes [{ name, image, point, subcategories: [{ name, image, point }, ...] }, ...]
 * @param {String} langApp
 * @param {Boolean} loading - если true, рисуем скелетоны
 */
function RecipesMasonryComponent({ categoryRecipes = [], langApp, loading = false }) {
  const [selected, setSelected] = useState(null) // выбранная категория
  const colors = useThemeColors()

  const data = useMemo(
    () => (Array.isArray(categoryRecipes) ? categoryRecipes : []),
    [categoryRecipes],
  )
  const isLoading = loading || data.length === 0

  const onPressCategory = useCallback((item) => setSelected(item), [])
  const onBack = useCallback(() => setSelected(null), [])

  // key extractors
  const keyCat = useCallback((it, idx) => String(it?.point || it?.name || idx), [])
  const keySub = useCallback((it, idx) => String(it?.point || it?.name || idx), [])

  // рендеры
  const renderCategory = useCallback(
    ({ item, i, index }) => (
      <CategoryCard item={item} index={index ?? i} onPress={onPressCategory} />
    ),
    [onPressCategory],
  )

  const router = useRouter()
  const openSub = useCallback(
    (sub) => {
      router.push({
        pathname: '(main)/AllRecipesPointScreen',
        params: { point: sub?.point, langApp, preview: false },
      })
    },
    [router, langApp],
  )

  const renderSubcategory = useCallback(
    ({ item, i, index }) => <SubCategoryCard item={item} index={index ?? i} onOpen={openSub} />,
    [openSub],
  )

  // ---- FIX: сначала показываем КАТЕГОРИИ, а при selected — ПОДКАТЕГОРИИ
  if (isLoading && !selected) {
    return <ShimmerGrid count={8} />
  }

  return (
    <View className="flex-1 mt-5">
      {!selected ? (
        <MasonryList
          data={data}
          keyExtractor={keyCat}
          numColumns={2}
          renderItem={renderCategory}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.1}
        />
      ) : (
        <Animated.View entering={FadeInDown}>
          {/* back */}
          <View className="flex-row items-center mb-5 mt-5">
            <TouchableOpacity
              onPress={onBack}
              style={shadowBoxBlack()}
              className="absolute left-0 z-10 w-[50] h-[50] justify-center items-center bg-white rounded-full"
            >
              <ArrowUturnLeftIcon size={30} color="gray" />
            </TouchableOpacity>

            <Text
              className="flex-1 text-center font-semibold text-xl"
              style={{ color: colors.textColor }}
              numberOfLines={1}
            >
              {selected?.name}
            </Text>
          </View>

          {Array.isArray(selected?.subcategories) && selected.subcategories.length > 0 ? (
            <MasonryList
              data={selected.subcategories}
              keyExtractor={keySub}
              numColumns={2}
              renderItem={renderSubcategory}
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.1}
            />
          ) : (
            <View style={{ paddingVertical: 16 }}>
              <Text style={{ textAlign: 'center', color: colors.secondaryTextColor }}>
                No subcategories found
              </Text>
            </View>
          )}
        </Animated.View>
      )}
    </View>
  )
}

function CardImageShell({ uri, height, radius = 35 }) {
  return (
    <View
      style={{
        width: '100%',
        height,
        borderRadius: radius,
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      <AvatarCustom
        uri={uri}
        style={{ borderWidth: 0.2, width: '100%', height }}
        rounded={radius}
      />
      {/*<View*/}
      {/*  style={[*/}
      {/*    StyleSheet.absoluteFill,*/}
      {/*    { borderRadius: radius, zIndex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },*/}
      {/*  ]}*/}
      {/*></View>*/}
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.9)']}
        locations={[0, 1]}
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { borderRadius: radius, zIndex: 1 }]}
        start={{ x: 0.5, y: 0.2 }}
        end={{ x: 0.5, y: 1 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 2,
    marginBottom: 10,
  },
})

export default React.memo(RecipesMasonryComponent)
