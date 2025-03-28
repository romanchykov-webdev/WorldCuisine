import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";

const RefactorTitleAria = ({ title, area, langApp }) => {
	console.log("RefactorTitleAria title", title);
	console.log("RefactorTitleAria area", area);

	// Извлекаем название на основе текущего языка
	const displayTitle = title?.lang?.find((item) => item.lang === langApp)?.name || title?.strTitle || "Untitled";

	// Извлекаем регион на основе текущего языка
	const displayArea = area?.[langApp] || "Unknown Area";

	// console.log("RefactorTitleAria title:", displayTitle);
	//   console.log("RefactorTitleAria area:", displayArea);

	return (
		<View className="px-4 flex justify-between gap-y-5 ">
			{/*    name and area*/}
			<View className="gap-y-2">
				<Text style={[{ fontSize: hp(2.7) }]} className="font-bold  text-neutral-700">
					{displayTitle}
				</Text>
				<Text style={{ fontSize: hp(1.8) }} className="font-medium text-neutral-500">
					{displayArea}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RefactorTitleAria;
