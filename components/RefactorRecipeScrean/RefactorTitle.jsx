import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import ModalEditComponent from './ModalEditComponent'

function RefactorTitle({ title, langApp, updateHeaderTitle, Icon }) {
  const { currentTheme } = useAuth()
  const [modalVisible, setModalVisible] = useState(false)

  // Новая структура: просто берём строку по текущему языку
  const displayTitle = (title && title[langApp]) || title?.en || 'Без названия'

  const handleSave = (newText, lang) => {
    if (newText !== displayTitle) {
      // родитель должен обновить title[lang] = newText
      updateHeaderTitle(newText, lang)
    }
    setModalVisible(false)
  }

  return (
    <View>
      <View className="flex-row justify-between items-start">
        <Text
          style={{ fontSize: hp(2.7), color: themes[currentTheme]?.textColor }}
          className="font-bold flex-1"
          numberOfLines={2}
        >
          {displayTitle}
        </Text>

        <TouchableOpacity onPress={() => setModalVisible(true)} style={shadowBoxBlack()}>
          <ButtonSmallCustom icon={Icon} tupeButton="refactor" size={15} w={30} h={30} />
        </TouchableOpacity>
      </View>

      <ModalEditComponent
        visible={modalVisible}
        initialData={displayTitle}
        lang={langApp}
        type="title"
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default RefactorTitle
