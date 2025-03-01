import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";

const TitleDescriptionComponent = ({ slyleWrapper, titleVisual = false, styleTitle, titleText, discriptionVisual = false, stileDescripton, descriptionText }) => {
	return (
		<View style={[styles.wrapper, slyleWrapper]}>
			{titleVisual && <Text style={[styles.title, styleTitle]}>{titleText}</Text>}

			{discriptionVisual && <Text style={[styles.description, stileDescripton]}>{descriptionText}</Text>}
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
