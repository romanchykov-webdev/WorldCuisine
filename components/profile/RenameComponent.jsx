import { useState } from 'react'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { PencilSquareIcon } from 'react-native-heroicons/mini'
import { ArrowUturnLeftIcon } from 'react-native-heroicons/outline'

function RenameComponent({ name, handleRename, setNewUserName, newUserName }) {
  // const [renameInput, setRenameInput] = useState('')

  const [renameToggle, setRenameToggle] = useState(false)
  const toggleRename = () => {
    setRenameToggle(!renameToggle)
  }

  const renameInput = (value) => {
    setNewUserName(value)
  }

  return (
    <View
      className="relative flex-row items-center
                "
    >
      {!renameToggle ? (
        <Text className="capitalize p-5">{name}</Text>
      ) : (
        <View className=" w-[200] p-[6]">
          <TextInput
            value={newUserName}
            onChangeText={(value) => renameInput(value)}
            placeholder="Your new Name"
            placeholderTextColor="gray"
            className="border-b-2 border-neutral-700 p-3 w-full "
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          ;(handleRename(name), toggleRename())
        }}
        className="absolute p-5 right-[-40] top-[-10]"
      >
        <View>
          {!renameToggle ? (
            <PencilSquareIcon size={20} color="grey" />
          ) : (
            <ArrowUturnLeftIcon size={20} color="gray" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})

export default RenameComponent
