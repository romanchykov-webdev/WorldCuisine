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
	RefactorImageHeader = false,
	// rounded = 'rounded-full'

	rounded = size / 2,
}) => {
	// console.log("AvatarCustom uri", uri);

	// Проверяем, является ли uri локальным файлом, полным URL или серверным путём
	const isLocalFile = uri?.startsWith("file://");
	const isFullUrl = uri?.startsWith("http://") || uri?.startsWith("https://");

	// Если это локальный файл, полный URL, isPreview или RefactorImageHeader, используем uri напрямую
	// Иначе предполагаем, что это серверный путь, и используем getUserImageSrc
	const source = isLocalFile || isFullUrl || isPreview || RefactorImageHeader ? uri : getUserImageSrc(uri);
	// console.log("AvatarCustom source", source);

	return (
		<Image
			// source={isPreview || RefactorImageHeader ? uri : getUserImageSrc(uri)}
			source={source}
			transition={100}
			className="rounded-full"
			style={[styles.avatar, { height: size, width: size, borderRadius: rounded }, style]}
			contentFit="cover" // Заменяем resizeMode на contentFit для 'expo-image'
		/>
	);
};

const styles = StyleSheet.create({
	avatar: {
		borderCurve: "continuous",
		// borderColor: "black",
		// borderWidth: 1,
	},
});

export default AvatarCustom;
