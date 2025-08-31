import React from 'react'
import { View } from 'react-native'
import Shimmer from './Shimmer'

export default function CardSkeletonRow() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Shimmer width="100%" height={160} borderRadius={16} />
      <Shimmer width="70%" height={16} />
      <Shimmer width="40%" height={16} />
    </View>
  )
}
