import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ArrowUpOnSquareStackIcon, TrashIcon } from 'react-native-heroicons/mini'
import i18n from '../../lang/i18n'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import LoadingComponent from '../loadingComponent'
import ViewImageListCreateRecipe from './RecipeListCreateRecipe/ViewImageListCreateRecipe'
import { useSingleImagePicker } from '../../lib/useSingleImagePicker'
import { shadowBoxBlack } from '../../constants/shadow'
import ImageCustom from '../recipeDetails/ImageCustom'

/**
 * props:
 *  - colors
 *  - value: string|null    (текущий uri)
 *  - onChange: (uri|null) => void
 */
export default function UploadHeaderImage({ colors, value, onChange }) {
  const { pickOne, isLoading } = useSingleImagePicker()
  // console.log('UploadHeaderImage value', value)

  const handlePick = async () => {
    const res = await pickOne()
    if (res?.uri) onChange(res.uri)
  }

  const handleRemove = () => onChange?.(null)

  const hasImage = typeof value === 'string' && value.length > 0

  return (
    <View style={[styles.container, { radius: colors.radiusMD }, shadowBoxBlack()]}>
      {hasImage ? (
        <View className="relative ">
          <TouchableOpacity
            onPress={handleRemove}
            className="absolute top-[-5] right-0 z-10"
          >
            <ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
          </TouchableOpacity>
          {/*<ViewImageListCreateRecipe image={value} />*/}
          <ImageCustom image={value} />
        </View>
      ) : (
        <TouchableOpacity
          onPress={handlePick}
          className="border-2 border-neutral-200 w-full h-[200] rounded-[15] justify-center"
        >
          <View className="items-center">
            {isLoading ? (
              <LoadingComponent />
            ) : (
              <>
                <Text className="mb-2" style={{ color: colors.textColor }}>
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

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    position: 'relative',
  },
})
