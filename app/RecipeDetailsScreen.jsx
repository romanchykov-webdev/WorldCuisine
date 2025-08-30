import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/mini'
import { ChatBubbleOvalLeftIcon, StarIcon } from 'react-native-heroicons/outline'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
import AvatarCustom from '../components/AvatarCustom'

import ButtonBack from '../components/ButtonBack'
import ButtonLike from '../components/ButtonLike'
// translate
import ButtonSmallCustom from '../components/Buttons/ButtonSmallCustom'

import LoadingComponent from '../components/loadingComponent'
import RatingComponents from '../components/RatingComponents'
import CommentsComponent from '../components/recipeDetails/CommentsComponent'

import LinkCopyrightComponent from '../components/recipeDetails/LinkCopyrightComponent'

import RecipeIngredients from '../components/recipeDetails/RecipeIngredients'
import RecipeInstructions from '../components/recipeDetails/RecipeInstructions'
import SelectLangComponent from '../components/recipeDetails/SelectLangComponent'
import SocialLinksComponent from '../components/recipeDetails/SocialLinksComponent'

import SubscriptionsComponent from '../components/recipeDetails/SubscriptionsComponent'
import VideoCustom from '../components/recipeDetails/video/VideoCustom'
import { hp, wp } from '../constants/responsiveScreen'
import { shadowBoxBlack, shadowTextSmall } from '../constants/shadow'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'
import i18n from '../lang/i18n'
import {
  getRecipesDescriptionLikeRatingMyDB,
  getRecipesDescriptionMyDB,
} from '../service/getDataFromDB'
import MapCoordinatesComponent from '../components/recipeDetails/MapCoordinatesComponent'

