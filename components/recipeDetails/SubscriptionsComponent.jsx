import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { UsersIcon } from 'react-native-heroicons/mini'
import { myFormatNumber, showCustomAlert } from '../../constants/halperFunctions'
import { hp, wp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import {
  getCreatoreRecipeDateMyDB,
  getSubscriptionCheckDateMyDB,
  subscribeToCreatorMyDB,
  unsubscribeFromCreatorMyDB,
} from '../../service/getDataFromDB'
import AvatarCustom from '../AvatarCustom'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'

function SubscriptionsComponent({
  subscriber,
  creatorId,
  isPreview = false,
  allRecipeBayCreatore = false,
  recipeDish,
}) {
  const subscriberId = subscriber?.id
  const { currentTheme } = useAuth()
  // console.log("SubscriptionsComponent subscriber ", subscriber);
  // console.log("SubscriptionsComponent subscriber id", subscriber?.id);
  // console.log("SubscriptionsComponent creatorId id", creatorId);
  // console.log("SubscriptionsComponent isPreview", isPreview);

  const router = useRouter()
  // subscriberId={user?.id} creatorId={recipeDish?.publishedId}
  // console.log("subscriberId",subscriberId);

  // get creator data componennt SubscriptionsComponent
  const [creatorData, setCreatorData] = useState({
    creatorId: null,
    creatorName: null,
    creatorAvatar: null,
    creatorSubscribers: null,
  })

  // Состояние подписки
  const [isSubscribed, setIsSubscribed] = useState(false)
  // console.log("isSubscribed", isSubscribed);

  useEffect(() => {
    // Если режим предпросмотра
    if (isPreview) {
      setCreatorData({
        creatorId: subscriber?.id,
        creatorName: subscriber?.user_name,
        creatorAvatar: subscriber?.avatar,
        creatorSubscribers: subscriber?.subscribers,
      })
      return
    }

    // Если subscriber совпадает с creator
    if (subscriber?.id === creatorId) {
      setCreatorData({
        creatorId: subscriber?.id,
        creatorName: subscriber?.user_name,
        creatorAvatar: subscriber?.avatar,
        creatorSubscribers: subscriber?.subscribers,
      })
      return
    }

    // Для других пользователей
    if (subscriber?.id !== creatorId) {
      fetchGetDataCreator(creatorId)
      checkSubscriptionStatus()
      // console.log("creatorData", creatorData);
      // console.log("allRecipeBayCreatore", allRecipeBayCreatore);
    }
  }, [isPreview, creatorId, subscriber, subscriberId])

  useEffect(() => {
    if (subscriberId) {
      // fetchGetDataCreator(creatorId);
      checkSubscriptionStatus()
      // console.log("creatorData", creatorId);
      // console.log("allRecipeBayCreatore subscriberId", subscriberId);
      // console.log("allRecipeBayCreatore", allRecipeBayCreatore);
    }
  }, [allRecipeBayCreatore, subscriberId])

  // Получение данных о создателе
  const fetchGetDataCreator = async (creatorId) => {
    try {
      // console.log("fetchGetDataCreator creatorId", creatorId);

      const { data, success, msg } = await getCreatoreRecipeDateMyDB(creatorId)
      if (!success) throw new Error(msg)

      setCreatorData({
        creatorId,
        creatorName: data?.user_name,
        creatorAvatar: data?.avatar,
        creatorSubscribers: data?.subscribers,
      })
    } catch (error) {
      console.error('Error:', error)
    }
  }

  // Проверка статуса подписки
  const checkSubscriptionStatus = async () => {
    if (!subscriberId || !creatorId) return
    try {
      // console.log("checkSubscriptionStatus subscriberId", subscriberId);

      const { data, success, msg } = await getSubscriptionCheckDateMyDB(subscriberId, creatorId)
      if (!success) throw new Error(msg)

      setIsSubscribed(!!data) // Устанавливаем true, если запись существует
    } catch (error) {
      console.error('Error checking subscription:', error)
      setIsSubscribed(false) // По умолчанию считаем, что не подписан при ошибке
    }
  }

  // Обработка подписки/отписки
  const handleSubscribe = async () => {
    if (isPreview) return // Если режим предпросмотра
    if (subscriber?.id === creatorId) return // Если сам на себя
    if (!subscriber) {
      showCustomAlert(
        'Subscribe',
        `${i18n.t('To subscribe, you need to log in or create an account')}`,
        router,
      )
      return
    }

    try {
      if (isSubscribed) {
        // Отписка
        const { success, msg } = await unsubscribeFromCreatorMyDB(subscriberId, creatorId)
        if (!success) throw new Error(msg)

        setIsSubscribed(false)
        // Перезапрашиваем данные о создателе, так как триггер обновил subscribers
        await fetchGetDataCreator(creatorId)
        // showCustomAlert("Success", "You have unsubscribed.");
      } else {
        // Подписка
        const { success, msg } = await subscribeToCreatorMyDB(subscriberId, creatorId)
        if (!success) throw new Error(msg)

        setIsSubscribed(true)
        // Перезапрашиваем данные о создателе, так как триггер обновил subscribers
        await fetchGetDataCreator(creatorId)
        // showCustomAlert("Success", "You have subscribed.");
      }
    } catch (error) {
      console.error('Error handling subscription:', error)
      showCustomAlert('Error', 'Failed to update subscription. Please try again.')
    }
  }

  const handleGetAllRecipeCreator = () => {
    if (isPreview) return
    router.push({
      pathname: '(main)/AllRecipesBayCreator',
      params: { creator_id: creatorId },
    })
  }

  const nandleRefactorRecipe = () => {
    // console.log("SubscriptionsComponent recipe_id", recipe_id);

    Alert.alert(
      `${i18n.t('Do you want to edit?')}`,
      `${i18n.t('Do you really want to edit your recipe?')}`,
      [
        {
          text: `${i18n.t('Cancel')}`,
          style: 'cancel',
          onPress: () => {},
        },
        {
          text: `${i18n.t('Edit')}`,
          onPress: () =>
            router.push({
              pathname: '(main)/CreateRecipeScreen',
              params: {
                recipeDish: JSON.stringify(recipeDish),
                isRefactorRecipe: 'true',
              },
            }),
          style: 'descructive',
        },
      ],
    )

    // router.push({
    // 	pathname: "(main)/CreateRecipeScreen",
    // 	params: {recipe_id:recipe_id},
    // });
  }

  return (
    <View
      className={`${
        allRecipeBayCreatore ? 'flex-col gap-y-5' : 'flex-row justify-between gap-x-3'
      } items-center  mb-5 flex-1`}
    >
      {/* Блок аватара и информации */}
      {/* <View className={`flex-1 m-w-[50%] flex-row items-center justify-start gap-x-3 `}> */}
      <View
        className={`${
          allRecipeBayCreatore
            ? 'w-full flex-col gap-y-2'
            : 'm-w-[50%] flex-row flex-1 items-center justify-start gap-x-3'
        }   `}
      >
        <View style={shadowBoxBlack()} className="items-center relative">
          <TouchableOpacity
            onPress={() => (!allRecipeBayCreatore ? handleGetAllRecipeCreator() : null)}
            // className=" rounded-full border-2 border-neutral-500"
          >
            <AvatarCustom
              size={hp(allRecipeBayCreatore ? 20 : 10)}
              uri={creatorData?.creatorAvatar}
            />
          </TouchableOpacity>
        </View>

        <View
          className={`${allRecipeBayCreatore ? 'items-center' : 'overflow-hidden w-full   flex-1'}`}
        >
          <View className="flex-row items-center">
            <Text
              numberOfLines={1}
              style={{ fontSize: 14, color: themes[currentTheme]?.textColor }}
              className="font-bold"
            >
              {creatorData.creatorName}
            </Text>
          </View>
          <View className="flex-row items-center">
            <UsersIcon color="grey" />
            <Text className="text-xs font-bold" numberOfLines={1}>
              {' '}
              - {myFormatNumber(creatorData.creatorSubscribers || 0)}
            </Text>
          </View>
        </View>
      </View>

      {/* <TouchableOpacity onPress={handleSubscribe} className="flex-1 m-w-[50%] " style={shadowBoxBlack()}> */}
      {subscriber?.id === creatorId ? (
        <View
          className={`${allRecipeBayCreatore ? 'items-center flex-1 bg-green-500' : 'flex-1 m-w-[50%] '}`}
        >
          <TouchableOpacity
            style={shadowBoxBlack()}
            onPress={isPreview ? null : nandleRefactorRecipe}
          >
            <ButtonSmallCustom
              title={i18n.t('Edit recipe')}
              bg="pink"
              w="100%"
              h={60}
              buttonText={true}
              styleText={{ fontSize: 12, marginLeft: 0 }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleSubscribe}
          className={`${allRecipeBayCreatore ? 'items-center flex-1 ' : 'flex-1 m-w-[50%] '}`}
          style={shadowBoxBlack()}
        >
          <ButtonSmallCustom
            title={isSubscribed ? `${i18n.t('Unsubscribe')}` : `${i18n.t('Subscribe')}`}
            bg={isSubscribed ? 'red' : 'green'}
            w={allRecipeBayCreatore ? wp(80) : '100%'}
            h={60}
            buttonText={true}
            styleText={{ fontSize: 12, marginLeft: 0 }}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({})

export default SubscriptionsComponent
