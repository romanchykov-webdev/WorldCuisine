// высота стеклянного хедара
import { Platform } from 'react-native'

export const HEADER_HEIGHT = 56

//
const marginTopIos = 10
const marginTopAnd = 60
export const commonPadding = {
  paddingHorizontal: 20,
  paddingBottom: Platform.OS === 'ios' ? marginTopIos : marginTopAnd + 60,
  marginBottom: 20,
  marginTop: Platform.OS === 'ios' ? marginTopIos : marginTopAnd,
  flexGrow: 1,
}
