import MasonryList from "@react-native-seoul/masonry-list";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getDeviceType } from "../../constants/getWidthDevice";
import RecipePointItemComponent from "../RecipesMasonry/AllRecipesPoint/RecipePointItemComponent";

// Компонент для отображения одного рецепта
// const RecipePointItem = ({ item, index, langApp }) => {
// 	const router = useRouter();
// 	const isEven = index % 3 === 0;
// 	const imageHeight = isEven ? hp(25) : hp(35);

// 	// Находим название категории в зависимости от выбранного языка
// 	const categoryTitle = Array.isArray(item.title.lang)
// 		? item.title.lang.find((it) => it.lang === langApp)?.name || item.title.strTitle
// 		: item.title.strTitle;

// 	return (
// 		<Animated.View
// 			entering={FadeInDown.delay((index + 4) * 200)
// 				.springify()
// 				.damping(30)}
// 			key={item.id}
// 			className="flex justify-center mb-[10] gap-y-1 p-[2]"
// 			style={[shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 1, radius: 3 })]}
// 		>
// 			<TouchableOpacity
// 				onPress={() =>
// 					router.push({
// 						pathname: "RecipeDetailsScreen",
// 						params: { id: item.full_recipe_id, langApp: langApp },
// 					})
// 				}
// 				style={{ width: "100%" }}
// 				className="rounded-full relative items-center"
// 			>
// 				{/*block up video user*/}
// 				<View
// 					style={shadowBoxBlack({
// 						offset: { width: 1, height: 1 },
// 						opacity: 1,
// 						radius: 1,
// 						elevation: 3,
// 					})}
// 					className={`${
// 						item?.video ? "justify-between" : "justify-end"
// 					} items-start flex-row w-full absolute top-2 left-0 z-10 px-5`}
// 				>
// 					{item?.video && <PlayCircleIcon size={25} color="red" />}
// 					{item?.published_user && (
// 						<View className="items-center">
// 							<AvatarCustom
// 								uri={item?.published_user?.avatar}
// 								size={25}
// 								style={{ borderWidth: 0.2 }}
// 								rounded={50}
// 							/>
// 							<Text
// 								style={{
// 									fontSize: 6,
// 									maxWidth: 20,
// 									overflow: "hidden",
// 									textAlign: "center",
// 								}}
// 								numberOfLines={1}
// 								ellipsizeMode="tail"
// 							>
// 								{item?.published_user?.user_name}
// 							</Text>
// 						</View>
// 					)}
// 				</View>

// 				{item.image_header && (
// 					<AvatarCustom
// 						uri={item.image_header}
// 						style={{
// 							borderWidth: 0.2,
// 							width: "100%",
// 							height: imageHeight,
// 						}}
// 						rounded={35}
// 					/>
// 				)}

// 				<LinearGradient
// 					colors={["transparent", "#18181b"]}
// 					style={{
// 						width: "100%",
// 						height: "100%",
// 						position: "absolute",
// 						borderRadius: 35,
// 					}}
// 					start={{ x: 0.5, y: 0.2 }}
// 					end={{ x: 0.5, y: 1 }}
// 				/>

// 				{/* icons like comments rating */}
// 				<View className="absolute bottom-[20] items-center justify-around">
// 					<Text className="text-white font-medium text-center mb-2" style={shadowText()}>
// 						{categoryTitle}
// 					</Text>

// 					{/* icons */}
// 					<View className="flex-row items-center justify-around w-full min-h-[25px]">
// 						{item.likes > 0 && (
// 							<View className="items-center">
// 								<HeartIcon size={25} color="gray" />
// 								<Text
// 									style={{
// 										fontSize: 8,
// 										maxWidth: 25,
// 										overflow: "hidden",
// 										textAlign: "center",
// 									}}
// 									className="text-white"
// 									numberOfLines={1}
// 									ellipsizeMode="tail"
// 								>
// 									{myFormatNumber(item.likes)}
// 								</Text>
// 							</View>
// 						)}

// 						{item.comments > 0 && (
// 							<View className="items-center">
// 								<ChatBubbleOvalLeftEllipsisIcon size={25} color="gray" />
// 								<Text
// 									style={{
// 										fontSize: 8,
// 										maxWidth: 25,
// 										overflow: "hidden",
// 										textAlign: "center",
// 									}}
// 									className="text-white"
// 									numberOfLines={1}
// 									ellipsizeMode="tail"
// 								>
// 									{myFormatNumber(item.comments)}
// 								</Text>
// 							</View>
// 						)}

// 						{item.rating > 0 && (
// 							<View className="items-center">
// 								<StarIcon size={25} color="gray" />
// 								<Text style={{ fontSize: 8 }} className="text-white">
// 									{item.rating}
// 								</Text>
// 							</View>
// 						)}
// 					</View>
// 				</View>
// 			</TouchableOpacity>
// 		</Animated.View>
// 	);
// };

// Основной компонент для отображения списка рецептов
const RecipeListSearchScreenComponent = ({ recipes, langApp }) => {
	const [column, setColumn] = useState(0);
	// console.log("RecipeListSearchScreenComponent recipes", recipes);

	// Определяем количество колонок в зависимости от типа устройства
	useEffect(() => {
		const type = getDeviceType(window.innerWidth);
		setColumn(type);
	}, []);

	return (
		<View className="flex-1">
			{recipes?.length === 0 ? (
				<Text className="text-center mt-5">No recipes found</Text>
			) : (
				<MasonryList
					data={recipes}
					keyExtractor={(item) => item.id}
					numColumns={column}
					style={{ gap: 10 }}
					showsVerticalScrollIndicator={false}
					renderItem={({ item, i }) => <RecipePointItemComponent item={item} index={i} langApp={langApp} />}
					onEndReachedThreshold={0.1}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({});

export default RecipeListSearchScreenComponent;
