// import recipe preview
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
// arrow-up-on-square

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import ButtonBack from '../../components/ButtonBack'
import ButtonSmallCustom from '../../components/Buttons/ButtonSmallCustom'
import AddCategory from '../../components/CreateRecipeScreen/AddCategory'
import AddLinkSocialComponent from '../../components/CreateRecipeScreen/AddLinkSocialComponent'
import AddLinkVideo from '../../components/CreateRecipeScreen/AddLinkVideo'
import AddPintGoogleMaps from '../../components/CreateRecipeScreen/AddPintGoogleMaps'
import IngredientsCreateRecipe from '../../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe'
import InputCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom'
import LinkToTheCopyright from '../../components/CreateRecipeScreen/LinkToTheCopyright'
import RecipeListCreateRecipe from '../../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe'
import SelectCreateRecipeScreenCustom from '../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom'
import TagsCustom from '../../components/CreateRecipeScreen/TagsCustom'
import TitleDescriptionComponent from '../../components/CreateRecipeScreen/TitleDescriptionComponent'
import UploadHeaderImage from '../../components/CreateRecipeScreen/UploadHeaderImage'
import LoadingComponent from '../../components/loadingComponent'
import TitleScreen from '../../components/TitleScreen'

import { validateRecipeStructure } from '../../constants/halperFunctions'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import { getMeasurementCreateRecipeMyDB } from '../../service/getDataFromDB'
import { uploadRecipeToTheServer } from '../../service/uploadDataToTheDB'
import InputCustomComponent from '../../components/CreateRecipeScreen/InputCustomComponent'

