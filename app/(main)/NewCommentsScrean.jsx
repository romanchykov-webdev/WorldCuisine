import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AvatarCustom from "../../components/AvatarCustom";
import ButtonBack from "../../components/ButtonBack";
import TitleScrean from "../../components/TitleScrean";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";

const NewCommentsScrean = () => {
	const { newComments, newLikes, markAsRead } = useAuth();

	console.log("NewCommentsScrean newComments", newComments);
	console.log("NewCommentsScrean newLikes", newLikes);
	console.log("NewCommentsScrean markAsRead", markAsRead);

	// Сброс уведомлений при открытии экрана
	// useEffect(() => {
	// 	if (recipeId) {
	// 		// markAsRead("comment", recipeId); // Сбрасываем уведомление о комментариях
	// 		// markAsRead("like", recipeId); // Сбрасываем уведомление о лайках
	// 	}
	// }, [recipeId, markAsRead]);
	return (
		<SafeAreaView>
			{/* headerSection */}
			<View className="px-[20] border-b border-b-neutral-300">
				<View style={shadowBoxBlack()} className="mb-5">
					<ButtonBack />
				</View>

				<View className="items-center ">
					<TitleScrean title={`${i18n.t("Last Comments")}`} styleTitle={{ textAlign: "center" }} />
				</View>
			</View>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					// backgroundColor: "red",
					minHeight: hp(100),
				}}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode={"on-drag"}
			>
				{/* section last comments */}
				<View className="gap-y-5">
					{/* component comment */}
					<View
						className="w-auto border-2 p-2 h-[150] bg-white border-neutral-500 rounded-[12] gap-x-2 "
						style={shadowBoxBlack()}
					>
						<Text className="text-center text-xl">Name recipe</Text>
						<View className="flex-row items-center gap-x-2">
							<AvatarCustom size={hp(10)} />

							{/* block  */}
							<View className="flex-1 ">
								<Text className="flex-1 " numberOfLines={7} ellipsizeMode="tail">
									Lorem ipsum, dolor sit amet consectetur adipisicing elit. Blanditiis repellat dicta
									ipsa velit, neque, distinctio eos doloremque architecto minima earum vitae illum!
									Corporis possimus, consectetur ipsum cupiditate, ratione alias expedita, blanditiis
									eligendi velit veniam quidem. Facere, quia amet! Explicabo hic praesentium ipsum
									modi magnam sit eligendi provident voluptatibus repellat a? Lorem ipsum, dolor sit
									amet consectetur adipisicing elit. Blanditiis repellat dicta ipsa velit, neque,
									distinctio eos doloremque architecto minima earum vitae illum! Corporis possimus,
									consectetur ipsum cupiditate, ratione alias expedita, blanditiis eligendi velit
									veniam quidem. Facere, quia amet! Explicabo hic praesentium ipsum modi magnam sit
									eligendi provident voluptatibus repellatrepellat a? Lorem ipsum, dolor sit amet
									consectetur adipisicing elit. Blanditiis repellat dicta ipsa velit, neque,
									distinctio eos doloremque architecto minima earum vitae illum! Corporis possimus,
									consectetur ipsum cupiditate, ratione alias expedita, blanditiis eligendi velit
									veniam quidem. Facere, quia amet! Explicabo hic praesentium ipsum modi magnam sit
									eligendi provident voluptatibus repellatrepellat a? Lorem ipsum, dolor sit amet
									consectetur adipisicing elit. Blanditiis repellat dicta ipsa velit, neque,
									distinctio eos doloremque architecto minima earum vitae illum! Corporis possimus,
									consectetur ipsum cupiditate, ratione alias expedita, blanditiis eligendi velit
									veniam quidem. Facere, quia amet! Explicabo hic praesentium ipsum modi magnam sit
									eligendi provident voluptatibus repellat a?
								</Text>
							</View>
						</View>
						<View className="flex-row flex-1 justify-between items-center mt-1 ">
							<Text className="" style={{ fontSize: 12 }}>
								15-03-2025 17:55
							</Text>
							<Text className="" style={{ fontSize: 12 }}>
								{i18n.t("Open recipe")} ...
							</Text>
						</View>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({});

export default NewCommentsScrean;
