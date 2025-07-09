import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native'
import { AdjustmentsVerticalIcon } from 'react-native-heroicons/mini'
import Animated, { FadeInLeft, FadeInUp } from 'react-native-reanimated'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { getTopRecipeHomeScreenMyDB } from '../../service/getDataFromDB'
import AvatarCustom from '../AvatarCustom'

function TopRecipeComponent() {
  const [topRecipes, setTopRecipes] = useState([])

  const fetchTopRecipe = async () => {
    try {
      const res = await getTopRecipeHomeScreenMyDB()
      // console.log(" TopRecipeComponent res", JSON.stringify(res.data, null));

      setTopRecipes(res.data)
    }
    catch (error) {
      console.error('Error:', error)
    }
  }
  useEffect(() => {
    fetchTopRecipe()
  }, [])

  // Кнопка фильтра
  const filterButton = () => (
    <Animated.View entering={FadeInLeft.delay(100).springify()} className="mr-[10px]">
      <TouchableOpacity
        style={[
          { width: hp(6), height: hp(6), borderWidth: 0.2, marginLeft: 5 },
          shadowBoxBlack({ offset: { width: 2, height: 2 } }),
        ]}
        className="bg-white p-[6px] rounded-full items-center justify-center"
      >
        <AdjustmentsVerticalIcon color="grey" size={30} />
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <View>
      <FlatList
        contentContainerStyle={{
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 10,
          // backgroundColor: "white",
        }}
        horizontal
        data={topRecipes}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <ItemTopRecipe item={item} index={index} />}
        showsHorizontalScrollIndicator={false}
        // ListHeaderComponent={filterButton}
        // ItemSeparatorComponent={() => <View style={{ width: 5 }}></View>}
      />
    </View>
  )
}

function ItemTopRecipe({ item, index }) {
  const router = useRouter()
  const openRecipe = (item_id) => {
    console.log('ItemTopRecipe item id', item_id)
    router.push({
      pathname: 'RecipeDetailsScreen',
      params: { id: item_id },
    })
  }

  return (
    <Animated.View
      entering={FadeInUp.duration(300)
        .delay(index * 300)
        .springify()}
      key={item.id}
    >
      <TouchableOpacity
        // onPress={() => setActiveCategory(category.strCategory)}
        onPress={() => openRecipe(item.full_recipe_id)}
        // key={index}
        // style={shadowBoxBlack()}
        className="flex-1 items-center "
      >
        <View
          // className="rounded-full p-[6] bg-neutral-300"
          className={`rounded-full p-[6] `}
          style={shadowBoxBlack()}
        >
          <AvatarCustom uri={item.image_header} size={hp(6)} style={{ borderWidth: 0.2 }} rounded={50} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({})

export default TopRecipeComponent
