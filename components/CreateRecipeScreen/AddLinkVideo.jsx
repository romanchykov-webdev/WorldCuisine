import { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LinkIcon, PlayCircleIcon, TrashIcon } from 'react-native-heroicons/mini'
import { useDebounce } from '../../constants/halperFunctions'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import ButtonClearInputCustomComponent from '../ButtonClearInputCustomComponent'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import InputComponent from '../InputComponent'
import ModalClearCustom from '../ModalClearCustom'
import VideoCustom from '../recipeDetails/video/VideoCustom'
import TitleDescriptionComponent from './TitleDescriptionComponent'

const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]{11}|youtu\.be\/[\w-]{11})(?:[^\s]*)$/i

const isValidYouTube = (s = '') => YT_REGEX.test(String(s).trim())

function AddLinkVideo({ setTotalRecipe, videoForUpdate, colors }) {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [inputLink, setInputLink] = useState(videoForUpdate ?? '')
  const [touched, setTouched] = useState(false)

  // если проп обновился — синхронизируемся
  useEffect(() => {
    setInputLink(videoForUpdate ?? '')
  }, [videoForUpdate])

  // debounce чтобы не спамить setTotalRecipe
  const debouncedValue = useDebounce(inputLink, 600)

  // пробрасываем в рецепт
  useEffect(() => {
    setTotalRecipe((prev) =>
      prev.video === debouncedValue || (!debouncedValue && prev.video == null)
        ? prev
        : { ...prev, video: debouncedValue?.trim() ? debouncedValue.trim() : null },
    )
  }, [debouncedValue, setTotalRecipe])

  const hasError =
    touched && inputLink.trim().length > 0 && !isValidYouTube(inputLink.trim())

  const openModal = () => {
    setTouched(false)
    setIsModalVisible(true)
  }
  const closeModal = () => setIsModalVisible(false)

  const handleSave = () => {
    setTouched(true)
    if (!inputLink.trim() || isValidYouTube(inputLink)) {
      setIsModalVisible(false)
    }
  }

  const removeVideo = () => {
    setInputLink('')
    setTouched(false)
    setTotalRecipe((prev) => (prev.video == null ? prev : { ...prev, video: null }))
  }

  const helperText = useMemo(() => {
    if (!touched || !inputLink.trim()) return ''
    if (isValidYouTube(inputLink)) return ''
    return i18n.t('Please enter a valid link') + ' (YouTube only)'
  }, [touched, inputLink])

  return (
    <View>
      {/* превью */}
      {inputLink?.trim() ? (
        <View className="mb-5">
          <VideoCustom video={inputLink.trim()} />
          <TouchableOpacity
            className="absolute top-0 right-0 justify-center items-center"
            onPress={removeVideo}
          >
            <ButtonSmallCustom
              buttonText={false}
              icon={TrashIcon}
              tupeButton="remove"
              w={30}
              h={30}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* заголовок */}
      <TitleDescriptionComponent
        titleText={i18n.t('Add link to video')}
        titleVisual
        descriptionVisual
        descriptionText={i18n.t('If you have a link to a video stored on YouTube')}
      />

      {/* кнопка открытия модалки */}
      <View className="gap-x-2 flex-row flex-1">
        <TouchableOpacity
          onPress={openModal}
          style={[shadowBoxBlack(), styles.buttonWrapper, { backgroundColor: '#EF4444' }]}
        >
          <PlayCircleIcon size={25} color="white" />
          <Text style={styles.ButtonText}>YouTube</Text>
        </TouchableOpacity>
      </View>

      {/* модалка */}
      <ModalClearCustom
        titleHeader={i18n.t('Insert the link to the recipe video from here')}
        textButton={i18n.t('Save')}
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        handleSave={handleSave}
        animationType="fade"
        colors={colors}
      >
        <View>
          <InputComponent
            icon={<LinkIcon size={20} color="grey" />}
            placeholder={i18n.t('Insert the link to your video')}
            value={inputLink}
            onChangeText={(v) => {
              setInputLink(v)
              if (!touched) setTouched(true)
            }}
          />

          {inputLink.length > 0 && (
            <ButtonClearInputCustomComponent
              inputValue={inputLink}
              setInputValue={setInputLink}
              top={-15}
              left={-5}
            />
          )}

          {!!helperText && (
            <Text style={{ marginTop: 8, color: '#ef4444' }}>{helperText}</Text>
          )}
        </View>
      </ModalClearCustom>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
  },
  ButtonText: {
    fontSize: 18,
    marginLeft: 5,
    fontWeight: 'bold',
    color: 'white',
  },
})

export default AddLinkVideo
