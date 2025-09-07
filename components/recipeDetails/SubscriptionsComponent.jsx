import { TouchableOpacity, View, Text, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import i18n from '../../lang/i18n'
import { shadowBoxBlack } from '../../constants/shadow'
import AvatarCustom from '../AvatarCustom'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import { UsersIcon } from 'react-native-heroicons/mini'
import { hp, wp } from '../../constants/responsiveScreen'
import { useSubscription, useCreatorData } from '../../queries/recipeDetails'
import { useAuthStore } from '../../stores/authStore'
import { themes } from '../../constants/themes'
import { useThemeStore } from '../../stores/themeStore'
import { formatNumber } from '../../utils/numberFormat'

function SubscriptionsComponent({
  creatorId,
  isPreview = false,
  allRecipeBayCreatore = false,
  recipeDish,
}) {
  // console.log('SubscriptionsComponent creatorId', creatorId)
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const currentTheme = useThemeStore((s) => s.currentTheme)

  // preview: показываем данные автора = сам пользователь
  const subscriberId = user?.id
  const { data: creator } = useCreatorData(isPreview ? subscriberId : creatorId)
  const { check, subscribe, unsubscribe, isLoading } = useSubscription(
    subscriberId,
    creatorId,
  )

  const isSelf = subscriberId && creatorId && subscriberId === creatorId
  const isSubscribed = check.data ?? false

  const onToggleSubscribe = () => {
    if (isPreview || isSelf) return
    if (!subscriberId) {
      router.push('/(auth)/LogInScreen')
      return
    }
    isSubscribed ? unsubscribe.mutate() : subscribe.mutate()
  }

  const editOwn = () => {
    if (isPreview) return
    Alert.alert(
      i18n.t('Do you want to edit?'),
      i18n.t('Do you really want to edit your recipe?'),
      [
        { text: i18n.t('Cancel'), style: 'cancel' },
        {
          text: i18n.t('Edit'),
          style: 'destructive',
          onPress: () =>
            router.push({
              pathname: '(main)/CreateRecipeScreen',
              params: {
                recipeDish: JSON.stringify(recipeDish),
                isRefactorRecipe: 'true',
              },
            }),
        },
      ],
    )
  }

  const goByCreator = () => {
    router.push({
      pathname: '(main)/AllRecipesBayCreator',
      params: {
        creatorId: creatorId,
      },
    })
  }
  return (
    <View
      className={`${allRecipeBayCreatore ? 'flex-col gap-y-5' : 'flex-row justify-between gap-x-3'} items-center mb-5 flex-1`}
    >
      <View
        className={`${allRecipeBayCreatore ? 'w-full flex-col gap-y-2' : 'm-w-[50%] flex-row flex-1 items-center justify-start gap-x-3'}`}
      >
        <TouchableOpacity
          onPress={goByCreator}
          style={shadowBoxBlack()}
          className="items-center relative "
        >
          <AvatarCustom
            size={hp(allRecipeBayCreatore ? 20 : 10)}
            uri={creator?.creatorAvatar}
          />
        </TouchableOpacity>

        <View
          className={`${allRecipeBayCreatore ? 'items-center' : 'overflow-hidden w-full flex-1'}`}
        >
          <View className="flex-row items-center">
            <Text
              numberOfLines={1}
              style={{ fontSize: 14, color: themes[currentTheme]?.textColor }}
              className="font-bold"
            >
              {creator?.creatorName}
            </Text>
          </View>
          <View className="flex-row items-center">
            <UsersIcon color="grey" />
            <Text className="text-xs font-bold" numberOfLines={1}>
              {' '}
              - {formatNumber(creator?.creatorSubscribers || 0)}
            </Text>
          </View>
        </View>
      </View>

      {isSelf ? (
        <View
          className={`${allRecipeBayCreatore ? 'items-center flex-1' : 'flex-1 m-w-[50%]'}`}
        >
          <TouchableOpacity style={shadowBoxBlack()} onPress={editOwn}>
            <ButtonSmallCustom
              title={i18n.t('Edit recipe')}
              bg="pink"
              w="100%"
              h={60}
              buttonText
              styleText={{ fontSize: 12, marginLeft: 0 }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={onToggleSubscribe}
          className={`${allRecipeBayCreatore ? 'items-center flex-1' : 'flex-1 m-w-[50%]'}`}
          style={shadowBoxBlack()}
          disabled={isLoading}
        >
          <ButtonSmallCustom
            title={isSubscribed ? i18n.t('Unsubscribe') : i18n.t('Subscribe')}
            bg={isLoading ? 'gray' : isSubscribed ? 'red' : 'green'}
            w={allRecipeBayCreatore ? wp(80) : '100%'}
            h={60}
            buttonText
            styleText={{ fontSize: 12, marginLeft: 0 }}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default SubscriptionsComponent
