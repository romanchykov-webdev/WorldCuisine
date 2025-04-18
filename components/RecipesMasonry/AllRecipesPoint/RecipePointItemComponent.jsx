import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "react-native-heroicons/outline";
import Animated, { FadeInDown } from "react-native-reanimated";
import { StarIcon } from "react-native-star-rating-widget";
import { myFormatNumber } from "../../../constants/halperFunctions";
import { hp } from "../../../constants/responsiveScreen";
import { shadowBoxBlack, shadowText } from "../../../constants/shadow";
import AvatarCustom from "../../AvatarCustom";

const RecipePointItemComponent = ({ item, index, langApp }) => {
	const router = useRouter();

	const isEven = index % 3 === 0;
	const imageHeight = isEven ? hp(25) : hp(35);

	// Находим название категории в зависимости от выбранного языка

	const categoryTitle = Array.isArray(item.title.lang)
		? item.title.lang.find((it) => it.lang === langApp)?.name || item.title.strTitle
		: item.title.strTitle;

	// console.log('categoryTitle',categoryTitle)

	return (
		<Animated.View
			entering={FadeInDown.delay((index + 4) * 200)
				.springify()
				.damping(30)}
			// key={index}
			key={item.id}
			className="flex justify-center mb-[10] gap-y-1  p-[2]"
			style={[
				shadowBoxBlack({
					offset: { width: 1, height: 1 },
					opacity: 1,
					radius: 3,
				}),
			]}
		>
			<TouchableOpacity
				onPress={() =>
					router.push({
						pathname: "RecipeDetailsScreen",
						params: { id: item.full_recipe_id, langApp: langApp },
					})
				}
				style={{ width: "100%" }}
				className="rounded-full relative items-center "
			>
				{/*block up video user*/}
				<View
					style={shadowBoxBlack({
						offset: { width: 1, height: 1 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
						opacity: 1, // Прозрачность тени (по умолчанию 30%)
						radius: 1, // Радиус размытия тени (по умолчанию 5px)
						elevation: 3, // Высота "подъема" для создания тени на Android (по умолчанию 6)
					})}
					className={`${
						item?.video ? "justify-between" : "justify-end"
					} items-start flex-row w-full absolute top-2 left-0 z-10 px-5 
                    `}
				>
					{item?.video && <PlayCircleIcon size={25} color="red" />}

					{/* if item?.published_user not null {} */}
					{item?.published_user && (
						<View className=" items-center ">
							<AvatarCustom
								uri={item?.published_user?.avatar}
								size={25}
								style={{ borderWidth: 0.2 }}
								rounded={50}
							/>
							<Text
								style={{
									fontSize: 6,
									maxWidth: 20,
									overflow: "hidden",
									textAlign: "center",
								}}
								numberOfLines={1}
								ellipsizeMode="tail"
							>
								{item?.published_user?.user_name}
							</Text>
						</View>
					)}
				</View>

				{item.image_header && (
					<AvatarCustom
						uri={item.image_header}
						style={{
							borderWidth: 0.2,
							width: "100%",
							height: imageHeight,
						}}
						rounded={35}
					/>
				)}

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

				{/*    icons like comments rating*/}
				<View className=" absolute bottom-[20] items-center justify-around">
					<Text className=" text-white font-medium text-center mb-2" style={shadowText()}>
						{categoryTitle}
					</Text>

					{/*icons*/}
					<View
						className="flex-row items-center justify-around  w-full min-h-[25px]
                    {/*bg-red-500*/}
                    "
					>
						{/*    like*/}
						{item.likes > 0 && (
							<View className="items-center ">
								<HeartIcon size={25} color="gray" />
								{/*<HeartIcon size={30} color='gray' fill='red'/>*/}
								<Text
									style={{
										fontSize: 8,
										maxWidth: 25,
										overflow: "hidden",
										textAlign: "center",
									}}
									className="text-white"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{myFormatNumber(item.likes)}
									{/*{item.likes}234*/}
								</Text>
							</View>
						)}

						{/*    comments*/}
						{item.comments > 0 && (
							<View className="items-center ">
								<ChatBubbleOvalLeftEllipsisIcon size={25} color="gray" />
								<Text
									style={{
										fontSize: 8,
										maxWidth: 25,
										overflow: "hidden",
										textAlign: "center",
									}}
									className="text-white"
									numberOfLines={1}
									ellipsizeMode="tail"
								>
									{myFormatNumber(item.comments)}
									{/*{item.comments}*/}
								</Text>
							</View>
						)}

						{/*    StarIcon*/}
						{item.rating > 0 && (
							<View className="items-center">
								<StarIcon size={25} color="gray" />
								<Text style={{ fontSize: 8 }} className="text-white">
									{item.rating}
								</Text>
							</View>
						)}
					</View>
				</View>
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({});

export default RecipePointItemComponent;
