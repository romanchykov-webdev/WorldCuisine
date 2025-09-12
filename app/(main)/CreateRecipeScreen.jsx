import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

import ButtonBack from '../../components/ButtonBack'
import ButtonSmallCustom from '../../components/Buttons/ButtonSmallCustom'
import AddCategory from '../../components/CreateRecipeScreen/AddCategory'

import LoadingComponent from '../../components/loadingComponent'
import TitleScreen from '../../components/TitleScreen'

import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'

import { useAuthStore } from '../../stores/authStore'
import { useLangStore } from '../../stores/langStore'
import { useThemeColors } from '../../stores/themeStore'

import { useMeasurement } from '../../queries/recipes'
import { useMutation } from '@tanstack/react-query'
import UploadHeaderImage from '../../components/CreateRecipeScreen/UploadHeaderImage'
import InputCustomComponent from '../../components/CreateRecipeScreen/InputCustomComponent'
import { validateRecipeStructure } from '../../utils/validateRecipe'
import InputCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom'
import TagsCustom from '../../components/CreateRecipeScreen/TagsCustom'
import SelectCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom'
import { isEqualMetrics } from '../../helpers/isEqualMetrics'
import IngredientsCreateRecipe from '../../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe'
import RecipeListCreateRecipe from '../../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe'
import AddLinkVideo from '../../components/CreateRecipeScreen/AddLinkVideo'
import AddLinkSocialComponent from '../../components/CreateRecipeScreen/AddLinkSocialComponent'
import LinkToTheCopyright from '../../components/CreateRecipeScreen/LinkToTheCopyright'
import AddPintGoogleMaps from '../../components/CreateRecipeScreen/AddPintGoogleMaps'
import { uploadRecipeToTheServerTQ } from '../../service/TQuery/uploadRecipeToTheServer'
import { updateRecipeTQ } from '../../service/TQuery/updateRecipeTQ'

function CreateRecipeScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const { recipeDish: recipeDishParam, isRefactorRecipe } = params

  const user = useAuthStore((s) => s.user)
  const langApp = useLangStore((s) => s.lang) // язык приложения
  const colors = useThemeColors()

  // measurement из React Query (кэш вечный)
  // const { data: measurement } = useMeasurement()
  // measurement кэшируется навсегда
  const { data: measurement } = useMeasurement()

  // входной рецепт (если редактирование)
  // входной рецепт (если редактирование)
  const parsedRecipe = useMemo(() => {
    if (!recipeDishParam) return null
    try {
      if (typeof recipeDishParam === 'object') return recipeDishParam
      return JSON.parse(recipeDishParam)
    } catch (e) {
      console.error('CreateRecipeScreen: parse error recipeDishParam', e)
      return null
    }
  }, [recipeDishParam])

  const isEdit =
    isRefactorRecipe === true ||
    isRefactorRecipe === 'true' ||
    !!parsedRecipe?.id || // если пришёл рецепт с id — точно редактируем
    !!totalRecipe?.id

  // Заготовка (blank)
  const blank = useMemo(
    () => ({
      category: null,
      category_id: null,
      image_header: null,
      area: {},
      title: {},
      rating: 0,
      likes: 0,
      comments: 0,
      recipe_metrics: { time: 0, serv: 0, cal: 0, level: 'easy' },
      ingredients: [],
      instructions: [],
      video: null,
      social_links: { facebook: null, instagram: null, tiktok: null },
      source_reference: null,
      tags: [],
      link_copyright: null,
      map_coordinates: null,
      published_id: user?.id,
      published_user: {
        avatar: user?.avatar ?? null,
        user_id: user?.id ?? null,
        user_name: user?.user_name ?? null,
      },
      point: null,
    }),
    [user],
  )

  const [totalRecipe, setTotalRecipe] = useState(() =>
    isEdit && parsedRecipe ? parsedRecipe : blank,
  )

  const setRecipe = useCallback(
    (patch) => setTotalRecipe((prev) => ({ ...prev, ...patch })),
    [],
  )

  // Итоговый editable объект
  // если приходят входные данные во время жизни экрана — обновим
  useEffect(() => {
    if (isEdit && parsedRecipe) setTotalRecipe(parsedRecipe)
  }, [isEdit, parsedRecipe])

  // предпросмотр открылся — показывать кнопку публикации
  const [previewOpened, setPreviewOpened] = useState(false)

  // валидность формы
  const formValidation = useMemo(
    () => validateRecipeStructure(totalRecipe),
    [totalRecipe],
  )
  const isValid = formValidation.ok

  // инициализируем выбранные языки для заголовка
  const initialTitleLangs = React.useMemo(() => {
    const keys = Object.keys(parsedRecipe?.title || {})
    return keys.length ? keys : [langApp]
  }, [parsedRecipe?.title, langApp])

  const [titleLangs, setTitleLangs] = React.useState(initialTitleLangs)

  // area теперь просто следует за выбранными языками тайтла
  const areaLangs = titleLangs

  // мутация публикации

  // публикация/обновление
  const publishMutation = useMutation({
    mutationFn: (payload) =>
      isEdit ? updateRecipeTQ(payload) : uploadRecipeToTheServerTQ(payload),
    onSuccess: () => {
      Alert.alert(
        i18n.t('Success'),
        isEdit
          ? i18n.t('Recipe updated successfully!')
          : i18n.t('Recipe uploaded successfully!'),
      )
      router.back()
      setPreviewOpened(false)
    },
    onError: (e) => {
      Alert.alert(i18n.t('Error'), e?.message || 'Upload error')
    },
  })

  const handlePreview = () => {
    // console.log('totalRecipe', JSON.stringify(totalRecipe, null))
    if (!isValid) {
      Alert.alert(i18n.t('Preview error'), formValidation.msg)
      return
    }
    setPreviewOpened(true)
    router.push({
      pathname: '/RecipeDetailsScreen',
      params: {
        totalRecipe: JSON.stringify(totalRecipe),
        preview: 'true',
        langApp,
      },
    })
  }

  const handlePublish = () => {
    if (isEdit && !totalRecipe?.id) {
      Alert.alert(i18n.t('Error'), 'Missing recipe id for update')
      return
    }

    if (!isValid) {
      Alert.alert(i18n.t('Validation error'), formValidation.msg)
      return
    }
    if (!publishMutation.isPending) publishMutation.mutate(totalRecipe)
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.backgroundColor,
        flex: 1,
      }}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            marginBottom: 20,
            marginTop: Platform.OS === 'ios' ? 10 : 60,
          }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          key={totalRecipe?.id || 'create-new'}
        >
          {/* загрузка-плашка при публикации */}
          {publishMutation.isPending && (
            <View style={styles.overlay} pointerEvents="auto">
              <LoadingComponent color="green" />
            </View>
          )}

          {/* Заголовок */}
          <View className="pt-5">
            <View className=" flex-1 mb-5">
              <ButtonBack />
            </View>
            <View className="items-center mb-5">
              <TitleScreen title={i18n.t(isRefactorRecipe ? 'Edit' : 'Create Recipe')} />
            </View>
          </View>

          {/* Категория + поинт (обновлённый компонент ниже) */}
          <AddCategory
            colors={colors}
            langApp={langApp}
            value={{
              category_id: totalRecipe?.category_id,
              point: totalRecipe?.point,
            }}
            onChange={(next) =>
              setRecipe({
                category: next.category_id,
                category_id: next.category_id,
                point: next.point ?? totalRecipe.point,
              })
            }
          />

          {/* Картинка шапки (1 изображение) */}
          <View style={styles.mb20}>
            <UploadHeaderImage
              colors={colors}
              value={totalRecipe?.image_header}
              onChange={(uri) => setRecipe({ image_header: uri || null })}
            />
          </View>

          {/* Мультиязычный заголовок */}
          <View style={styles.mb20}>
            <InputCustomComponent
              colors={colors}
              appLang={langApp}
              value={totalRecipe?.title}
              onChange={(next) =>
                setTotalRecipe((prev) => ({ ...prev, title: next || {} }))
              }
              styleTextDesc={styles.label}
              styleInput={styles.input}
              //управляемые языки
              selectedLangs={titleLangs}
              onLangsChange={setTitleLangs}
            />
          </View>

          {/* Страна происхождения */}
          <View style={styles.mb20}>
            <InputCreateRecipeScreenCustom
              langs={areaLangs}
              value={totalRecipe?.area}
              onChange={(next) => setRecipe({ area: next || {} })}
              styleTextDesc={styles.label}
              styleInput={styles.input}
              placeholder={i18n.t('Write the name of the country')}
            />
          </View>

          {/* Теги */}
          <View style={styles.mb20}>
            <TagsCustom
              value={totalRecipe?.tags || []}
              onChange={(next) => setTotalRecipe((prev) => ({ ...prev, tags: next }))}
            />
          </View>

          {/* Метрики */}
          <View style={{ paddingBottom: 40 }}>
            <SelectCreateRecipeScreenCustom
              value={totalRecipe?.recipe_metrics}
              onChange={(next) =>
                setTotalRecipe((prev) =>
                  isEqualMetrics(prev.recipe_metrics, next)
                    ? prev
                    : { ...prev, recipe_metrics: next },
                )
              }
            />
          </View>

          {/* Ингредиенты */}
          <View style={styles.mb20}>
            <IngredientsCreateRecipe
              colors={colors}
              styleInput={styles.input}
              placeholderText={i18n.t('Name of the ingredient')}
              placeholderColor="grey"
              langApp={langApp}
              measurement={measurement}
              totalLangRecipe={titleLangs}
              setTotalRecipe={setTotalRecipe}
              ingredientsForUpdate={totalRecipe?.ingredients}
            />
          </View>

          {/* Описание (шаги) */}
          <View style={{ marginBottom: 24 }}>
            <RecipeListCreateRecipe
              colors={colors}
              placeholderText={i18n.t('Here you can describe the recipe in the language')}
              placeholderColor="grey"
              totalLangRecipe={titleLangs}
              setTotalRecipe={setTotalRecipe}
              instructionsForUpdate={totalRecipe?.instructions}
            />
          </View>

          {/* Видео */}
          <View style={{ marginBottom: 24 }}>
            <AddLinkVideo
              colors={colors}
              setTotalRecipe={setTotalRecipe}
              videoForUpdate={totalRecipe?.video}
            />
          </View>

          {/* Соцсети */}
          <View style={{ marginBottom: 24 }}>
            <AddLinkSocialComponent
              setTotalRecipe={setTotalRecipe}
              socialLinksForUpdate={totalRecipe?.social_links}
            />
          </View>

          {/* Авторское право (ссылка) */}
          <LinkToTheCopyright
            setTotalRecipe={setTotalRecipe}
            linkCopyrightLinksForUpdate={totalRecipe?.link_copyright}
          />

          {/* Карта */}
          <AddPintGoogleMaps
            setTotalRecipe={setTotalRecipe}
            mapCoordinatesLinksForUpdate={totalRecipe?.map_coordinates}
          />

          {/* Кнопки  Upload review */}
          <View className="gap-y-5 mt-10 mb-10 flex-1 ">
            <TouchableOpacity
              onPress={handlePreview}
              style={shadowBoxBlack()}
              className="flex-1"
            >
              <ButtonSmallCustom
                buttonText={true}
                title={i18n.t('Preview')}
                bg="violet"
                w="100%"
                h={60}
              />
            </TouchableOpacity>

            {previewOpened && (
              <TouchableOpacity
                onPress={handlePublish}
                style={[
                  shadowBoxBlack(),
                  { opacity: publishMutation.isPending ? 0.6 : 1 },
                ]}
                disabled={!isValid || publishMutation.isPending}
              >
                {publishMutation.isPending ? (
                  <LoadingComponent />
                ) : (
                  <ButtonSmallCustom
                    buttonText
                    title={isRefactorRecipe ? i18n.t('Refactor') : i18n.t('Publish')}
                    bg="green"
                    w="100%"
                    h={60}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
          {/*  */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mb20: {
    marginBottom: 20,
  },
  flex: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 60,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, paddingLeft: 5 },
  // input: { fontSize: 16, flex: 1, borderWidth: 1, borderColor: 'grey', padding: 20 },
  header: { paddingTop: 20, marginBottom: 20 },
  headerTitle: { alignItems: 'center', marginTop: 10 },
  buttonsWrap: { gap: 16, marginTop: 24, marginBottom: 24 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CreateRecipeScreen
