import { TouchableOpacity, View } from 'react-native'
import { shadowBoxBlack } from '../../constants/shadow'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'
import { useEffect } from 'react'

function SelectLangComponent({ recipeDishArea, handleLangChange, langApp }) {
  const areaKeys = recipeDishArea ? Object.keys(recipeDishArea) : []

  useEffect(() => {
    if (areaKeys.length === 1) {
      handleLangChange(areaKeys)
    }
  }, [])

  return (
    <View className="flex-row flex-wrap gap-3">
      {/* <LanguageIcon size={hp(4)} strokeWidth={2.5} color="gray" /> */}

      {areaKeys?.length > 1 &&
        areaKeys.map((item) => {
          // console.log("SelectLangComponent item", item);

          const lang = item.toUpperCase()
          return (
            <TouchableOpacity
              onPress={() => handleLangChange(item)}
              key={item}
              className="flex-1"
              style={shadowBoxBlack()}
            >
              <ButtonSmallCustom
                w="auto"
                bg={langApp === item ? 'yellow' : 'green'}
                buttonText={true}
                // title={item}
                title={lang}
                styleText={{
                  marginLeft: 0,
                }}
              />
            </TouchableOpacity>
          )
        })}
    </View>
  )
}

export default SelectLangComponent
