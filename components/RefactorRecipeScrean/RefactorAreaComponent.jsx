import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { hp } from '../../constants/responsiveScreen'
import { shadowBoxBlack } from '../../constants/shadow'
import { themes } from '../../constants/themes'
import { useAuth } from '../../contexts/AuthContext'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import ModalEditComponent from './ModalEditComponent'

function RefactorAreaComponent({ area, langApp, updateAreaText, Icon }) {
  const [modalVisible, setModalVisible] = useState(false)
  const { currentTheme } = useAuth()
  // console.log("RefactorAreaComponent area", area);
  // console.log("RefactorAreaComponent langApp", langApp);

  // Извлекаем регион на основе текущего языка
  const displayArea = area?.[langApp] || 'Неизвестный регион'

  // Функция обработки сохранения изменений
  const handleSave = (newText, lang) => {
    if (newText !== displayArea) {
      updateAreaText(newText, lang)
      // console.log(`Регион изменен с "${displayArea}" на "${newText}" для языка "${lang}"`);
    }
  }
  return (
    <View className="justify-center">
      <Text
        style={{ fontSize: hp(1.8), color: themes[currentTheme]?.secondaryTextColor }}
        className="font-medium "
      >
        {displayArea}
      </Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={shadowBoxBlack()}
        className="absolute top-[-10px] right-0"
      >
        <ButtonSmallCustom icon={Icon} tupeButton="refactor" size={15} w={30} h={30} />
      </TouchableOpacity>

      {/* Модальное окно для региона */}
      <ModalEditComponent
        visible={modalVisible}
        initialData={displayArea}
        lang={langApp}
        type="area"
        onSave={handleSave}
        onClose={() => setModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default RefactorAreaComponent
