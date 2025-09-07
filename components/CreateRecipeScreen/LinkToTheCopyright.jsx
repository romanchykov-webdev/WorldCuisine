import { useEffect, useMemo, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { LinkIcon, TrashIcon } from 'react-native-heroicons/mini'
import LinkCopyrightComponent from '../../components/recipeDetails/LinkCopyrightComponent'
import { useDebounce } from '../../constants/halperFunctions'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import ButtonClearInputCustomComponent from '../ButtonClearInputCustomComponent'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import InputComponent from '../InputComponent'
import TitleDescriptionComponent from './TitleDescriptionComponent'

const isValidUrl = (s) => {
  try {
    const u = new URL(s)
    return !!u.protocol && !!u.hostname
  } catch {
    return false
  }
}

function LinkToTheCopyright({ setTotalRecipe, linkCopyrightLinksForUpdate }) {
  const [inputText, setInputText] = useState(linkCopyrightLinksForUpdate ?? '')
  const debounced = useDebounce(inputText, 500)

  // Пробрасываем наверх
  useEffect(() => {
    setTotalRecipe((prev) => ({
      ...prev,
      link_copyright: debounced?.trim() ? debounced.trim() : null,
    }))
  }, [debounced, setTotalRecipe])

  const removeLinkCopyright = () => setInputText('')

  const hasValid = useMemo(() => isValidUrl(inputText), [inputText])

  return (
    <View className="mb-5">
      <TitleDescriptionComponent
        titleText={i18n.t('Add link')}
        titleVisual
        descriptionVisual
        descriptionText={i18n.t(
          'If this recipe is available on another resource, you can add a link to it',
        )}
      />

      {inputText !== '' && hasValid && (
        <View className="flex-row items-center mb-5">
          <LinkCopyrightComponent linkCopyright={inputText} />
          <TouchableOpacity style={shadowBoxBlack()} onPress={removeLinkCopyright}>
            <ButtonSmallCustom w={30} h={30} icon={TrashIcon} tupeButton="remove" />
          </TouchableOpacity>
        </View>
      )}

      <View className="flex-row gap-x-1">
        <View className="relative flex-1">
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
      </View>
    </View>
  )
}

export default LinkToTheCopyright
