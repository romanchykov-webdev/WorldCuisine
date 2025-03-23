import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../lang/i18n";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [requiredFields, setRequiredFields] = useState(false);
	const [previewRecipeReady, setPreviewRecipeReady] = useState(false);
	const [language, setLanguage] = useState(i18n.locale);
	const [newComments, setNewComments] = useState({});

	// console.log("AuthProvider user", user);

	const [newLikes, setNewLikes] = useState({});
	const [unreadCommentsCount, setUnreadCommentsCount] = useState(0);
	const [unreadLikesCount, setUnreadLikesCount] = useState(0);

	const setAuth = (authUser) => {
		setUser(authUser);
	};

	const setUserData = (userData) => {
		setUser((prev) => ({ ...prev, ...userData }));
	};

	const changeLanguage = (newLanguage) => {
		setLanguage(newLanguage);
		i18n.locale = newLanguage;
	};

	// Функция для подсчёта непрочитанных уведомлений
	// const fetchUnreadCount = async () => {
	// 	if (!user?.id) return;

	// 	const { count, error } = await supabase
	// 		.from("notifications")
	// 		.select("*", { count: "exact", head: true }) // Подсчитываем количество записей
	// 		.eq("user_id", user.id)
	// 		.eq("is_read", false)
	// 		.eq("type", "comment");

	// 	if (error) {
	// 		console.error("Error fetching unread count:", error.message);
	// 	} else {
	// 		setUnreadCount(count || 0);
	// 	}
	// };

	// Подписка на новые комментарии и начальная загрузка
	// useEffect(() => {
	// 	if (!user?.id) return;

	// 	// Начальная загрузка непрочитанных комментариев
	// 	const loadInitialComments = async () => {
	// 		const { data, error } = await supabase
	// 			.from("notifications")
	// 			.select("recipe_id")
	// 			.eq("user_id", user.id)
	// 			.eq("is_read", false)
	// 			.eq("type", "comment")
	// 			.order("created_at", { ascending: false });

	// 		if (error) {
	// 			console.error("Error loading initial comments:", error.message);
	// 		} else {
	// 			const initialComments = data.reduce((acc, item) => {
	// 				acc[item.recipe_id] = true;
	// 				return acc;
	// 			}, {});
	// 			setNewComments(initialComments);
	// 		}

	// 		// Загружаем начальное количество непрочитанных уведомлений
	// 		fetchUnreadCount();
	// 	};

	// 	loadInitialComments();

	// 	// Подписка на новые комментарии
	// 	const commentsSubscription = supabase
	// 		.channel("comments-channel")
	// 		.on(
	// 			"postgres_changes",
	// 			{
	// 				event: "INSERT",
	// 				schema: "public",
	// 				table: "notifications",
	// 				filter: `user_id=eq.${user.id},is_read=eq.false,type=eq.comment`,
	// 			},
	// 			(payload) => {
	// 				const recipeId = payload.new.recipe_id;
	// 				setNewComments((prev) => ({
	// 					...prev,
	// 					[recipeId]: true,
	// 				}));
	// 				// Увеличиваем счётчик непрочитанных уведомлений
	// 				setUnreadCount((prev) => prev + 1);
	// 			}
	// 		)
	// 		.subscribe();

	// 	return () => {
	// 		supabase.removeChannel(commentsSubscription);
	// 	};
	// }, [user?.id]);

	// useEffect(() => {
	// 	if (!user?.id) return;

	// 	console.log("Subscribing with user.id:", user.id);

	// 	const loadInitialComments = async () => {
	// 		const { data, error } = await supabase
	// 			.from("notifications")
	// 			.select("recipe_id")
	// 			.eq("user_id", user.id)
	// 			.eq("is_read", false)
	// 			.eq("type", "comment")
	// 			.order("created_at", { ascending: false });

	// 		if (error) {
	// 			console.error("Error loading initial comments:", error.message);
	// 		} else {
	// 			const initialComments = data.reduce((acc, item) => {
	// 				acc[item.recipe_id] = true;
	// 				return acc;
	// 			}, {});
	// 			setNewComments(initialComments);
	// 		}
	// 		fetchUnreadCount();
	// 	};

	// 	loadInitialComments();

	// 	const commentsSubscription = supabase
	// 		.channel(`comments-channel-${user.id}`)
	// 		.on(
	// 			"postgres_changes",
	// 			{
	// 				event: "INSERT",
	// 				schema: "public",
	// 				table: "notifications",
	// 				filter: `user_id=eq.${user.id}`,
	// 			},
	// 			(payload) => {
	// 				console.log("New notification received:", payload);
	// 				if (payload.new.is_read === false && payload.new.type === "comment") {
	// 					console.log("Processing comment:", payload.new);
	// 					const recipeId = payload.new.recipe_id;
	// 					setNewComments((prev) => ({
	// 						...prev,
	// 						[recipeId]: true,
	// 					}));
	// 					fetchUnreadCount();
	// 				} else {
	// 					console.log("Notification filtered out:", payload.new);
	// 				}
	// 			}
	// 		)
	// 		.subscribe((status) => {
	// 			console.log("Subscription status:", status);
	// 		});

	// 	return () => {
	// 		supabase.removeChannel(commentsSubscription);
	// 	};
	// }, [user?.id]);

	// // Подписка на новые лайки
	// useEffect(() => {
	// 	if (!user?.id) return;

	// 	const likesSubscription = supabase
	// 		.channel("likes-channel")
	// 		.on(
	// 			"postgres_changes",
	// 			{
	// 				event: "INSERT",
	// 				schema: "public",
	// 				table: "recipes_likes",
	// 				filter: `recipe_id_like=in.(SELECT id FROM all_recipes_description WHERE published_id=eq.${user.id})`,
	// 			},
	// 			(payload) => {
	// 				setNewLikes((prev) => ({
	// 					...prev,
	// 					[payload.new.recipe_id_like]: true,
	// 				}));
	// 			}
	// 		)
	// 		.subscribe();

	// 	return () => {
	// 		supabase.removeChannel(likesSubscription);
	// 	};
	// }, [user?.id]);

	// const markAsRead = async (type, recipeId, notificationId = null) => {
	// 	if (!user?.id) return;

	// 	try {
	// 		let query = supabase
	// 			.from("notifications")
	// 			.update({ is_read: true })
	// 			.eq("user_id", user.id)
	// 			.eq("type", type)
	// 			.eq("is_read", false);

	// 		if (notificationId) {
	// 			query = query.eq("id", notificationId);
	// 		} else {
	// 			query = query.eq("recipe_id", recipeId);
	// 		}

	// 		const { error } = await query;

	// 		if (error) {
	// 			console.error("Error marking as read:", error.message);
	// 			return;
	// 		}

	// 		// Обновляем количество непрочитанных уведомлений
	// 		fetchUnreadCount();

	// 		// Проверяем, остались ли непрочитанные уведомления для recipeId
	// 		if (type === "comment") {
	// 			const { data: remainingNotifications, error: fetchError } = await supabase
	// 				.from("notifications")
	// 				.select("id")
	// 				.eq("user_id", user.id)
	// 				.eq("recipe_id", recipeId)
	// 				.eq("type", "comment")
	// 				.eq("is_read", false);

	// 			if (fetchError) {
	// 				console.error("Error fetching remaining notifications:", fetchError.message);
	// 				return;
	// 			}

	// 			setNewComments((prev) => {
	// 				const updated = { ...prev };
	// 				if (!remainingNotifications || remainingNotifications.length === 0) {
	// 					delete updated[recipeId];
	// 				}
	// 				return updated;
	// 			});
	// 		} else if (type === "like") {
	// 			setNewLikes((prev) => {
	// 				const updated = { ...prev };
	// 				delete updated[recipeId];
	// 				return updated;
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("Unexpected error in markAsRead:", error.message);
	// 	}
	// };
	//-------------
	// const fetchUnreadCount = async (type) => {
	// 	if (!user?.id) return;

	// 	const { count, error } = await supabase
	// 		.from("notifications")
	// 		.select("*", { count: "exact", head: true })
	// 		.eq("user_id", user.id)
	// 		.eq("is_read", false)
	// 		.eq("type", type);

	// 	if (error) {
	// 		console.error(`Error fetching unread ${type} count:`, error.message);
	// 	} else {
	// 		if (type === "comment") {
	// 			setUnreadCommentsCount(count || 0);
	// 		} else if (type === "like") {
	// 			setUnreadLikesCount(count || 0);
	// 		}
	// 	}
	// };

	// useEffect(() => {
	// 	if (!user?.id) return;

	// 	const loadInitialData = async () => {
	// 		// Комментарии
	// 		const { data: commentsData, error: commentsError } = await supabase
	// 			.from("notifications")
	// 			.select("recipe_id")
	// 			.eq("user_id", user.id)
	// 			.eq("is_read", false)
	// 			.eq("type", "comment")
	// 			.order("created_at", { ascending: false });
	// 		if (commentsError) {
	// 			console.error("Error loading initial comments:", commentsError.message);
	// 		} else {
	// 			setNewComments(commentsData.reduce((acc, item) => ({ ...acc, [item.recipe_id]: true }), {}));
	// 		}
	// 		fetchUnreadCount("comment");

	// 		// Лайки
	// 		const { data: likesData, error: likesError } = await supabase
	// 			.from("notifications")
	// 			.select("recipe_id")
	// 			.eq("user_id", user.id)
	// 			.eq("is_read", false)
	// 			.eq("type", "like")
	// 			.order("created_at", { ascending: false });
	// 		if (likesError) {
	// 			console.error("Error loading initial likes:", likesError.message);
	// 		} else {
	// 			setNewLikes(likesData.reduce((acc, item) => ({ ...acc, [item.recipe_id]: true }), {}));
	// 		}
	// 		fetchUnreadCount("like");
	// 	};

	// 	loadInitialData();

	// 	const subscription = supabase
	// 		.channel(`notifications-channel-${user.id}`)
	// 		.on(
	// 			"postgres_changes",
	// 			{
	// 				event: "INSERT",
	// 				schema: "public",
	// 				table: "notifications",
	// 				filter: `user_id=eq.${user.id}`,
	// 			},
	// 			(payload) => {
	// 				if (payload.new.is_read === false) {
	// 					const recipeId = payload.new.recipe_id;
	// 					if (payload.new.type === "comment") {
	// 						setNewComments((prev) => ({ ...prev, [recipeId]: true }));
	// 						fetchUnreadCount("comment");
	// 					} else if (payload.new.type === "like") {
	// 						setNewLikes((prev) => ({ ...prev, [recipeId]: true }));
	// 						fetchUnreadCount("like");
	// 					}
	// 				}
	// 			}
	// 		)
	// 		.subscribe((status) => {
	// 			console.log("Subscription status:", status);
	// 		});

	// 	return () => supabase.removeChannel(subscription);
	// }, [user?.id]);

	// const markAsRead = async (type, recipeId, notificationId = null) => {
	// 	if (!user?.id) return;

	// 	try {
	// 		let query = supabase
	// 			.from("notifications")
	// 			.update({ is_read: true })
	// 			.eq("user_id", user.id)
	// 			.eq("type", type)
	// 			.eq("is_read", false);

	// 		if (notificationId) {
	// 			query = query.eq("id", notificationId);
	// 		} else {
	// 			query = query.eq("recipe_id", recipeId);
	// 		}

	// 		const { error } = await query;

	// 		if (error) {
	// 			console.error("Error marking as read:", error.message);
	// 			return;
	// 		}

	// 		fetchUnreadCount(type);

	// 		const { data: remainingNotifications, error: fetchError } = await supabase
	// 			.from("notifications")
	// 			.select("id")
	// 			.eq("user_id", user.id)
	// 			.eq("recipe_id", recipeId)
	// 			.eq("type", type)
	// 			.eq("is_read", false);

	// 		if (fetchError) {
	// 			console.error("Error fetching remaining notifications:", fetchError.message);
	// 			return;
	// 		}

	// 		if (type === "comment") {
	// 			setNewComments((prev) => {
	// 				const updated = { ...prev };
	// 				if (!remainingNotifications || remainingNotifications.length === 0) {
	// 					delete updated[recipeId];
	// 				}
	// 				return updated;
	// 			});
	// 		} else if (type === "like") {
	// 			setNewLikes((prev) => {
	// 				const updated = { ...prev };
	// 				if (!remainingNotifications || remainingNotifications.length === 0) {
	// 					delete updated[recipeId];
	// 				}
	// 				return updated;
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("Unexpected error in markAsRead:", error.message);
	// 	}
	// };

	const fetchUnreadCount = async (type) => {
		if (!user?.id || user === null) return;

		const { count, error } = await supabase
			.from("notifications")
			.select("*", { count: "exact", head: true })
			.eq("user_id", user.id)
			.eq("is_read", false)
			.eq("type", type);

		if (error) {
			console.error(`Error fetching unread ${type} count:`, error.message);
		} else {
			if (type === "comment") {
				setUnreadCommentsCount(count || 0);
			} else if (type === "like") {
				setUnreadLikesCount(count || 0);
			}
		}
	};

	useEffect(() => {
		if (!user?.id || user === null) return;

		const loadInitialData = async () => {
			// Один запрос для комментариев и лайков
			const { data, error } = await supabase
				.from("notifications")
				.select("recipe_id, type")
				.eq("user_id", user.id)
				.eq("is_read", false)
				.in("type", ["comment", "like"])
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error loading initial notifications:", error.message);
			} else {
				const comments = {};
				const likes = {};
				data.forEach((item) => {
					if (item.type === "comment") comments[item.recipe_id] = true;
					else if (item.type === "like") likes[item.recipe_id] = true;
				});
				setNewComments(comments);
				setNewLikes(likes);
			}
			fetchUnreadCount("comment");
			fetchUnreadCount("like");
		};

		loadInitialData();

		const subscription = supabase
			.channel(`notifications-channel-${user.id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${user.id}`,
				},
				(payload) => {
					const { eventType, new: newData, old: oldData } = payload;
					const recipeId = newData?.recipe_id || oldData?.recipe_id;
					const type = newData?.type || oldData?.type;

					if (type === "comment") {
						if (eventType === "INSERT" && newData.is_read === false) {
							setNewComments((prev) => ({ ...prev, [recipeId]: true }));
							fetchUnreadCount("comment");
						} else if (eventType === "UPDATE" && newData.is_read === true) {
							setNewComments((prev) => {
								const updated = { ...prev };
								delete updated[recipeId];
								return updated;
							});
							fetchUnreadCount("comment");
						}
					} else if (type === "like") {
						if (eventType === "INSERT" || (eventType === "UPDATE" && newData.is_read === false)) {
							setNewLikes((prev) => ({ ...prev, [recipeId]: true }));
							fetchUnreadCount("like");
						} else if (eventType === "UPDATE" && newData.is_read === true) {
							setNewLikes((prev) => {
								const updated = { ...prev };
								delete updated[recipeId];
								return updated;
							});
							fetchUnreadCount("like");
						}
					}
				}
			)
			.subscribe((status) => console.log("Subscription status:", status));

		return () => supabase.removeChannel(subscription);
	}, [user?.id]);

	const markAsRead = async (type, recipeId, notificationId = null) => {
		if (!user?.id) return;

		try {
			let query = supabase
				.from("notifications")
				.update({ is_read: true })
				.eq("user_id", user.id)
				.eq("type", type)
				.eq("is_read", false);

			if (notificationId) {
				query = query.eq("id", notificationId);
			} else {
				query = query.eq("recipe_id", recipeId);
			}

			const { error } = await query;

			if (error) throw error;

			fetchUnreadCount(type);

			const { data: remaining, error: fetchError } = await supabase
				.from("notifications")
				.select("id")
				.eq("user_id", user.id)
				.eq("recipe_id", recipeId)
				.eq("type", type)
				.eq("is_read", false);

			if (fetchError) throw fetchError;

			if (type === "comment") {
				setNewComments((prev) => {
					const updated = { ...prev };
					if (!remaining?.length) delete updated[recipeId];
					return updated;
				});
			} else if (type === "like") {
				setNewLikes((prev) => {
					const updated = { ...prev };
					if (!remaining?.length) delete updated[recipeId];
					return updated;
				});
			}
		} catch (error) {
			console.error("Error in markAsRead:", error.message);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setAuth,
				setUserData,
				language,
				changeLanguage,
				requiredFields,
				setRequiredFields,
				previewRecipeReady,
				setPreviewRecipeReady,
				newComments,
				newLikes,
				markAsRead,
				unreadCommentsCount,
				unreadLikesCount,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
