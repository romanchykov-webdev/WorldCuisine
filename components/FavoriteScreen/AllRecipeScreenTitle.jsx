import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import Animated, { FadeInLeft, FadeInRight, FadeInUp } from 'react-native-reanimated'
import { shadowBoxBlack } from '../../constants/shadow'
import ButtonBack from '../ButtonBack'
import TitleScreen from '../TitleScreen'
import i18n from '../../lang/i18n'
import { AdjustmentsVerticalIcon } from 'react-native-heroicons/mini'

const AllRecipeScreenTitle = ({ isFavoriteScreen, setFilterOpen }) => {
  return (
    <>
      {isFavoriteScreen && (
        <View className="flex-row h-[56px] mb-[16px] items-center justify-center">
          <Animated.View
            entering={FadeInLeft.delay(300).springify().damping(30)}
            className="absolute left-0"
            style={shadowBoxBlack()}
          >
            <ButtonBack />
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(500).springify().damping(30)}>
            <TitleScreen title={i18n.t('Recipes')} />
          </Animated.View>

          <Animated.View
            className="absolute right-0"
            entering={FadeInRight.delay(700).springify().damping(30)}
          >
            <TouchableOpacity
              onPress={() => setFilterOpen(true)}
              style={[
                {
                  height: 50,
                  width: 50,
                  borderWidth: 0.2,
                  borderColor: 'black',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                },
                shadowBoxBlack(),
              ]}
            >
              <AdjustmentsVerticalIcon color="grey" size={30} />
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </>
  )
}

export default AllRecipeScreenTitle
