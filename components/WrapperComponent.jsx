import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { hp } from "../constants/responsiveScreen";

const WrapperComponent = ({ children, marginTopIos = 10, marginTopAnd = 60 }) => {
	return (
		<SafeAreaView>
			<StatusBar style="dark" />
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					// backgroundColor: "red",
					marginTop: Platform.OS === "ios" ? marginTopIos : marginTopAnd,
					minHeight: hp ? hp(100) : "100%",
				}}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode={"on-drag"}
			>
				{children}
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default WrapperComponent;
