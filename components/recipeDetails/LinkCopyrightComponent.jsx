import { Link } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import i18n from '../../lang/i18n'

function LinkCopyrightComponent({ linkCopyright }) {
  // console.log("LinkCopyrightComponent", linkCopyright);

  if (!linkCopyright) {
    return null // Или placeholder, например: <Text>Ссылка отсутствует</Text>
  }

  return (
    <View className="flex-row gap-x-4 items-center flex-1">
      <View style={{ height: 20, width: 20 }} className="bg-amber-300 rounded-full" />
      <View className="flex-row gap-x-2 items-center justify-between  flex-1">
        <Link href={linkCopyright} className="text-blue-900 font-bold text-xl underline">
          {i18n.t('Link to the author')}
        </Link>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})

export default LinkCopyrightComponent
