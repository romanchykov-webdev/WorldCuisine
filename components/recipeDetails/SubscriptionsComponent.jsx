import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UsersIcon } from "react-native-heroicons/mini";
import { myFormatNumber, showCustomAlert } from "../../constants/halperFunctions";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import { getCreatoreRecipeDateMyDB } from "../../service/getDataFromDB";
import AvatarCustom from "../AvatarCustom";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";

const SubscriptionsComponent = ({ subscriber, creatorId, isPreview = false }) => {
	const subscriberId = subscriber?.id;

	console.log("SubscriptionsComponent subscriber ", subscriber);
	// console.log("SubscriptionsComponent subscriber id", subscriber?.id);
	// console.log("SubscriptionsComponent creatorId id", creatorId);
	// console.log("SubscriptionsComponent isPreview", isPreview);

	const router = useRouter();
	// subscriberId={user?.id} creatorId={recipeDish?.publishedId}
	// console.log("subscriberId",subscriberId);

	// get creator data componennt SubscriptionsComponent
	const [creatorData, setCreatorData] = useState({
		creaotorId: null,
		creaotorName: null,
		creaotorAvatar: null,
		creaotorSubscribers: null,
	});

	// useEffect(() => {
	// 	// let mounted = true;

	// 	const fetchCreatorData = async () => {
	// 		try {
	// 			// Приоритет 1: Режим предпросмотра
	// 			if (isPreview) {
	// 				// if (mounted) {
	// 				setCreatorData({
	// 					creatorId: subscriber?.id,
	// 					creatorName: subscriber.user_name,
	// 					creatorAvatar: subscriber.avatar,
	// 					creatorSubscribers: subscriber.subscribers,
	// 				});
	// 				// }
	// 				return; // Прерываем выполнение, если данные из предпросмотра
	// 			}

	// 			// Приоритет 2: Текущий пользователь является создателем
	// 			if (subscriberId === creatorId) {
	// 				// if (mounted) {
	// 				setCreatorData({
	// 					creatorId: subscriber?.id,
	// 					creatorName: subscriber.user_name,
	// 					creatorAvatar: subscriber.avatar,
	// 					creatorSubscribers: subscriber.subscribers,
	// 				});
	// 				// }
	// 				return; // Прерываем выполнение, если данные из subscriber
	// 			}

	// 			// Приоритет 3: Запрос к серверу для другого пользователя
	// 			if (!isPreview && subscriberId !== creatorId) {
	// 				const data = await getCreatorData(creatorId); // Предполагаемый запрос
	// 				// if (mounted && data) {
	// 				setCreatorData({
	// 					creatorId: data.id,
	// 					creatorName: data.user_name,
	// 					creatorAvatar: data.avatar,
	// 					creatorSubscribers: data.subscribers,
	// 				});
	// 				// }
	// 			}
	// 		} catch (error) {
	// 			console.error("Error fetching creator data:", error);
	// 			// if (mounted) {
	// 			setCreatorData({
	// 				creatorId: null,
	// 				creatorName: "Unknown",
	// 				creatorAvatar: null,
	// 				creatorSubscribers: 0,
	// 			}); // Установка значений по умолчанию при ошибке
	// 			// }
	// 		}
	// 	};

	// 	fetchCreatorData();

	// 	// return () => {
	// 	// 	mounted = false;
	// 	// };
	// }, [isPreview, subscriberId, creatorId, subscriber]);

	useEffect(() => {
		// if preview
		if (isPreview) {
			setCreatorData({
				creatorId: subscriber?.id,
				creaotorName: subscriber?.user_name,
				creaotorAvatar: subscriber?.avatar,
				creaotorSubscribers: subscriber?.subscribers,
			});
			return;
		}

		// if subscriber?.id === creatorId
		if (subscriber?.id === creatorId) {
			setCreatorData({
				creatorId: subscriber?.id,
				creaotorName: subscriber?.user_name,
				creaotorAvatar: subscriber?.avatar,
				creaotorSubscribers: subscriber?.subscribers,
			});
			return;
		}

		// if subscriber?.id !== creatorId For other users------
		if (subscriber?.id !== creatorId) {
			fetchGetDataCreator(creatorId);
			// console.log("creatorData", creatorData);
		}
	}, [isPreview, creatorId, subscriber]);

	const fetchGetDataCreator = async (creatorId) => {
		try {
			const { data: res } = await getCreatoreRecipeDateMyDB(creatorId);
			console.log("fetchGetDataCreator res", res);

			setCreatorData({
				creatorId: creatorId,
				creaotorName: res?.user_name,
				creaotorAvatar: res?.avatar,
				creaotorSubscribers: res?.subscribers,
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};

	// console.log("creatorId", creatorId);

	const handleSubscribe = async () => {
		if (isPreview) return; //if prewiew true
		if (subscriber?.id === creatorId) return;
		// console.log("ok");
		// console.log("subscriber", subscriber);
		// console.log("subscriberId", subscriberId);
		// console.log("creatorId", creatorId);
		if (subscriber === null) {
			showCustomAlert("Subscribe", `${i18n.t("To subscribe, you need to log in or create an account.")}`, router);
		}
	};

	const handleGetAllRecipeCreator = () => {
		if (isPreview) return;

		router.push({
			pathname: "(main)/AllRecipesBayCreator", // Путь к экрану RecipeDetailsScreen
			params: {
				creatorId, // Передаем данные как строку
			},
		});
	};
	return (
		<View className="flex-row items-center justify-between gap-x-3 mb-5 ">
			{/*block avatar subscribe recipe*/}
			<View className=" flex-1 m-w-[50%] flex-row items-center justify-start gap-x-3 ">
				<View style={shadowBoxBlack()} className="items-center relative">
					<TouchableOpacity onPress={() => handleGetAllRecipeCreator()}>
						<AvatarCustom size={hp(10)} uri={creatorData.creaotorAvatar} />
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
						<Text numberOfLines={1} style={{ fontSize: 14 }} className="font-bold">
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

			<TouchableOpacity onPress={handleSubscribe} className="flex-1 m-w-[50%] " style={shadowBoxBlack()}>
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
