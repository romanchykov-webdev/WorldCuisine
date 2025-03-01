import { useLocalSearchParams } from "expo-router";
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
const AllRecipesBayCreator = () => {
	const params = useLocalSearchParams();
	const creatorId = params.creatorId;
	console.log("creatorId", creatorId);

	return (
		<SafeAreaView>
			<Text>AllRecipesBayCreator</Text>
			<Text>creator id :{creatorId}</Text>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default AllRecipesBayCreator;
