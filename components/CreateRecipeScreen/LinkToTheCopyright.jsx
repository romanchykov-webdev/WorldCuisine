import { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { LinkIcon, PlusIcon, TrashIcon } from 'react-native-heroicons/mini'
import LinkCopyrightComponent from '../../components/recipeDetails/LinkCopyrightComponent'
// import my hook
import { useDebounce } from '../../constants/halperFunctions'
import { shadowBoxBlack } from '../../constants/shadow'

import i18n from '../../lang/i18n'

import ButtonClearInputCustomComponent from '../ButtonClearInputCustomComponent'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import InputComponent from '../InputComponent'
import TitleDescriptionComponent from './TitleDescriptionComponent'

function LinkToTheCopyright({ setTotalRecipe, refactorRecipescrean = false, oldCopyring, updateCopyring }) {
  const [inputText, setInputText] = useState('')

  const [linkCopyright, setLinkCopyright] = useState('')

  // Добавляем дебонсированное значение
  const debouncedValue = useDebounce(linkCopyright, 1000)

  const addLinkCopyright = () => {
    // console.log("addLinkCopyright");
    setInputText('')
    setLinkCopyright(inputText)
  }

  const removeLinkCopyright = () => {
    setInputText('')
    setLinkCopyright('')
  }
  useEffect(() => {
    if (refactorRecipescrean && oldCopyring) {
      setLinkCopyright(oldCopyring)
    }
  }, [])

  useEffect(() => {
    if (refactorRecipescrean && updateCopyring) {
      updateCopyring(linkCopyright)
    }
    else {
      setTotalRecipe(prevRecipe => ({
        ...prevRecipe,
        link_copyright: debouncedValue,
      }))
    }
  }, [debouncedValue])

  return (
    <View className="mb-5">
      <TitleDescriptionComponent
        titleText={i18n.t('Add link')}
        titleVisual={true}
        descriptionVisual={true}
        descriptionText={i18n.t('If this recipe is available on another resource, you can add a link to it')}
      />

      {linkCopyright !== '' && (
        <View className="flex-row  items-center mb-3 ">
          <LinkCopyrightComponent linkCopyright={linkCopyright} />

          <TouchableOpacity style={shadowBoxBlack()} onPress={removeLinkCopyright}>
            <ButtonSmallCustom w={30} h={30} icon={TrashIcon} tupeButton="remove" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row gap-x-1 ">
        <View className=" relative flex-1">
          <InputComponent
            placeholder={i18n.t('Link to the author')}
            onChangeText={setInputText}
            value={inputText}
            icon={<LinkIcon size={20} color="grey" />}
            containerStyle={{ flex: 1 }}
          />
          {inputText.length > 0 && (
            <ButtonClearInputCustomComponent
              top={-15}
              left={-5}
              inputValue={inputText}
              setInputValue={setInputText}
            />
          )}
        </View>
        <TouchableOpacity style={shadowBoxBlack()} onPress={addLinkCopyright}>
          <ButtonSmallCustom icon={PlusIcon} tupeButton="add" h={60} w={60} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default LinkToTheCopyright
