import { useState } from 'react'
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PlusIcon, TrashIcon } from 'react-native-heroicons/outline'

import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import { useImagePickerForRefactor } from '../../lib/imageUtils'

import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import TitleDescriptionComponent from '../CreateRecipeScreen/TitleDescriptionComponent'
import LoadingComponent from '../loadingComponent'
import ImageCustom from '../recipeDetails/ImageCustom'
import ImageSliderCustom from '../recipeDetails/ImageSliderCustom'

/**
 * props:
 * - descriptionsRecipe: Step[]
 * - langApp: 'en'|'es'|'it'|'ru'|'ua'
 * - Icon: any
 * - onUpdateDescription: (updatedSteps: Step[]) => void
 * - recipe: any (для пикера)
 */
function RefactorDescriptionRecipe({
  descriptionsRecipe = [],
  langApp,
  Icon,
  onUpdateDescription,
  recipe,
}) {
  const { currentTheme } = useAuth()

  // локальные состояния для модалки
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null) // index шага или null при добавлении
  const [editedText, setEditedText] = useState('') // временный текст для langApp
  const [tempImages, setTempImages] = useState([]) // временные картинки шага

  // доступные языки берём из первого шага (если он есть), иначе дефолт
  const langs = descriptionsRecipe[0]
    ? Object.keys({ ...descriptionsRecipe[0] }).filter((k) => k !== 'images')
    : ['en', 'es', 'it', 'ru', 'ua']

  // picker (оставляем ваш хук)
  const currentImages = selectedIndex != null ? descriptionsRecipe[selectedIndex]?.images || [] : []
  const { pickImageForRefactor } = useImagePickerForRefactor(
    currentImages,
    setTempImages,
    setLoading,
    recipe,
    5,
  )

  // --------- handlers ----------
  const openEditStep = (index) => {
    setSelectedIndex(index)
    setEditedText(descriptionsRecipe[index]?.[langApp] || '')
    setTempImages(descriptionsRecipe[index]?.images || [])
    setModalVisible(true)
  }

  const openAddStep = () => {
    setSelectedIndex(null)
    setEditedText('')
    setTempImages([])
    setModalVisible(true)
  }

  const handleImageUpdate = (newImages, action) => {
    if (action === 'remove') setTempImages([])
    else if (action === 'refactor') setTempImages(newImages)
    else if (action === 'add') setTempImages((prev) => [...prev, ...newImages].slice(0, 5))
  }

  const handleRemoveImage = () => handleImageUpdate([], 'remove')

  const handleRefactorImage = async () => {
    setLoading(true)
    try {
      const newUri = await pickImageForRefactor()
      if (newUri) handleImageUpdate([newUri], 'refactor')
    } catch (e) {
      console.error(e)
      Alert.alert('Error', 'Failed to refactor image')
    } finally {
      setLoading(false)
    }
  }

  const handleAddImage = async () => {
    if (tempImages.length >= 5) {
      Alert.alert(i18n.t('Limit Reached'), i18n.t('You have reached the limit of 5 images'))
      return
    }
    setLoading(true)
    try {
      const newUri = await pickImageForRefactor()
      if (newUri) handleImageUpdate([newUri], 'add')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    let updated = [...descriptionsRecipe]

    if (selectedIndex != null) {
      // редактирование существующего шага
      const step = { ...(updated[selectedIndex] || {}) }
      step[langApp] = editedText
      step.images = tempImages
      updated[selectedIndex] = step
    } else {
      // добавление нового шага
      // создаём объект со всеми языками (пустые строки), текущему ставим editedText
      const emptyStep = langs.reduce((acc, lng) => {
        acc[lng] = lng === langApp ? editedText : ''
        return acc
      }, {})
      updated.push({ ...emptyStep, images: tempImages })
    }

    onUpdateDescription(updated)
    setModalVisible(false)
  }

  const handleCancel = () => {
    setEditedText('')
    setTempImages([])
    setModalVisible(false)
  }

  // ---------- render ----------
  return (
    <View style={{ position: 'relative' }}>
      <TitleDescriptionComponent titleText={i18n.t('Recipe Description')} titleVisual />

      {Array.isArray(descriptionsRecipe) &&
        descriptionsRecipe.length > 0 &&
        descriptionsRecipe.map((step, index) => {
          const textForLang = step?.[langApp] || ''
          const imgs = step?.images || []

          return (
            <View key={index} className="w-full mb-5">
              {/* text */}
              <View className="flex-row flex-1 ">
                <Text
                  className="flex-wrap flex-1 mb-3"
                  style={{ fontSize: hp(2.5), color: themes[currentTheme]?.textColor }}
                >
                  <Text className="text-amber-500">{index + 1}) </Text>
                  {textForLang}
                </Text>
                <TouchableOpacity onPress={() => openEditStep(index)} style={shadowBoxBlack()}>
                  <ButtonSmallCustom icon={Icon} tupeButton="refactor" />
                </TouchableOpacity>
              </View>

              {/* images */}
              {Array.isArray(imgs) &&
                imgs.length > 0 &&
                (imgs.length === 1 ? (
                  <View>
                    {loading ? (
                      <View
                        style={shadowBoxBlack()}
                        className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
                      >
                        <LoadingComponent />
                      </View>
                    ) : (
                      <ImageCustom image={imgs} isPreview={false} refactorScrean />
                    )}
                  </View>
                ) : (
                  <View>
                    {loading ? (
                      <View
                        style={shadowBoxBlack()}
                        className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
                      >
                        <LoadingComponent />
                      </View>
                    ) : (
                      <ImageSliderCustom images={imgs} isPreview={false} />
                    )}
                  </View>
                ))}
            </View>
          )
        })}

      {/* add new step */}
      <View>
        <TouchableOpacity style={shadowBoxBlack()} onPress={openAddStep}>
          <ButtonSmallCustom tupeButton="add" w="100%" h={60} icon={PlusIcon} size={40} />
        </TouchableOpacity>
      </View>

      {/* modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: themes[currentTheme]?.backgroundColor },
            ]}
          >
            <Text style={[styles.modalTitle, { color: themes[currentTheme]?.textColor }]}>
              {selectedIndex != null
                ? `${i18n.t('Edit')} ${selectedIndex + 1} (${langApp.toUpperCase()})`
                : `${i18n.t('Add New Step')} (${langApp.toUpperCase()})`}
            </Text>

            <TextInput
              style={[styles.input, { color: themes[currentTheme]?.textColor }]}
              value={editedText}
              onChangeText={setEditedText}
              multiline
              autoFocus
            />

            {/* блок картинок в модалке */}
            {Array.isArray(tempImages) && tempImages.length > 0 ? (
              tempImages.length === 1 ? (
                <View className="w-full relative">
                  {loading ? (
                    <View
                      style={shadowBoxBlack()}
                      className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
                    >
                      <LoadingComponent />
                    </View>
                  ) : (
                    <ImageCustom image={tempImages} />
                  )}
                  <View className="absolute top-0 right-0 h-full justify-between py-5">
                    <TouchableOpacity onPress={handleRemoveImage} style={shadowBoxBlack()}>
                      <ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRefactorImage} style={shadowBoxBlack()}>
                      <ButtonSmallCustom icon={Icon} tupeButton="refactor" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
                      <ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="w-full relative">
                  {loading ? (
                    <View
                      style={shadowBoxBlack()}
                      className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
                    >
                      <LoadingComponent />
                    </View>
                  ) : (
                    <ImageSliderCustom images={tempImages} />
                  )}
                  <View className="absolute top-0 right-0 h-full justify-between py-5">
                    <TouchableOpacity onPress={handleRemoveImage} style={shadowBoxBlack()}>
                      <ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRefactorImage} style={shadowBoxBlack()}>
                      <ButtonSmallCustom icon={Icon} tupeButton="refactor" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
                      <ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
                    </TouchableOpacity>
                  </View>
                </View>
              )
            ) : (
              <TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
                <ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
              </TouchableOpacity>
            )}

            <View className="flex-row justify-between w-full mt-3">
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>{i18n.t('Save')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'violet' }]}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>{i18n.t('Cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: hp(2),
    marginBottom: 20,
    minHeight: 100,
    maxHeight: hp(30),
  },
  button: {
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: hp(2), fontWeight: 'bold' },
})

export default RefactorDescriptionRecipe
