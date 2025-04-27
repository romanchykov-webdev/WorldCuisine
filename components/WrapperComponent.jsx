import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { hp } from "../constants/responsiveScreen";
import {useAuth} from "../contexts/AuthContext";
import {themes} from "../constants/themes";

const WrapperComponent = ({ children, marginTopIos = 10, marginTopAnd = 60 }) => {

	const {currentTheme} =useAuth()

	return (
		<SafeAreaView style={{flex:1,backgroundColor: themes[currentTheme].backgroundColor}}>
			<StatusBar style={currentTheme === "light" ? "dark" : "light"}/>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					// backgroundColor: "red",
					backgroundColor: themes[currentTheme].backgroundColor, // Устанавливаем цвет фона
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
