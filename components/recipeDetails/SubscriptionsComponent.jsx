import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UsersIcon } from "react-native-heroicons/mini";
import { myFormatNumber } from "../../constants/halperFunctions";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import AvatarCustom from "../AvatarCustom";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";

const SubscriptionsComponent = ({
	subscriber,
	creatorId,
	isPreview = false,
}) => {
	const subscriberId = subscriber?.id;

	console.log("subscriber", subscriber);

	const router = useRouter();
	// subscriberId={user?.id} creatorId={recipeDish?.publishedId}
	// console.log("subscriberId",subscriberId);

	// get creator data componennt SubscriptionsComponent
	const [creatorData, setcreatorData] = useState({
		creaotorId: null,
		creaotorName: null,
		creaotorAvatar: null,
		creaotorSubscribers: null,
	});

	useEffect(() => {
		if (isPreview) {
			setcreatorData({
				creatorId: subscriber?.id,
				creaotorName: subscriber.user_name,
				creaotorAvatar: subscriber.avatar,
				creaotorSubscribers: subscriber.subscribers,
			});
		}
		console.log("creatorData", creatorData);
	}, [isPreview]);

	const getDataCreator = async () => {
		try {
		} catch (error) {
			console.error("Error:", error);
		}
	};

	console.log("creatorId", creatorId);
	const handleSubscribe = async () => {
		if (isPreview) return;
		console.log("ok");
		console.log("subscriberId", subscriberId);
		console.log("creatorId", creatorId);
	};

	const handleGetAllRecipeCreator = () => {
		if (isPreview) return;
		router.push({
			pathname: "(main)/AllRecipesBayCreator",
			query: { creatorId: creatorId }, // Передача ID пользователя
		});
	};
	return (
		<View className="flex-row items-center justify-between gap-x-3 mb-5 ">
			{/*block avatar subscribe recipe*/}
			<View className=" flex-1 m-w-[50%] flex-row items-center justify-start gap-x-3 ">
				<View
					style={shadowBoxBlack()}
					className="items-center relative"
				>
					<TouchableOpacity
						onPress={() => handleGetAllRecipeCreator()}
					>
						<AvatarCustom
							size={hp(10)}
							uri={creatorData.creaotorAvatar}
						/>
					</TouchableOpacity>

					{/*<Text*/}
					{/*    numberOfLines={1}*/}
					{/*    style={{maxWidth:hp(10),overflow:"hidden",fontSize:12}}*/}
					{/*    className="absolute bottom-[-18]"*/}

					{/*>*/}
					{/*    userName*/}
					{/*</Text>*/}
				</View>

				<View className="w-full  overflow-hidden flex-1">
					<View className="flex-row items-center">
						{/*<DocumentTextIcon color="grey"/>*/}
						{/*<Text className="text-xs font-bold" numberOfLines={1}> - {myFormatNumber(1)}</Text>*/}
						<Text
							numberOfLines={1}
							style={{ fontSize: 14 }}
							className="font-bold"
						>
							{creatorData.creaotorName}
						</Text>
					</View>
					<View className="flex-row items-center">
						<UsersIcon color="grey" />
						<Text className="text-xs font-bold" numberOfLines={1}>
							{" "}
							- {myFormatNumber(creatorData.creaotorSubscribers)}
						</Text>
					</View>
				</View>
			</View>

			<TouchableOpacity
				onPress={handleSubscribe}
				className="flex-1 m-w-[50%] "
				style={shadowBoxBlack()}
			>
				<ButtonSmallCustom
					title="Subscribe"
					bg={"green"}
					// icon={PlusIcon}
					w="100%"
					h={60}
					buttonText={true}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({});

export default SubscriptionsComponent;
