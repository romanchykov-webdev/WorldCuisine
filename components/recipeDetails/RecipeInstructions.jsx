import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { hp } from "../../constants/responsiveScreen";
import { shadowTextSmall } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import LoadingComponent from "../loadingComponent";
import ImageCustom from "./ImageCustom";
import ImageSliderCustom from "./ImageSliderCustom";
import { useAuth } from "../../contexts/AuthContext";
import { themes } from "../../constants/themes";

const RecipeInstructions = ({ instructions, langDev, isPreview }) => {
	// console.log("RecipeInstructions instructions ",JSON.stringify(instructions,null,2));
	// console.log("RecipeInstructions langDev ",langDev)
	const { currentTheme } = useAuth();
	// Проверяем, есть ли язык, соответствующий langDev
	// const selectedLang = instructions.lang[langDev]
	// 	? instructions.lang[langDev]
	// 	: Object.values(instructions.lang)[0]; // Если языка нет, берем первый доступный

	// Проверяем, есть ли язык, соответствующий langDev
	const selectedLang = instructions.lang[langDev] || Object.values(instructions.lang)[0];
	// console.log('selectedLang',selectedLang)

	// Если instructions.lang пустой объект, ничего не рендерим
	if (!selectedLang || Object.keys(instructions.lang).length === 0) {
		return null;
	}

	// Преобразуем объект в массив для FlatList
	const steps = Object?.entries(selectedLang).map(([key, value]) => ({
		step: key,
		...value,
	}));

	// console.log('steps',steps)

	return (
		<View>
			<Text
				style={[{ fontSize: hp(2.5), color: themes[currentTheme]?.secondaryTextColor }, shadowTextSmall()]}
				className="font-bold px-4  mb-3"
			>
				{i18n.t("Recipe Description")}
			</Text>
			{steps ? (
				<>
					{steps?.map((item, index) => {
						return (
							<View
								key={index}
								className="w-full
                                {/*bg-red-500*/}
                                "
							>
								<View className="mb-5">
									<Text
										className="flex-wrap mb-3"
										style={{ fontSize: hp(2.5), color: themes[currentTheme]?.secondaryTextColor }}
									>
										<Text className="text-amber-500">
											{item.step}
											{" ) "}
										</Text>

										{item.text}
									</Text>
									{Array.isArray(item?.images) &&
										item?.images.length > 0 &&
										(item?.images.length === 1 ? (
											<ImageCustom image={item?.images} isPreview={isPreview} />
										) : (
											<ImageSliderCustom images={item?.images} isPreview={isPreview} />
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
