import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import ButtonBack from "../../components/ButtonBack";
import SubscriptionsComponent from "../../components/recipeDetails/SubscriptionsComponent";
import TitleScrean from "../../components/TitleScrean";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";

import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import Icon from "react-native-vector-icons/Entypo";
import IconComent from "react-native-vector-icons/EvilIcons";
import LoadingComponent from "../../components/loadingComponent";
import ToggleListCategoryComponent from "../../components/profile/ToggleListCategoryComponent";
import RecipesMasonryComponent from "../../components/RecipesMasonry/RecipesMasonryComponent";
import {
	createCategoryPointObject,
	filterCategoryRecipesBySubcategories,
	myFormatNumber,
} from "../../constants/halperFunctions";
import i18n from "../../lang/i18n";
import { getAllRecipesBayCreatoreListMyDB, getCategoryRecipeMasonryMyDB } from "../../service/getDataFromDB";
import AllRecipesPointScreen from "./AllRecipesPointScreen";

const AllRecipesBayCreator = () => {
	const router = useRouter();
	const params = useLocalSearchParams();

	const { user: userData, unreadCommentsCount, unreadLikesCount, language: langDev } = useAuth();
	// console.log("AllRecipesBayCreator unreadCommentsCount", unreadCommentsCount);

	const { creator_id } = params;

	const [headerAllCeripe, setHeaderAllRecipe] = useState(true);

	// show folder or list
	const [toggleFolderList, setToggleFolderList] = useState(false);

	// loading
	const [loading, setLoading] = useState(true);

	// all recipe bay creator
	const [allRecipesCreator, setAllRecipesCreator] = useState([]);

	// object for filter categoryes
	const [obFilterCategory, setObFilterCategory] = useState({});

	// comment count
	// const [commentCount, setCommentCount] = useState(unreadCommentsCount);

	// for folder
	const [categoryRecipes, setCategoryRecipes] = useState([]);

	// get al ceripe bay creatir
	const featGetAllRecipeBayCreator = async (creator_id) => {
		try {
			// console.log("featGetAllRecipeBayCreator creator_id:", creator_id);
			setLoading(true);
			const res = await getAllRecipesBayCreatoreListMyDB(creator_id);

			if (res?.success) {
				// console.log("featGetAlßlRecipeBayCreator res:", res.data);

				//
				setObFilterCategory(createCategoryPointObject(res.data));

				//
				setAllRecipesCreator(res.data);

				// timeuot
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
		} catch (error) {
			console.error("Error in featGetAllRecipeBayCreator:", error);
			throw error; // Пробрасываем ошибку, чтобы её можно было обработать снаружи
		}
	};

	// get al ceripe bay category
	const fetchCategoryRecipeMasonry = async () => {
		setLoading(true);
		const res = await getCategoryRecipeMasonryMyDB(userData?.lang ?? langDev);

		// const res = await getCategoryRecipeMasonryMyDB("ru");
		// console.log("fetchCategoryRecipeMasonry", JSON.stringify(res.data, null));
		// setCategoryRecipes(res.data);
		setCategoryRecipes(filterCategoryRecipesBySubcategories(res.data, obFilterCategory));
		// timeuot
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	};

	//
	useEffect(() => {
		if (userData?.id === creator_id) {
			setHeaderAllRecipe(false);
			// console.log("headerAllCeripe", headerAllCeripe);
		}
		if (!toggleFolderList) {
			featGetAllRecipeBayCreator(creator_id);
		} else {
			fetchCategoryRecipeMasonry();
		}
	}, [userData, creator_id, toggleFolderList]);

	useEffect(() => {
		i18n.locale = langDev; // Устанавливаем текущий язык
	}, [langDev]);

	const handleToggleChange = (newValue) => {
		setToggleFolderList(newValue); // Обновляем состояние в родителе
	};

	// console.log("AllRecipesBayCreator params", params);
	// console.log("AllRecipesBayCreator creator_id", creator_id);
	// console.log("AllRecipesBayCreator userData", userData);

	return (
		<SafeAreaView>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					// backgroundColor: "red",
					marginTop: Platform.OS === "ios" ? null : 60,
					minHeight: hp(100),
				}}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode={"on-drag"}
			>
				{/* header section */}
				<View
					className={`relative py-5  ${
						headerAllCeripe ? null : "flex-row mb-5"
					} items-center justify-center `}
				>
					{/*  */}
					<Animated.View
						entering={FadeInDown.springify().delay(100)}
						className={`${headerAllCeripe ? "mb-10 self-start" : "absolute left-0"}`}
						style={shadowBoxBlack()}
					>
						<ButtonBack />
					</Animated.View>
					{/* Остальные элементы */}
					{!headerAllCeripe && (
						<Animated.View entering={FadeInDown.springify().delay(200)}>
							<TitleScrean
								title={i18n.t("Your recipes")}
								styleTitle={{ textAlign: "center", fontSize: hp(3) }}
							/>
						</Animated.View>
					)}

					{headerAllCeripe && (
						<SubscriptionsComponent
							subscriber={userData}
							creatorId={creator_id}
							allRecipeBayCreatore={true}
						/>
					)}
				</View>

				{/* section foldr list */}
				<View className="flex-row items-center justify-around mb-5">
					{/* Toggle section */}
					<View className="flex-1">
						<ToggleListCategoryComponent
							toggleFolderList={toggleFolderList}
							onToggleChange={handleToggleChange}
							hasRecipes={allRecipesCreator.length > 0}
						/>
					</View>

					{unreadCommentsCount > 0 || unreadLikesCount > 0 ? (
						<View
							// className={`flex-${
							// 	unreadCommentsCount > 0 && unreadLikesCount > 0 ? "1" : "1/2"
							// } flex-row items-center  justify-around bg-red-300`}
							className={`flex-row  items-center justify-around ${
								unreadCommentsCount > 0 && unreadLikesCount > 0
									? "flex-1" // 100% ширины, если оба > 0
									: "w-[30%]" // 30% ширины, если только один > 0
							}`}
						>
							{/* coments */}
							{unreadCommentsCount > 0 && (
								<Animated.View entering={FadeInDown.springify().delay(500)}>
									<TouchableOpacity
										onPress={() => router.push("(main)/NewCommentsScrean")}
										className={`w-[70] h-[70] relative justify-center items-center bg-white  rounded-full `}
										style={shadowBoxBlack()}
									>
										<IconComent name="comment" size={50} color="red" />
										<Text className="absolute" style={{ fontSize: 12 }}>
											+ {myFormatNumber(unreadCommentsCount)}
										</Text>
									</TouchableOpacity>
								</Animated.View>
							)}

							{/* Like */}
							{unreadLikesCount > 0 && (
								<Animated.View entering={FadeInDown.springify().delay(600)}>
									<TouchableOpacity
										onPress={() => router.push("(main)/NewLikesScrean")}
										className={`w-[70] h-[70] relative justify-center items-center bg-white  rounded-full `}
										style={shadowBoxBlack()}
									>
										<Icon name="heart" size={50} color="red" />
										<Text className="absolute" style={{ fontSize: 12 }}>
											+ {myFormatNumber(unreadLikesCount)}
										</Text>
									</TouchableOpacity>
								</Animated.View>
							)}
						</View>
					) : null}

					{/* section data */}
				</View>
				<View className=" flex-1">
					{loading ? (
						<LoadingComponent color="green" />
					) : (
						<View>
							{allRecipesCreator.length === 0 ? (
								<Animated.Text
									className="text-lg font-bold text-center"
									entering={FadeInDown.delay(500).springify().damping(30)}
								>
									{i18n.t("You don't have any published recipes yet")}
								</Animated.Text>
							) : toggleFolderList ? (
								<RecipesMasonryComponent
									categoryRecipes={categoryRecipes}
									langApp={userData?.lang ?? langDev}
									isScreanAlrecipeBayCreatore={true}
									isScreanAllRecibeData={allRecipesCreator}
								/>
							) : (
								<AllRecipesPointScreen
									isScreanAlrecipeBayCreatore={true}
									titleVisible={false}
									isScreanAllRecibeData={allRecipesCreator}
								/>
							)}
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default AllRecipesBayCreator;
