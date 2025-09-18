import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { Animated, FlatList, SafeAreaView, Text, View } from 'react-native'

import ButtonBack from '../../components/ButtonBack'
import LoadingComponent from '../../components/loadingComponent'
import NotificationItem from '../../components/NotificationComponent/NotificationItem'
import TitleScreen from '../../components/TitleScreen'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'

import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import { useNotificationsStore } from '../../stores/notificationsStore'

import {
  useNotificationsInfinite,
  useMarkAsReadMutation,
  useNotificationsRealtime,
} from '../../queries/notifications'
import i18n from '../../lang/i18n'

function NewLikesScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const language = useAuthStore((s) => s.language)
  const currentTheme = useThemeStore((s) => s.currentTheme)

  const unreadLikesCount = useNotificationsStore((s) => s.unreadLikesCount)

  const animatedHeights = useRef({})
  const fadeAnim = useRef({})
  const [switchStates, setSwitchStates] = useState({})

  // лайки
  const {
    data: notifications = [],
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useNotificationsInfinite(user?.id, 'like')
  // список (type = 'like')
  // const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
  //   useNotificationsInfinite(user?.id, 'like')

  // console.log('data', JSON.stringify(data, null))

  // const notifications = data?.pages?.flatMap((p) => p.page) ?? []
  // const notificationIds = notifications.map((n) => n.id).join(',')

  // первичная синхронизация свитчей
  // useEffect(() => {
  //   setSwitchStates((prev) => {
  //     const next = { ...prev }
  //     notifications.forEach((n) => {
  //       if (next[n.id] === undefined) next[n.id] = true
  //     })
  //     // зачистка ключей которых нет в списке
  //     Object.keys(next).forEach((id) => {
  //       if (!notifications.some((n) => String(n.id) === String(id))) delete next[id]
  //     })
  //     return next
  //   })
  // }, [notificationIds])

  // realtime
  useNotificationsRealtime(user?.id, 'like')

  // мутация "прочитано"
  const markAsReadMutation = useMarkAsReadMutation(user?.id, 'like')

  // const toggleReadStatus = async (notificationId, recipeId) => {
  //   // оптимистично
  //   setSwitchStates((s) => ({ ...s, [notificationId]: false }))
  //   try {
  //     await markAsReadMutation.mutateAsync(notificationId)
  //     // элемент уйдёт из списка через onMutate/onSettled
  //     // счётчик обновится через useUnreadCounters(...) если он активен
  //   } catch (e) {
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
            title={`${i18n.t('Your recipes were liked by users')} (${unreadLikesCount})`}
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
              isLiked={true} // чтобы рисовать heart-анимацию
            />
          )}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            minHeight: hp(100),
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-lg mt-5">No new likes</Text>
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

export default NewLikesScreen
