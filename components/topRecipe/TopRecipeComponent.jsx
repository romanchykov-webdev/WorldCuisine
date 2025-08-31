import React, { memo, useCallback } from 'react'
import { useRouter } from 'expo-router'
import { FlatList, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp } from 'react-native-reanimated'

import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import AvatarCustom from '../AvatarCustom'
import LoadingComponent from '../loadingComponent'
import { useTopRecipes } from '../../queries/recipes'
import TopRecipeSkeleton from '../Skeleton/TopRecipeSkeleton'

function TopRecipeComponent() {
  const { data: topRecipes = [], isLoading, isFetching, isError } = useTopRecipes(50)

  if (isLoading || isFetching) {
    return <TopRecipeSkeleton />
  }

  if (isError || topRecipes.length === 0) {
    return <View />
  }

  return (
    <View>
      <FlatList
        horizontal
        data={topRecipes}
        keyExtractor={(item) => String(item.id ?? item.full_recipe_id)}
        renderItem={({ item, index }) => <ItemTopRecipe item={item} index={index} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}
        // производительность
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews
        getItemLayout={(_, idx) => {
          // ширина аватарки + внешние отступы (примерная)
          const W = hp(6) + 24
          return { length: W, offset: W * idx, index: idx }
        }}
      />
    </View>
  )
}

const ItemTopRecipe = memo(function ItemTopRecipe({ item, index }) {
  const router = useRouter()
  const openRecipe = useCallback(() => {
    router.push({
      pathname: 'RecipeDetailsScreen',
      params: { id: item.full_recipe_id },
    })
  }, [router, item.full_recipe_id])

  return (
    <Animated.View
      entering={FadeInUp.duration(300)
        .delay(index * 80)
        .springify()}
      style={{ marginHorizontal: 6 }}
    >
      <TouchableOpacity onPress={openRecipe} className="items-center">
        <View style={shadowBoxBlack()} className="rounded-full p-[6]">
          <AvatarCustom
            uri={item.image_header}
            size={hp(6)}
            style={{ borderWidth: 0.2 }}
            rounded={50}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
})

export default TopRecipeComponent
