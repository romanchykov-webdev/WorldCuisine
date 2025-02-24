import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LoadingComponent from "../loadingComponent";
import ImageCustom from "./ImageCustom";
import ImageSliderCustom from "./ImageSliderCustom";

const RecipeInstructions = ({ instructions, langDev, isPreview }) => {
	// console.log("RecipeInstructions instructions ",JSON.stringify(instructions,null,2));
	// console.log("RecipeInstructions langDev ",langDev)

	// Проверяем, есть ли язык, соответствующий langDev
	const selectedLang = instructions.lang[langDev]
		? instructions.lang[langDev]
		: Object.values(instructions.lang)[0]; // Если языка нет, берем первый доступный

	// console.log('selectedLang',selectedLang)

	// Преобразуем объект в массив для FlatList
	const steps = Object.entries(selectedLang).map(([key, value]) => ({
		step: key,
		...value,
	}));

	// console.log('steps',steps)

	return (
		<View>
			{steps ? (
				<>
					{steps.map((item, index) => {
						return (
							<View
								key={index}
								className="w-full
                                {/*bg-red-500*/}
                                "
							>
								<View className="mb-5">
									<Text className="flex-wrap">
										<Text className="text-amber-500">
											{item.step}){" "}
										</Text>

										{item.text}
									</Text>
									{Array.isArray(item?.images) &&
										item?.images.length > 0 &&
										(item?.images.length === 1 ? (
											<ImageCustom
												image={item?.images}
												isPreview={isPreview}
											/>
										) : (
											<ImageSliderCustom
												images={item?.images}
												isPreview={isPreview}
											/>
										))}
								</View>
							</View>
						);
					})}
				</>
			) : (
				<View>
					<LoadingComponent />
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({});

export default RecipeInstructions;
