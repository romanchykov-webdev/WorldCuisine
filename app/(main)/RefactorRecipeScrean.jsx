import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PencilSquareIcon } from 'react-native-heroicons/outline'
import ButtonSmallCustom from '../../components/Buttons/ButtonSmallCustom'
import AddLinkSocialComponent from '../../components/CreateRecipeScreen/AddLinkSocialComponent'
import AddLinkVideo from '../../components/CreateRecipeScreen/AddLinkVideo'

import AddPointGoogleMaps from '../../components/CreateRecipeScreen/AddPintGoogleMaps'
import LinkToTheCopyright from '../../components/CreateRecipeScreen/LinkToTheCopyright'
import SelectCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom'
import HeaderScreanComponent from '../../components/HeaderScreanComponent'
import LoadingComponent from '../../components/loadingComponent'
import SelectLangComponent from '../../components/recipeDetails/SelectLangComponent'
import RefactorAreaComponent from '../../components/RefactorRecipeScrean/RefactorAreaComponent'
import RefactorDescriptionRecipe from '../../components/RefactorRecipeScrean/RefactorDescriptionRecipe'
import RefactorImageHeader from '../../components/RefactorRecipeScrean/RefactorImageHeader'
import RefactorIngredientsComponent from '../../components/RefactorRecipeScrean/RefactorIngredientsComponent'
import RefactorTagsComponent from '../../components/RefactorRecipeScrean/RefactorTagsComponent'
import RefactorTitle from '../../components/RefactorRecipeScrean/RefactorTitle'
import WrapperComponent from '../../components/WrapperComponent'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import {
  getMeasurementCreateRecipeMyDB,
  getRecipesDescriptionMyDB,
} from '../../service/getDataFromDB'
import { deleteRecipeFromMyDB } from '../../service/removeRecipe'
import { updateRecipeToTheServer } from '../../service/uploadDataToTheDB'

// Функция для глубокого сравнения двух значений
function areEqual(a, b) {
  // Если это один и тот же объект или оба undefined/null
  if (a === b) return true

  // Если один из них null или undefined, а другой нет
  if (a == null || b == null) return false

  // Если это массивы
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((item, index) => areEqual(item, b[index]))
  }

  // Если это объекты
  if (typeof a === 'object' && typeof b === 'object') {
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    return keysA.every((key) => areEqual(a[key], b[key]))
  }

  // Для примитивных типов
  return a === b
}

