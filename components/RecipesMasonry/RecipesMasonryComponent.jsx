import MasonryList from "@react-native-seoul/masonry-list";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowUturnLeftIcon } from "react-native-heroicons/outline";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { getDeviceType } from "../../constants/getWidthDevice";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import AvatarCustom from "../AvatarCustom";

const RecipesMasonryComponent = ({ categoryRecipes, langApp, isScreanAlrecipeBayCreatore = false }) => {
	console.log("RecipesMasonryComponent categoryRecipes", categoryRecipes);
	console.log("RecipesMasonryComponent langApp", langApp);
	console.log("RecipesMasonryComponent isScreanAlrecipeBayCreatore", isScreanAlrecipeBayCreatore);
	// console.log("RecipesMasonryComponent isScreanAllRecibeData", isScreanAllRecibeData);
	useEffect(() => {}, [langApp]);

	const [isSubCategoryView, setIsSubCategoryView] = useState(false);
	const [selectedItem, setSelectedItem] = useState(null);

	const [column, setColumn] = useState(0);

	// console.log('Recipes Recipes',recipes)

	useEffect(() => {
		// Определяем тип устройства и обновляем количество колонок
		const type = getDeviceType(window.innerWidth);
		setColumn(type);
	}, []);

	const handleSubCategory = (item) => {
		setSelectedItem(item); // Устанавливаем текущий элемент
		setIsSubCategoryView(true); // Переходим к отображению подкатегорий
	};

	const handleBack = () => {
		setIsSubCategoryView(false); // Возвращаемся к основным категориям
		setSelectedItem(null); // Сбрасываем выбранный элемент
	};

	return (
		<View className="flex-1 gap-y-3 mt-5">
			{!isSubCategoryView ? (
				<MasonryList
					data={categoryRecipes}
					keyExtractor={(_, index) => index.toString()}
					numColumns={2}
					renderItem={({ item, i }) => (
						<CardItem item={item} index={i} onPress={handleSubCategory} langApp={langApp} />
					)}
				/>
			) : (
				<Animated.View entering={FadeInDown} exiting={FadeOutDown}>
					<SubCategoryView
						item={selectedItem}
						isSubCategoryView={isSubCategoryView}
						handleBack={handleBack}
						langApp={langApp}
					/>
				</Animated.View>
			)}
		</View>
	);
};

const CardItem = ({ item, index, onPress, langApp }) => {
	// console.log('CardItem',index)
	const isEven = index % 3 === 0;
	const imageHeight = isEven ? hp(25) : hp(35);

	return (
		<Animated.View
			entering={FadeInDown.delay(index * 200).springify()} // Задержка анимации
			className="flex mb-[10] gap-y-1 p-[2]"
			style={[
				shadowBoxBlack({
					offset: { width: 1, height: 1 },
					opacity: 1,
					radius: 3,
				}),
			]}
		>
			<TouchableOpacity onPress={() => onPress(item)} className="rounded-full relative items-center">
				<AvatarCustom
					uri={item.image}
					style={{
						borderWidth: 0.2,
						width: "100%",
						height: imageHeight,
					}}
					rounded={35}
				/>
				<LinearGradient
					colors={["transparent", "#18181b"]}
					style={{
						width: "100%",
						height: "100%",
						position: "absolute",
						borderRadius: 35,
					}}
					start={{ x: 0.5, y: 0.2 }}
					end={{ x: 0.5, y: 1 }}
				/>
				<Text className="absolute bottom-[20] text-white font-semibold">{item.name}</Text>
			</TouchableOpacity>
		</Animated.View>
	);
};

const SubCategoryView = ({ item, isSubCategoryView, handleBack, langApp }) => {
	const router = useRouter();

	const handleOpenItem = async (item) => {
		console.log("SubCategoryView handleOpenItem", item);

		router.push({
			pathname: "(main)/AllRecipesPointScreen",
			params: { point: item.point, langApp: langApp, preview: false },
		});
	};
	// console.log(item);
	return (
		<View className="gap-y-3">
			<View className="flex-row items-center mb-5 mt-5">
				{isSubCategoryView && (
					<TouchableOpacity
						className="absolute left-0 z-10 w-[50] h-[50] justify-center items-center bg-white rounded-full"
						onPress={handleBack}
					>
						<ArrowUturnLeftIcon size={30} color="gray" />
					</TouchableOpacity>
				)}
				<Text className=" flex-1 text-center  font-semibold text-xl text-neutral-700 mb-2">{item?.name}</Text>
			</View>

			<MasonryList
				data={item.subcategories || []}
				keyExtractor={(subItem, index) => subItem.name + index.toString()} // Используем уникальный ключ
				numColumns={2}
				renderItem={({ item, i }) => {
					// console.log('SubCategoryView',i)
					const isEven = i % 3 === 0;
					const imageHeight = isEven ? hp(25) : hp(35);
					return (
						<Animated.View
							style={[
								shadowBoxBlack({
									offset: { width: 1, height: 1 },
									opacity: 1,
									radius: 3,
								}),
							]}
							entering={FadeInDown.delay(i * 200).springify()} // Задержка анимации
							exiting={FadeOutDown.delay(i * 100)} // Задержка исчезновения
							className="flex mb-[10] gap-y-1 p-[2]"
						>
							<TouchableOpacity
								onPress={() => handleOpenItem(item)}
								className="rounded-full relative items-center"
							>
								<AvatarCustom
									uri={item.image}
									style={{
										borderWidth: 0.2,
										width: "100%",
										height: imageHeight,
									}}
									rounded={35}
								/>
								<LinearGradient
									colors={["transparent", "#18181b"]}
									style={{
										width: "100%",
										height: "100%",
										position: "absolute",
										borderRadius: 35,
									}}
									start={{ x: 0.5, y: 0.2 }}
									end={{ x: 0.5, y: 1 }}
								/>
								<Text className="absolute bottom-[10] text-white font-semibold">{item.name}</Text>
							</TouchableOpacity>
						</Animated.View>
					);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RecipesMasonryComponent;
