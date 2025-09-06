import { StatusBar } from 'expo-status-bar'
import { useLocalSearchParams } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated'
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
import MapCoordinatesComponent from '../components/recipeDetails/MapCoordinatesComponent'

import { hp, wp } from '../constants/responsiveScreen'
import { shadowTextSmall } from '../constants/shadow'
import { themes } from '../constants/themes'
import i18n from '../lang/i18n'

// Zustand stores
import { useAuthStore } from '../stores/authStore'
import { useThemeStore } from '../stores/themeStore'
import { useLangStore } from '../stores/langStore'

// TQuery
import { useRecipeDetails } from '../queries/recipeDetails'
import { HeaderImageRecipe } from '../components/recipeDetails/HeaderImageRecipe'
import { TitleAreaRecipe } from '../components/recipeDetails/TitleAreaRecipe'
import { MetricsRecipe } from '../components/recipeDetails/MetricsRecipe'
import { hasSocialLinks } from '../utils/hasSocialLinks'
import { useMeasurement } from '../queries/recipes'

function RecipeDetailsScreen() {
  const { id, totalRecipe: totalRecipeString, preview } = useLocalSearchParams()
  const isPreview = preview === 'true' || preview === true

  const user = useAuthStore((s) => s.user)
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const defaultLang = useLangStore((s) => s.lang)

  // локальная локаль для текста рецепта
  const [langApp, setLangApp] = useState(user?.app_lang ?? defaultLang ?? 'en')

  // парсим totalRecipe, если пришли в режиме превью
  const parsedTotalRecipe = useMemo(() => {
    if (!totalRecipeString) return null
    try {
      const parsed = JSON.parse(totalRecipeString)
      return typeof parsed === 'object' && parsed ? parsed : null
    } catch {
      return null
    }
  }, [totalRecipeString])

  // получаем детали рецепта (кроме превью)
  const {
    data: details,
    isLoading: loadingDetails,
    refetch: refetchDetails,
  } = useRecipeDetails(id, { preview: isPreview })

  const { data: measurement, isLoading } = useMeasurement()

  const recipeDish = isPreview ? parsedTotalRecipe : details
  const rating = recipeDish?.rating ?? 0

  // refs для скролла к блоку комментариев
  const scrollViewRef = useRef(null)
  const commentsRef = useRef(null)

  const scrollToComments = () => {
    if (isPreview) return
    commentsRef.current?.measureLayout(
      scrollViewRef.current.getNativeScrollRef(),
      (_x, y) => scrollViewRef.current.scrollTo({ y, animated: true }),
    )
  }

  // коллбек для CommentsComponent — после добавления комментария рефетчим детали
  const afterCommentAdded = async () => {
    if (!isPreview) {
      await refetchDetails()
    }
  }

  // лоадер: при превью не ждём т-к данные уже есть в параметрах
  if (!isPreview && loadingDetails) {
    return (
      <View style={{ flex: 1, height: hp(100), width: wp(100) }}>
        <LoadingComponent color="green" />
      </View>
    )
  }

  // защитимся от пустых данных
  if (!recipeDish) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{i18n.t('There are no recipes yet')}</Text>
      </View>
    )
  }

  const titleText =
    recipeDish?.title?.[langApp] ||
    recipeDish?.title?.en ||
    Object.values(recipeDish?.title)[0]

  const areaText =
    recipeDish?.area?.[langApp] ||
    recipeDish?.area?.en ||
    Object.values(recipeDish?.area)[0]

  // console.log('recipescreen  recipeDish', JSON.stringify(recipeDish, null))
  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 30,
        backgroundColor: themes[currentTheme]?.backgroundColor,
        paddingHorizontal: wp(3),
        minHeight: hp(120),
        flexGrow: 1,
      }}
    >
      <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      <View className="gap-y-5" key={id}>
        {/* top image + back + like rating*/}
        <HeaderImageRecipe
          rating={rating}
          scrollToComments={scrollToComments}
          recipeComments={recipeDish?.comments}
          imageHeader={recipeDish?.image_header}
          recipeId={recipeDish?.id}
          totalCountLike={recipeDish?.likes}
        />

        {/* rating stars (интерактивные) */}
        <RatingComponents
          isPreview={isPreview}
          rating={rating}
          recipeId={recipeDish?.id}
        />

        {/* subscriptions block */}
        <Animated.View entering={FadeInDown.delay(550)}>
          <SubscriptionsComponent
            isPreview={isPreview}
            creatorId={recipeDish?.published_id}
            recipeDish={recipeDish}
          />
        </Animated.View>

        {/* language selector */}
        <Animated.View entering={FadeInDown.delay(570)}>
          <SelectLangComponent
            recipeDishArea={recipeDish?.area}
            handleLangChange={setLangApp}
            langApp={langApp}
          />
        </Animated.View>

        {/* title + area */}
        <TitleAreaRecipe
          titleText={titleText}
          areaText={areaText}
          currentTheme={currentTheme}
        />

        {/* metrics */}
        <MetricsRecipe
          time={recipeDish?.recipe_metrics?.time}
          serv={recipeDish?.recipe_metrics?.serv}
          cal={recipeDish?.recipe_metrics?.cal}
          level={recipeDish?.recipe_metrics?.level}
        />

        {/* ingredients */}
        <Animated.View entering={FadeInDown.delay(800)} className="gap-y-4">
          <Text
            style={[
              { fontSize: hp(2.5), color: themes[currentTheme]?.textColor },
              shadowTextSmall(),
            ]}
            className="font-bold px-4"
          >
            {i18n.t('Ingredients')}
          </Text>
          <View className="gap-y-2">
            <RecipeIngredients
              recIng={recipeDish?.ingredients}
              langDev={langApp}
              currentTheme={currentTheme}
              measurement={measurement}
            />
          </View>
        </Animated.View>

        {/* instructions */}
        <Animated.View entering={FadeInDown.delay(800)} className="gap-y-4">
          <RecipeInstructions
            isPreview={isPreview}
            instructions={recipeDish?.instructions}
            langDev={langApp}
            currentTheme={currentTheme}
          />
        </Animated.View>

        {/* video */}
        {recipeDish?.video && (
          <View className="mb-5">
            <VideoCustom video={recipeDish?.video} />
          </View>
        )}

        {/* copyright link */}
        {recipeDish?.link_copyright && (
          <View className="mb-5">
            <LinkCopyrightComponent linkCopyright={recipeDish?.link_copyright} />
          </View>
        )}

        {/* map */}
        {recipeDish?.map_coordinates && (
          <View className="mb-5">
            <MapCoordinatesComponent mapLink={recipeDish?.map_coordinates} />
          </View>
        )}

        {/* social links */}
        {hasSocialLinks(recipeDish?.social_links) && (
          <View className="mb-5 mt-5">
            <SocialLinksComponent socialLinks={recipeDish?.social_links} />
          </View>
        )}

        {/* comments */}
        <View ref={commentsRef} className="mb-10">
          {!isPreview && (
            <CommentsComponent
              recepId={id}
              user={user ?? null}
              updateLikeCommentCount={() => afterCommentAdded()}
              publishedId={recipeDish?.published_id}
              currentTheme={currentTheme}
            />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default RecipeDetailsScreen
