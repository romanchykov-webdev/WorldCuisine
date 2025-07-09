import { Image } from 'expo-image'
import { StyleSheet, View } from 'react-native'
import ImageSliderCustom from '../../recipeDetails/ImageSliderCustom'

function SliderImagesListCreateRecipe({ images, createRecipe }) {
  // console.log('SliderImagesListCreateRecipe',images);
  // Преобразуем пути изображений для корректного отображения
  const formattedImages = images.map(image => ({
    uri: image.uri, // Используем URI с file://
  }))

  // console.log('SliderImagesListCreateRecipe',formattedImages);

  return (
    <View style={{ flex: 1 }}>
      <ImageSliderCustom
        createRecipe={createRecipe}
        images={formattedImages.map(image => ({
          uri: image.uri,
          render: uri => <Image source={{ uri }} style={styles.image} />, // Используем render для корректного отображения
        }))}

      />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    width: '100%',
    borderRadius: 15,
    margin: 10,
  },
})

export default SliderImagesListCreateRecipe
