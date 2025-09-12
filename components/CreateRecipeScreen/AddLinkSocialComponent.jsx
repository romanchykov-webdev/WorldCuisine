import { useEffect, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { LinkIcon, PlusIcon } from 'react-native-heroicons/mini'
import { useDebounce } from '../../constants/halperFunctions'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'

import ButtonClearInputCustomComponent from '../ButtonClearInputCustomComponent'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import InputComponent from '../InputComponent'
import SocialMediaEmbedComponent from './SocialMediaEmbedComponent'
import TitleDescriptionComponent from './TitleDescriptionComponent'
import { toast } from '../../lib/toast'

function AddLinkSocialComponent({
  setTotalRecipe,
  refactorRecipescrean = false,
  socialLinksForUpdate = {},
  updateSocialLinks,
}) {
  const [inputValue, setInputValue] = useState('')
  const [previewUrl, setPreviewUrl] = useState({
    facebook: socialLinksForUpdate.facebook ?? null,
    instagram: socialLinksForUpdate.instagram ?? null,
    tiktok: socialLinksForUpdate.tiktok ?? null,
  })

  // debounce
  const debouncedValue = useDebounce(previewUrl, 600)

  // пробрасываем наверх
  useEffect(() => {
    if (refactorRecipescrean && updateSocialLinks) {
      updateSocialLinks(previewUrl)
    } else if (setTotalRecipe) {
      setTotalRecipe((prev) => ({
        ...prev,
        social_links: debouncedValue,
      }))
    }
  }, [debouncedValue, refactorRecipescrean, updateSocialLinks, setTotalRecipe])

  const determinePlatform = (url) => {
    if (!url) return null
    const lower = url.toLowerCase()
    if (lower.includes('facebook.com')) return 'facebook'
    if (lower.includes('instagram.com')) return 'instagram'
    if (lower.includes('tiktok.com')) return 'tiktok'
    return null
  }

  const handleAddLink = () => {
    if (!inputValue.trim()) {
      toast.info(i18n.t('Add link'), i18n.t('Please enter a valid link'))

      return
    }

    const platform = determinePlatform(inputValue)
    if (!platform) {
      toast.info(
        i18n.t('Invalid link'),
        `${i18n.t('Please enter a valid link')} (Facebook, Instagram, TikTok)`,
      )

      return
    }

    setPreviewUrl((prev) => ({
      ...prev,
      [platform]: inputValue.trim(),
    }))
    setInputValue('')
  }

  return (
    <View>
      <TitleDescriptionComponent
        titleVisual
        titleText={i18n.t('Here you can add links to Facebook, Instagram, TikTok')}
        descriptionVisual
        descriptionText={`${i18n.t('If you want to add links to your facebook instagram tiktok')}`}
      />

      {/* превью ссылок */}
      {(previewUrl.facebook || previewUrl.instagram || previewUrl.tiktok) && (
        <SocialMediaEmbedComponent
          previewUrl={previewUrl}
          setPreviewUrl={setPreviewUrl}
        />
      )}

      {/* input + add button */}
      <View className="flex-row gap-x-1 justify-between items-center mt-3">
        <View className="relative flex-1">
          <InputComponent
            containerStyle={{ marginBottom: 0 }}
            icon={<LinkIcon size={20} color="grey" />}
            placeholder={i18n.t('Add link')}
            value={inputValue}
            onChangeText={setInputValue}
          />
          {inputValue.length > 0 && (
            <ButtonClearInputCustomComponent
              top={-15}
              left={-5}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          )}
        </View>

        <TouchableOpacity onPress={handleAddLink} style={shadowBoxBlack()}>
          <ButtonSmallCustom icon={PlusIcon} tupeButton="add" w={60} h={60} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AddLinkSocialComponent
