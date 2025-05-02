import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
// import StarRating from "react-native-star-rating-widget";

// translate
import { useRouter } from "expo-router";
import i18n from "../lang/i18n";
import { addRecipeRatingMyDB } from "../service/getDataFromDB";

//rating
import { Rating } from "react-native-ratings";
import { showCustomAlert } from "../constants/halperFunctions";
import {themes} from "../constants/themes";
import {useAuth} from "../contexts/AuthContext";

const RatingComponents = ({ rating, user, recipeId, isPreview }) => {
	// console.log("RatingComponents user", user);
	// console.log("RatingComponents isPreview", isPreview);
	// console.log('RatingComponents rating', typeof rating)
	// console.log('RatingComponents rating', rating)
	// console.log("RatingComponents recipeId", recipeId);

	const router = useRouter();

	const {currentTheme}=useAuth()

	const [addStar, setAddStar] = useState(true);
	// const [selectedRating, setSelectedRating] = useState(0); // Сохранение выбранного рейтинга
	const [selectedRating, setSelectedRating] = useState(rating || 0); // Сохранение выбранного рейтинга

	// Анимация масштаба
	const scale = useSharedValue(0);
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		opacity: scale.value > 0 ? 1 : 0,
	}));
	// Анимация масштаба

	// useEffect(() => {
	// 	console.log("addRating rating", rating);
	// 	setSelectedRating(rating);
	// }, [selectedRating]);

	const addRating = async (newRating) => {
		// console.log("addRecipeRatingMyDB try", newRating);
		if (isPreview || !recipeId) return; // Если это предпросмотр или recipeId отсутствует, не выполняем действие
		// console.log('addRating called with newRating:', newRating);
		// if (user === null) {
		// 	showCustomAlert(
		// 		"Rating",
		// 		`${i18n.t(
		// 			"To rate a recipe you must log in or create an account"
		// 		)}`,
		// 		router
		// 	);

		// 	// Alert.alert("",{i18n.t('To rate a recipe you must log in or create an account')})
		// } else {
		try {
			setSelectedRating(newRating); // Обновляем состояние только для авторизованного пользователя
			 addRecipeRatingMyDB({
				recipeId: recipeId,
				userId: user.id,
				rating: newRating,
			});
		} catch (error) {
			console.error("Error upserting recipe rating:", error);
			setSelectedRating(rating); // Возвращаем предыдущее значение в случае ошибки
		}
		// }
	};

	const IfUserNull = () => {
		if (user === null) {
			showCustomAlert("Rating", `${i18n.t("To rate a recipe you must log in or create an account")}`, router);
		}
	};

	return (
		<Animated.View entering={FadeInDown.duration(400).delay(550)} className="px-4  items-center justify-around relative" style={{ backgroundColor: "transparent" }}>
			<Text className=" mb-2" style={{color:themes[currentTheme]?.textColor}}>{i18n.t("Rate the recipe")}</Text>

			{/* Star Rating component */}

			<TouchableOpacity onPress={IfUserNull} style={{ backgroundColor: "transparent" }}>
				<Rating
					type="star"
					ratingCount={5}
					imageSize={40}
					ratingColor="gold"
					// ratingBackgroundColor="red"
					tintColor={themes[currentTheme]?.backgroundColor}
					// startingValue={isPreview ? 0 : rating}
					startingValue={isPreview ? 0 : selectedRating}
					// onFinishRating={isPreview ? null : addRating}
					// onFinishRating={addRating} // Вызываем addRating для обработки рейтинга
					onFinishRating={addRating} // Вызываем addRating для обработки рейтинга
					readonly={isPreview || user === null} // Делаем неактивным для предпросмотра или неавторизованных пользователей
					style={{ backgroundColor: "transparent" }}
				/>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	// starContainer: {
	// 	position: "absolute",
	// 	zIndex: 10,
	// 	left: "50%",
	// 	top: "50%",
	// 	transform: [{ translateX: -22.5 }, { translateY: -22.5 }], // Центровка звезды
	// 	alignItems: "center", // Центровка текста внутри звезды
	// 	justifyContent: "center",
	// },
	// ratingText: {
	// 	position: "absolute",
	// 	color: "Black",
	// 	fontSize: 10,
	// 	fontWeight: "bold",
	// 	textAlign: "center",
	// },

});

export default RatingComponents;
