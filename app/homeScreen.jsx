import { StatusBar } from 'expo-status-bar'

import { useEffect, useState } from 'react'
import { Platform, RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native'

import HeaderComponent from '../components/HeaderComponent'
import LoadingComponent from '../components/loadingComponent'
import RecipesMasonryComponent from '../components/RecipesMasonry/RecipesMasonryComponent'

import SearchComponent from '../components/SearchComponent'

import TopRecipeComponent from '../components/topRecipe/TopRecipeComponent'
import { hp, wp } from '../constants/responsiveScreen'
import { themes } from '../constants/themes'
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import i18n from '../lang/i18n'
import { useCategories } from '../queries/recipes'

function HomeScreen() {
  // Zustand
  const user = useAuthStore((s) => s.user)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const unreadCommentsCount = 0
  const unreadLikesCount = 0

  // язык берём из профиля пользователя или оставляем текущий
  const langDev = user?.app_lang || i18n.locale
  useEffect(() => {
    i18n.locale = langDev
  }, [langDev])
  const isAuth = !!user

  // Zustand

  const { data: categoryRecipes, isLoading, isFetching, refetch } = useCategories(langDev)

  // if (__DEV__) useLogQueries('home')
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
            refreshing={isFetching}
            onRefresh={refetch}
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
              categoryRecipes={categoryRecipes || {}}
              langApp={user?.app_lang ?? langDev}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen
