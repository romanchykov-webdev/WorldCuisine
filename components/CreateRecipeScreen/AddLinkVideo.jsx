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

function AddLinkVideo({ setTotalRecipe, refactorRecipescrean = false, oldLinkVideo = {}, updateLinkVideo }) {
  // https://www.youtube.com/watch?v=q4xBdh4Cjfk
  // https://youtu.be/q4xBdh4Cjfk?si=9mRK-JSkw-wIfwZz
  // https://youtu.be/itSxa5_-1cE?si=ZIi0QSI7Z8LytxlB
  // console.log("AddLinkVideo oldLinkVideo", oldLinkVideo);

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [inputLink, setInputLink] = useState('')

  const [link, setLink] = useState(null)

  const [linkVideo, setLinkVideo] = useState({
    strYoutube: null,
    strYouVideo: null,
  })

  // Добавляем дебонсированное значение
  const debouncedValue = useDebounce(linkVideo, 1000)

  useEffect(() => {
    // console.log("Обновленный linkVideo:", linkVideo);
  }, [linkVideo])

  useEffect(() => {
    if (refactorRecipescrean && oldLinkVideo) {
      // Проверяем, отличается ли oldLinkVideo от текущего linkVideo
      if (
        (oldLinkVideo.strYouVideo !== linkVideo.strYouVideo
          || oldLinkVideo.strYoutube !== linkVideo.strYoutube)
        && (oldLinkVideo.strYouVideo !== null || oldLinkVideo.strYoutube !== null)
      ) {
        setLinkVideo({
          strYoutube: oldLinkVideo.strYoutube || null,
          strYouVideo: oldLinkVideo.strYouVideo || null,
        })
      }
    }
  }, [refactorRecipescrean, oldLinkVideo]) // Зависимость от oldLinkVideo

  // Обновление родительского состояния при изменении debouncedValue
  useEffect(() => {
    if (refactorRecipescrean) {
      // В режиме редактирования передаём изменения через updateLinkVideo
      if (updateLinkVideo) {
        updateLinkVideo(linkVideo) // Передаём текущее значение linkVideo
      }
    }
    else {
      // В режиме создания обновляем totalRecipe
      setTotalRecipe(prevRecipe => ({
        ...prevRecipe,
        video: debouncedValue,
      }))
    }
    // console.log("linkVideo", linkVideo);
  }, [debouncedValue, refactorRecipescrean, setTotalRecipe, updateLinkVideo, linkVideo])

  const closeModal = () => {
    setIsModalVisible(false)
  }

  const handleSave = () => {
    setIsModalVisible(false)

    if (inputLink.trim() === '') {
      setInputLink('')
      return
    }

    if (link === 'YouTube') {
      setLinkVideo({
        strYoutube: inputLink,
        strYouVideo: null,
      })
    }
    if (link === 'Google Disk') {
      setLinkVideo({
        strYoutube: null,
        strYouVideo: inputLink,
      })
    }
  }

  const handleTuLink = (link) => {
    if (link === 'YouTube') {
      setLink('YouTube')
      // console.log("YouTube")
      setIsModalVisible(true)
    }
    if (link === 'Google Disk') {
      // console.log("googleDisk")
      setLink('Google Disk')
      setIsModalVisible(true)
    }
  }

  const removeLink = async () => {
    // setInputLink("");
    setLinkVideo({
      strYoutube: null,
      strYouVideo: null,
    })
    // setIsModalVisible(false)
    // setLink(null)
  }

  const removeVideo = () => {
    setLinkVideo({
      strYoutube: null,
      strYouVideo: null,
    })
  }

  return (
    <View>
      {(linkVideo.strYoutube !== null || linkVideo.strYouVideo !== null) && (
        <View className="mb-5">
          <VideoCustom video={linkVideo} />

          <TouchableOpacity
            className="absolute top-0 right-0 justify-center items-center"
            onPress={removeVideo}
          >
            <ButtonSmallCustom buttonText={false} icon={TrashIcon} tupeButton="remove" w={30} h={30} />
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
          onPress={() => handleTuLink('YouTube')}
          style={[shadowBoxBlack(), styles.buttonWrapper, { backgroundColor: '#EF4444' }]}
        >
          <PlayCircleIcon size={25} color="white" />
          <Text style={styles.ButtonText}>YouTube</Text>
        </TouchableOpacity>

        {/* Google disk */}
        <TouchableOpacity
          onPress={() => handleTuLink('Google Disk')}
          style={[shadowBoxBlack(), styles.buttonWrapper, { backgroundColor: 'green' }]}
        >
          <CircleStackIcon size={25} color="white" />
          <Text style={styles.ButtonText}>Google Disk</Text>
        </TouchableOpacity>
      </View>

      <ModalClearCustom
        titleHeader={`${i18n.t('Insert the link to the recipe video from here')}`}
        textButton="Save"
        isModalVisible={isModalVisible}
        closeModal={closeModal}
        handleSave={handleSave}
        animationType="fade"
        childrenSubheader={(
          <Text className="underline font-bold text-[18px] mb-[15] text-center ">
            {link}
            .
          </Text>
        )}
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
