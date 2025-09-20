import MasonryList from '@react-native-seoul/masonry-list'
import { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getDeviceType } from '../../constants/getWidthDevice'
import RecipePointItemComponent from '../RecipesMasonry/AllRecipesPoint/RecipePointItemComponent'

// Основной компонент для отображения списка рецептов
function RecipeListSearchScreenComponent({ recipes, langApp }) {
  const [column, setColumn] = useState(0)
  // console.log("RecipeListSearchScreenComponent recipes", recipes);

  // Определяем количество колонок в зависимости от типа устройства
  useEffect(() => {
    const type = getDeviceType(window.innerWidth)
    setColumn(type)
  }, [])

  return (
    <View className="flex-1">
      {recipes?.length === 0 ? (
        <Text className="text-center mt-5">No recipes found</Text>
      ) : (
        <MasonryList
          data={recipes}
          keyExtractor={(item) => item.id}
          numColumns={column}
          style={{ gap: 10 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, i }) => (
            <RecipePointItemComponent item={item} index={i} langApp={langApp} />
          )}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({})

export default RecipeListSearchScreenComponent
