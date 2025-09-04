import { StatusBar } from 'expo-status-bar'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { hp } from '../constants/responsiveScreen'
import { useThemeColors, useThemeStore } from '../stores/themeStore'

function WrapperComponent({ children, marginTopIos = 10, marginTopAnd = 60, stylesScrollView }) {
  const colors = useThemeColors()
  const currentTheme = useThemeStore((s) => s.currentTheme)

  return (
    // Корневой View с фоном — закрашивает всё (в т.ч. под safe area)
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      <SafeAreaView
        style={{ flex: 1 }}
        // какие края учитывать; top/left/right обычно достаточно
        edges={['top', 'left', 'right']}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          contentContainerStyle={[
            {
              paddingHorizontal: 20,
              paddingBottom: Platform.OS === 'ios' ? marginTopIos : marginTopAnd + 60,
              marginBottom: 20,
              marginTop: Platform.OS === 'ios' ? marginTopIos : marginTopAnd,
              minHeight: hp ? hp(100) : '100%',
            },
            stylesScrollView,
          ]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default WrapperComponent
