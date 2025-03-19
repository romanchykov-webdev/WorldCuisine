import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import AvatarCustom from "../../components/AvatarCustom";
import ButtonBack from "../../components/ButtonBack";
import TitleScrean from "../../components/TitleScrean";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import { supabase } from "../../lib/supabase";
import { getRecipeImageUrl } from "../../service/imageServices";

const NewCommentsScrean = () => {
	const { user, markAsRead, unreadCount, language } = useAuth();
	const navigation = useNavigation();
	const [notifications, setNotifications] = useState([]);
	// console.log("NewCommentsScrean notifications", notifications);

	const [switchStates, setSwitchStates] = useState({}); // Состояние для каждого Switch

	const router = useRouter();

	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const animatedHeights = useRef({});

	useEffect(() => {
		if (!user?.id) {
			console.log("User ID is not available:", user);
			setErrorMessage("User ID is not available");
			return;
		}

		setLoading(true);
		setErrorMessage(null);
		const fetchNotifications = async () => {
			// console.log("Fetching notifications for user_id:", user.id);
			try {
				const { data, error } = await supabase
					.from("notifications")
					.select(
						`
            id,
            recipe_id,
            message,
            created_at,
            is_read,
            type,
            actor_id,
            user_id,
            users(user_name, avatar),
            all_recipes_description(title, image_header)
          `
					)
					.eq("user_id", user.id)
					.eq("is_read", false)
					.eq("type", "comment")
					.order("created_at", { ascending: false });

				if (error) {
					console.error("Error fetching notifications:", error.message, error.details);
					setErrorMessage(`Error: ${error.message}`);
				} else {
					// Инициализация анимации и состояния переключателей
					const initialSwitchStates = {};
					// console.log("Raw fetched data:", data);c
					const validNotifications = Array.isArray(data) ? data : [];
					// console.log("Processed notifications:", validNotifications);
					setNotifications(validNotifications);

					validNotifications.forEach((notification) => {
						if (!animatedHeights.current[notification.id]) {
							animatedHeights.current[notification.id] = new Animated.Value(150);
						}
						initialSwitchStates[notification.id] = true; // Изначально включен (зеленый)
					});
					setSwitchStates(initialSwitchStates);
				}
			} catch (e) {
				console.error("Unexpected error:", e.message);
				setErrorMessage(`Unexpected error: ${e.message}`);
			} finally {
				setLoading(false);
			}
		};

		fetchNotifications();
	}, [user?.id]);

	const toggleReadStatus = async (notificationId, recipeId) => {
		try {
			Animated.timing(animatedHeights.current[notificationId], {
				toValue: 0,
				duration: 300,
				useNativeDriver: false,
			}).start(() => {
				// Обновляем только конкретное уведомление в Supabase
				supabase
					.from("notifications")
					.update({ is_read: true })
					.eq("id", notificationId)
					.then(({ error }) => {
						if (error) {
							console.error("Error marking notification as read:", error.message);
							return;
						}

						// Удаляем уведомление из состояния
						setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
						setSwitchStates((prev) => {
							const newState = { ...prev };
							delete newState[notificationId]; // Удаляем состояние переключателя
							return newState;
						});
						// Передаём notificationId в markAsRead
						markAsRead("comment", recipeId, notificationId);
					});
			});
		} catch (error) {
			console.error("Unexpected error in toggleReadStatus:", error.message);
		}
	};

	const navigateToRecipe = (recipeId) => {
		// navigation.navigate("RecipeScreen", { recipeId });
		console.log("NewCommentsScrean navigateToRecipe", recipeId);
		router.push({
			pathname: "RecipeDetailsScreen",
			params: { id: recipeId, langApp: language },
		});
	};

	// console.log("notification notifications", notifications);

	return (
		<SafeAreaView>
			<View className="px-[20] border-b border-b-neutral-300 mb-5">
				<View style={shadowBoxBlack()} className="mb-5">
					<ButtonBack />
				</View>
				<View className="items-center ">
					<TitleScrean
						title={`${i18n.t("Last Comments")} (${unreadCount})`}
						styleTitle={{ textAlign: "center" }}
					/>
				</View>
			</View>
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					minHeight: hp(100),
				}}
				showsVerticalScrollIndicator={false}
				keyboardDismissMode={"on-drag"}
			>
				<View className="gap-y-5">
					{loading ? (
						<Text className="text-center text-lg mt-5">Loading...</Text>
					) : errorMessage ? (
						<Text className="text-center text-lg mt-5 text-red-500">{errorMessage}</Text>
					) : notifications.length > 0 ? (
						notifications.map((notification) => {
							const imageUrl = getRecipeImageUrl(notification.all_recipes_description?.image_header);
							// console.log("Recipe image URL for notification", notification.id, ":", imageUrl);
							return (
								<Animated.View
									key={notification.id}
									style={{
										height: animatedHeights.current[notification.id] || 130,
										// overflow: "hidden",
										...shadowBoxBlack({
											offset: { width: 1, height: 1 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
											opacity: 0.5, // Прозрачность тени (по умолчанию 30%)
										}),
									}}
								>
									<View className="w-auto border-2 p-2 h-[130] bg-white border-neutral-500 rounded-[12] gap-x-2 relative overflow-hidden">
										<AvatarCustom
											uri={notification.all_recipes_description?.image_header}
											resizeMode="cover"
											style={{
												position: "absolute",
												borderRadius: 0,
												top: 0,
												left: 0,
												width: "110%",
												height: "120%",
												ResizeMode: "",
												zIndex: -10,
												opacity: 0.5,
											}}
										/>
										<View className="flex-row justify-between items-center">
											<View className="flex-row items-center">
												<Text className="text-xl text-neutral-500">User : </Text>
												<Text className="text-xl">
													{notification.users?.user_name || "Unknown User"}
												</Text>
											</View>
											<Switch
												value={switchStates[notification.id]} // Динамическое состояние
												onValueChange={() =>
													toggleReadStatus(notification.id, notification.recipe_id)
												}
												thumbColor={switchStates[notification.id] ? "green" : "red"}
												trackColor={{
													false: "#767577",
													true: "#00FF00",
												}}
											/>
										</View>
										<View className="flex-row items-center gap-x-2">
											<AvatarCustom uri={notification.users?.avatar} size={60} />
											<View className="flex-1">
												<Text className="flex-1" numberOfLines={7} ellipsizeMode="tail">
													{notification.message}
												</Text>
											</View>
										</View>
										<View className="flex-row flex-1 justify-between items-center mt-1">
											<Text className="" style={{ fontSize: 12 }}>
												{new Date(notification.created_at).toLocaleString()}
											</Text>
											<TouchableOpacity onPress={() => navigateToRecipe(notification.recipe_id)}>
												<Text className="" style={{ fontSize: 12 }}>
													{i18n.t("Open recipe")} ...
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								</Animated.View>
							);
						})
					) : (
						<Text className="text-center text-lg mt-5">No new comments</Text>
					)}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	cardBackground: {
		borderRadius: 12,
		overflow: "hidden",
	},
});

export default NewCommentsScrean;
