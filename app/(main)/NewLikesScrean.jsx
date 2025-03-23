import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, FlatList, SafeAreaView, Text, View } from "react-native";
import ButtonBack from "../../components/ButtonBack";
import LoadingComponent from "../../components/loadingComponent";
import NotificationItem from "../../components/NotificationComponent/NotificationItem";
import TitleScrean from "../../components/TitleScrean";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import {
	fetchNotificationDetails,
	fetchNotifications,
	markNotificationAsRead,
	subscribeToNotifications,
} from "../../service/notificationsService";
import { createFadeAnimation, createHeightCollapseAnimation } from "../../utils/animations";

const NewLikesScrean = () => {
	const { user, markAsRead, unreadCount, unreadLikesCount, language } = useAuth();
	const [notifications, setNotifications] = useState([]);
	const [switchStates, setSwitchStates] = useState({});
	const [loading, setLoading] = useState(false);
	const [loadingMore, setLoadingMore] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [hasMore, setHasMore] = useState(true);
	const animatedHeights = useRef({});
	const fadeAnim = useRef({});
	const flatListRef = useRef(null);
	const oldestLoadedDate = useRef(null);
	const router = useRouter();

	const loadNotifications = async (isLoadMore = false) => {
		setLoading(!isLoadMore);
		setLoadingMore(isLoadMore);

		const { data, error } = await fetchNotifications({
			userId: user?.id,
			isLoadMore,
			oldestLoadedDate: oldestLoadedDate.current,
			notifications,
			type: "like", // Фильтруем только лайки
		});

		if (error) {
			setErrorMessage(`Error: ${error.message}`);
		} else {
			setNotifications((prev) => {
				const newNotifications = isLoadMore ? [...prev, ...data] : data;
				data.forEach((notification, index) => {
					if (!animatedHeights.current[notification.id]) {
						animatedHeights.current[notification.id] = new Animated.Value(150);
					}
					createFadeAnimation({
						id: notification.id,
						animationRef: fadeAnim,
						direction: "fromTop",
						duration: 300,
						offset: 20,
						delay: index * 100,
						useNativeDriver: true,
					});
				});
				return newNotifications;
			});
			setSwitchStates((prev) => ({
				...prev,
				...Object.fromEntries(data.map((n) => [n.id, true])),
			}));
			setHasMore(data.length === 10);
			if (data.length > 0) {
				oldestLoadedDate.current = data[data.length - 1].created_at;
			}
		}

		setLoading(false);
		setLoadingMore(false);
	};

	useEffect(() => {
		loadNotifications();

		const handleInsert = async (payload) => {
			if (payload.new.is_read || payload.new.type !== "like") return;

			setNotifications((prev) => {
				if (prev.some((n) => n.id === payload.new.id)) return prev;
				const newNotification = {
					...payload.new,
					users: { user_name: "Loading...", avatar: null },
					all_recipes_description: { title: "Loading...", image_header: null },
				};
				animatedHeights.current[newNotification.id] = new Animated.Value(150);
				createFadeAnimation({
					id: newNotification.id,
					animationRef: fadeAnim,
					direction: "fromTop",
					duration: 300,
					offset: 20,
					delay: 0,
					useNativeDriver: true,
				});
				return [...prev, newNotification];
			});
			setSwitchStates((prev) => ({ ...prev, [payload.new.id]: true }));

			const { data, error } = await fetchNotificationDetails(payload.new.id);
			if (!error && data) {
				setNotifications((prev) => prev.map((n) => (n.id === data.id ? data : n)));
			}
		};

		const unsubscribe = subscribeToNotifications(user?.id, handleInsert);
		return unsubscribe;
	}, [user?.id]);

	const toggleReadStatus = async (notificationId, recipeId) => {
		try {
			setSwitchStates((prev) => {
				const newState = { ...prev };
				delete newState[notificationId];
				return newState;
			});

			createHeightCollapseAnimation({
				id: notificationId,
				animationRef: animatedHeights,
				fromHeight: 150,
				duration: 300,
				onComplete: async () => {
					const { error } = await markNotificationAsRead(notificationId);
					if (error) {
						console.error("Error marking notification as read:", error.message);
						return;
					}
					setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
					markAsRead("like", recipeId, notificationId);
				},
			});
		} catch (error) {
			console.error("Unexpected error in toggleReadStatus:", error.message);
		}
	};

	const navigateToRecipe = (recipeId) => {
		router.push({
			pathname: "RecipeDetailsScreen",
			params: { id: recipeId, langApp: language },
		});
	};

	const loadMore = () => {
		if (!loadingMore && hasMore) {
			loadNotifications(true);
		}
	};

	const renderFooter = () => (loadingMore ? <LoadingComponent color="green" /> : null);

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View className="px-[20] border-b border-b-neutral-300 mb-5">
				<View style={shadowBoxBlack()} className="mb-5">
					<ButtonBack />
				</View>
				<View className="items-center">
					<TitleScrean
						title={`${i18n.t("Your recipes were liked by users")} (${unreadLikesCount})`}
						styleTitle={{ textAlign: "center" }}
					/>
				</View>
			</View>
			{loading ? (
				<LoadingComponent color="green" />
			) : errorMessage ? (
				<Text className="text-center text-lg mt-5 text-red-500">{errorMessage}</Text>
			) : (
				<FlatList
					data={notifications}
					renderItem={({ item }) => (
						<NotificationItem
							item={item}
							animatedHeights={animatedHeights}
							fadeAnim={fadeAnim}
							switchStates={switchStates}
							onToggleRead={toggleReadStatus}
							onNavigate={navigateToRecipe}
							isLiked={true}
						/>
					)}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						paddingHorizontal: 20,
						paddingBottom: 20,
						minHeight: hp(100),
					}}
					showsVerticalScrollIndicator={false}
					ListEmptyComponent={<Text className="text-center text-lg mt-5">No new likes</Text>}
					onEndReached={loadMore}
					onEndReachedThreshold={0.1}
					ListFooterComponent={renderFooter}
					ref={flatListRef}
				/>
			)}
		</SafeAreaView>
	);
};

export default NewLikesScrean;
