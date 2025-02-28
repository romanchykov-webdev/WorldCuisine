import React, { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import Animated, {
	FadeInDown,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
// import StarRating from "react-native-star-rating-widget";

// translate
import { useRouter } from "expo-router";
import i18n from "../lang/i18n";
import { addRecipeRatingMyDB } from "../service/getDataFromDB";

//rating
import { Rating } from "react-native-ratings";

const RatingComponents = ({ rating, user, recipeId, isPreview }) => {
	// console.log('RatingComponents user', user)
	console.log("RatingComponents isPreview", isPreview);
	// console.log('RatingComponents rating', typeof rating)
	// console.log('RatingComponents rating', rating)
	console.log("RatingComponents recipeId", recipeId);

	const router = useRouter();

	const [addStar, setAddStar] = useState(true);
	const [selectedRating, setSelectedRating] = useState(0); // Сохранение выбранного рейтинга

	// Анимация масштаба
	const scale = useSharedValue(0);
	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ scale: scale.value }],
		opacity: scale.value > 0 ? 1 : 0,
	}));
	// Анимация масштаба

	const addRating = async (newRating) => {
		if (isPreview || !recipeId) return; // Если это предпросмотр или recipeId отсутствует, не выполняем действие
		// console.log('addRating called with newRating:', newRating);
		if (user === null) {
			Alert.alert(
				"Rating",
				`${i18n.t(
					"To rate a recipe you must log in or create an account"
				)}`,
				[
					{
						text: "Cancel",
						onPress: () => console.log("modal cancelled"),
						style: "cancel",
					},
					{
						text: "LogIn-SignUp",
						onPress: () => router.replace("/ProfileScreen"),
						style: "default",
					},
				]
			);
			// Alert.alert("",{i18n.t('To rate a recipe you must log in or create an account')})
		} else {
			try {
				await addRecipeRatingMyDB({
					recipeId: recipeId,
					userId: user.id,
					rating: newRating,
				});
			} catch (error) {
				console.error("Error upserting recipe rating:", error);
			}
		}
	};

	return (
		<Animated.View
			entering={FadeInDown.duration(400).delay(550)}
			className="px-4  items-center justify-around relative"
		>
			<Text className="text-neutral-700 mb-2">
				{i18n.t("Rate the recipe")}
			</Text>

			{/* Star Rating component */}
			<Rating
				type="star"
				ratingCount={5}
				imageSize={40}
				ratingColor="gold"
				ratingBackgroundColor="gray"
				startingValue={isPreview ? 0 : rating}
				onFinishRating={isPreview ? null : addRating}
				readonly={isPreview} // Делаем рейтинг только для чтения в режиме предпросмотра
				style={styles.rating}
			/>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	starContainer: {
		position: "absolute",
		zIndex: 10,
		left: "50%",
		top: "50%",
		transform: [{ translateX: -22.5 }, { translateY: -22.5 }], // Центровка звезды
		alignItems: "center", // Центровка текста внутри звезды
		justifyContent: "center",
	},
	ratingText: {
		position: "absolute",
		color: "Black",
		fontSize: 10,
		fontWeight: "bold",
		textAlign: "center",
	},
	rating: {
		// marginBottom: 20,
	},
});

export default RatingComponents;
