import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";
import {useAuth} from "../../contexts/AuthContext";
import {themes} from "../../constants/themes";

const TitleDescriptionComponent = ({
	slyleWrapper,
	titleVisual = false,
	styleTitle,
	titleText,
	descriptionVisual = false,
	stileDescripton,
	descriptionText,
}) => {
	const {currentTheme}=useAuth()
	return (
		<View style={[styles.wrapper, slyleWrapper]}>
			{titleVisual && <Text style={[styles.title, styleTitle, { color:themes[currentTheme]?.textColor}]}>{titleText}</Text>}

			{descriptionVisual && <Text style={[styles.description, stileDescripton,{color:themes[currentTheme]?.secondaryTextColor}]}>{descriptionText}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		marginBottom: 10,
	},
	title: {
		fontSize: hp(2),
		fontWeight: "bold",
		paddingLeft: 5,
		marginBottom: 5,
	},
	description: {
		fontSize: 12,
		// fontWeight: "n",
		paddingLeft: 5,
	},
});

export default TitleDescriptionComponent;
