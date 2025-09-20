import { useRouter } from 'expo-router'
import React, { useRef } from 'react'
import { FlatList, Text, View } from 'react-native'
import ButtonBack from '../../components/ButtonBack'
import LoadingComponent from '../../components/loadingComponent'
import NotificationItem from '../../components/NotificationComponent/NotificationItem'
import TitleScreen from '../../components/TitleScreen'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import { useAuthStore } from '../../stores/authStore'
import {
  useNotificationsInfinite,
  useMarkAsReadMutation,
  useNotificationsRealtime,
} from '../../queries/notifications'
import { useNotificationsStore } from '../../stores/notificationsStore'
import { useThemeColors } from '../../stores/themeStore'

//
import { useState } from 'react'
import WrapperComponent from '../../components/WrapperComponent'

function NewCommentsScreen() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const language = useAuthStore((s) => s.language)
  const colors = useThemeColors()

  const unreadCommentsCount = useNotificationsStore((s) => s.unreadCommentsCount)

  const setUnread = useNotificationsStore((s) => s.setUnread)

  const animatedHeights = useRef({})
  const fadeAnim = useRef({})

  const [switchStates, setSwitchStates] = useState({})

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
    <WrapperComponent scroll={false} marginTopAnd={20}>
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
          // data={notifications}
          data={Array.isArray(notifications) ? notifications : []}
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
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 20,
            minHeight: hp(100),
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              className="text-center text-lg mt-5"
              style={{ color: colors.textColor }}
            >
              No new comments
            </Text>
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isFetchingNextPage ? <LoadingComponent color="green" /> : null
          }
        />
      )}
    </WrapperComponent>
  )
}

export default NewCommentsScreen
