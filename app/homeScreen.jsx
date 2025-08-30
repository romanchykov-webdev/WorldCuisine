import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import { Platform, RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native'
import HeaderComponent from '../components/HeaderComponent'
// translate
import LoadingComponent from '../components/loadingComponent'
import RecipesMasonryComponent from '../components/RecipesMasonry/RecipesMasonryComponent'

import SearchComponent from '../components/SearchComponent'

import TopRecipeComponent from '../components/topRecipe/TopRecipeComponent'
import { hp, wp } from '../constants/responsiveScreen'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'
import i18n from '../lang/i18n'
import { getCategoriesMyDB, getCategoryRecipeMasonryMyDB } from '../service/getDataFromDB'

function HomeScreen() {
  const { user, unreadCommentsCount, unreadLikesCount, currentTheme } = useAuth()
  // const router = useRouter();

  const { language: langDev } = useAuth()
  useEffect(() => {
    i18n.locale = langDev // Устанавливаем текущий язык
  }, [langDev])

  const [isAuth, setIsAuth] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false) // Состояние для отслеживания процесса обновления
  const [isLoading, setIsLoading] = useState(false) // Состояние для отслеживания загрузки данных

  const [activeCategory, setActiveCategory] = useState('Beef')

  const [categories, setCategories] = useState(null)
  // console.log('homescreen user',user)

  const changeLanguage = (newLocale) => {
    if (newLocale !== undefined) {
      i18n.locale = newLocale
      // console.log("homescreen newLocale", newLocale);
    } else {
      i18n.locale = 'en'
      console.log('homescreen newLocale else i18n undefine', newLocale)
    }

    // Здесь можно обновить состояние компонента, чтобы интерфейс обновился
  }

  useEffect(() => {
    if (user) {
      setIsAuth(true)
      changeLanguage(user.app_lang)
      // console.log("HomeScreen useEffect if user");
    } else if (!user && !isAuth) {
      setIsAuth(false)
    }
  }, [user, isAuth])

  // get all categories
  const getAllCategories = async () => {
    const res = await getCategoriesMyDB()
    setCategories(res.data)
    // console.log('home screen categories',res)
    // console.log("home screen categories", res);
  }

  const [categoryRecipes, setCategoryRecipes] = useState([])

  const fetchCategoryRecipeMasonry = async () => {
    const res = await getCategoryRecipeMasonryMyDB(user?.app_lang ?? langDev)
    setCategoryRecipes(res.data)
  }

  useEffect(() => {
    getAllCategories()
    fetchCategoryRecipeMasonry()
  }, [])

  // const handleChangeCategory = (category) => {
  const handleChangeCategory = (category) => {
    setActiveCategory(category)
    setRecipes([]) // Очищаем рецепты при смене категории

    fetchRecipes(activeCategory)
  }
  // Используем useEffect для вызова fetchRecipes, когда activeCategory изменяется
  useEffect(() => {
    // fetchRecipes(activeCategory)
  }, [activeCategory]) // Следим за изменением activeCategory

  // Функция для обновления данных при свайпе вниз
  const onRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true) // Устанавливаем загрузку в true
    await getAllCategories() // Загрузка категорий
    // await fetchRecipes(activeCategory);  // Загрузка рецептов
    await fetchCategoryRecipeMasonry()
    setIsRefreshing(false) // Завершаем процесс обновления

    setTimeout(() => {
      setIsLoading(false) // Завершаем процесс загрузки
    }, 1000)
  }
  // console.log('currentTheme.backgroundColor',themes[currentTheme]?.backgroundColor)

  return (
    <SafeAreaView style={{ backgroundColor: themes[currentTheme]?.backgroundColor, flex: 1 }}>
      <StatusBar style={currentTheme === 'dark' ? 'light' : 'dark'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Platform.OS === 'ios' ? 15 : 50,
          marginBottom: Platform.OS === 'ios' ? 15 : 50,
          marginTop: Platform.OS === 'ios' ? 15 : 50,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            // Кастомизация под тему
            tintColor={themes[currentTheme]?.textColor} // iOS спиннер
            title="" // iOS подпись, если нужна
            colors={[themes[currentTheme]?.textColor || '#000']} // Android спиннер
            progressBackgroundColor={themes[currentTheme]?.backgroundColor}
          />
        }
      >
        {/* Лоадер */}
        {isLoading ? (
          <View
            style={{
              width: wp(100),
              height: hp(100),
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // className="bg-red-500 absolute top-0 left-0 w-full h-full flex-1"
          >
            <LoadingComponent size="large" color="green" />
          </View>
        ) : (
          <>
            {/* avatar snd ball */}
            <HeaderComponent
              isAuth={isAuth}
              user={user}
              unreadCommentsCount={unreadCommentsCount}
              unreadLikesCount={unreadLikesCount}
            />

            {/*    greetings and punchline */}
            <View gap-y-2>
              <View>
                <Text
                  style={{
                    fontSize: hp(3),
                    color: themes[currentTheme]?.textColor,
                  }}
                  className="font-semibold "
                >
                  {i18n.t('Make your own food')},
                </Text>
                <Text
                  style={{
                    fontSize: hp(3),
                    color: themes[currentTheme]?.textColor,
                  }}
                  className="font-semibold"
                >
                  {i18n.t('stay at')} <Text className="text-amber-500">{i18n.t('home')}</Text>
                </Text>
              </View>
            </View>

            {/* ?search bar */}
            <SearchComponent />

            {/*    categories */}
            <TopRecipeComponent />

            {/*    RecipesMasonryComponent */}
            <RecipesMasonryComponent
              categoryRecipes={categoryRecipes}
              langApp={user?.app_lang ?? langDev}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
