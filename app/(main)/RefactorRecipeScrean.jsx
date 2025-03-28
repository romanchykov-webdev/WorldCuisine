import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import HeaderScreanComponent from "../../components/HeaderScreanComponent";
import WrapperComponent from "../../components/WrapperComponent";
import { getRecipesDescriptionMyDB } from "../../service/getDataFromDB";

import LoadingComponent from "../../components/loadingComponent";
import SelectLangComponent from "../../components/recipeDetails/SelectLangComponent";
import RefactorImageHeader from "../../components/RefactorRecipeScrean/RefactorImageHeader";
import RefactorTitleAria from "../../components/RefactorRecipeScrean/RefactorTitleAria";
import { useAuth } from "../../contexts/AuthContext";

const RefactorRecipeScrean = () => {
	const { user } = useAuth();

	const [langApp, setLangApp] = useState(user?.lang);

	const [loading, setLoading] = useState(true);

	const [recipeDish, setRecipeDish] = useState(null);

	const params = useLocalSearchParams();

	// console.log(params);
	const { recipe_id, isRefactorRecipe } = params;

	// console.log("RefactorRecipeScrean recipe_id", recipe_id);
	// console.log("RefactorRecipeScrean isRefactorRecipe", isRefactorRecipe);

	const fetchGetRecipeForRefactoring = async (id) => {
		try {
			const res = await getRecipesDescriptionMyDB(id);
			//
			if (res.success && res.data.length > 0) {
				setRecipeDish(res.data[0]);
				// console.log("RefactorRecipeScrean res.data[0]", JSON.stringify(res.data[0], null));
			} else {
				Alert.alert("Error", "Recipe not found");
			}
		} catch (error) {
			console.error("Error loading recipe:", error);
			Alert.alert("Error", "Failed to load recipe");
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 500);
		}
	};

	useEffect(() => {
		if (recipe_id && isRefactorRecipe) {
			setLoading(true);
			fetchGetRecipeForRefactoring(recipe_id);
		} else {
			setLoading(false);
		}
	}, [recipe_id, isRefactorRecipe]);

	// Пока данные загружаются, показываем только индикатор загрузки
	if (loading) {
		return (
			<WrapperComponent>
				<LoadingComponent />
			</WrapperComponent>
		);
	}

	// Если данные не загрузились или отсутствуют
	if (!recipeDish) {
		return (
			<WrapperComponent>
				<HeaderScreanComponent titleScreanText={"Refactor Recipe"} />
				<View className="flex-1 justify-center items-center">
					<Text>No recipe data available</Text>
				</View>
			</WrapperComponent>
		);
	}

	/*
    *  надо создать микс createRecipe Screan c recipedetailsscrean
     чтобы нидит как деталь рецепта но свозможностью редактировать тоесть стиреть или изменить
    
    */

	const handleLangChange = (lang) => {
		setLangApp(lang);
	};
	// console.log("RefactorRecipeScrean recipeDish?.area", recipeDish?.area);

	// update image header
	const handleImageUpdate = (newImage) => {
		setRecipeDish((prev) => ({ ...prev, image_header: newImage }));
		console.log("handleImageUpdate recipeDish.image_header", recipeDish.image_header);
	};

	return (
		<WrapperComponent>
			<View className="gap-y-5">
				{/* header */}
				<HeaderScreanComponent titleScreanText={"refactor"} />

				{/* section select lang */}
				<SelectLangComponent
					recipeDishArea={recipeDish?.area}
					handleLangChange={handleLangChange}
					langApp={langApp}
				/>

				{/* top image button back and like*/}
				<RefactorImageHeader
					imageUri={recipeDish?.image_header}
					onImageUpdate={handleImageUpdate}
					icon={PencilSquareIcon}
					test={recipeDish}
				/>

				{/*    dish and description*/}
				<RefactorTitleAria title={recipeDish?.title} area={recipeDish?.area} langApp={langApp} />
				{/* <View className="px-4 flex justify-between gap-y-5 ">

					<View className="gap-y-2">
						<Text style={[{ fontSize: hp(2.7) }]} className="font-bold  text-neutral-700">

							{recipeDish?.title?.lang.find((item) => item.lang === langApp)?.name ||
								recipeDish?.title?.strTitle}
						</Text>
						<Text style={{ fontSize: hp(1.8) }} className="font-medium text-neutral-500">

							{recipeDish?.area?.[langApp]}
						</Text>
						<TextInput
							value={
								recipeDish?.title?.lang.find((item) => item.lang === langApp)?.name ||
								recipeDish?.title?.strTitle
							}
						/>
					</View>
				</View> */}
				{/*    dish and description  end*/}
			</View>
		</WrapperComponent>
	);
};

const styles = StyleSheet.create({});

export default RefactorRecipeScrean;
