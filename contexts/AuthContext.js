import { createContext, useContext, useEffect, useState } from "react";
import i18n from "../lang/i18n"; // Импортируем i18n из конфигурационного файла
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);

	const [requiredFields, setRequiredFields] = useState(false);

	const [previewRecipeReady, setPreviewRecipeReady] = useState(false);

	const [language, setLanguage] = useState(i18n.locale); // Храним текущий язык

	const [newComments, setNewComments] = useState({}); // Состояние новых комментариев по recipeId

	const [newLikes, setNewLikes] = useState({}); // Состояние новых лайков по recipeId

	const setAuth = (authUser) => {
		setUser(authUser);
	};

	// const setUserData = (userData) => {
	// 	setUser({ ...userData });
	// };

	const setUserData = (userData) => {
		setUser((prev) => ({ ...prev, ...userData }));
	};

	// Функция для смены языка
	const changeLanguage = (newLanguage) => {
		setLanguage(newLanguage);
		i18n.locale = newLanguage; // Обновляем язык в i18n
	};

	// Подписка на новые комментарии
	useEffect(() => {
		if (!user?.id) return;

		const commentsSubscription = supabase
			.channel("comments-channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${user.id},is_read=eq.false,type=eq.comment`, // Комментарии к рецептам пользователя
				},
				(payload) => {
					setNewComments((prev) => ({
						...prev,
						[payload.new.post_id]: true,
					}));
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
					filter: `recipe_id_like=in.(SELECT id FROM all_recipes_description WHERE published_id=eq.${user.id})`, // Лайки к рецептам пользователя
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

	// Сброс уведомлений
	const markAsRead = (type, recipeId) => {
		if (type === "comment") {
			setNewComments((prev) => {
				const updated = { ...prev };
				delete updated[recipeId];
				return updated;
			});
		} else if (type === "like") {
			setNewLikes((prev) => {
				const updated = { ...prev };
				delete updated[recipeId];
				return updated;
			});
		}
	};

	// console.log("AuthProvider requiredFields before render:", requiredFields);
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
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
