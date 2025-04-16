import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FolderOpenIcon, HeartIcon, ListBulletIcon, StarIcon } from "react-native-heroicons/mini";
import ButtonBack from "../../components/ButtonBack";
import TitleScrean from "../../components/TitleScrean";
import WrapperComponent from "../../components/WrapperComponent";

import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import ButtonSmallCustom from "../../components/Buttons/ButtonSmallCustom";
import LoadingComponent from "../../components/loadingComponent";
import SearchComponent from "../../components/SearchComponent";
import { shadowBoxBlack } from "../../constants/shadow";
import { getRecipesByQuerySearchcreenMyDB } from "../../service/getDataFromDB";
import AllRecipesPointScreen from "./AllRecipesPointScreen";

const SearchRecipeScrean = () => {
	const [loading, setLoading] = useState(true);
	const [displayFilters, setDisplayFilters] = useState("list");

	const [filterRatingFavorite, setFilterRatingFavorite] = useState({
		rating: false,
		favorite: false,
	});

	const router = useRouter();

	const { searchQuery } = useLocalSearchParams();

	useEffect(() => {}, [searchQuery]);

	console.log("SearchRecipeScrean", searchQuery);

	const [recipes, setRecipes] = useState([]);

	const [currentQuery, setCurrentQuery] = useState(searchQuery || "");

	const [filterQuery, setFilterQuery] = useState([]);
	//animaten
	const customFadeIn = (typeAnimation, numDuration, delayMs) => typeAnimation.duration(numDuration).delay(delayMs);

	// // Анимированное прозрачностью
	// const opacity = useSharedValue(1);
	// const [isLoadingVisible, setIsLoadingVisible] = useState(true); // Контролируем видимость

	const featchGetAllRecipeQuery = async (query) => {
		if (!query) return;
		// if (!query) {
		// 	setRecipes([]);
		// 	setLoading(false);
		// 	return;
		// }

		try {
			setLoading(true);
			// setIsLoadingVisible(true);
			// opacity.value = withTiming(1, { duration: 300 }); // Плавное появление за 300 мс

			const res = await getRecipesByQuerySearchcreenMyDB(query);
			// console.log("SearchRecipeScrean featchGetAllRecipeQuery res", res);
			if (res.success) {
				setRecipes(res.data);
				setFilterQuery(res.data);
			} else {
				setRecipes([]);
			}
		} catch (error) {
			console.error("Unexpected error:", error);
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 500);
			// Запускаем анимацию исчезновения
			// opacity.value = withTiming(0, { duration: 500 }, () => {
			// 	setIsLoadingVisible(false); // Убираем компонент после завершения анимации
			// });
		}
	};

	// useEffect(() => {
	// 	setCurrentQuery(searchQuery || "");
	// }, [searchQuery]);

	useEffect(() => {
		featchGetAllRecipeQuery(currentQuery);
		// console.log("research query featchGetAllRecipeQuery currentQuery", currentQuery);
		// console.log("research query featchGetAllRecipeQuery recipes", recipes);
	}, [currentQuery]);

	// filter if displayFilters list
	useEffect(() => {
		if (displayFilters === "list") {
			if (filterRatingFavorite.rating === true) {
				setLoading(true);
				// setFilterQuery(())
				console.log("filter if displayFilters list", filterQuery);
				// Сортировка массива по убыванию rating
				const sortedRecipes = [...recipes].sort((a, b) => b.rating - a.rating);
				setFilterQuery(sortedRecipes);
				setTimeout(() => {
					setLoading(false);
				}, 500);
			}
		}
	}, [filterRatingFavorite]);

	// Анимированный стиль для LoadingComponent
	// const animatedStyle = useAnimatedStyle(() => {
	// 	return {
	// 		opacity: opacity.value,
	// 	};
	// });

	return (
		<WrapperComponent>
			{/* header section */}
			<View className="mb-5 justify-center  p-2">
				{/* back to home screen */}
				<Animated.View entering={customFadeIn(FadeInUp, 500, 100)} className="absolute z-10">
					<TouchableOpacity style={shadowBoxBlack()} onPress={() => router.replace("homeScreen")}>
						<ButtonBack />
					</TouchableOpacity>
				</Animated.View>

				{/* title screen */}
				<Animated.View entering={customFadeIn(FadeInUp, 500, 200)} className="flex-1 j items-center">
					<TitleScrean title="Search" />
				</Animated.View>
			</View>

			{/* block search */}
			<Animated.View entering={customFadeIn(FadeInDown, 500, 400)}>
				<SearchComponent
					searchDefault={currentQuery}
					searchScrean={true}
					onSearchChange={(newQuery) => setCurrentQuery(newQuery)} // Передаём коллбэк
				/>
			</Animated.View>

			{/* block filtr */}
			<Animated.View
				entering={customFadeIn(FadeInDown, 500, 700)}
				className="py-5 mb-5 flex-row  justify-around "
			>
				{/* get category */}
				<TouchableOpacity
					style={displayFilters === "list" ? null : shadowBoxBlack()}
					onPress={() => setDisplayFilters("folder")}
				>
					<ButtonSmallCustom
						w={60}
						h={60}
						size={40}
						icon={FolderOpenIcon}
						color={displayFilters === "list" ? "grey" : "white"}
						bg={displayFilters === "list" ? "white" : "grey"}
					/>
				</TouchableOpacity>
				{/* get list */}
				<TouchableOpacity
					style={displayFilters === "list" ? shadowBoxBlack() : null}
					onPress={() => setDisplayFilters("list")}
				>
					<ButtonSmallCustom
						w={60}
						h={60}
						size={40}
						icon={ListBulletIcon}
						color={displayFilters === "list" ? "white" : "grey"}
						bg={displayFilters === "list" ? "grey" : "white"}
					/>
				</TouchableOpacity>
				{/* get tu mach reting */}
				<TouchableOpacity
					onPress={() =>
						setFilterRatingFavorite((prev) => ({ ...prev, rating: !prev.rating, favorite: false }))
					}
					style={
						displayFilters === "list" ? filterRatingFavorite.rating && shadowBoxBlack() : { opacity: 0.3 }
					}
				>
					<ButtonSmallCustom w={60} h={60} size={40} icon={StarIcon} color="gold" bg="white" />
				</TouchableOpacity>

				{/* get to mach likes */}
				<TouchableOpacity
					onPress={() =>
						setFilterRatingFavorite((prev) => ({
							...prev,
							favorite: !prev.favorite,
							rating: false,
						}))
					}
					style={
						displayFilters === "list" ? filterRatingFavorite.favorite && shadowBoxBlack() : { opacity: 0.3 }
					}
				>
					<ButtonSmallCustom w={60} h={60} size={40} icon={HeartIcon} color="red" bg="white" />
				</TouchableOpacity>
			</Animated.View>

			{/* block render query */}
			<View className=" flex-1">
				{loading ? (
					<LoadingComponent color="green" />
				) : filterQuery ? (
					<AllRecipesPointScreen
						isScreanAlrecipeBayCreatore={true}
						titleVisible={false}
						isScreanAllRecibeData={filterQuery}
					/>
				) : (
					<Text>no recipe</Text>
				)}
				{/* {recipes ? (
					<View className="flex-1">
						{isLoadingVisible && (
							<View
								style={[animatedStyle, { backgroundColor: "rgba(0,0,0,0.8)" }]}
								className="absolute w-full h-full z-10 rounded-[45px] justify-center items-center"
							>
								<LoadingComponent color="green" />
							</View>
						)}
						<AllRecipesPointScreen
							isScreanAlrecipeBayCreatore={true}
							titleVisible={false}
							isScreanAllRecibeData={recipes}
						/>
					</View>
				) : (
					<Text>no recipe</Text>
				)} */}
			</View>
		</WrapperComponent>
	);
};

const styles = StyleSheet.create({});

export default SearchRecipeScrean;
