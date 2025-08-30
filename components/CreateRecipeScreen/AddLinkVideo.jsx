import { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { CircleStackIcon, LinkIcon, PlayCircleIcon, TrashIcon } from 'react-native-heroicons/mini'
// import my hook
import { useDebounce } from '../../constants/halperFunctions'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import ButtonClearInputCustomComponent from '../ButtonClearInputCustomComponent'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'

import InputComponent from '../InputComponent'
import ModalClearCustom from '../ModalClearCustom'
import VideoCustom from '../recipeDetails/video/VideoCustom'
import TitleDescriptionComponent from './TitleDescriptionComponent'

function AddLinkVideo({
  setTotalRecipe,
  refactorRecipescrean = false,
  updateLinkVideo,
  videoForUpdate,
}) {
  // console.log('oldLinkVideo', oldLinkVideo)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [inputLink, setInputLink] = useState(videoForUpdate ?? '')

  // Добавляем дебонсированное значение
  const debouncedValue = useDebounce(inputLink, 1000)

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const handleSave = () => {
    if (inputLink.trim() === '') {
      setInputLink('')
    }
    console.log('debouncedValue', debouncedValue)
    if (refactorRecipescrean) {
      updateLinkVideo(inputLink)
    }

    // setTotalRecipe((prevRecipe) => ({
    //   ...prevRecipe,
    //   video: debouncedValue,
    // }))
    setIsModalVisible(false)
  }

  const removeVideo = () => {
    setInputLink('')
  }

  return (
    <View>
      {inputLink !== '' && (
        <View className="mb-5">
          <VideoCustom video={inputLink} />

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
      )}

      <TitleDescriptionComponent
        titleText={i18n.t('Add link to video')}
        titleVisual={true}
        descriptionVisual={true}
        descriptionText={i18n.t('If you have a link to a video stored on YouTube or Google Drive')}
      />
      <View className="gap-x-2 flex-row flex-1">
        {/* YouTube */}
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          style={[shadowBoxBlack(), styles.buttonWrapper, { backgroundColor: '#EF4444' }]}
        >
          <PlayCircleIcon size={25} color="white" />
          <Text style={styles.ButtonText}>YouTube</Text>
        </TouchableOpacity>

        {/* Google disk */}
      </View>

      <ModalClearCustom
        titleHeader={`${i18n.t('Insert the link to the recipe video from here')}`}
        textButton="Save"
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        handleSave={handleSave}
        animationType="fade"
      >
        <View>
          <InputComponent
            icon={<LinkIcon size={20} color="grey" />}
            placeholder={i18n.t('Insert the link to your video')}
            value={inputLink}
            onChangeText={setInputLink}
          />

          {inputLink.length > 0 && (
            <ButtonClearInputCustomComponent
              inputValue={inputLink}
              setInputValue={setInputLink}
              top={-15}
              left={-5}
            />
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
  },
})

export default AddLinkVideo
