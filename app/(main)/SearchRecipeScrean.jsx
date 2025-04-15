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

	const router = useRouter();
	const { searchQuery } = useLocalSearchParams();
	console.log(searchQuery);
	const [recipes, setRecipes] = useState([]);
	const [currentQuery, setCurrentQuery] = useState(searchQuery || "");

	//
	const customFadeIn = (typeAnimation, numDuration, delayMs) => typeAnimation.duration(numDuration).delay(delayMs);

	const featchGetAllRecipeQuery = async (query) => {
		if (!query) return;

		try {
			const res = await getRecipesByQuerySearchcreenMyDB(query);
			// console.log("SearchRecipeScrean featchGetAllRecipeQuery res", res);
			if (res.success) {
				setRecipes(res.data);
			} else {
				setRecipes([]);
			}
		} catch (error) {
			console.error("Unexpected error:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		featchGetAllRecipeQuery(currentQuery);
	}, [currentQuery]);

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
				<SearchComponent searchDefault={currentQuery} searchScrean={true} />
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
				<TouchableOpacity style={shadowBoxBlack()}>
					<ButtonSmallCustom w={60} h={60} size={40} icon={StarIcon} color="gold" bg="white" />
				</TouchableOpacity>

				{/* get to mach likes */}
				<TouchableOpacity style={shadowBoxBlack()}>
					<ButtonSmallCustom w={60} h={60} size={40} icon={HeartIcon} color="red" bg="white" />
				</TouchableOpacity>
			</Animated.View>

			{/* block render query */}
			<View className=" flex-1">
				{loading ? (
					<LoadingComponent />
				) : recipes ? (
					<AllRecipesPointScreen
						isScreanAlrecipeBayCreatore={true}
						titleVisible={false}
						isScreanAllRecibeData={recipes}
					/>
				) : (
					<Text>no recipe</Text>
				)}
			</View>
		</WrapperComponent>
	);
};

const styles = StyleSheet.create({});

export default SearchRecipeScrean;
