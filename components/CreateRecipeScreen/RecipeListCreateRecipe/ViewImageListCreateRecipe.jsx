import { Image } from 'expo-image'
import { StyleSheet, View } from 'react-native'
import { shadowBoxBlack } from '../../../constants/shadow'

function ViewImageListCreateRecipe({ image }) {
  // image: строка URL ИЛИ массив вида [{ uri }]
  console.log('image', image)
  let imageSource = null

  if (typeof image === 'string' && image) {
    imageSource = { uri: image }
  } else if (Array.isArray(image) && image[0] && image[0].uri) {
    imageSource = { uri: image[0].uri }
  }

  return (
    <View className="p-[1px]">
      <View
        style={shadowBoxBlack({
          offset: { width: 1, height: 1 },
          opacity: 0.9,
        })}
      >
        <Image
          source={imageSource ?? require('../../../assets/images/react-logo3x.png')}
          transition={100}
          style={styles.image}
          contentFit="cover"
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    height: 250,
    borderCurve: 'continuous',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
  },
})

export default ViewImageListCreateRecipe
