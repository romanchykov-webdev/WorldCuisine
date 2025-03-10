import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import ButtonBack from "../../components/ButtonBack";
import SubscriptionsComponent from "../../components/recipeDetails/SubscriptionsComponent";
import TitleScrean from "../../components/TitleScrean";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
const AllRecipesBayCreator = () => {
	const params = useLocalSearchParams();

	const { user: userData } = useAuth();

	const { crearote_id } = params;

	const [headerAllCeripe, setHeaderAllRecipe] = useState(true);

	// Переносим логику в useEffect
	useEffect(() => {
		if (userData?.id === crearote_id) {
			setHeaderAllRecipe(false);
		}
	}, [userData, crearote_id]); // Зависимости: эффект сработает при изменении userData или crearote_id

	// console.log("AllRecipesBayCreator creatorId", crearote_id);
	// console.log("AllRecipesBayCreator userData", userData);

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
				<View className="relativ  py-5 ">
					<View className="absolute self-start top-[15] " style={shadowBoxBlack()}>
						<ButtonBack />
					</View>
					{!headerAllCeripe && <TitleScrean title={"Ваши рецепты"} styleTitle={{ textAlign: "center" }} />}
					<Text></Text>

					{headerAllCeripe && (
						<View className="mt-16">
							<SubscriptionsComponent subscriber={userData?.id} creatorId={crearote_id} />
						</View>
					)}
					{/* <Text>creator id :{creatorId}</Text> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default AllRecipesBayCreator;
