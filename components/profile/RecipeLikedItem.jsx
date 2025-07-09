import { StyleSheet, Text, View } from 'react-native'
import { wp } from '../../constants/responsiveScreen'
import AvatarCustom from '../AvatarCustom'

function RecipeLikedItem(item) {
  // console.log('RecipeLikedItem item', item);
  // console.log('RecipeLikedItem item', item?.item.imageHeader);

  return (
    <View>
      <AvatarCustom uri={item?.imageHeader} size={wp(50)} style={{ borderWidth: 0.2 }} rounded={150} />
      <Text>RecipeLikedItem</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default RecipeLikedItem
