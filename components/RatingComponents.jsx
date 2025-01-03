import React, {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {StarIcon} from "react-native-heroicons/outline";
import Animated, {FadeInDown, useSharedValue, useAnimatedStyle, withTiming} from "react-native-reanimated";
import StarRating from "react-native-star-rating-widget";

// translate
import i18n from '../lang/i18n'
import {logOut} from "../service/userService";
import {useRouter} from "expo-router";


const RatingComponents = ({rating, handleStarPress, user}) => {

    // console.log('RatingComponents user', user)
    // console.log('RatingComponents rating', typeof rating)

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

    const addRating = (newRating) => {
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
            setSelectedRating(newRating); // Устанавливаем выбранный рейтинг
            setAddStar(true); // Устанавливаем состояние для отображения звезды
            scale.value = 0; // Сбрасываем масштаб
            scale.value = withTiming(10, {duration: 1000}); // Анимация увеличения до масштаба 10
            handleStarPress(newRating); // Вызываем обработчик рейтинга

            // Скрыть звезду через 1 секунду
            setTimeout(() => {
                setAddStar(false);
                scale.value = 0; // Сбрасываем масштаб
            }, 1000);
        }

    }

    return (
        <Animated.View
            entering={FadeInDown.duration(400).delay(550)}
            className="px-4  items-center justify-around relative">
            <Text className="text-neutral-700 mb-2">
                {i18n.t('Rate the recipe')}
            </Text>

            {/* Анимационная звезда */}
            {addStar && (
                <Animated.View style={[styles.starContainer, animatedStyle]}>
                    <StarIcon size={45} color="gold"/>
                    <Text style={styles.ratingText}>{selectedRating}</Text>
                </Animated.View>
            )}

            {/* Рейтинг */}
            <StarRating
                emptyColor="gray"
                enableHalfStar={false}
                starSize={45}
                maxStars={5}
                rating={rating} // Округление значения
                // rating={Math.round(rating)} // Округление значения
                onChange={(newRating) => addRating(newRating)} // Используйте onChange вместо selectedStar
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
});

export default RatingComponents;
