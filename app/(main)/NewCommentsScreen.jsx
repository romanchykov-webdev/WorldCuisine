import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { Animated, FlatList, SafeAreaView, Text, View } from 'react-native'
import ButtonBack from '../../components/ButtonBack'
import LoadingComponent from '../../components/loadingComponent'
import NotificationItem from '../../components/NotificationComponent/NotificationItem'
import TitleScreen from '../../components/TitleScreen'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import i18n from '../../lang/i18n'
import { useAuthStore } from '../../stores/authStore'
import {
  useNotificationsInfinite,
  useMarkAsReadMutation,
  useNotificationsRealtime,
} from '../../queries/notifications'
import { useNotificationsStore } from '../../stores/notificationsStore'
import { useThemeStore } from '../../stores/themeStore'

function NewCommentsScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const language = useAuthStore((s) => s.language)
  const currentTheme = useThemeStore((s) => s.currentTheme)

  const unreadCommentsCount = useNotificationsStore((s) => s.unreadCommentsCount)

  const animatedHeights = useRef({})
  const fadeAnim = useRef({})

  // React Query: список
  const {
    data: notifications = [],
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useNotificationsInfinite(user?.id, 'comment')

  // Реалтайм подписка
  useNotificationsRealtime(user?.id, 'comment')

  // Мутация "прочитано"
  const markAsReadMutation = useMarkAsReadMutation(user?.id, 'comment')

  const toggleReadStatus = async (notificationId, recipeId) => {
    // твоя анимация схлопывания как и была...
    await markAsReadMutation.mutateAsync(notificationId)
  }

  const navigateToRecipe = (recipeId) => {
    router.push({
      pathname: 'RecipeDetailsScreen',
      params: { id: recipeId, langApp: language },
    })
  }

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage()
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: themes[currentTheme]?.backgroundColor }}
    >
      <View className="px-[20] border-b border-b-neutral-300 mb-5 pb-5">
        <View style={shadowBoxBlack()} className="mb-5">
          <ButtonBack />
        </View>
        <View className="items-center">
          <TitleScreen
            title={`${i18n.t('Last Comments')} (${unreadCommentsCount})`}
            styleTitle={{ textAlign: 'center' }}
          />
        </View>
      </View>

      {isLoading ? (
        <LoadingComponent color="green" />
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem
              item={item}
              animatedHeights={animatedHeights}
              fadeAnim={fadeAnim}
              switchStates={{}} // можно убрать если не нужен
              onToggleRead={toggleReadStatus}
              onNavigate={navigateToRecipe}
            />
          )}
          // keyExtractor={(item) => item.id}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            minHeight: hp(100),
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-lg mt-5">No new comments</Text>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingNextPage ? <LoadingComponent color="green" /> : null
          }
        />
      )}
    </SafeAreaView>
  )
}

export default NewCommentsScreen
