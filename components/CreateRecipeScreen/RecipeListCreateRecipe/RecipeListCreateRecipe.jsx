// components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import Animated, { FadeInDown } from 'react-native-reanimated'
import { PhotoIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/mini'

import { shadowBoxBlack } from '../../../constants/shadow'
import { themes } from '../../../constants/themes'
import i18n from '../../../lang/i18n'

import ButtonSmallCustom from '../../Buttons/ButtonSmallCustom'
import LoadingComponent from '../../loadingComponent'
import TitleDescriptionComponent from '../TitleDescriptionComponent'
import ImageCustom from '../../recipeDetails/ImageCustom'
import ImageSliderCustom from '../../recipeDetails/ImageSliderCustom'
import InputComponent from '../../InputComponent'
import { toast } from '../../../lib/toast'

// --- helpers ----------------------------------------------------------
const makeLangMap = (langs, fill = '') =>
  langs.reduce((acc, l) => ((acc[l] = fill), acc), {})

// --- hooks ------------------------------------------------------------
function useRecipeInstructions(totalLangRecipe, instructionsForUpdate, setTotalRecipe) {
  const [instructions, setInstructions] = useState([])
  const hydratedOnce = useRef(false)

  // гидратация один раз
  useEffect(() => {
    if (hydratedOnce.current) return
    if (Array.isArray(instructionsForUpdate) && instructionsForUpdate.length > 0) {
      setInstructions(instructionsForUpdate)
    }
    hydratedOnce.current = true
  }, [instructionsForUpdate])

  // проброс наверх
  useEffect(() => {
    setTotalRecipe((prev) => ({ ...prev, instructions }))
  }, [instructions, setTotalRecipe])

  return [instructions, setInstructions]
}

// --- step item --------------------------------------------------------
const StepItem = ({ idx, step, changeLang, removeStep, colors }) => {
  const imgs = Array.isArray(step.images) ? step.images.filter(Boolean) : []
  return (
    <Animated.View
      entering={FadeInDown.duration(300).springify()}
      key={`step-${idx}`}
      className="mb-10 mt-10"
    >
      <View className="flex-row gap-x-2 flex-1">
        <TouchableOpacity
          className="flex-1"
          onPress={() => removeStep(idx)}
          style={shadowBoxBlack()}
        >
          <ButtonSmallCustom
            w="100%"
            icon={TrashIcon}
            color="white"
            tupeButton="remove"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 flex-row w-full mt-2">
        <Text className="mb-2 flex-1">
          <Text className="text-amber-500">
            {idx + 1}){'  '}
          </Text>
          <Text style={{ color: colors?.textColor }}>{step?.[changeLang] || ''}</Text>
        </Text>
      </View>

      {imgs.length > 0 &&
        (imgs.length === 1 ? (
          <ImageCustom image={imgs} />
        ) : (
          <ImageSliderCustom images={imgs} />
        ))}
    </Animated.View>
  )
}

// --- main component ---------------------------------------------------
function RecipeListCreateRecipe({
  placeholderText,
  placeholderColor,
  totalLangRecipe,
  setTotalRecipe,
  instructionsForUpdate,
  colors,
}) {
  const [instructions, setInstructions] = useRecipeInstructions(
    totalLangRecipe,
    instructionsForUpdate,
    setTotalRecipe,
  )
  const [changeLang, setChangeLang] = useState(totalLangRecipe[0])

  // черновик
  const emptyDraft = useMemo(() => makeLangMap(totalLangRecipe, ''), [totalLangRecipe])
  const [draft, setDraft] = useState(emptyDraft)
  const [draftImages, setDraftImages] = useState([])
  const [loadingImages, setLoadingImages] = useState(false)

  const handleDraftChange = (lang, text) => setDraft((p) => ({ ...p, [lang]: text }))

  const addImage = async () => {
    if (draftImages.length >= 5) {
      toast.info(null, i18n.t('You have reached the image limit for one item'))
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
    const empty = totalLangRecipe.some((code) => !draft[code]?.trim())
    if (empty) {
      toast.info(
        i18n.t('Preview error'),
        i18n.t('Here you can describe the recipe in the language'),
      )
      return
    }
    setInstructions((prev) => [...prev, { ...draft, images: [...draftImages] }])
    setDraft(emptyDraft)
    setDraftImages([])
  }

  const removeStep = (index) =>
    setInstructions((prev) => prev.filter((_, i) => i !== index))

  return (
    <View>
      {/* переключатель языков */}
      {totalLangRecipe?.length > 1 && (
        <View className="mb-2">
          <Text className="mb-3 text-xl font-bold" style={{ color: colors?.textColor }}>
            {i18n.t('View in language')}{' '}
            <Text className="capitalize text-amber-500">{changeLang}</Text>
          </Text>

          <View className="flex-row flex-wrap gap-x-2 mb-2 items-center justify-around">
            {totalLangRecipe.map((code) => (
              <TouchableOpacity
                key={code}
                style={changeLang === code ? shadowBoxBlack() : null}
                className={`border-[1px] border-neutral-500 rounded-2xl px-5 py-2 ${
                  changeLang === code ? `bg-amber-500` : `bg-transparent`
                }`}
                onPress={() => setChangeLang(code)}
              >
                <Text style={{ color: colors?.textColor }}>{code.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* список шагов */}
      {instructions.map((step, idx) => (
        <StepItem
          key={idx}
          idx={idx}
          step={step}
          changeLang={changeLang}
          removeStep={removeStep}
          colors={colors}
        />
      ))}

      {/* описание / поля */}
      <TitleDescriptionComponent
        titleText={i18n.t('Recipe Description')}
        titleVisual
        descriptionVisual
        descriptionText={i18n.t(
          'Here you can write a recipe as text or in bullet points',
        )}
      />

      {totalLangRecipe.map((code) => (
        <InputComponent
          key={code}
          value={draft[code]}
          onChangeText={(v) => handleDraftChange(code, v)}
          placeholder={`${placeholderText} ${code}`}
          placeholderTextColor={placeholderColor}
          multiline
          style={{
            minHeight: 100,
            color: colors?.textColor,

            padding: 2,
          }}
        />
      ))}

      {/* кнопки */}
      <View className="flex-row gap-x-2 mt-2">
        <TouchableOpacity
          onPress={loadingImages ? null : addImage}
          style={[{ flex: 1 }, shadowBoxBlack()]}
          className="h-[60px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center"
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
          className="h-[60px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center"
        >
          <PlusIcon color="white" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default RecipeListCreateRecipe
