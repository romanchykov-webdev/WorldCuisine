import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from "react-native-reanimated";
import ButtonBack from "../../components/ButtonBack";
import LoadingComponent from "../../components/loadingComponent";
import RecipePointItemComponent from "../../components/RecipesMasonry/AllRecipesPoint/RecipePointItemComponent";
import TitleScrean from "../../components/TitleScrean";
import { getDeviceType } from "../../constants/getWidthDevice";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import { getAllRecipesPointMasonryMyDB } from "../../service/getDataFromDB";

const AllRecipesPointScreen = ({
	isScreanAlrecipeBayCreatore = false,
	isScreanAllRecibeData = [],
	isFavoriteScrean = false,
	allFavoriteRecipes = [],
	titleVisible = true,
}) => {
	const { point } = useLocalSearchParams();
	const { language: langApp } = useAuth();

	// console.log("AllRecipesPointScreen point", point);
	// console.log("AllRecipesPointScreen isFavoriteScrean", isFavoriteScrean);

	const [loading, setLoading] = useState(true);

	const [column, setColumn] = useState(0);

	const [allRecipes, setAllRecipes] = useState([]);

	// Определяем количество колонок на основе типа устройства
	useEffect(() => {
		// Определяем тип устройства и обновляем количество колонок
		const type = getDeviceType(window.innerWidth);
		setColumn(type);
	}, []);

	// console.log('AllRecipesPointScreen',point)

	const fetchGetAllRecipesPointMasonryMyDB = async () => {
		const res = await getAllRecipesPointMasonryMyDB(point);
		// console.log("AllRecipesPointScreen res point", JSON.stringify(res.data, null, 2));
		setAllRecipes(res.data);
	};

	useEffect(() => {
		if (!isScreanAlrecipeBayCreatore && !isFavoriteScrean) {
			setLoading(true);
			fetchGetAllRecipesPointMasonryMyDB();
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	}, [point]);

	useEffect(() => {
		if (isScreanAlrecipeBayCreatore) {
			setLoading(true);

			setAllRecipes(isScreanAllRecibeData);
			setTimeout(() => {
				setLoading(false);
			}, 1000);

			// console.log("isScreanAlrecipeBayCreatore", allRecipes);
		}
	}, [isScreanAlrecipeBayCreatore, isScreanAllRecibeData]);

	useEffect(() => {
		if (isFavoriteScrean) {
			setLoading(true);

			setAllRecipes(allFavoriteRecipes);

			setTimeout(() => {
				setLoading(false);
			}, 1000);

			// console.log("FavoriteScrean", allRecipes);
		}
	}, [isFavoriteScrean]);

	return (
		<SafeAreaView>
			<ScrollView contentContainerStyle={{ marginTop: Platform.OS === "ios" ? null : 30 }}>
				<View className={`gap-y-3 ${isScreanAlrecipeBayCreatore || isFavoriteScrean ? null : "p-[20]"}`}>
					{/* block header*/}
					{titleVisible && (
						<View className=" items-center justify-center mb-5">
							{/* button back */}
							<Animated.View
								entering={FadeInLeft.delay(300).springify().damping(30)}
								className="absolute left-0"
								style={shadowBoxBlack()}
							>
								<ButtonBack />
							</Animated.View>
							{/* title header screan */}
							<Animated.View entering={FadeInUp.delay(500).springify().damping(30)}>
								<TitleScrean title={i18n.t("Recipes")} />
							</Animated.View>
						</View>
					)}

					{/* block header end*/}

					{/*    masonry*/}
					{loading && !isScreanAlrecipeBayCreatore && !isFavoriteScrean ? (
						<LoadingComponent size="large" color="green" />
					) : allRecipes?.length === 0 ? (
						<Animated.View entering={FadeInDown.delay(300).springify()}>
							<Text className="text-center font-medium text-xl">There are no recipes yet</Text>
						</Animated.View>
					) : (
						<MasonryList
							// data={mealData}
							data={allRecipes}
							keyExtractor={(item) => item.id}
							// numColumns={2}
							numColumns={column}
							style={{ gap: 10 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item, i }) => (
								<RecipePointItemComponent item={item} index={i} langApp={langApp} />
							)}
							onEndReachedThreshold={0.1}
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default AllRecipesPointScreen;
