import { Image } from "expo-image";
import React from "react";
import { StyleSheet } from "react-native";
import { hp } from "../constants/responsiveScreen";
import { getUserImageSrc } from "../service/imageServices";

const AvatarCustom = ({
	uri,
	size = hp(4.5),
	style = {},
	isPreview = false,
	// rounded = 'rounded-full'
	rounded = "100%",
}) => {
	console.log("AvatarCustom uri", uri);
	return (
		<Image
			source={isPreview ? uri : getUserImageSrc(uri)}
			// source={getUserImageSrc(uri)}
			transition={100}
			style={[
				styles.avatar,
				{ height: size, width: size, borderRadius: rounded },
				style,
			]}
			contentFit="cover" // Заменяем resizeMode на contentFit для 'expo-image'
		/>
	);
};

const styles = StyleSheet.create({
	avatar: {
		borderCurve: "continuous",
		borderColor: "black",
		borderWidth: 1,
	},
});

export default AvatarCustom;
