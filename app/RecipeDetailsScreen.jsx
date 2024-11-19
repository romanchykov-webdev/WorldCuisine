import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {getRecipeDish} from "../api";

import {Image} from 'expo-image'
import {hp, wp} from "../constants/responsiveScreen";
import {shadowBoxBlack, shadowTextSmall} from "../constants/shadow";
import LoadingComponent from "../components/loadingComponent";
import {StatusBar} from "expo-status-bar";
import {LinearGradient} from "expo-linear-gradient";
import ButtonBack from "../components/ButtonBack";

import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";
import ButtonLike from "../components/ButtonLike";
import {ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon} from "react-native-heroicons/mini";

import YouTubeIframe from 'react-native-youtube-iframe'

const RecipeDetailsScreen = () => {

    const {id} = useLocalSearchParams();


    const [loading, setLoading] = useState(false)

    const [recipeDish, setRecipeDish] = useState([])
    // console.log('id', id);
    // console.log('recipeDish', recipeDish);


    const fetchRecipeDish = async (id) => {
        // console.log('id', id);
        setLoading(true)
        const response = await getRecipeDish(id)
        // console.log('fetchRecipesDish',response)
        if (response && response) {
            setRecipeDish(response)
        }
        // setTimeout(() => {
        setLoading(false)
        // }, 400)

    }
    useEffect(() => {
        fetchRecipeDish(id)
    }, [])
    // console.log('recipeDish', recipeDish);


    // get ingredients
    const ingredientsIndexes = (recipeDish) => {
        if (!recipeDish) return [];

        let indexes = [];
        for (let i = 1; i <= 20; i++) {
            if (recipeDish['strIngredient' + i]) {
                indexes.push(i)
            }
        }
        // console.log('indexes', indexes)
        return indexes;
    }
    // ingredientsIndexes(recipeDish)
    // get ingredients


    // get video id
    const getYoutobeVideoId = url => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);

        if(match && match[1]){
            return match[1]
        }
        return null

    }
    // get video id

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30, backgroundColor: 'white'}}
        >
            <StatusBar style='light'/>
            {
                loading || recipeDish.length === 0
                    ? (<LoadingComponent size="large" color="gray"/>)
                    : (

                        <View className="gap-y-5">

                            {/* top image button back and like*/}
                            <View className="flex-row justify-center relative" style={shadowBoxBlack()}>

                                <Animated.View
                                    entering={FadeInUp.duration(400).delay(100)}
                                >
                                    <Image
                                        source={{uri: recipeDish?.strMealThumb}}
                                        contentFit="cover"
                                        transition={1000}
                                        style={{
                                            width: wp(98),
                                            height: hp(50),
                                            borderRadius: 40,
                                            marginTop: wp(1),
                                            borderWidth: 0.5,
                                            borderColor: 'gray'
                                        }}
                                    />
                                </Animated.View>
                                <LinearGradient
                                    colors={['transparent', '#18181b']}
                                    style={{
                                        width: wp(98),
                                        height: '20%',
                                        position: 'absolute',
                                        top: wp(1),
                                        borderRadius: 40,
                                        borderBottomRightRadius: 0,
                                        borderBottomLeftRadius: 0
                                    }}
                                    start={{x: 0.5, y: 1}}
                                    end={{x: 0.5, y: 0}}
                                />
                                <Animated.View
                                    entering={FadeInUp.duration(400).delay(500)}
                                    className="absolute flex-row justify-between top-[60] pl-5 pr-5  w-full
                                    {/*bg-red-500*/}
                                    ">
                                    <ButtonBack/>

                                    <ButtonLike/>

                                </Animated.View>
                            </View>
                            {/* top image button back and like end*/}

                            {/*    dish and description*/}
                            <Animated.View
                                entering={FadeInDown.delay(600)}
                                className="px-4 flex justify-between gap-y-5 "
                            >
                                {/*    name and area*/}
                                <View className="gap-y-2">
                                    <Text style={[{fontSize: hp(2.7)}, shadowTextSmall()]}
                                          className="font-bold  text-neutral-700">
                                        {recipeDish?.strMeal}
                                    </Text>
                                    <Text style={{fontSize: hp(1.8)}} className="font-medium text-neutral-500">
                                        {recipeDish?.strArea}
                                    </Text>
                                </View>

                            </Animated.View>
                            {/*    dish and description  end*/}

                            {/*    misc     */}
                            <Animated.View
                                entering={FadeInDown.delay(700)}
                                className="flex-row justify-around">

                                {/*ClockIcon*/}
                                <View className="flex rounded-full bg-amber-300 p-2"
                                      style={shadowBoxBlack()}
                                >

                                    <View
                                        className="bg-white rounded-full flex items-center justify-around"
                                        style={{width: hp(6.5), height: hp(6.5)}}
                                    >
                                        <ClockIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                                    </View>

                                    {/*    descriptions*/}
                                    <View className="flex items-center py-2 gap-y-1">
                                        <Text style={{fontSize: hp(2)}} className="font-bold  text-neutral-700">
                                            35
                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500">
                                            Mins
                                        </Text>
                                    </View>

                                </View>

                                {/*users*/}
                                <View className="flex rounded-full bg-amber-300 p-2"
                                      style={shadowBoxBlack()}
                                >

                                    <View
                                        className="bg-white rounded-full flex items-center justify-around"
                                        style={{width: hp(6.5), height: hp(6.5)}}
                                    >
                                        <UsersIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                                    </View>

                                    {/*    descriptions*/}
                                    <View className="flex items-center py-2 gap-y-1">
                                        <Text style={{fontSize: hp(2)}} className="font-bold  text-neutral-700">
                                            3
                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                            Person
                                        </Text>
                                    </View>

                                </View>

                                {/*calories*/}
                                <View className="flex rounded-full bg-amber-300 p-2"
                                      style={shadowBoxBlack()}
                                >

                                    <View
                                        className="bg-white rounded-full flex items-center justify-around"
                                        style={{width: hp(6.5), height: hp(6.5)}}
                                    >
                                        <FireIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                                    </View>

                                    {/*    descriptions*/}
                                    <View className="flex items-center py-2 gap-y-1">
                                        <Text style={{fontSize: hp(2)}} className="font-bold  text-neutral-700">
                                            103
                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                            Cal
                                        </Text>
                                    </View>

                                </View>

                                {/*level*/}
                                <View className="flex rounded-full bg-amber-300 p-2"
                                      style={shadowBoxBlack()}
                                >

                                    <View
                                        className="bg-white rounded-full flex items-center justify-around"
                                        style={{width: hp(6.5), height: hp(6.5)}}
                                    >
                                        <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                                    </View>

                                    {/*    descriptions*/}
                                    <View className="flex items-center py-2 gap-y-1">
                                        <Text style={{fontSize: hp(2)}} className="font-bold  text-neutral-700">

                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                            Easy
                                        </Text>
                                    </View>

                                </View>

                            </Animated.View>
                            {/*misc end*/}

                            {/*    ingredients*/}
                            <Animated.View
                                entering={FadeInDown.delay(800)}
                                className="gap-y-4 px-4">
                                <Text
                                    style={[{fontSize: hp(2.5)}, shadowTextSmall()]}
                                    className="font-bold px-4 text-neutral-700"
                                >
                                    Ingredients
                                </Text>

                                {/*    */}
                                <View className="gap-y-2">
                                    {
                                        ingredientsIndexes(recipeDish).map(i => {
                                            return (
                                                <View key={i} className="flex-row gap-x-4 items-center">
                                                    <View style={{height: hp(1.5), width: hp(1.5)}}
                                                          className="bg-amber-300 rounded-full"
                                                    />
                                                    <View className="flex-row gap-x-2">
                                                        <Text
                                                            style={{fontSize: hp(1.7)}}
                                                            className="font-extrabold text-neutral-700">{recipeDish['strIngredient' + i]} -</Text>
                                                        <Text
                                                            style={{fontSize: hp(1.7)}}
                                                            className="font-medium text-neutral-600">{recipeDish['strMeasure' + i]}</Text>
                                                    </View>

                                                </View>
                                            )
                                        })
                                    }
                                </View>
                            </Animated.View>
                            {/*    ingredients  end*/}

                            {/*    instructions*/}
                            <Animated.View
                                entering={FadeInDown.delay(800)}
                                className="gap-y-4 px-4">
                                <Text
                                    style={[{fontSize: hp(2.5)}, shadowTextSmall()]}
                                    className="font-bold px-4 text-neutral-700"
                                >
                                    Ingredients
                                </Text>

                                {/*    */}
                                <Text style={{fontSize: hp(1.6)}} className="text-neutral-700">
                                    {recipeDish?.strInstructions}
                                </Text>
                            </Animated.View>
                            {/*    instructions  end*/}

                            {/*    recipe video*/}
                            {
                                recipeDish?.strYoutube && (
                                    <Animated.View
                                        entering={FadeInDown.delay(900)}
                                        className="gap-y-4">
                                        <Text
                                            style={[{fontSize: hp(2.5)}, shadowTextSmall()]}
                                            className="font-bold px-4 text-neutral-700"
                                        >
                                            Recipe video
                                        </Text>
                                        {/*    plaer*/}
                                        <View className="px-4">
                                            <YouTubeIframe
                                                videoId={getYoutobeVideoId(recipeDish?.strYoutube)}
                                                // videoId='nMyBC9staMU'
                                                height={hp(30)}
                                            />
                                        </View>
                                    </Animated.View>

                                )
                            }
                            {/*    recipe video end*/}

                        </View> //end block


                    )
            }


        </ScrollView>

    );
};


export default RecipeDetailsScreen;
