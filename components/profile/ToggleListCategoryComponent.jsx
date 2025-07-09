import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Icon from 'react-native-vector-icons/Entypo'
import { shadowBoxBlack } from '../../constants/shadow'

function ToggleListCategoryComponent({ toggleFolderList, onToggleChange, hasRecipes }) {
  return (
    <View className="flex-row items-center justify-around flex-1">
      {hasRecipes && (
        <>
          {/* Folder */}
          <Animated.View entering={FadeInDown.springify().delay(300)}>
            <TouchableOpacity
              onPress={() => onToggleChange(true)}
              className={`w-[70] h-[70] justify-center items-center ${
                toggleFolderList ? 'bg-amber-300' : 'bg-white'
              } rounded-full`}
              style={shadowBoxBlack()}
            >
              <Icon name="folder" size={30} color={toggleFolderList ? 'white' : 'grey'} />
            </TouchableOpacity>
          </Animated.View>

          {/* List */}
          <Animated.View entering={FadeInDown.springify().delay(400)}>
            <TouchableOpacity
              onPress={() => onToggleChange(false)}
              className={`w-[70] h-[70] justify-center items-center ${
                toggleFolderList ? 'bg-white' : 'bg-amber-300'
              } rounded-full`}
              style={shadowBoxBlack()}
            >
              <Icon name="list" size={30} color={toggleFolderList ? 'grey' : 'white'} />
            </TouchableOpacity>
          </Animated.View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({})

export default ToggleListCategoryComponent
