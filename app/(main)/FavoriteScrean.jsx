import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import ButtonBack from "../../components/ButtonBack";
import LoadingComponent from "../../components/loadingComponent";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import { getAllFavoriteIdisMyDB, getAllFavoriteListMyDB } from "../../service/getDataFromDB";
import AllRecipesPointScreen from "./AllRecipesPointScreen";

const FavoriteScrean = () => {
	const { user } = useAuth();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	// console.log("FavoriteScrean user", user);

	const [allFavoriteRecipe, setAllFavoriteRecipe] = useState([]);

	const fetchLikedRecipes = async (userId) => {
		try {
			// Шаг 1: Получаем ID лайкнутых рецептов
			const likedIdsResponse = await getAllFavoriteIdisMyDB(userId);
			if (!likedIdsResponse.success) {
				return { success: false, msg: likedIdsResponse.msg };
			}

			const recipeIds = likedIdsResponse.data;
			if (recipeIds.length === 0) {
				return { success: true, data: [], msg: "No liked recipes found" };
			}

			// Шаг 2: Получаем сами рецепты по ID
			const recipesResponse = await getAllFavoriteListMyDB(recipeIds);
			if (!recipesResponse.success) {
				return { success: false, msg: recipesResponse.msg };
			}

			return { success: true, data: recipesResponse.data };
		} catch (error) {
			console.error("Error in fetchLikedRecipes:", error.message);
			return { success: false, msg: error.message };
		}
	};

	useEffect(() => {
		const loadLikedRecipes = async () => {
			setLoading(true);
			const response = await fetchLikedRecipes(user?.id);

			setTimeout(() => {
				setLoading(false);
			}, 1000);

			if (response.success) {
				setAllFavoriteRecipe(response.data);
				console.log("response.success response.data", response.data);
			} else {
				setError(response.msg);
			}
		};

		loadLikedRecipes();
	}, [user?.id]);

	if (loading) {
		return <LoadingComponent color="green" />;
	}

	// if (error) {
	// 	return <Text>Ошибка: {error}</Text>;
	// }

	// if (allFavoriteRecipe.length === 0) {
	// 	return;
	// }

	return (
		<SafeAreaView>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					minHeight: hp(100),
				}}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode="on-drag"
			>
				<View className="h-full w-full ">
					{allFavoriteRecipe.length === 0 ? (
						<View className="">
							<Animated.View entering={FadeInDown.springify()} style={shadowBoxBlack()}>
								<ButtonBack />
							</Animated.View>
							<Animated.Text
								entering={FadeInDown.springify().delay(100)}
								className="mt-5 text-center text-lg font-bold"
							>
								{i18n.t("There are no recipes you like yet")}
							</Animated.Text>
						</View>
					) : (
						<AllRecipesPointScreen isScreanFavorite={true} allFavoriteRecipes={allFavoriteRecipe} />
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default FavoriteScrean;