function RecipeDetailsScreen({ totalRecipe }) {
  const [loading, setLoading] = useState(true)

  const [recipeDish, setRecipeDish] = useState(null)
  // console.log("RecipeDetailsScreen recipeDish", JSON.stringify(recipeDish, null));

  const [rating, setRating] = useState(0)

  const scrollViewRef = useRef(null)
  const commentsRef = useRef(null)

  const { user, language, previewRecipeReady, setPreviewRecipeReady, currentTheme } = useAuth()

  const params = useLocalSearchParams()
  const { id, currentLang, totalRecipe: totalRecipeString, preview } = params

  const isPreview = preview === 'true' || preview === true

  // console.log("RecipeDetailsScreen params", params);

  const [langApp, setLangApp] = useState(user?.app_lang ?? language)

  // Парсинг totalRecipe с проверкой
  const parsedTotalRecipe = useMemo(() => {
    if (!totalRecipeString) return null
    try {
      const parsed = JSON.parse(totalRecipeString)
      if (typeof parsed !== 'object' || parsed === null) {
        console.error('Некорректная структура :', parsed)
        return null
      }
      return parsed
    } catch (error) {
      console.error('Ошибка парсинга totalRecipe:', error)
      return null
    }
  }, [totalRecipeString])

  // Обновление количества лайков/комментариев
  const updateLikeCommentCount = async (payload) => {
    if (isPreview === true) return // если это предпросмотр

    const res = await getRecipesDescriptionLikeRatingMyDB({ id, payload })

    if (payload === 'updateCommentsCount') {
      // Обновляем состояние с новым количеством комментариев
      setRecipeDish((prevRecipeDish) => ({
        ...prevRecipeDish,
        comments: res.data[0].comments, // Обновляем только поле comments
      }))
    }
  }

  // scroll xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  const scrollToComments = () => {
    if (isPreview) return // если это предпросмотр

    commentsRef.current?.measureLayout(scrollViewRef.current.getNativeScrollRef(), (x, y) => {
      scrollViewRef.current.scrollTo({ y, animated: true }) // Плавный скролл
    })
  }

  // Загрузка данных
  useEffect(() => {
    const loadRecipeDish = async () => {
      // setLoading(true); // Устанавливаем loading в true перед началом загрузки
      try {
        if (isPreview && parsedTotalRecipe) {
          setRecipeDish(parsedTotalRecipe)
          // setDataSource("preview");
        } else if (id) {
          const response = await getRecipesDescriptionMyDB(id)
          // console.log("RecipeDetailsScreen response", response);

          setRecipeDish(response?.data[0] || null)
          setRating(response?.data[0].rating ?? 0)
        }
      } catch (error) {
        console.error('Ошибка загрузки рецепта:', error)
        setRecipeDish(null) // В случае ошибки устанавливаем null
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }

    loadRecipeDish()
  }, [id, isPreview, parsedTotalRecipe]) // Зависимости: только id, isPreview и parsedTotalRecipe

  const handleLangChange = (lang) => {
    setLangApp(lang)
  }
  if (loading) {
    return (
      <View style={{ flex: 1, height: hp(100), width: wp(100) }}>
        <LoadingComponent color="green" />
      </View>
    )
  }
  // console.log('RecipeDetailsScreen recipeDish', recipeDish)

  return (
    <ScrollView
      ref={scrollViewRef} // for scroll
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
        backgroundColor: themes[currentTheme]?.backgroundColor,
        paddingHorizontal: wp(3),
        minHeight: hp(120), // Минимальная высота, но не фиксированная
        flexGrow: 1, // Позволяет содержимому расти
      }}
    >
      <StatusBar style="dark" />
      {loading || recipeDish === null ? (
        <View
          style={{
            backgroundColor: themes[currentTheme]?.backgroundColor,
          }}
        >
          <LoadingComponent size="large" color="green" />
        </View>
      ) : (
        <View className="gap-y-5" key={id}>
          {/* top image button back and like */}
          <View className="flex-row justify-center items-center relative" style={shadowBoxBlack()}>
            <Animated.View entering={FadeInUp.duration(400).delay(100)}>
              {isPreview ? (
                <Image
                  source={{
                    uri: recipeDish?.image_header,
                  }}
                  transition={100}
                  style={{
                    width: wp(98),
                    height: hp(50),
                    borderRadius: 40,
                    marginTop: wp(1),
                    borderWidth: 0.5,
                    borderColor: 'gray',
                  }}
                />
              ) : (
                <AvatarCustom
                  uri={recipeDish?.image_header}
                  style={{
                    width: wp(98),
                    height: hp(50),
                    borderRadius: 40,
                    marginTop: wp(1),
                    borderWidth: 0.5,
                    borderColor: 'gray',
                  }}
                />
              )}
            </Animated.View>
            <LinearGradient
              colors={['transparent', '#18181b']}
              style={{
                width: wp(98),
                height: '20%',
                position: 'absolute',
                top: wp(1),
                borderRadius: 40,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
            />
            <Animated.View
              entering={FadeInUp.duration(400).delay(500)}
              className="absolute flex-row justify-between top-[60] pl-5 pr-5  w-full
                          {/*bg-red-500*/}
                          "
            >
              <ButtonBack />

              <ButtonLike
                isPreview={isPreview}
                user={user ?? null}
                recipeId={recipeDish?.id ?? null}
                totalCountLike={recipeDish?.likes}
              />
            </Animated.View>

            {/*    rating Star and comments */}
            <Animated.View
              entering={FadeInDown.duration(400).delay(500)}
              className="absolute flex-row justify-between bottom-[20] pl-5 pr-5  w-full
                          {/*bg-red-500*/}
                          "
            >
              {/*    StarIcon */}
              <View
                className="items-center justify-center flex-row w-[60] h-[60] rounded-full relative"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      fontWeight: 'bold',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {rating}
                  </Text>
                </View>
                <StarIcon size={45} color="gold" />
              </View>

              {/*    comments quantity */}
              <View
                className="items-center justify-center flex-row w-[60] h-[60] rounded-full"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.7)',
                }}
              >
                <TouchableOpacity
                  className="items-center justify-center flex-row"
                  onPress={scrollToComments}
                >
                  <ChatBubbleOvalLeftIcon size={45} color="gray" />
                  <Text style={{ fontSize: 8 }} className="text-neutral-700 absolute">
                    {recipeDish?.comments}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
          {/* ratings */}
          <RatingComponents
            isPreview={isPreview}
            rating={rating}
            user={user ?? null}
            recipeId={id}
          />
          {/* section Subscriptions */}
          <Animated.View entering={FadeInDown.delay(550)}>
            <SubscriptionsComponent
              isPreview={isPreview}
              subscriber={user ?? null}
              creatorId={recipeDish?.published_id}
              recipeDish={recipeDish}
            />
          </Animated.View>
          {/* section select lang */}
          <Animated.View entering={FadeInDown.delay(570)}>
            <SelectLangComponent
              recipeDishArea={recipeDish?.area}
              handleLangChange={handleLangChange}
              langApp={langApp}
            />
          </Animated.View>
          {/*    dish and description */}
          <Animated.View
            entering={FadeInDown.delay(600)}
            className="px-4 flex justify-between gap-y-5 "
          >
            {/* name and area */}
            <View className="gap-y-2">
              <Text
                style={[
                  {
                    fontSize: hp(2.7),
                    color: themes[currentTheme]?.textColor,
                  },
                  shadowTextSmall(),
                ]}
                className="font-bold"
              >
                {recipeDish?.title?.[langApp] || recipeDish?.title?.en || 'No title'}
              </Text>
              <Text
                style={{
                  fontSize: hp(1.8),
                  color: themes[currentTheme]?.secondaryTextColor,
                }}
                className="font-medium text-neutral-500"
              >
                {recipeDish?.area?.[langApp] || recipeDish?.area?.en || 'No area'}
              </Text>
            </View>
          </Animated.View>
          {/*time per cal level*/}
          <Animated.View entering={FadeInDown.delay(700)} className="flex-row justify-around">
            {/*time*/}
            <View
              className="flex rounded-full bg-amber-300  p-1 items-center"
              style={shadowBoxBlack()}
            >
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{
                  width: hp(6.5),
                  height: hp(6.5),
                }}
              >
                <ClockIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>

              {/*    descriptions */}
              <View className="flex items-center py-2 gap-y-1">
                <Text style={{ fontSize: hp(2) }} className="font-bold  text-neutral-700">
                  {/* 35 */}
                  {recipeDish?.recipe_metrics?.time}
                </Text>
                <Text style={{ fontSize: hp(1.2) }} className="font-bold  text-neutral-500">
                  {i18n.t('Mins')}
                </Text>
              </View>
            </View>
            {/*    persons*/}
            <View
              className="flex rounded-full bg-amber-300  p-1 items-center"
              style={shadowBoxBlack()}
            >
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{
                  width: hp(6.5),
                  height: hp(6.5),
                }}
              >
                <UsersIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>

              {/*    descriptions */}
              <View className="flex items-center py-2 gap-y-1">
                <Text style={{ fontSize: hp(2) }} className="font-bold  text-neutral-700">
                  {recipeDish?.recipe_metrics?.serv}
                </Text>
                <Text
                  style={{ fontSize: hp(1.2) }}
                  className="font-bold  text-neutral-500
                              {/*bg-red-500*/}
                              "
                >
                  {i18n.t('Person')}
                </Text>
              </View>
            </View>
            {/* calories */}
            <View
              className="flex rounded-full bg-amber-300  p-1 items-center

                      "
              style={shadowBoxBlack()}
            >
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{
                  width: hp(6.5),
                  height: hp(6.5),
                }}
              >
                <FireIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>

              {/*    descriptions */}
              <View className="flex items-center py-2 gap-y-1">
                <Text style={{ fontSize: hp(2) }} className="font-bold  text-neutral-700">
                  {recipeDish?.recipe_metrics?.cal}
                </Text>
                <Text
                  style={{ fontSize: hp(1.2) }}
                  className="font-bold  text-neutral-500
                              {/*bg-red-500*/}
                              "
                >
                  {i18n.t('Cal')}
                </Text>
              </View>
            </View>
            {/* level */}
            <View
              className="flex rounded-full bg-amber-300  p-1 items-center"
              style={shadowBoxBlack()}
            >
              <View
                className="bg-white rounded-full flex items-center justify-around"
                style={{
                  width: hp(6.5),
                  height: hp(6.5),
                }}
              >
                <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="gray" />
              </View>

              {/*    descriptions */}
              <View className="flex items-center py-2 gap-y-1">
                <Text style={{ fontSize: hp(2) }} className="font-bold  text-neutral-700"></Text>
                <Text
                  style={{ fontSize: hp(1.2) }}
                  className="font-bold  text-neutral-500
                              {/*bg-red-500*/}
                              "
                >
                  {i18n.t(`${recipeDish?.recipe_metrics?.level}`)}
                </Text>
              </View>
            </View>
          </Animated.View>
          {/*    ingredients*/}
          <Animated.View entering={FadeInDown.delay(800)} className="gap-y-4 ">
            <Text
              style={[
                {
                  fontSize: hp(2.5),
                  color: themes[currentTheme]?.textColor,
                },
                shadowTextSmall(),
              ]}
              className="font-bold px-4 "
            >
              {i18n.t('Ingredients')}
            </Text>

            {/*    */}
            <View className="gap-y-2">
              <RecipeIngredients recIng={recipeDish?.ingredients} langDev={langApp} />
            </View>
          </Animated.View>
          {/* instructions   */}
          <Animated.View entering={FadeInDown.delay(800)} className="gap-y-4 ">
            <RecipeInstructions
              isPreview={isPreview}
              instructions={recipeDish?.instructions}
              langDev={langApp}
            />
          </Animated.View>
          {/*    recipe video */}
          {recipeDish?.video && (
            <View className="mb-5">
              <VideoCustom video={recipeDish?.video} />
            </View>
          )}
          {/*    LinkCopyrightComponent*/}
          {recipeDish?.link_copyright && (
            <View className="mb-5">
              <LinkCopyrightComponent linkCopyright={recipeDish?.link_copyright} />
            </View>
          )}
          {/*   MapСordinatesComponent */}
          {recipeDish?.map_coordinates && (
            <View className="mb-5">
              <MapCoordinatesComponent mapLink={recipeDish?.map_coordinates} />
            </View>
          )}

          {/*    social_links block*/}
          {(recipeDish?.social_links.facebook ||
            recipeDish?.social_links.tiktok ||
            recipeDish?.social_links.instagram) && (
            <View className="mb-5 mt-5">
              <SocialLinksComponent socialLinks={recipeDish?.social_links} />
            </View>
          )}
          {/*    accordion comments*/}
          <View ref={commentsRef} className="mb-10">
            {isPreview === false && (
              <CommentsComponent
                recepId={id}
                user={user ?? null}
                updateLikeCommentCount={updateLikeCommentCount}
                publishedId={recipeDish?.published_id}
              />
            )}
          </View>
        </View>
      )}
    </ScrollView>
  )
}

export default RecipeDetailsScreen
