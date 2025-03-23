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
	}, [userData, creator_id, toggleFolderList]); // Зависимости: эффект сработает при изменении userData или crearote_id

	useEffect(() => {
		i18n.locale = langDev; // Устанавливаем текущий язык
	}, [langDev]);

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
					<View
						className={`${headerAllCeripe ? "mb-10 self-start" : "absolute left-0"}`}
						style={shadowBoxBlack()}
					>
						<ButtonBack />
					</View>
					{/* Остальные элементы */}
					{!headerAllCeripe && (
						<TitleScrean
							title={i18n.t("Your recipes")}
							styleTitle={{ textAlign: "center", fontSize: hp(3) }}
						/>
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
					{allRecipesCreator.length > 0 && (
						<>
							{/* folder */}
							<TouchableOpacity
								onPress={() => setToggleFolderList(true)}
								className={`w-[70] h-[70] justify-center items-center ${
									toggleFolderList ? "bg-amber-300" : "bg-white"
								}  rounded-full `}
								style={shadowBoxBlack()}
							>
								<Icon name="folder" size={30} color="bg-amber-300" />
							</TouchableOpacity>

							{/* list/ */}
							<TouchableOpacity
								onPress={() => setToggleFolderList(false)}
								className={`w-[70] h-[70] justify-center items-center ${
									toggleFolderList ? "bg-white" : "bg-amber-300"
								}  rounded-full `}
								style={shadowBoxBlack()}
							>
								<Icon name="list" size={30} color="grey" />
							</TouchableOpacity>
						</>
					)}

					{/* coments */}
					{unreadCommentsCount > 0 && (
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
					)}

					{/* Like */}
					{unreadLikesCount > 0 && (
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
					)}

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
