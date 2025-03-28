import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import RecipesMasonryComponent from "../../components/RecipesMasonry/RecipesMasonryComponent";

import HeaderScreanComponent from "../../components/HeaderScreanComponent";
import LoadingComponent from "../../components/loadingComponent";
import ToggleListCategoryComponent from "../../components/profile/ToggleListCategoryComponent";
import WrapperComponent from "../../components/WrapperComponent";
import { createCategoryPointObject, filterCategoryRecipesBySubcategories } from "../../constants/halperFunctions";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import {
	getAllFavoriteIdisMyDB,
	getAllFavoriteListMyDB,
	getCategoryRecipeMasonryMyDB,
} from "../../service/getDataFromDB";
import AllRecipesPointScreen from "./AllRecipesPointScreen";

const FavoriteScrean = () => {
	const { user } = useAuth();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [toggleFolderList, setToggleFolderList] = useState(false);
	const [allFavoriteRecipes, setAllFavoriteRecipes] = useState([]);
	const [categoryRecipes, setCategoryRecipes] = useState([]);
	const [obFilterCategory, setObFilterCategory] = useState({});

	// Загрузка всех избранных рецептов
	const fetchLikedRecipes = async (userId) => {
		try {
			const likedIdsResponse = await getAllFavoriteIdisMyDB(userId);
			if (!likedIdsResponse.success) {
				return { success: false, msg: likedIdsResponse.msg };
			}

			const recipeIds = likedIdsResponse.data;
			if (recipeIds.length === 0) {
				return { success: true, data: [], msg: "No liked recipes found" };
			}

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

	// Загрузка категорий и фильтрация избранных рецептов
	const fetchCategoryRecipes = async (lang) => {
		try {
			const categoriesResponse = await getCategoryRecipeMasonryMyDB(lang);
			if (!categoriesResponse.success) {
				return { success: false, msg: categoriesResponse.msg };
			}

			const allCategories = categoriesResponse.data; // Массив категорий из categories_masonry
			const filteredCategories = filterCategoryRecipesBySubcategories(allCategories, obFilterCategory);
			return { success: true, data: filteredCategories };
		} catch (error) {
			console.error("Error in fetchCategoryRecipes:", error.message);
			return { success: false, msg: error.message };
		}
	};

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			const likedRecipesResponse = await fetchLikedRecipes(user?.id);

			if (likedRecipesResponse.success) {
				setAllFavoriteRecipes(likedRecipesResponse.data);
				const filterObject = createCategoryPointObject(likedRecipesResponse.data);
				setObFilterCategory(filterObject);

				if (toggleFolderList && likedRecipesResponse.data.length > 0) {
					const categoryResponse = await fetchCategoryRecipes(user?.lang || "en");
					if (categoryResponse.success) {
						setCategoryRecipes(categoryResponse.data);
					} else {
						setError(categoryResponse.msg);
					}
				}
			} else {
				setError(likedRecipesResponse.msg);
			}

			setTimeout(() => setLoading(false), 1000);
		};

		loadData();
	}, [user?.id, toggleFolderList]);

	const handleToggleChange = (newValue) => {
		setToggleFolderList(newValue);
	};

	// if (loading) {
	// 	return <LoadingComponent color="green" />;
	// }

	// if (error) {
	// 	return (
	// 		<WrapperComponent>
	// 			<View className="h-full w-full">
	// 				<Animated.View entering={FadeInDown.springify()} style={shadowBoxBlack()}>
	// 					<ButtonBack />
	// 				</Animated.View>
	// 				<Animated.Text
	// 					entering={FadeInDown.springify().delay(100)}
	// 					className="mt-5 text-center text-lg font-bold text-red-500"
	// 				>
	// 					{i18n.t("Error")}: {error}
	// 				</Animated.Text>
	// 			</View>
	// 		</WrapperComponent>
	// 	);
	// }

	return (
		<WrapperComponent>
			<View className="flex-1">
				{/* {allFavoriteRecipes.length === 0 ? (
					<View>
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
				) : ( */}
				<View>
					<View className=" mb-5">
						<HeaderScreanComponent titleScreanText={i18n.t("Liked")} />
						{/*  */}
						<ToggleListCategoryComponent
							toggleFolderList={toggleFolderList}
							onToggleChange={handleToggleChange}
							hasRecipes={allFavoriteRecipes.length > 0}
						/>
					</View>

					<View>
						{loading ? (
							<LoadingComponent color="green" />
						) : toggleFolderList ? (
							<RecipesMasonryComponent
								categoryRecipes={categoryRecipes}
								langApp={user?.lang || "en"}
								isScreanFavorite={true}
								isScreanAllRecibeData={allFavoriteRecipes}
							/>
						) : (
							<AllRecipesPointScreen
								allFavoriteRecipes={allFavoriteRecipes}
								isFavoriteScrean={true}
								isScreanAlrecipeBayCreatore={true}
								titleVisible={false}
							/>
						)}
					</View>
				</View>
				{/* )} */}
			</View>
		</WrapperComponent>
	);
};

const styles = StyleSheet.create({});

export default FavoriteScrean;
