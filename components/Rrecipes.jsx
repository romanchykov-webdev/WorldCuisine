import React, {useEffect} from 'react';
import {View, Text,  TouchableOpacity, ActivityIndicator} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {shadowBoxBlack, shadowText} from "../constants/shadow";

import MasonryList from '@react-native-seoul/masonry-list';
import {mealData} from "../constants/fakeData";

import Animated, {FadeInDown} from 'react-native-reanimated';

import {Image} from 'expo-image'

// gradient
import {LinearGradient} from 'expo-linear-gradient';
import Loading from "./loading";

const Recipes = ({categories,recipes}) => {

    // console.log('Recipes',recipes)

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
                // categories === 0 ? null : (
                // categories.lenght === 0 ||
                recipes.length == 0
                    ? (
                        <Loading size="large" color="gray" />
                    )
                    : (
                    <MasonryList
                        // data={mealData}
                        data={recipes}
                        keyExtractor={(item) => item.idMeal}
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

    const loadingImage=()=>{
        // console.log('loading')
    }

    return (
        <Animated.View
            entering={FadeInDown.delay((index+4)*200).springify().damping(30)}
            // key={index}
            key={item.idMeal}
            className="flex justify-center mb-[10] gap-y-1  p-[2]"
            style={[shadowBoxBlack({offset: {width: 1, height: 1}, opacity: 1, radius: 3})]}
        >
            <TouchableOpacity
                style={{width: '100%'}}
                className="rounded-full relative items-center"
            >
                <Image
                    // source={{uri: item.image}}
                    source={{uri: item.strMealThumb}}
                    style={{width: '100%', height: imageHeight, borderRadius: 35}}
                    contentFit="cover"
                    transition={1000}
                    onLoad={loadingImage}
                />
                <LinearGradient

                    colors={['transparent', '#18181b']}
                    style={{width: '100%', height: '100%', position: 'absolute', borderRadius: 35}}
                    start={{x: 0.5, y: 0.5}}
                    end={{x: 0.5, y: 1}}
                />
                <Text className="absolute bottom-[30] text-white font-medium text-center"
                      style={shadowText()}
                >
                    {/*{item.name}*/}
                    {item.strMeal}
                </Text>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default Recipes;
