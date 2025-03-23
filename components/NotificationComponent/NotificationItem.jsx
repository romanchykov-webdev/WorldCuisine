import React, { useEffect, useRef } from "react";
import { Animated, Switch, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import { createPulseAnimation } from "../../utils/animations";
import AvatarCustom from "../AvatarCustom";

const NotificationItem = ({
	item,
	animatedHeights,
	fadeAnim,
	switchStates,
	onToggleRead,
	onNavigate,
	isLiked = false,
}) => {
	// console.log("NotificationItem isLiked ", isLiked);
	// console.log("NotificationItem isLiked:", isLiked);
	// console.log("NotificationItem item.type:", item.type);

	const pulseAnim = useRef({});

	// Запускаем анимацию пульсации, когда компонент монтируется
	useEffect(() => {
		console.log("useEffect triggered for item.id:", item.id);
		if (item.type !== "comment") {
			console.log("Starting pulse animation for item.id:", item.id);
			createPulseAnimation({
				id: item.id,
				animationRef: pulseAnim,
				duration: 1400,
				scaleFrom: 1,
				scaleTo: 1.5,
				useNativeDriver: true,
			});
			console.log("pulseAnim.current after createPulseAnimation:", pulseAnim.current);
		}
	}, [item.id, item.type]);

	return (
		<View style={{ overflow: "hidden" }}>
			<Animated.View
				key={item.id}
				style={{
					height: animatedHeights.current[item.id] || 150,
					...shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 0.5 }),
				}}
			>
				<Animated.View
					style={{
						opacity: fadeAnim.current[item.id]?.opacity || 1,
						transform: [{ translateY: fadeAnim.current[item.id]?.translate || 0 }],
						backgroundColor: "transparent",
						position: "relative",
					}}
				>
					<View className="w-auto border-2 p-2 h-[130px] bg-transparent border-neutral-500 rounded-[12] gap-x-2 relative overflow-hidden">
						<AvatarCustom
							uri={item.all_recipes_description?.image_header}
							resizeMode="cover"
							style={{
								position: "absolute",
								borderRadius: 0,
								top: 0,
								left: 0,
								width: "110%",
								height: "120%",
								zIndex: -1,
								opacity: 0.5,
							}}
						/>
						<View className="flex-row justify-between items-center">
							<View className="flex-row items-center">
								<Text className="text-xl text-neutral-700">User : </Text>
								<Text className="text-xl">{item.users?.user_name || "Unknown User"}</Text>
							</View>
							<Switch
								value={switchStates[item.id]}
								onValueChange={() => onToggleRead(item.id, item.recipe_id)}
								thumbColor={switchStates[item.id] ? "#B2AC88" : "red"}
								trackColor={{ false: "rgba(0,0,0,0.2)", true: "rgba(0,0,0,0.3)" }}
							/>
						</View>
						{item.type === "comment" ? (
							// Для комментариев показываем текст сообщения
							<View className="flex-row items-center gap-x-2">
								<AvatarCustom uri={item.users?.avatar} size={60} />
								<View className="flex-1">
									<Text className="flex-1" numberOfLines={7} ellipsizeMode="tail">
										{item.message}
									</Text>
								</View>
							</View>
						) : (
							// Для лайков показываем только аватар и пустое место
							<View className="flex-row items-center gap-x-2 relative">
								<AvatarCustom uri={item.users?.avatar} size={60} />
								<View className="flex-1 items-center absolute left-[40%] ">
									{/* <Icon name="heart" size={80} color="red" className="  mr-[60px]" /> */}
									<Animated.View
										style={{
											transform: [{ scale: pulseAnim.current[item.id] || 1 }],
										}}
									>
										<Icon name="heart" size={80} color="red" className="mr-[60px]" />
									</Animated.View>
								</View>
							</View>
						)}
						<View className="flex-row flex-1 justify-between items-center mt-1">
							<Text style={{ fontSize: 12 }}>{new Date(item.created_at).toLocaleString()}</Text>
							<TouchableOpacity onPress={() => onNavigate(item.recipe_id)}>
								<Text style={{ fontSize: 12 }}>{i18n.t("Open recipe")} ...</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
			</Animated.View>
		</View>
	);
};

export default NotificationItem;
