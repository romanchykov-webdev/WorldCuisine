import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert} from 'react-native';
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
import {ChatBubbleOvalLeftIcon, StarIcon} from "react-native-heroicons/outline";
import RatingComponents from "../components/RatingComponents";

// for rating
// import StarRating, {StarRatingDisplay} from 'react-native-star-rating-widget';
import {calculateRating} from "../constants/ratingHalper";
import CommentsComponent from "../components/CommentsComponent";
import {getRecipesDescriptionMyDB} from "../service/getDataFromDB";
import AvatarCustom from "../components/AvatarCustom";
import {useAuth} from "../contexts/AuthContext";

// translate
import i18n from '../lang/i18n'
import RecipeIngredients from "../components/recipeDetails/RecipeIngredients";

const RecipeDetailsScreen = () => {



    const { language:langDev } = useAuth();
    i18n.locale = langDev; // Устанавливаем текущий язык
    // console.log('RecipeDetailsScreen langDev',langDev)

    const [loading, setLoading] = useState(false)

    const [recipeDish, setRecipeDish] = useState(null)

    // Когда блок попадет в видимую область
    const [isCommentsVisible, setIsCommentsVisible] = useState(false);
    const [hasLayoutBeenMeasured, setHasLayoutBeenMeasured] = useState(false); // Флаг для отслеживания измерений

    // Плавный запрос на сервер, когда компонент становится видимым
    const handleVisibilityChange = (event) => {
        const { layout } = event.nativeEvent;
        const { height } = layout;

        // Проверяем, что блок с комментариями стал видимым и что проверка еще не была выполнена
        if (height > 0 && !isCommentsVisible && !hasLayoutBeenMeasured) {
            setIsCommentsVisible(true);
            setHasLayoutBeenMeasured(true); // Помечаем, что проверка уже была выполнена
            console.log('block Comments is visible');
        }
    };

    // console.log('RecipeDetailsScreen recipeDish', JSON.stringify(recipeDish,null,2));

    const {user, setAuth, setUserData} = useAuth();

    // console.log('RecipeDetailsScreen setAuth',user);

    const {id} = useLocalSearchParams();

    const [rating, setRating] = useState('0')

    // console.log('RecipeDetailsScreen id ',id)
    // console.log('RecipeDetailsScreen langApp ',langApp)

    const comments = ['ok', 'wery bast', 'naise', 'kryto']


    // rating xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


    useEffect(() => {
    if (recipeDish?.rating?.averageScore !== undefined) {
        const averageScoreString = recipeDish.rating.averageScore.toString();
        setRating(averageScoreString); // Устанавливаем строковое значение
        // console.log('recipeDish.rating.averageScore (as string):', averageScoreString);
        // console.log('rating (as string):', rating);
    }
    },[recipeDish])


    // let rating = recipeDish?.rating?.averageScore;

    const handleStarPress = (starIndex) => {
        // console.log('Star pressed:', starIndex); // Индекс звезды
        // setChangeRating(starIndex); // Установить рейтинг

        // ratings.push(starIndex);

        //add rating to db

        // Alert.alert('Rating',`You have rated this recipe: ${starIndex}`)


        //update rating to the item on dataBAse
    };
    // rating xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

    // scroll xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    const scrollViewRef = useRef(null);
    const commentsRef = useRef(null);

    const scrollToComments = () => {


        commentsRef.current?.measureLayout(
            scrollViewRef.current.getNativeScrollRef(),
            (x, y) => {
                scrollViewRef.current.scrollTo({y, animated: true}); // Плавный скролл
            }
        );


    };
    // scroll xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



    // console.log('id', id);
    // console.log('recipeDish', recipeDish);


    useEffect(() => {
        const fetchRecipeDish = async () => {
            try {
                // console.log('Fetching with ID:', id, 'and tableCategory:', tableCategory);
                setLoading(true);
                const response = await getRecipesDescriptionMyDB(id);
                // console.log('API Response:', response);
                setRecipeDish(response?.data[0] || null);

                setTimeout(()=>{
                    setLoading(false);
                },1000)
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setTimeout(()=>{
                    setLoading(false);
                },1000)
            }
        };

        fetchRecipeDish();
    }, [id]);
    // console.log('recipeDish', recipeDish);





    // get video id
    const getYoutobeVideoId = url => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);

        if (match && match[1]) {
            return match[1]
        }
        return null

    }
    // get video id
    // console.log('RecipeDetailsScreen recipeDish',JSON.stringify(recipeDish,null,2))
    // console.log('recipeDish.imageHeader',recipeDish.imageHeader)
    return (
        <ScrollView
            ref={scrollViewRef} //for scroll
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 30, backgroundColor: 'white' }}
        >
            <StatusBar style='light'/>
            {
                loading || recipeDish === null

                    ? (
                        <View style={{height:hp(100)}}>
                            <LoadingComponent size="large" color="green"/>
                        </View>
                    )
                    : (

                        <View className="gap-y-5" key={id}>

                            {/* top image button back and like*/}
                            <View className="flex-row justify-center relative" style={shadowBoxBlack()}>

                                <Animated.View
                                    entering={FadeInUp.duration(400).delay(100)}
                                >
                                    {/*<Image*/}
                                    {/*    source={{uri: recipeDish?.strMealThumb}}*/}
                                    {/*    contentFit="cover"*/}
                                    {/*    transition={1000}*/}
                                    {/*    style={{*/}
                                    {/*        width: wp(98),*/}
                                    {/*        height: hp(50),*/}
                                    {/*        borderRadius: 40,*/}
                                    {/*        marginTop: wp(1),*/}
                                    {/*        borderWidth: 0.5,*/}
                                    {/*        borderColor: 'gray'*/}
                                    {/*    }}*/}
                                    {/*/>*/}
                                    <AvatarCustom
                                        uri={recipeDish.imageHeader}
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

                                    <ButtonLike user={user ?? null}/>

                                </Animated.View>

                                {/*    rating and comments*/}
                                <Animated.View
                                    entering={FadeInDown.duration(400).delay(500)}
                                    className="absolute flex-row justify-between bottom-[20] pl-5 pr-5  w-full
                                    {/*bg-red-500*/}
                                    ">
                                    {/*    StarIcon*/}
                                    <View className="items-center justify-center flex-row w-[60] h-[60] rounded-full"
                                          style={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                                    >
                                        <StarIcon size={45} color='gold'/>
                                        <Text style={{fontSize: 8}} className="text-neutral-700 absolute">
                                            {rating}
                                        </Text>
                                    </View>

                                    {/*    comments*/}
                                    <View className="items-center justify-center flex-row w-[60] h-[60] rounded-full"
                                          style={{backgroundColor: 'rgba(255,255,255,0.5)'}}
                                    >
                                        <TouchableOpacity
                                            className="items-center justify-center flex-row"
                                            onPress={scrollToComments}
                                        >
                                            <ChatBubbleOvalLeftIcon size={45} color='gray'/>
                                            <Text style={{fontSize: 8}} className="text-neutral-700 absolute">
                                                {recipeDish?.comments}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>


                                </Animated.View>
                            </View>
                            {/* top image button back and like end*/}


                            <RatingComponents rating={rating} handleStarPress={handleStarPress} user={user ?? null}/>


                            {/*    dish and description*/}
                            <Animated.View
                                entering={FadeInDown.delay(600)}
                                className="px-4 flex justify-between gap-y-5 "
                            >
                                {/*    name and area*/}
                                <View className="gap-y-2">
                                    <Text style={[{fontSize: hp(2.7)}, shadowTextSmall()]}
                                          className="font-bold  text-neutral-700">
                                        {/*{recipeDish?.strMeal}*/}
                                        {
                                            recipeDish?.title?.lang.find(it=>it.lang===langDev)?.name || recipeDish?.title?.strTitle
                                        }
                                    </Text>
                                    <Text style={{fontSize: hp(1.8)}} className="font-medium text-neutral-500">
                                        {/*{recipeDish?.strArea}*/}
                                        {
                                            recipeDish?.area
                                        }
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
                                            {/*35*/}
                                            {
                                                recipeDish?.recipeMetrics?.time?.value
                                            }
                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500">
                                            {i18n.t('Mins')}
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
                                            {
                                                recipeDish?.recipeMetrics?.persons?.value
                                            }
                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                            {i18n.t('Person')}
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
                                            {
                                                recipeDish?.recipeMetrics?.calories?.value
                                            }
                                        </Text>
                                        <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                            {i18n.t('Cal')}
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
                                            {i18n.t(`${recipeDish?.recipeMetrics?.difficulty?.value}`)}
                                            {/*{recipeDish?.recipeMetrics?.difficulty?.value}*/}
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
                                    {i18n.t('Ingredients')}
                                </Text>

                                {/*    */}
                                <View className="gap-y-2">

                                    {/*{*/}
                                    {/*    ingredientsIndexes(recipeDish).map(i => {*/}
                                    {/*        return (*/}
                                    {/*            <View key={i} className="flex-row gap-x-4 items-center">*/}
                                    {/*                <View style={{height: hp(1.5), width: hp(1.5)}}*/}
                                    {/*                      className="bg-amber-300 rounded-full"*/}
                                    {/*                />*/}
                                    {/*                <View className="flex-row gap-x-2">*/}
                                    {/*                    <Text*/}
                                    {/*                        style={{fontSize: hp(1.7)}}*/}
                                    {/*                        className="font-extrabold text-neutral-700">*/}
                                    {/*                        {recipeDish['strIngredient' + i]} -*/}
                                    {/*                    </Text>*/}
                                    {/*                    <Text*/}
                                    {/*                        style={{fontSize: hp(1.7)}}*/}
                                    {/*                        className="font-medium text-neutral-600">*/}
                                    {/*                        {recipeDish['strMeasure' + i]}*/}
                                    {/*                    </Text>*/}
                                    {/*                </View>*/}

                                    {/*            </View>*/}
                                    {/*        )*/}
                                    {/*    })*/}
                                    {/*}*/}
                                    {
                                        // recipeDish?.ingredients?.lang.find(it=>it.)
                                    }
                                    <RecipeIngredients recIng={recipeDish?.ingredients?.lang} langDev={langDev}/>

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
                                    {i18n.t('Recipe Description')}
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

                            {/*accordion comments*/}

                            <View ref={commentsRef}
                                  onLayout={handleVisibilityChange} // Отслеживаем появление блока
                            >
                                <CommentsComponent comments={['ok', 'wery bast', 'naise', 'kryto']} user={user ?? null}/>
                            </View>


                        </View> //end block


                    )
            }


        </ScrollView>

    );
};


export default RecipeDetailsScreen;