function CreateRecipeScreen() {
  const {
    user: userData,
    language,
    setRequiredFields,
    previewRecipeReady,
    setPreviewRecipeReady,
    currentTheme,
  } = useAuth()

  // Парсинг totalRecipe с проверкой
  const params = useLocalSearchParams()
  const { recipeDish: recipeDishParam, isRefactorRecipe } = params
  const parsedTotalRecipe = useMemo(() => {
    if (!recipeDishParam) return null
    try {
      // если вдруг кто-то передал уже объект (на будущее)
      if (typeof recipeDishParam === 'object') return recipeDishParam
      // а обычно это строка
      return JSON.parse(recipeDishParam)
    } catch (e) {
      console.error('Ошибка парсинга totalRecipe:', e)
      return null
    }
  }, [recipeDishParam])

  const blank = {
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
    published_id: userData.id,
    published_user: {
      avatar: userData?.avatar,
      user_id: userData?.id,
      user_name: userData?.user_name,
    },
    point: null,
  }
  const [totalRecipe, setTotalRecipe] = useState(() =>
    (isRefactorRecipe === 'true' || isRefactorRecipe === true) && parsedTotalRecipe
      ? parsedTotalRecipe
      : blank,
  )
  // const [totalRecipe, setTotalRecipe] = useState({
  //   category: null,
  //   category_id: null,
  //   image_header: null,
  //   area: null,
  //   title: null,
  //   rating: 0,
  //   likes: 0,
  //   comments: 0,
  //   recipe_metrics: null,
  //   ingredients: null,
  //   instructions: null,
  //   video: null,
  //   social_links: null,
  //   source_reference: null,
  //   tags: null,
  //   link_copyright: null,
  //   map_coordinates: null,
  //   published_id: userData.id,
  //   published_user: {
  //     avatar: userData?.avatar,
  //     user_id: userData?.id,
  //     user_name: userData?.user_name,
  //   },
  //   point: null,
  // })

  const router = useRouter()

  // const [uploadRecipe, setUploadRecipe] = useState(false);

  const [preView, setPreView] = useState(false)

  const [loadingUpload, setLoadingUpload] = useState(false)

  const [loadingRecipe, setLoadingRecipe] = useState(false)

  useEffect(() => {
    if (isRefactorRecipe === 'true' || isRefactorRecipe === true) {
      console.log('parsedTotalRecipe')
      if (parsedTotalRecipe) {
        setTotalRecipe(parsedTotalRecipe)
        console.log('parsedTotalRecipe', parsedTotalRecipe)
        console.log('totalRecipe', totalRecipe)
      }
    }
  }, [isRefactorRecipe, parsedTotalRecipe])

  const langApp = userData.app_lang ?? language
  // console.log('CreateRecipeScreen',langApp)

  const totalLangUpdateRecipe = Object.keys(totalRecipe?.title ?? {})
  console.log('totalLangUpdateRecipe', totalLangUpdateRecipe)

  const [totalLangRecipe, setTotalLangRecipe] = useState(
    isRefactorRecipe ? totalLangUpdateRecipe : [langApp],
  )

  // measurement
  const [measurement, setMeasurement] = useState([])

  // get all
  const fetchMeasurement = async () => {
    const res = await getMeasurementCreateRecipeMyDB()
    // console.log(res.data);
    setMeasurement(res.data)
  }
  useEffect(() => {
    fetchMeasurement()
  }, [])

  const handlePreview = () => {
    // console.log("prevoew");
    // console.log(
    // 	"Preview totalRecipe:",
    // 	JSON.stringify(totalRecipe, null, 2)
    // );
    console.log('totalRecipe', JSON.stringify(totalRecipe))

    setPreView(true)

    // Проверка структуры перед переходом
    // const validationResult = validateRecipeStructure(totalRecipe)
    // if (!validationResult.isValid) {
    //   setRequiredFields(true)
    //   Alert.alert(`${i18n.t('Preview error')}`, validationResult.message)
    //   return
    // }
    //
    // // console.log("totalRecipe", JSON.stringify(totalRecipe, null));
    router.push({
      pathname: '/RecipeDetailsScreen', // Путь к экрану RecipeDetailsScreen
      params: {
        totalRecipe: JSON.stringify(totalRecipe), // Передаем данные как строку
        preview: 'true', // Указываем, что это предпросмотр
        langApp: language, // Язык приложения
      },
    })
  }

  // handlePublishRecipe
  const handlePublishRecipe = async () => {
    try {
      setLoadingUpload(true)

      const res = await uploadRecipeToTheServer(totalRecipe)
      if (res.success) {
        Alert.alert('Success', 'Recipe uploaded successfully!')
        router.back() // Перенаправление после сохранения
        // Отключить оповещение об обязательном заполнение полей
        setRequiredFields(false)

        // прячем кнопку опубликовать
        setPreviewRecipeReady(false)
      }
    } catch (e) {
      Alert.alert('Error', e.msg)
    } finally {
      setLoadingUpload(false)
    }
  }

  return (
    <>
      {loadingRecipe ? (
        <LoadingComponent color="green" />
      ) : (
        <SafeAreaView
          style={{
            backgroundColor: themes[currentTheme]?.backgroundColor,
          }}
        >
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 20,
                marginBottom: 20,
                marginTop: Platform.OS === 'ios' ? null : 60,
              }}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="on-drag"
              key={totalRecipe?.id || 'new'}
            >
              {loadingUpload && <View style={styles.overlay} pointerEvents="auto" />}

              {/* title */}
              <View className="pt-5">
                <View className=" flex-1">
                  <ButtonBack />
                </View>
                <View className="items-center mb-5">
                  <TitleScreen title={i18n.t(isRefactorRecipe ? 'Edit' : 'Create Recipe')} />
                </View>
              </View>

              {/* add category */}
              <AddCategory
                currentTheme={currentTheme}
                langApp={langApp}
                setTotalRecipe={setTotalRecipe}
                categoryForUpdate={totalRecipe?.category}
                categoryIdForUpdate={totalRecipe?.category_id}
                pointForUpdate={totalRecipe?.point}
              />

              {/* upload header image    */}
              <View className="mb-5">
                <UploadHeaderImage
                  styleTextDesc={styles.styleTextDesc}
                  styleInput={styles.styleInput}
                  langDev={langApp}
                  setTotalLangRecipe={setTotalLangRecipe}
                  totalLangRecipe={totalLangRecipe}
                  setTotalRecipe={setTotalRecipe}
                  totalRecipe={totalRecipe}
                  currentTheme={currentTheme}
                  themes={themes}
                  imageHeaderForUpdate={totalRecipe?.image_header}
                />
              </View>

              {/* title recipe */}
              <View className="mb-10">
                <InputCustomComponent
                  styleTextDesc={styles.styleTextDesc}
                  styleInput={styles.styleInput}
                  langDev={langApp}
                  setTotalLangRecipe={setTotalLangRecipe}
                  totalLangRecipe={totalLangRecipe}
                  setTotalRecipe={setTotalRecipe}
                  totalRecipe={totalRecipe}
                  currentTheme={currentTheme}
                  themes={themes}
                  titleForUpdate={totalRecipe?.title}
                />
              </View>

              {/*   aria  recipe */}
              <View className="mb-5">
                <TitleDescriptionComponent
                  titleText={i18n.t('Country of origin of the recipe')}
                  titleVisual={true}
                />
                <InputCreateRecipeScreenCustom
                  styleTextDesc={styles.styleTextDesc}
                  styleInput={styles.styleInput}
                  placeholderText={i18n.t('Write the name of the country')}
                  placeholderColor="grey"
                  totalLangRecipe={totalLangRecipe}
                  setTotalRecipe={setTotalRecipe}
                  currentTheme={currentTheme}
                  areaForUpdate={totalRecipe?.area}
                />
              </View>

              {/*  Tags   */}
              <View className="mb-5">
                <TagsCustom
                  styleInput={styles.styleInput}
                  styleTextDesc={styles.styleTextDesc}
                  setTotalRecipe={setTotalRecipe}
                  tagsForUpdate={totalRecipe?.tags}
                />
              </View>

              {/*    select */}
              <View className="mb-10">
                <SelectCreateRecipeScreenCustom
                  setTotalRecipe={setTotalRecipe}
                  recipeMetricsForUpdate={totalRecipe?.recipe_metrics}
                />
              </View>

              {/*    Ingredients */}
              <View className="mb-5">
                <View>
                  <IngredientsCreateRecipe
                    currentTheme={currentTheme}
                    styleInput={styles.styleInput}
                    placeholderText={i18n.t('Name of the ingredient')}
                    placeholderColor="grey"
                    langApp={userData.lang ?? language}
                    measurement={measurement}
                    totalLangRecipe={totalLangRecipe}
                    setTotalRecipe={setTotalRecipe}
                    ingredientsForUpdate={totalRecipe?.ingredients}
                  />
                </View>
              </View>

              {/*    recipe description  */}
              <View className="mb-10">
                <RecipeListCreateRecipe
                  currentTheme={currentTheme}
                  placeholderText={i18n.t('Here you can describe the recipe in the language')}
                  placeholderColor="grey"
                  totalLangRecipe={totalLangRecipe}
                  setTotalRecipe={setTotalRecipe}
                  instructionsForUpdate={totalRecipe?.instructions}
                />
              </View>

              {/*    add recipe link video */}
              <View className="mb-10">
                <AddLinkVideo setTotalRecipe={setTotalRecipe} videoForUpdate={totalRecipe?.video} />
              </View>

              {/* add links social facebook instagram tiktok */}
              <View className="mb-10">
                <AddLinkSocialComponent
                  setTotalRecipe={setTotalRecipe}
                  socialLinksForUpdate={totalRecipe?.social_links}
                />
              </View>

              {/*    add link to the author */}
              <LinkToTheCopyright
                setTotalRecipe={setTotalRecipe}
                linkCopyrightLinksForUpdate={totalRecipe?.link_copyright}
              />

              {/*    AddPintGoogleMaps    */}
              <AddPintGoogleMaps
                setTotalRecipe={setTotalRecipe}
                mapCoordinatesLinksForUpdate={totalRecipe?.map_coordinates}
              />

              {/*    buttons save and preview */}
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

                {preView && (
                  <TouchableOpacity
                    onPress={handlePublishRecipe}
                    style={[{ backgroundColor: 'green' }, shadowBoxBlack()]}
                    className="flex-1 w-full h-[100] rounded-[12] border-[1px] border-neutral-50 "
                  >
                    {loadingUpload ? (
                      <LoadingComponent />
                    ) : (
                      <ButtonSmallCustom
                        buttonText={true}
                        title={i18n.t('Publish')}
                        bg="green"
                        w="100%"
                        h={100}
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  buttonTextPrevSave: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonTextPrevSavePadding: {
    padding: 10,
  },
  styleTextDesc: {
    fontSize: hp(2),
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft: 5,
  },
  styleInput: {
    fontSize: hp(2),
    flex: 1,
    borderWidth: 1,
    borderColor: 'grey',
    padding: 20,
    borderRadius: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    zIndex: 9999, // поверх всего
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default CreateRecipeScreen
