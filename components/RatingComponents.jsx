import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {StarIcon} from "react-native-heroicons/outline";
import Animated, {FadeInDown, useSharedValue, useAnimatedStyle, withTiming} from "react-native-reanimated";
// import StarRating from "react-native-star-rating-widget";

// translate
import i18n from '../lang/i18n'
import {logOut} from "../service/userService";
import {useRouter} from "expo-router";
import {addRecipeRatingMyDB} from "../service/getDataFromDB";

//rating
import { Rating } from 'react-native-ratings';

const RatingComponents = ({rating, handleStarPress, user,recipeId}) => {

    // console.log('RatingComponents user', user)
    // console.log('RatingComponents rating', typeof rating)
    // console.log('RatingComponents rating', rating)


    const router = useRouter();

    const [addStar, setAddStar] = useState(true)
    const [selectedRating, setSelectedRating] = useState(0); // Сохранение выбранного рейтинга


    // Анимация масштаба
    const scale = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{scale: scale.value}],
        opacity: scale.value > 0 ? 1 : 0,
    }));
    // Анимация масштаба

    const addRating =async  (newRating) => {
        // console.log('addRating called with newRating:', newRating);
        if (user === null) {
            Alert.alert("Rating", `${i18n.t('To rate a recipe you must log in or create an account')}`, [
                {
                    text: 'Cancel',
                    onPress: () => console.log('modal cancelled'),
                    style: 'cancel'
                },
                {
                    text: 'LogIn-SignUp',
                    onPress: () => router.replace('/ProfileScreen'),
                    style: "default"
                }
            ]);
            // Alert.alert("",{i18n.t('To rate a recipe you must log in or create an account')})
        } else {
            // (recipeId, userId, rating)
            // console.log('RatingComponents adding new rating newRating', newRating)
            // console.log('RatingComponents adding new rating user.id', user.id)
            // console.log('RatingComponents adding new rating recipeId', recipeId)

            await  addRecipeRatingMyDB({recipeId:recipeId, userId:user.id, rating:newRating})

            // setSelectedRating(newRating); // Устанавливаем выбранный рейтинг
            // setAddStar(true); // Устанавливаем состояние для отображения звезды
            // scale.value = 0; // Сбрасываем масштаб
            // scale.value = withTiming(10, {duration: 1000}); // Анимация увеличения до масштаба 10
            // handleStarPress(newRating); // Вызываем обработчик рейтинга
            //
            // // Скрыть звезду через 1 секунду
            // setTimeout(() => {
            //     setAddStar(false);
            //     scale.value = 0; // Сбрасываем масштаб
            // }, 1000);
        }

    }


    return (
        <Animated.View
            entering={FadeInDown.duration(400).delay(550)}
            className="px-4  items-center justify-around relative">
            <Text className="text-neutral-700 mb-2">
                {i18n.t('Rate the recipe')}
            </Text>

            {/* Star Rating component */}
            <Rating
                type="star"
                ratingCount={5}
                imageSize={40}
                ratingColor="gold"
                ratingBackgroundColor="gray"
                startingValue={rating}
                onFinishRating={addRating}
                style={styles.rating}
            />





        </Animated.View>
    );
};

const styles = StyleSheet.create({
    starContainer: {
        position: 'absolute',
        zIndex: 10,
        left: '50%',
        top: '50%',
        transform: [{translateX: -22.5}, {translateY: -22.5}], // Центровка звезды
        alignItems: 'center', // Центровка текста внутри звезды
        justifyContent: 'center',
    },
    ratingText: {
        position: 'absolute',
        color: 'Black',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    rating:{
        // marginBottom: 20,

    }
});

export default RatingComponents;
