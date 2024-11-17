import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {shadowBoxBlack, shadowText} from "../constants/shadow";

import MasonryList from '@react-native-seoul/masonry-list';
import {mealData} from "../constants/fakeData";

import Animated, {FadeInDown} from 'react-native-reanimated';

// gradient
import {LinearGradient} from 'expo-linear-gradient';

const Recipes = ({categories}) => {
    return (
        <View className="gap-y-3">
            <Text
                style={[{fontSize: hp(3)},
                    shadowText(
                        {
                            color: 'rgba(0,0,0,0.4)',
                            offset: {width: 1.5, height: 1.5},
                            radius: 1,
                        }
                    )
                ]}
                className="font-semibold text-neutral-700 mb-2"
            >
                Recipes
            </Text>

            {/*    masonry*/}
            {
                categories === 0 ? null : (
                    <MasonryList
                        data={mealData}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                        style={{gap: 10}}
                        showsVerticalScrollIndicator={false}
                        renderItem={({item, i}) => <CardItem item={item} index={i}/>}
                        // refreshing={isLoadingNext}
                        // onRefresh={() => refetch({first: ITEM_CNT})}
                        onEndReachedThreshold={0.1}
                        // onEndReached={() => loadNext(ITEM_CNT)}
                    />
                )
            }

        </View>
    );
};

const CardItem = ({item, index}) => {
    // console.log('index', index)



    const isEven = index % 3 === 0;
    const imageHeight = isEven ? hp(25) : hp(35);

    return (
        <Animated.View
            entering={FadeInDown.delay((index+6)*200).springify().damping(30)}
            key={index}
            className="flex justify-center mb-[10] gap-y-1  p-[2]"
            style={[shadowBoxBlack({offset: {width: 1, height: 1}, opacity: 1, radius: 3})]}
        >
            <TouchableOpacity
                style={{width: '100%'}}
                className="rounded-full relative items-center"
            >
                <Image
                    source={{uri: item.image}}
                    style={{width: '100%', height: imageHeight, borderRadius: 35}}
                />
                <LinearGradient

                    colors={['transparent', '#18181b']}
                    style={{width: '100%', height: '100%', position: 'absolute', borderRadius: 35}}
                    start={{x: 0.5, y: 0.5}}
                    end={{x: 0.5, y: 1}}
                />
                <Text className="absolute bottom-[30] text-white font-medium text-center"
                      style={shadowText()}
                >{item.name}</Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default Recipes;
