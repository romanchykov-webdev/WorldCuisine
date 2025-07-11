import { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PlusIcon, TrashIcon } from 'react-native-heroicons/mini'
// import my hook
import { useDebounce } from '../../constants/halperFunctions'
import { shadowBoxBlack, shadowBoxWhite } from '../../constants/shadow'
import { themes } from '../../constants/themes'

import { useAuth } from '../../contexts/AuthContext'
import i18n from '../../lang/i18n'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import StərɪskCustomComponent from '../StərɪskCustomComponent'
import TitleDescriptionComponent from './TitleDescriptionComponent'

function TagsCustom({ styleInput, styleTextDesc, setTotalRecipe }) {
  const { currentTheme } = useAuth()

  const [inputTags, setInputTags] = useState('')

  const [arrayTags, setArrayTags] = useState([])

  const debouncedValue = useDebounce(arrayTags, 1000)

  // useEffect(() => {}, [inputTags]);

  useEffect(() => {
    setTotalRecipe(prevRecipe => ({
      ...prevRecipe,
      tags: debouncedValue,
    }))
  }, [debouncedValue])

  const handleChange = (value) => {
    // console.log(value);
    setInputTags(value)
  }

  const addTagHandler = (inputTags) => {
    const clearTags = inputTags.trim()

    if (clearTags === '') {
      Alert.alert(`${i18n.t('Please enter the tag')}`)
      return
    }

    if (arrayTags.includes(clearTags)) {
      Alert.alert(`${i18n.t('This tag already exists')}`)
      return
    }

    setArrayTags(prev => [...prev, clearTags])
    setInputTags('')
  }

  const removeTag = (tagToRemove) => {
    // console.log(tagToRemove);
    const updateTage = arrayTags.filter(tag => tag !== tagToRemove)
    setArrayTags(updateTage)
  }

  return (
    <View className="mb-5">
      {arrayTags.length > 0 && (
        <View className="flex-row flex-wrap gap-3 mb-5">
          {arrayTags.map((tag, index) => {
            return (
              <View
                style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
                className="px-3  border-[1px] border-neutral-700
                                        rounded-2xl flex-row gap-x-2 items-center bg-white
                                        "
                key={index}
              >
                <Text>{tag}</Text>

                {/* remove tag */}
                <TouchableOpacity
                  onPress={() => {
                    removeTag(tag)
                  }}
                  className="transform translate-x-[8]"
                >
                  <ButtonSmallCustom icon={TrashIcon} size={20} w={30} h={30} tupeButton="remove" />
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      )}

      <TitleDescriptionComponent
        titleVisual={true}
        titleText={i18n.t('Tags')}
        descriptionVisual={true}
        descriptionText={i18n.t(
          'Tags improve recipe search in the database because: They allow you to quickly find recipes by key characteristics',
        )}
      />

      <View className="flex-row gap-x-2 items-center ">
        <View className="relative flex-1">
          <StərɪskCustomComponent />
          <TextInput
            style={[styleInput, { color: themes[currentTheme]?.textColor }]}
            onChangeText={value => handleChange(value)}
            value={inputTags}
            placeholder={i18n.t('Enter tag')}
            placeholderTextColor="grey"
            // className="mb-2"
            // className="flex-1 border-2 border-neutral-200 p-3 rounded-[5] h-[40px]"
          />
        </View>

        <TouchableOpacity style={shadowBoxBlack()} onPress={() => addTagHandler(inputTags)}>
          <ButtonSmallCustom w={60} h={60} bg="green" icon={PlusIcon} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default TagsCustom
