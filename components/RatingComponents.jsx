// translate
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

// rating
import { Rating } from 'react-native-ratings';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';
import { showCustomAlert } from '../constants/halperFunctions';

import { themes } from '../constants/themes';
import { useAuth } from '../contexts/AuthContext';
import i18n from '../lang/i18n';
import { addRecipeRatingMyDB } from '../service/getDataFromDB';

function RatingComponents({ rating, user, recipeId, isPreview }) {
    const router = useRouter();

    const { currentTheme } = useAuth();

    const [addStar, setAddStar] = useState(true);
    // const [selectedRating, setSelectedRating] = useState(0); // Сохранение выбранного рейтинга
    const [selectedRating, setSelectedRating] = useState(rating || 0); // Сохранение выбранного рейтинга

    // Анимация масштаба
    const scale = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: scale.value > 0 ? 1 : 0,
    }));

    const addRating = async newRating => {
        // console.log("addRecipeRatingMyDB try", newRating);
        if (isPreview || !recipeId) return; // Если это предпросмотр или recipeId отсутствует, не выполняем действие

        try {
            setSelectedRating(newRating); // Обновляем состояние только для авторизованного пользователя
            addRecipeRatingMyDB({
                recipeId,
                userId: user.id,
                rating: newRating,
            });
        } catch (error) {
            console.error('Error upserting recipe rating:', error);
            setSelectedRating(rating); // Возвращаем предыдущее значение в случае ошибки
        }
        // }
    };

    const IfUserNull = () => {
        if (user === null) {
            showCustomAlert(
                'Rating',
                `${i18n.t('To rate a recipe you must log in or create an account')}`,
                router
            );
        }
    };

    return (
        <Animated.View
            entering={FadeInDown.duration(400).delay(550)}
            className="px-4  items-center justify-around relative"
            style={{ backgroundColor: 'transparent' }}
        >
            <Text
                className=" mb-2"
                style={{ color: themes[currentTheme]?.textColor }}
            >
                {i18n.t('Rate the recipe')}
            </Text>

            {/* Star Rating component */}

            <TouchableOpacity
                onPress={IfUserNull}
                style={{ backgroundColor: 'transparent' }}
            >
                <Rating
                    type="star"
                    ratingCount={5}
                    imageSize={40}
                    ratingColor="gold"
                    tintColor={themes[currentTheme]?.backgroundColor}
                    startingValue={isPreview ? 0 : selectedRating}
                    onFinishRating={addRating} // Вызываем addRating для обработки рейтинга
                    readonly={isPreview || user === null} // Делаем неактивным для предпросмотра или неавторизованных пользователей
                    style={{ backgroundColor: 'transparent' }}
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

export default RatingComponents;
