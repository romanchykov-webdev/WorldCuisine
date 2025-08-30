import { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { ArrowUpOnSquareStackIcon, TrashIcon } from 'react-native-heroicons/mini'
import i18n from '../../lang/i18n'
import { useImagePicker } from '../../lib/imageUtils'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import LoadingComponent from '../loadingComponent'
import StərɪskCustomComponent from '../StərɪskCustomComponent'
import InputCustomComponent from './InputCustomComponent'
import ViewImageListCreateRecipe from './RecipeListCreateRecipe/ViewImageListCreateRecipe'

function UploadHeaderImage({
  styleTextDesc,
  styleInput,
  langDev,
  setTotalLangRecipe,
  totalLangRecipe,
  setTotalRecipe,
  totalRecipe,
  currentTheme,
  themes,
  imageHeaderForUpdate = null, // ожидаем строку URL или null
}) {
  const [addImage, setAddImage] = useState(null) // строка URL или null
  const [loadingCompresImg, setLoadingCompresImg] = useState(false)

  //  кастомный хук
  const { addImageRecipeList } = useImagePicker(addImage, setAddImage, setLoadingCompresImg)

  // const { addImageRecipeList } = useImagePicker(addImage, setAddImage, setLoadingCompresImg)
  useEffect(() => {
    if (imageHeaderForUpdate) {
      setAddImage(imageHeaderForUpdate)
    } else {
      setAddImage(null)
    }
  }, [imageHeaderForUpdate])

  const handleImagePick = async () => {
    const imageUrl = await addImageRecipeList()
    if (imageUrl) {
      setAddImage(imageUrl)
      setTotalRecipe((prev) => ({ ...prev, image_header: imageUrl }))
    }
  }

  const handlerRemoveHeaderImage = () => {
    setAddImage(null)
    setTotalRecipe((prev) => ({ ...prev, image_header: null }))
  }

  const hasImage = typeof addImage === 'string' && addImage.length > 0

  return (
    <View className="mb-5 relative">
      <StərɪskCustomComponent />

      {hasImage ? (
        <View className="relative">
          <TouchableOpacity
            onPress={handlerRemoveHeaderImage}
            className="absolute top-[-5] right-0 z-10"
          >
            <ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
          </TouchableOpacity>

          <ViewImageListCreateRecipe image={addImage} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleImagePick}
          className="border-2 border-neutral-200 w-full h-[200] rounded-[15] justify-center"
        >
          <View className="items-center">
            {loadingCompresImg ? (
              <LoadingComponent />
            ) : (
              <>
                <Text className="mb-2" style={{ color: themes[currentTheme].textColor }}>
                  {i18n.t('Upload your image')}
                </Text>
                <ArrowUpOnSquareStackIcon size={50} color="green" />
              </>
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default UploadHeaderImage
