// WrapperComponent.jsx
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Platform, ScrollView, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useThemeColors, useThemeStore } from '../stores/themeStore'
import { commonPadding } from '../constants/constants'

function WrapperComponent({
  children,
  marginTopIos = 10,
  marginTopAnd = 60,
  stylesScrollView,
  scroll = true,
}) {
  const colors = useThemeColors()
  const currentTheme = useThemeStore((s) => s.currentTheme)

  // const commonPadding = {
  //   paddingHorizontal: 20,
  //   paddingBottom: Platform.OS === 'ios' ? marginTopIos : marginTopAnd + 60,
  //   marginBottom: 20,
  //   marginTop: Platform.OS === 'ios' ? marginTopIos : marginTopAnd,
  //   flexGrow: 1,
  // }

  return (
    <View style={{ flex: 1, backgroundColor: colors.backgroundColor }}>
      <StatusBar style={currentTheme === 'light' ? 'dark' : 'light'} />
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {scroll ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            contentContainerStyle={[commonPadding, stylesScrollView]}
          >
            {children}
          </ScrollView>
        ) : (
          // без ScrollView, чтобы внутренний MasonryList сам управлял скроллом
          <View
            style={[
              {
                flex: 1,
                paddingHorizontal: 20,
                paddingTop: Platform.OS === 'ios' ? marginTopIos : marginTopAnd,
              },
              stylesScrollView,
            ]}
          >
            {children}
          </View>
        )}
      </SafeAreaView>
    </View>
  )
}

export default WrapperComponent