function RefactorRecipeScrean() {
  const router = useRouter()

  const { user } = useAuth()

  const [langApp, setLangApp] = useState(user?.app_lang)

  const [loading, setLoading] = useState(true)

  const [recipeDish, setRecipeDish] = useState(null)
  // console.log("",JSON.stringify(recipeDish,null));

  const [originalRecipe, setOriginalRecipe] = useState(null) // Исходный рецепт

  const params = useLocalSearchParams()

  // Инициализируем totalLangRecipe с текущим языком
  const [totalLangRecipe, setTotalLangRecipe] = useState([langApp])

  // console.log(params);
  const { recipe_id, isRefactorRecipe } = params

  const fetchGetRecipeForRefactoring = async (id) => {
    try {
      const res = await getRecipesDescriptionMyDB(id)
      //
      if (res.success && res.data.length > 0) {
        setRecipeDish(res.data[0])

        // setOriginalRecipe(res.data[0]); // Сохраняем исходный рецепт
        setOriginalRecipe(JSON.parse(JSON.stringify(res.data[0]))) // Глубокая копия
        // console.log("RefactorRecipeScrean res.data[0]", JSON.stringify(res.data[0], null));

        // Обновляем totalLangRecipe, добавляя все языки из ingredients
        const ingredientLangs = res.data[0]?.ingredients?.lang
          ? Object.keys(res.data[0].ingredients.lang)
          : []
        const uniqueLangs = [...new Set([langApp, ...ingredientLangs])]
        setTotalLangRecipe(uniqueLangs)
      } else {
        Alert.alert('Error', 'Recipe not found')
      }
    } catch (error) {
      console.error('Error loading recipe:', error)
      Alert.alert('Error', 'Failed to load recipe')
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 500)
    }
  }

  const [measurement, setMeasurement] = useState([])

  // get all
  const fetchMeasurement = async () => {
    const res = await getMeasurementCreateRecipeMyDB()
    // console.log(res.data);
    setMeasurement(res.data)
  }

  useEffect(() => {
    if (recipe_id && isRefactorRecipe) {
      setLoading(true)
      fetchGetRecipeForRefactoring(recipe_id)
      fetchMeasurement()
    } else {
      setLoading(false)
    }
  }, [recipe_id, isRefactorRecipe])

  const handleLangChange = (lang) => {
    // console.log("RefactorRecipeScrean handleLangChange lang", lang);

    setLangApp(lang)
  }
  // console.log("RefactorRecipeScrean recipeDish?.area", recipeDish?.area);

  // update image header
  const handleImageUpdate = (newImage) => {
    setRecipeDish((prev) => ({ ...prev, image_header: newImage }))
    // console.log("handleImageUpdate recipeDish.image_header", recipeDish.image_header);
  }

  // update header title
  const updateHeaderTitle = async (newTitle, lang) => {
    setRecipeDish((prev) => {
      if (!prev) return prev

      const updatedDish = {
        ...prev,
        title: {
          ...prev.title,
          [lang]: newTitle, // просто перезаписываем по ключу языка
        },
      }

      return updatedDish
    })

    // console.log("Обновленный заголовок:", newTitle, "для языка:", lang);
  }

  // update area text
  const updateAreaText = async (text, lang) => {
    setRecipeDish((prev) => ({
      ...prev,
      area: { ...prev.area, [lang]: text },
    }))
  }

  // update tags
  const updateTags = async (newTags) => {
    setRecipeDish((prev) => ({
      ...prev,
      tags: newTags,
    }))
  }

  const updateIngredients = (updatedData, lang) => {
    setRecipeDish((prev) => ({
      ...prev,
      ingredients: updatedData,
    }))
  }

  const onUpdateDescription = (updateDescription) => {
    setRecipeDish((prev) => ({
      ...prev,
      instructions: updateDescription,
    }))
  }

  const updateLinkVideo = (updateVideo) => {
    // Проверяем, изменилось ли значение, чтобы избежать лишних обновлений
    console.log('updateVideo', updateVideo)
    console.log('recipeDish', recipeDish)

    setRecipeDish((prev) => {
      if (!prev) return prev
      // если ссылка не изменилась — ничего не делаем
      if (areEqual(prev.video, updateVideo)) return prev
      // иначе — возвращаем НОВЫЙ объект состояния
      return { ...prev, video: updateVideo }
    })
  }

  // updateSocialLinks
  const updateSocialLinks = (updateSocialLink) => {
    // console.log("RefactorRecipeScrean updateSocialLinks", updateSocialLink);
    setRecipeDish((prev) => {
      if (areEqual(prev.social_links, updateSocialLink)) {
        return prev
      }
      return {
        ...prev,
        social_links: { ...updateSocialLink },
      }
    })
  }

  // updateCopyring
  const updateCopyring = (updateOldCopering) => {
    // console.log("RefactorRecipeScrean updateSocialLinks", updateOldCopering);
    setRecipeDish((prev) => {
      if (areEqual(prev.link_copyright, updateOldCopering)) {
        return prev
      }
      return {
        ...prev,
        link_copyright: updateOldCopering,
      }
    })
  }

  const updateCoordinates = (updatePoint) => {
    // console.log("RefactorRecipeScrean updatePointMap", updatePoint);
    setRecipeDish((prev) => {
      if (areEqual(prev.map_coordinates, updatePoint)) {
        return prev
      }
      return {
        ...prev,
        map_coordinates: updatePoint,
      }
    })
  }

  // Функция для получения изменённых полей
  const getChangedFields = () => {
    const changedFields = {}

    for (const key in recipeDish) {
      if (key === 'rating' || key === 'likes' || key === 'comments') continue

      if (!areEqual(recipeDish[key], originalRecipe[key])) {
        changedFields[key] = recipeDish[key]
      }
    }

    return changedFields
  }

  const saveRefactor = async () => {
    try {
      setLoading(true)

      // Получаем изменённые поля
      const changedFields = getChangedFields()

      // // Отправляем только изменённые поля
      const response = await updateRecipeToTheServer(recipeDish.id, changedFields)
      if (response.success) {
        setOriginalRecipe(response.data) // Обновляем исходный рецепт
        setRecipeDish(response.data) // Обновляем текущий рецепт
        Alert.alert('Успех', 'Рецепт успешно сохранен!')
        router.replace({
          pathname: 'RecipeDetailsScreen',
          params: { id: recipeDish.id },
        })
      } else {
        throw new Error(response.msg || 'Ошибка при сохранении рецепта')
      }
    } catch (error) {
      console.error('saveRefactor: Error:', error)
      Alert.alert('Ошибка', error.message || 'Не удалось сохранить рецепт')
    } finally {
      setLoading(false)
    }
  }

  const removeRecipe = () => {
    // console.log("RefactorRecipeScreen removeRecipe");
    Alert.alert(i18n.t('Confirm'), i18n.t('Are you sure you want to DELETE this recipe?'), [
      {
        text: i18n.t('Cancel'),
        onPress: () => console.log('Delete cancelled'),
        style: 'cancel',
      },
      {
        text: i18n.t('Delete'),
        onPress: async () => {
          // console.log("RefactorRecipeScreen removeRecipe");
          setLoading(true)
          const res = await deleteRecipeFromMyDB(recipeDish.id)
          // console.log("Delete result:", res);
          if (res.success) {
            setLoading(false)
            Alert.alert(i18n.t('Success'), i18n.t('Recipe deleted successfully'))
            router.replace('/homeScreen') // Перенаправляем на список рецептов
          } else {
            setLoading(false)
            Alert.alert('Error', res.msg || 'Failed to delete recipe')
          }
        },
        style: 'destructive',
      },
    ])
  }

  // Пока данные загружаются, показываем только индикатор загрузки
  if (loading) {
    return (
      <WrapperComponent>
        <LoadingComponent />
      </WrapperComponent>
    )
  }

  // Если данные не загрузились или отсутствуют
  if (!recipeDish) {
    return (
      <WrapperComponent>
        <HeaderScreanComponent titleScreanText="Refactor Recipe" />
        <View className="flex-1 justify-center items-center">
          <Text>No recipe data available</Text>
        </View>
      </WrapperComponent>
    )
  }

  // console.log('recipeDish?.ingredients', recipeDish?.ingredients)
  // console.log('recipeDish', recipeDish?.instructions)
  // console.log('recipeDish?.video', recipeDish?.video)

  return (
    <WrapperComponent>
      <View className="gap-y-5">
        {/* header */}
        <HeaderScreanComponent titleScreanText={i18n.t('Edit')} />

        {/* section select lang */}
        <SelectLangComponent
          recipeDishArea={recipeDish?.area}
          handleLangChange={handleLangChange}
          langApp={langApp}
        />

        {/* top image button back and like */}
        <RefactorImageHeader
          imageUri={recipeDish?.image_header}
          onImageUpdate={handleImageUpdate}
          Icon={PencilSquareIcon}
        />

        {/*    dish and description */}
        <View className="mb-10">
          <RefactorTitle
            title={recipeDish?.title}
            langApp={langApp}
            updateHeaderTitle={updateHeaderTitle}
            Icon={PencilSquareIcon}
          />
        </View>

        {/* refactor Area */}
        <View className="mb-10">
          <RefactorAreaComponent
            area={recipeDish?.area}
            langApp={langApp}
            updateAreaText={updateAreaText}
            Icon={PencilSquareIcon}
          />
        </View>

        {/* tags */}
        <RefactorTagsComponent tags={recipeDish?.tags} updateTags={updateTags} langApp={langApp} />

        {/* block time person cal level */}
        <View className="mb-10">
          <SelectCreateRecipeScreenCustom
            setTotalRecipe={setRecipeDish}
            recipeDish={recipeDish}
            reafctorScrean={true}
          />
        </View>

        {/*    Ingredients */}
        <View className="mb-10">
          <RefactorIngredientsComponent
            langApp={langApp}
            ingredients={recipeDish?.ingredients}
            updateIngredients={updateIngredients}
            iconRefactor={PencilSquareIcon}
            measurement={measurement}
          />
        </View>

        {/* description recipe */}
        <View className="mb-10">
          <RefactorDescriptionRecipe
            descriptionsRecipe={recipeDish?.instructions}
            langApp={langApp}
            Icon={PencilSquareIcon}
            onUpdateDescription={onUpdateDescription}
            recipe={recipeDish}
          />
        </View>

        {/*    add recipe link video */}
        <View className="mb-10">
          <AddLinkVideo
            oldLinkVideo={recipeDish?.video}
            refactorRecipescrean={true}
            updateLinkVideo={updateLinkVideo}
          />
        </View>
      </View>
    </WrapperComponent>
  )
}

const styles = StyleSheet.create({
  styleInput: {
    fontSize: hp(2),
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 20,
    borderRadius: 15,
  },
})

export default RefactorRecipeScrean
