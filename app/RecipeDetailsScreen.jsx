import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import {getRecipeDish} from "../api";

import {Image} from 'expo-image'
import {hp, wp} from "../constants/responsiveScreen";
import {shadowBoxBlack,  shadowTextSmall} from "../constants/shadow";
import LoadingComponent from "../components/loadingComponent";
import {StatusBar} from "expo-status-bar";
import {LinearGradient} from "expo-linear-gradient";
import ButtonBack from "../components/ButtonBack";

import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";
import ButtonLike from "../components/ButtonLike";
import {ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon} from "react-native-heroicons/mini";

const RecipeDetailsScreen = () => {

    const {id} = useLocalSearchParams();


    const [loading, setLoading] = useState(false)

    const [recipeDish, setRecipeDish] = useState([])
    // console.log('id', id);


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


    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30, backgroundColor: 'white', flex: 1}}
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
                                <View className="absolute flex-row justify-between top-[60] pl-5 pr-5  w-full
                            {/*bg-red-500*/}
                            ">
                                    <ButtonBack/>

                                    <ButtonLike/>

                                </View>
                            </View>
                            {/* top image button back and like end*/}

                            {/*    dish and description*/}
                            <View
                                className="px-4 flex justify-between gap-y-5 "
                            >
                                {/*    name and area*/}
                                <View className="gap-y-2">
                                    <Text style={[{fontSize: hp(2.7)},shadowTextSmall()]} className="font-bold  text-neutral-700">
                                        {recipeDish?.strMeal}
                                    </Text>
                                    <Text style={{fontSize: hp(1.8)}} className="font-medium text-neutral-500">
                                        {recipeDish?.strArea}
                                    </Text>
                                </View>

                            </View>
                            {/*    dish and description  end*/}

                            {/*    misc     */}
                            <View className="flex-row justify-around">

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

                            </View>
                            {/*misc end*/}

                            {/*    ingredients*/}
                            <View className="gap-y-4">
                                <Text
                                    style={[{fontSize: hp(2.5)},shadowTextSmall()]}
                                    className="font-bold px-4 text-neutral-700"
                                >
                                    Ingredients
                                </Text>
                            </View>
                            {/*    ingredients  end*/}

                        </View> //end block


                    )
            }


        </ScrollView>

    );
};

const styles = StyleSheet.create({})

export default RecipeDetailsScreen;
