import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import ButtonBack from "../../components/ButtonBack";
import SubscriptionsComponent from "../../components/recipeDetails/SubscriptionsComponent";
import TitleScrean from "../../components/TitleScrean";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";

import Icon from "react-native-vector-icons/Entypo";
import LoadingComponent from "../../components/loadingComponent";

const AllRecipesBayCreator = () => {
	const params = useLocalSearchParams();

	const { user: userData } = useAuth();

	const { creator_id } = params;

	const [headerAllCeripe, setHeaderAllRecipe] = useState(true);

	// show folder or list
	const [toggleFolderList, setToggleFolderList] = useState(false);

	// loading
	const [loading, setLoading] = useState(true);

	// Переносим логику в useEffect
	useEffect(() => {
		if (userData?.id === creator_id) {
			setHeaderAllRecipe(false);
			console.log("headerAllCeripe", headerAllCeripe);
		}
	}, [userData, creator_id]); // Зависимости: эффект сработает при изменении userData или crearote_id

	console.log("AllRecipesBayCreator params", params);
	console.log("AllRecipesBayCreator creator_id", creator_id);
	console.log("AllRecipesBayCreator userData", userData);

	return (
		<SafeAreaView>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					// backgroundColor: "red",
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
					{/* Перемещённый блок в начало */}
					<View
						className={`${headerAllCeripe ? "mb-10 self-start" : "absolute left-0"}`}
						style={shadowBoxBlack()}
					>
						<ButtonBack />
					</View>
					{/* Остальные элементы */}
					{!headerAllCeripe && (
						<TitleScrean title={"Ваши рецепты"} styleTitle={{ textAlign: "center", fontSize: hp(3) }} />
					)}

					{headerAllCeripe && <SubscriptionsComponent subscriber={userData?.id} creatorId={creator_id} />}
				</View>

				{/* section foldr list */}
				<View className="flex-row items-center justify-around mb-5">
					{/* folder */}
					<TouchableOpacity
						onPress={() => setToggleFolderList((prev) => !prev)}
						className={`p-5 ${toggleFolderList ? "bg-amber-300" : "bg-white"}  rounded-full `}
						style={shadowBoxBlack()}
					>
						<Icon name="folder" size={30} color="bg-amber-300" />
					</TouchableOpacity>

					{/* list/ */}
					<TouchableOpacity
						onPress={() => setToggleFolderList((prev) => !prev)}
						className={`p-5 ${toggleFolderList ? "bg-white" : "bg-amber-300"}  rounded-full `}
						style={shadowBoxBlack()}
					>
						<Icon name="list" size={30} color="grey" />
					</TouchableOpacity>

					{/* section data */}
				</View>
				<View className="bg-red-500 flex-1">
					{loading ? (
						<LoadingComponent />
					) : (
						<View>
							<Text></Text>
						</View>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default AllRecipesBayCreator;
