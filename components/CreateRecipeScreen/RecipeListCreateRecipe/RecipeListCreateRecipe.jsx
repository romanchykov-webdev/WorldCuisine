import * as ImagePicker from 'expo-image-picker'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PhotoIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/mini'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { useDebounce } from '../../../constants/halperFunctions'
import { shadowBoxBlack } from '../../../constants/shadow'
import { themes } from '../../../constants/themes'
import { useAuth } from '../../../contexts/AuthContext'
import i18n from '../../../lang/i18n'

import { compressImage100 } from '../../../lib/imageUtils'
import ButtonSmallCustom from '../../Buttons/ButtonSmallCustom'
import LoadingComponent from '../../loadingComponent'
import TitleDescriptionComponent from '../TitleDescriptionComponent'
import SliderImagesListCreateRecipe from './SliderImagesListCreateRecipe'
import ViewImageListCreateRecipe from './ViewImageListCreateRecipe'
import ImageCustom from '../../recipeDetails/ImageCustom'
import ImageSliderCustom from '../../recipeDetails/ImageSliderCustom'

function RecipeListCreateRecipe({
  placeholderText,
  placeholderColor,
  totalLangRecipe,
  setTotalRecipe,
  instructionsForUpdate,
  currentTheme,
}) {
  // единственный источник правды внутри — новый формат
  const [instructions, setInstructions] = useState([])
  const [changeLang, setChangeLang] = useState(totalLangRecipe[0])

  // черновик нового шага
  const emptyDraft = useMemo(() => {
    const obj = {}
    totalLangRecipe.forEach((code) => (obj[code] = ''))
    return obj
  }, [totalLangRecipe])
  const [draft, setDraft] = useState(emptyDraft)
  const [draftImages, setDraftImages] = useState([])
  const [loadingImages, setLoadingImages] = useState(false)

  // гидратация из пропса один раз
  const hydratedOnce = useRef(false)
  useEffect(() => {
    if (hydratedOnce.current) return
    if (Array.isArray(instructionsForUpdate) && instructionsForUpdate.length > 0) {
      setInstructions(instructionsForUpdate)
    }
    hydratedOnce.current = true
  }, [instructionsForUpdate])

  // отдаём наверх при каждом изменении
  useEffect(() => {
    setTotalRecipe((prev) => ({ ...prev, instructions }))
  }, [instructions, setTotalRecipe])

  const handleChangeLang = (l) => setChangeLang(l)
  const handleDraftChange = (lang, text) => setDraft((p) => ({ ...p, [lang]: text }))

  const addImage = async () => {
    if (draftImages.length >= 5) {
      Alert.alert(i18n.t('You have reached the image limit for one item'))
      return
    }
    setLoadingImages(true)
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (!res.canceled && res.assets?.[0]?.uri) {
        setDraftImages((prev) => [...prev, res.assets[0].uri])
      }
    } finally {
      setLoadingImages(false)
    }
  }

  const addStep = () => {
    // все языки должны быть заполнены
    const empty = totalLangRecipe.some((code) => !draft[code] || !draft[code].trim())
    if (empty) {
      Alert.alert(
        i18n.t('Preview error'),
        i18n.t('Here you can describe the recipe in the language'),
      )
      return
    }
    const newStep = { ...draft, images: [...draftImages] }
    setInstructions((prev) => [...prev, newStep])
    setDraft(emptyDraft)
    setDraftImages([])
  }

  const removeStep = (index) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <View>
      {/* переключатель языков просмотра */}
      {totalLangRecipe?.length > 1 && (
        <View className="mb-2">
          <Text
            className="mb-3 text-xl font-bold"
            style={{ color: themes[currentTheme]?.textColor }}
          >
            {i18n.t('View in language')}{' '}
            <Text className="capitalize text-amber-500"> {changeLang}</Text>
          </Text>

          <View className="flex-row flex-wrap gap-x-2 mb-2 items-center justify-around">
            {totalLangRecipe.map((code) => (
              <TouchableOpacity
                key={code}
                style={changeLang === code ? shadowBoxBlack() : null}
                className={`border-[1px] border-neutral-500 rounded-2xl px-5 py-2 ${
                  changeLang === code ? `bg-amber-500` : `bg-transparent`
                } `}
                onPress={() => handleChangeLang(code)}
              >
                <Text style={{ color: themes[currentTheme]?.textColor }}>{code.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* список шагов (новый формат), но показываем текст на выбранном языке */}
      {instructions.map((step, idx) => {
        console.log('step', step)
        const imgs = Array.isArray(step.images) ? step.images.filter(Boolean) : []
        return (
          <Animated.View
            entering={FadeInDown.duration(300).springify()}
            key={`step-${idx}`}
            className="mb-10 mt-10 "
          >
            <View className="flex-row gap-x-2  flex-1">
              <TouchableOpacity
                className=" flex-1"
                onPress={() => removeStep(idx)}
                style={shadowBoxBlack()}
              >
                <ButtonSmallCustom w="100%" icon={TrashIcon} color="white" tupeButton="remove" />
              </TouchableOpacity>
            </View>
            <View className="flex-1 flex-row w-full ">
              <Text className="mb-2 flex-1">
                <Text className="text-amber-500">
                  {idx + 1}){'  '}
                </Text>
                <Text style={{ color: themes[currentTheme]?.textColor }}>
                  {step?.[changeLang] || ''}
                </Text>
              </Text>
            </View>

            <View>
              {imgs.length > 0 &&
                (imgs.length === 1 ? (
                  <ImageCustom image={imgs} />
                ) : (
                  <ImageSliderCustom images={imgs} />
                ))}
            </View>
          </Animated.View>
        )
      })}

      <TitleDescriptionComponent
        titleText={i18n.t('Recipe Description')}
        titleVisual
        descriptionVisual
        descriptionText={i18n.t('Here you can write a recipe as text or in bullet points')}
      />

      {/* поля ввода для черновика нового шага */}
      {totalLangRecipe.map((code) => (
        <TextInput
          key={code}
          className="border-2 border-neutral-500 rounded-[15] p-2 mb-3"
          value={draft[code]}
          onChangeText={(v) => handleDraftChange(code, v)}
          placeholder={`${placeholderText} ${code}`}
          placeholderTextColor={placeholderColor}
          multiline
          style={{ minHeight: 100, color: themes[currentTheme]?.textColor }}
        />
      ))}

      <View className="flex-row gap-x-2 ">
        <TouchableOpacity
          onPress={loadingImages ? null : addImage}
          style={[{ flex: 1 }, shadowBoxBlack()]}
          className="flex-1 h-[60px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center "
        >
          {loadingImages ? (
            <LoadingComponent color="green" size="small" />
          ) : (
            <PhotoIcon color="white" size={20} />
          )}

          {draftImages.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(200).springify()}
              style={[
                shadowBoxBlack({ offset: { width: 1, height: 1 } }),
                {
                  position: 'absolute',
                  top: -5,
                  right: 10,
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              className="border-2 border-neutral-500 rounded-3xl bg-violet-700"
            >
              <Text className="text-neutral-900 text-[16px]">{draftImages.length}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[{ flex: 1 }, shadowBoxBlack()]}
          onPress={addStep}
          className="flex-1 h-[60px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center"
        >
          <PlusIcon color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RecipeListCreateRecipe
