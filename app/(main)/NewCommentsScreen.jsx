import { useRouter } from 'expo-router'
import { useRef } from 'react'
import { FlatList, SafeAreaView, Text, View } from 'react-native'
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

//
import { useEffect, useState } from 'react'

function NewCommentsScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const language = useAuthStore((s) => s.language)
  const currentTheme = useThemeStore((s) => s.currentTheme)

  const unreadCommentsCount = useNotificationsStore((s) => s.unreadCommentsCount)

  const setUnread = useNotificationsStore((s) => s.setUnread)

  const animatedHeights = useRef({})
  const fadeAnim = useRef({})

  const [switchStates, setSwitchStates] = useState({})

  // React Query: список
  // const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
  //   useNotificationsInfinite(user?.id, 'comment')
  //
  // const notifications = data?.pages?.flatMap((p) => p.page) ?? []
  // const notificationIds = notifications.map((n) => n.id).join(',')

  // useEffect(() => {
  //   setSwitchStates((prev) => {
  //     const next = { ...prev }
  //     notifications.forEach((n) => {
  //       if (next[n.id] === undefined) next[n.id] = true
  //     })
  //     Object.keys(next).forEach((id) => {
  //       if (!notifications.some((n) => String(n.id) === String(id))) {
  //         delete next[id]
  //       }
  //     })
  //     return next
  //   })
  // }, [notificationIds])

  // комменты
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

  // const toggleReadStatus = async (notificationId, recipeId) => {
  //   setSwitchStates((s) => ({ ...s, [notificationId]: false }))
  //   try {
  //     await markAsReadMutation.mutateAsync(notificationId)
  //     // уменьшаем локальный zustand-счётчик
  //     setUnread('comment', Math.max(unreadCommentsCount - 1, 0))
  //   } catch (e) {
  //     // откат свитч, если ошибка
  //     setSwitchStates((s) => ({ ...s, [notificationId]: true }))
  //     console.warn('markAsRead error:', e?.message || e)
  //   }
  // }
  const toggleReadStatus = async (id) => {
    setSwitchStates((s) => ({ ...s, [id]: false }))
    try {
      await markAsReadMutation.mutateAsync(id)
    } catch {
      setSwitchStates((s) => ({ ...s, [id]: true }))
    }
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
          renderItem={({ item, index }) => (
            <NotificationItem
              item={item}
              index={index}
              animatedHeights={animatedHeights}
              fadeAnim={fadeAnim}
              switchStates={switchStates}
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
