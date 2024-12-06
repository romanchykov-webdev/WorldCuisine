import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {shadowBoxBlack, shadowText} from "../constants/shadow";

import MasonryList from '@react-native-seoul/masonry-list';
import {mealData} from "../constants/fakeData";

import Animated, {FadeInDown} from 'react-native-reanimated';

import {Image} from 'expo-image'

// icons import
import {HeartIcon, ChatBubbleOvalLeftEllipsisIcon, StarIcon} from "react-native-heroicons/outline";

// gradient
import {LinearGradient} from 'expo-linear-gradient';
import LoadingComponent from "./loadingComponent";
import {useRouter} from "expo-router";
import {getDeviceType} from "../constants/getWidthDevice";

const Recipes = ({categories, recipes}) => {

    const [column, setColumn] = useState(0)

    useEffect(() => {
        // Определяем тип устройства и обновляем количество колонок
        const type = getDeviceType(window.innerWidth);
        setColumn(type);

    }, [])
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
                        <LoadingComponent size="large" color="gray"/>
                    )
                    : (
                        <MasonryList
                            // data={mealData}
                            data={recipes}
                            keyExtractor={(item) => item.idMeal}
                            // numColumns={2}
                            numColumns={column}
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
    const router = useRouter()


    const isEven = index % 3 === 0;
    const imageHeight = isEven ? hp(25) : hp(35);

    const loadingImage = () => {
        // console.log('loading')
    }

    return (
        <Animated.View
            entering={FadeInDown.delay((index + 4) * 200).springify().damping(30)}
            // key={index}
            key={item.idMeal}
            className="flex justify-center mb-[10] gap-y-1  p-[2]"
            style={[shadowBoxBlack({offset: {width: 1, height: 1}, opacity: 1, radius: 3})]}
        >
            <TouchableOpacity
                onPress={() => router.push({
                    pathname: '/RecipeDetailsScreen',
                    params: {id: item.idMeal},
                })}
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


                {/*    icons like comments rating*/}
                <View className=" absolute bottom-[20] items-center justify-around">
                    <Text className=" text-white font-medium text-center mb-2"
                          style={shadowText()}
                    >
                        {/*{item.name}*/}
                        {item.strMeal}
                    </Text>

                    {/*icons*/}
                    <View className="flex-row items-center justify-around  w-full
                    {/*bg-red-500*/}
                    ">
                        {/*    like*/}
                        <View className="items-center flex-row">
                            <HeartIcon size={25} color='gray'/>
                            {/*<HeartIcon size={30} color='gray' fill='red'/>*/}
                            <Text style={{fontSize: 8}} className="text-white"> 3</Text>
                        </View>

                        {/*    comments*/}
                        <View className="items-center flex-row">
                            <ChatBubbleOvalLeftEllipsisIcon size={25} color='gray'/>
                            <Text style={{fontSize: 8}} className="text-white"> 3</Text>
                        </View>

                        {/*    StarIcon*/}
                        <View className="items-center flex-row">
                            <StarIcon size={25} color='gray'/>
                            <Text style={{fontSize: 8}} className="text-white"> 3.5</Text>
                        </View>
                    </View>


                </View>
            </TouchableOpacity>
        </Animated.View>
    )
}

export default Recipes;
