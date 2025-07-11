import { StatusBar } from 'expo-status-bar'
import { Platform, SafeAreaView, ScrollView, StyleSheet } from 'react-native'
import { hp } from '../constants/responsiveScreen'
import { themes } from '../constants/themes'
import { useAuth } from '../contexts/AuthContext'

function WrapperComponent({ children, marginTopIos = 10, marginTopAnd = 60, stylesScrollView }) {
  const { currentTheme } = useAuth()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themes[currentTheme]?.backgroundColor }}>
      <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      <ScrollView
        contentContainerStyle={[
          {
            paddingHorizontal: 20,
            marginBottom: 20,
            // backgroundColor: "red",
            // backgroundColor: themes[currentTheme].backgroundColor, // Устанавливаем цвет фона
            marginTop: Platform.OS === 'ios' ? marginTopIos : marginTopAnd,
            minHeight: hp ? hp(100) : '100%',
          },
          stylesScrollView,
        ]}
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})

export default WrapperComponent
