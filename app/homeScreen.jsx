import { StatusBar } from 'expo-status-bar'

import {
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native'

import HeaderComponent from '../components/HeaderComponent'
import LoadingComponent from '../components/loadingComponent'
import RecipesMasonryComponent from '../components/RecipesMasonry/RecipesMasonryComponent'

import SearchComponent from '../components/SearchComponent'

import TopRecipeComponent from '../components/topRecipe/TopRecipeComponent'
import { hp, wp } from '../constants/responsiveScreen'

import i18n from '../lang/i18n'
import { useCategories } from '../queries/recipes'

import { useAuthStore } from '../stores/authStore'
import { useThemeColors, useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'
import { useNotificationsStore } from '../stores/notificationsStore'

function HomeScreen() {
  const colors = useThemeColors()

  // Zustand

  const user = useAuthStore((s) => s.user)

  const currentTheme = useThemeStore((s) => s.currentTheme)

  const lang = useLangStore((s) => s.lang)

  const isAuth = !!user

  // counter comments
  const unreadCommentsCount = useNotificationsStore((s) => s.unreadCommentsCount)
  // counter likes
  const unreadLikesCount = useNotificationsStore((s) => s.unreadLikesCount)

  // Zustand

  const { data: categoryRecipes, isLoading, isFetching, refetch } = useCategories(lang)
  return (
    <SafeAreaView style={{ backgroundColor: colors.backgroundColor, flex: 1 }}>
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
            tintColor={colors.textColor}
            colors={[colors.textColor || '#000']}
            progressBackgroundColor={colors.backgroundColor}
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
          >
            <LoadingComponent size="large" color="green" />
          </View>
        ) : (
          <>
            {/* avatar snd ball */}
            <HeaderComponent
              isAuth={isAuth}
              user={user}
              colors={colors}
              unreadCommentsCount={unreadCommentsCount}
              unreadLikesCount={unreadLikesCount}
            />

            {/*    greetings and punchline */}
            <View gap-y-2>
              <View>
                <Text
                  style={{
                    fontSize: hp(3),
                    color: colors.textColor,
                  }}
                  className="font-semibold "
                >
                  {i18n.t('Make your own food')},
                </Text>
                <Text
                  style={{
                    fontSize: hp(3),
                    color: colors.textColor,
                  }}
                  className="font-semibold"
                >
                  {i18n.t('stay at')}{' '}
                  <Text className="text-amber-500">{i18n.t('home')}</Text>
                </Text>
              </View>
            </View>

            {/* search bar */}
            <SearchComponent />

            {/*    categories */}
            <TopRecipeComponent />

            {/*    RecipesMasonryComponent */}
            <RecipesMasonryComponent
              categoryRecipes={categoryRecipes || []}
              langApp={user?.app_lang ?? lang}
              loading={isLoading}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
export default HomeScreen
