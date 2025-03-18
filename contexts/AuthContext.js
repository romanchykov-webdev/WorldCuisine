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
	const [newLikes, setNewLikes] = useState({});
	const [unreadCount, setUnreadCount] = useState(0); // Новое состояние для количества непрочитанных уведомлений

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
	const fetchUnreadCount = async () => {
		if (!user?.id) return;

		const { count, error } = await supabase
			.from("notifications")
			.select("*", { count: "exact", head: true }) // Подсчитываем количество записей
			.eq("user_id", user.id)
			.eq("is_read", false)
			.eq("type", "comment");

		if (error) {
			console.error("Error fetching unread count:", error.message);
		} else {
			setUnreadCount(count || 0);
		}
	};

	// Подписка на новые комментарии и начальная загрузка
	useEffect(() => {
		if (!user?.id) return;

		// Начальная загрузка непрочитанных комментариев
		const loadInitialComments = async () => {
			const { data, error } = await supabase
				.from("notifications")
				.select("recipe_id")
				.eq("user_id", user.id)
				.eq("is_read", false)
				.eq("type", "comment")
				.order("created_at", { ascending: false });

			if (error) {
				console.error("Error loading initial comments:", error.message);
			} else {
				const initialComments = data.reduce((acc, item) => {
					acc[item.recipe_id] = true;
					return acc;
				}, {});
				setNewComments(initialComments);
			}

			// Загружаем начальное количество непрочитанных уведомлений
			fetchUnreadCount();
		};

		loadInitialComments();

		// Подписка на новые комментарии
		const commentsSubscription = supabase
			.channel("comments-channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${user.id},is_read=eq.false,type=eq.comment`,
				},
				(payload) => {
					const recipeId = payload.new.recipe_id;
					setNewComments((prev) => ({
						...prev,
						[recipeId]: true,
					}));
					// Увеличиваем счётчик непрочитанных уведомлений
					setUnreadCount((prev) => prev + 1);
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(commentsSubscription);
		};
	}, [user?.id]);

	// Подписка на новые лайки
	useEffect(() => {
		if (!user?.id) return;

		const likesSubscription = supabase
			.channel("likes-channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "recipes_likes",
					filter: `recipe_id_like=in.(SELECT id FROM all_recipes_description WHERE published_id=eq.${user.id})`,
				},
				(payload) => {
					setNewLikes((prev) => ({
						...prev,
						[payload.new.recipe_id_like]: true,
					}));
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(likesSubscription);
		};
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

			if (error) {
				console.error("Error marking as read:", error.message);
				return;
			}

			// Обновляем количество непрочитанных уведомлений
			fetchUnreadCount();

			// Проверяем, остались ли непрочитанные уведомления для recipeId
			if (type === "comment") {
				const { data: remainingNotifications, error: fetchError } = await supabase
					.from("notifications")
					.select("id")
					.eq("user_id", user.id)
					.eq("recipe_id", recipeId)
					.eq("type", "comment")
					.eq("is_read", false);

				if (fetchError) {
					console.error("Error fetching remaining notifications:", fetchError.message);
					return;
				}

				setNewComments((prev) => {
					const updated = { ...prev };
					if (!remainingNotifications || remainingNotifications.length === 0) {
						delete updated[recipeId];
					}
					return updated;
				});
			} else if (type === "like") {
				setNewLikes((prev) => {
					const updated = { ...prev };
					delete updated[recipeId];
					return updated;
				});
			}
		} catch (error) {
			console.error("Unexpected error in markAsRead:", error.message);
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
				unreadCount,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
