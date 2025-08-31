import React from 'react'
import { View } from 'react-native'
import Shimmer from './Shimmer'
import { hp } from '../../constants/responsiveScreen'

/** Полоска аватаров-скелетонов (горизонтальная) */
export default function TopRecipeSkeleton() {
  const size = hp(6)
  return (
    <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <View key={i} style={{ marginHorizontal: 6 }}>
          <Shimmer width={size} height={size} borderRadius={999} />
        </View>
      ))}
    </View>
  )
}
