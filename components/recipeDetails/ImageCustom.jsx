import React from "react";
import { StyleSheet, View } from "react-native";
import { shadowBoxBlack } from "../../constants/shadow";
import AvatarCustom from "../AvatarCustom";

const ImageCustom = ({ image, isPreview, refactorScrean = false }) => {
	// console.log("ImageCustom image", image);
	// console.log("ImageCustom refactorScrean", refactorScrean);

	// Извлекаем первый элемент массива, если image — массив, или используем как строку
	const imageUri = Array.isArray(image) && image.length > 0 ? image[0] : image;
	// console.log("ImageCustom imageUri", imageUri);

	if (!imageUri) {
		return null; // Если нет изображения, ничего не рендерим
	}
	return (
		<View
			style={[
				{
					height: 300,
					width: "100%",
				},
				shadowBoxBlack(),
			]}
		>
			<AvatarCustom
				isPreview={isPreview}
				refactorScrean={refactorScrean}
				uri={imageUri}
				style={{
					width: "100%",
					height: 300,
					borderRadius: 40,
					// marginTop: wp(1),
					borderWidth: 0.5,
					borderColor: "gray",
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default ImageCustom;
