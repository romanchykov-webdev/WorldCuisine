import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInLeft, FadeInUp } from "react-native-reanimated";
import ButtonBack from "../../components/ButtonBack";
import LoadingComponent from "../../components/loadingComponent";
import RecipePointItemComponent from "../../components/RecipesMasonry/AllRecipesPoint/RecipePointItemComponent";
import TitleScrean from "../../components/TitleScrean";
import { getDeviceType } from "../../constants/getWidthDevice";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import { getAllRecipesPointMasonryMyDB } from "../../service/getDataFromDB";

const AllRecipesPointScreen = ({
	isScreanAlrecipeBayCreatore = false,
	isScreanAllRecibeData = [],
	isFavoriteScrean = false,
	allFavoriteRecipes = [],
	titleVisible = true,
}) => {
	const { point } = useLocalSearchParams();
	const { language: langApp } = useAuth();

	// console.log("AllRecipesPointScreen langApp", langApp);
	// console.log("AllRecipesPointScreen isFavoriteScrean", isFavoriteScrean);

	const [loading, setLoading] = useState(true);

	const [column, setColumn] = useState(0);
	useEffect(() => {
		// Определяем тип устройства и обновляем количество колонок
		const type = getDeviceType(window.innerWidth);
		setColumn(type);
	}, []);

	const [allRecipes, setAllRecipes] = useState([]);

	// console.log('AllRecipesPointScreen',point)

	const fetchGetAllRecipesPointMasonryMyDB = async () => {
		const res = await getAllRecipesPointMasonryMyDB(point);
		// console.log("AllRecipesPointScreen res point", JSON.stringify(res.data, null, 2));
		setAllRecipes(res.data);
	};

	useEffect(() => {
		if (!isScreanAlrecipeBayCreatore && !isFavoriteScrean) {
			setLoading(true);
			fetchGetAllRecipesPointMasonryMyDB();
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	}, [point]);

	useEffect(() => {
		if (isScreanAlrecipeBayCreatore) {
			setLoading(true);

			setAllRecipes(isScreanAllRecibeData);
			setTimeout(() => {
				setLoading(false);
			}, 1000);

			// console.log("isScreanAlrecipeBayCreatore", allRecipes);
		}
	}, [isScreanAlrecipeBayCreatore, isScreanAllRecibeData]);

	useEffect(() => {
		if (isFavoriteScrean) {
			setLoading(true);

			setAllRecipes(allFavoriteRecipes);

			setTimeout(() => {
				setLoading(false);
			}, 1000);

			// console.log("FavoriteScrean", allRecipes);
		}
	}, [isFavoriteScrean]);

	return (
		<SafeAreaView>
			<ScrollView contentContainerStyle={{ marginTop: Platform.OS === "ios" ? null : 30 }}>
				<View className={`gap-y-3 ${isScreanAlrecipeBayCreatore || isFavoriteScrean ? null : "p-[20]"}`}>
					{/* block header*/}
					{titleVisible && (
						<View className=" items-center justify-center mb-5">
							{/* button back */}
							<Animated.View
								entering={FadeInLeft.delay(300).springify().damping(30)}
								className="absolute left-0"
								style={shadowBoxBlack()}
							>
								<ButtonBack />
							</Animated.View>
							{/* title header screan */}
							<Animated.View entering={FadeInUp.delay(500).springify().damping(30)}>
								<TitleScrean title={i18n.t("Recipes")} />
							</Animated.View>
						</View>
					)}

					{/* block header end*/}

					{/*    masonry*/}
					{loading && !isScreanAlrecipeBayCreatore && !isFavoriteScrean ? (
						<LoadingComponent size="large" color="green" />
					) : allRecipes?.length === 0 ? (
						// prettier-ignore
						// (!isScreanAlrecipeBayCreatore && !isFavoriteScrean) ? (
						// 	<LoadingComponent size="large" color="green" />
						// ) : null
						<Animated.View
						entering={FadeInDown.delay(300).springify()}
						>
							<Text className="text-center font-medium text-xl">There are no recipes yet</Text>
							</Animated.View>
					) : (
						<MasonryList
							// data={mealData}
							data={allRecipes}
							keyExtractor={(item) => item.id}
							// numColumns={2}
							numColumns={column}
							style={{ gap: 10 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item, i }) => (
								<RecipePointItemComponent item={item} index={i} langApp={langApp} />
							)}
							// refreshing={isLoadingNext}
							// onRefresh={() => refetch({first: ITEM_CNT})}
							onEndReachedThreshold={0.1}
							// onEndReached={() => loadNext(ITEM_CNT)}
						/>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

// const RecipePointItem = ({ item, index, langApp }) => {
// 	// console.log('index', index)
// 	// console.log('CardItem item', item)
// 	// console.log("CardItem langApp", langApp);
// 	const router = useRouter();

// 	const isEven = index % 3 === 0;
// 	const imageHeight = isEven ? hp(25) : hp(35);

// 	// Находим название категории в зависимости от выбранного языка

// 	const categoryTitle = Array.isArray(item.title.lang)
// 		? item.title.lang.find((it) => it.lang === langApp)?.name || item.title.strTitle
// 		: item.title.strTitle;

// 	// console.log('categoryTitle',categoryTitle)

// 	return (
// 		<Animated.View
// 			entering={FadeInDown.delay((index + 4) * 200)
// 				.springify()
// 				.damping(30)}
// 			// key={index}
// 			key={item.id}
// 			className="flex justify-center mb-[10] gap-y-1  p-[2]"
// 			style={[
// 				shadowBoxBlack({
// 					offset: { width: 1, height: 1 },
// 					opacity: 1,
// 					radius: 3,
// 				}),
// 			]}
// 		>
// 			<TouchableOpacity
// 				onPress={() =>
// 					router.push({
// 						pathname: "RecipeDetailsScreen",
// 						params: { id: item.full_recipe_id, langApp: langApp },
// 					})
// 				}
// 				style={{ width: "100%" }}
// 				className="rounded-full relative items-center "
// 			>
// 				{/*block up video user*/}
// 				<View
// 					style={shadowBoxBlack({
// 						offset: { width: 1, height: 1 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
// 						opacity: 1, // Прозрачность тени (по умолчанию 30%)
// 						radius: 1, // Радиус размытия тени (по умолчанию 5px)
// 						elevation: 3, // Высота "подъема" для создания тени на Android (по умолчанию 6)
// 					})}
// 					className={`${
// 						item?.video ? "justify-between" : "justify-end"
// 					} items-start flex-row w-full absolute top-2 left-0 z-10 px-5
//                     `}
// 				>
// 					{item?.video && <PlayCircleIcon size={25} color="red" />}

// 					{/* if item?.published_user not null {} */}
// 					{item?.published_user && (
// 						<View className=" items-center ">
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

// 				{/*    icons like comments rating*/}
// 				<View className=" absolute bottom-[20] items-center justify-around">
// 					<Text className=" text-white font-medium text-center mb-2" style={shadowText()}>
// 						{categoryTitle}
// 					</Text>

// 					{/*icons*/}
// 					<View
// 						className="flex-row items-center justify-around  w-full min-h-[25px]
//                     {/*bg-red-500*/}
//                     "
// 					>
// 						{/*    like*/}
// 						{item.likes > 0 && (
// 							<View className="items-center ">
// 								<HeartIcon size={25} color="gray" />
// 								{/*<HeartIcon size={30} color='gray' fill='red'/>*/}
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
// 									{/*{item.likes}234*/}
// 								</Text>
// 							</View>
// 						)}

// 						{/*    comments*/}
// 						{item.comments > 0 && (
// 							<View className="items-center ">
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
// 									{/*{item.comments}*/}
// 								</Text>
// 							</View>
// 						)}

// 						{/*    StarIcon*/}
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

const styles = StyleSheet.create({});

export default AllRecipesPointScreen;
