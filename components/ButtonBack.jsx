import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { ArrowUturnLeftIcon } from 'react-native-heroicons/outline'
import { shadowBoxBlack, shadowBoxWhite } from '../constants/shadow'
import { useThemeStore } from '../stores/themeStore'

function ButtonBack() {
  const router = useRouter()

  const currentTheme = useThemeStore((s) => s.currentTheme)
  //

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      className="w-[50] h-[50] justify-center items-center bg-white rounded-full"
      style={currentTheme === 'light' ? shadowBoxBlack() : shadowBoxWhite()}
    >
      <ArrowUturnLeftIcon size={30} color="gray" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})

export default ButtonBack
