import { useEffect } from "react";
import { supabase } from "../lib/supabase";

// Получить все категории
export const getCategoriesMyDB = async () => {
	try {
		const { data, error } = await supabase.from("categories").select("*");
		if (error) {
			return { success: false, msg: error?.message };
		}

		// console.log('data', data)
		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return { success: false, msg: error.message };
	}
};

//получение всех рецептов в категории
export const getRecipesMyDB = async (category) => {
	// console.log("getRecipesMyDB category",category)
	try {
		let { data, error } = await supabase.from("short_desc").select("*").eq("category", category);

		if (error) {
			return {
				success: false,
				msg: "getRecipesMyDB error" + error?.message,
			};
		}

		// console.log('shortDesc', JSON.stringify(data, null, 2));

		return { success: true, data: data };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getRecipesMyDB catch error" + error.message,
		};
	}
};

//получение всех категории getCategoryRecipeMasonryMyDB
export const getCategoryRecipeMasonryMyDB = async (langDew) => {
	// console.log("getCategoryRecipeMasonryMyDB langDew", langDew);

	try {
		let { data, error } = await supabase.from("categories_masonry").select("*").eq("lang", langDew);

		if (error) {
			return {
				success: false,
				msg: "getCategoryRecipeMasonryMyDB try error" + error?.message,
			};
		}
		// console.log('getCategoryRecipeMasonryMyDB', JSON.stringify(data[0].title, null, 2))

		return { success: true, data: data[0].title };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getCategoryRecipeMasonry catch error" + error.message,
		};
	}
};

//получение всех под категории getCategoryRecipeMasonryMyDB
export const getAllRecipesPointMasonryMyDB = async (point) => {
	try {
		// let { data, error } = await supabase.from("shortDesc").select("*").eq("point", point);
		let { data, error } = await supabase.from("short_desc").select("*").eq("point", point);

		if (error) {
			return {
				success: false,
				msg: "getAllSubCategoriesMasonryMyDB try error" + error?.message,
			};
		}
		// console.log('getAllSubCategoriesMasonryMyDB', data)
		// console.log('getAllSubCategoriesMasonryMyDB', JSON.stringify(data[0].title, null, 2))

		return { success: true, data: data };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getAllSubCategoriesMasonryMyDB catch error" + error.message,
		};
	}
};

//получение description рецепта
export const getRecipesDescriptionMyDB = async (id) => {
	// console.log("getRecipesDescriptionMyDB receps id", id);
	// console.log('ok:',tableCategory)
	// if (tableCategory.includes(' ')) {
	//     console.log('Строка содержит пробелы');
	// } else {
	//     console.log('Строка не содержит пробелы');
	// }
	try {
		let { data, error } = await supabase.from("all_recipes_description").select("*").eq("id", id); // Фильтр по id

		if (error) {
			return {
				success: false,
				msg: "getRecipesDescriptionMyDB error" + error?.message,
			};
		}

		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getRecipesDescriptionMyDB catch error" + error.message,
		};
	}
};

//получение description рецепта его количества комментариев и рейтинга
export const getRecipesDescriptionLikeRatingMyDB = async ({ id, payload }) => {
	// console.log("getRecipesDescriptionLikeRatingMyDB recipe id",id)
	// console.log("getRecipesDescriptionLikeRatingMyDB recipe payload",payload)
	// console.log('ok:',tableCategory)

	try {
		let query;
		if (payload === "updateCommentsCount") {
			query = "comments";
		}
		// console.log('getRecipesDescriptionLikeRatingMyDB query',query)

		let { data, error } = await supabase.from("all_recipes_description").select(query).eq("id", id); // Фильтр по id

		if (error) {
			return {
				success: false,
				msg: "getRecipesDescriptionLikeRatingMyDB error" + error?.message,
			};
		}
		//
		//

		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getRecipesDescriptionMyDB catch error" + error.message,
		};
	}
};

//получение all comments рецепта
export const getAllCommentsMyDB = async (id) => {
	// console.log('getAllCommentsMyDB id',id)
	try {
		let { data, error } = await supabase
			.from("comments")
			.select("*")
			.eq("post_id", id) // Фильтр по id
			.order("created_at", { ascending: false }); // Сортировка от нового к старому

		if (error) {
			return {
				success: false,
				msg: "getRecipesDescriptionMyDB error" + error?.message,
			};
		}

		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getRecipesDescriptionMyDB catch error" + error.message,
		};
	}
};

//получение all users avatar name
export const getAllUserIdCommentedMyDB = async (ids) => {
	// console.log('getAllCommentsMyDB id', ids)
	try {
		// Запрос по массиву id, с использованием .in() для выборки данных по нескольким id
		let { data, error } = await supabase
			.from("users")
			.select("id, avatar, user_name") // Выбираем только нужные поля
			.in("id", ids); // Фильтруем по массиву id

		if (error) {
			return {
				success: false,
				msg: "getAllUserIdCommentedMyDB error: " + error.message,
			};
		}

		// console.log('Fetched user data:', JSON.stringify(data, null, 2));

		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return {
			success: false,
			msg: "getRecipesDescriptionMyDB catch error" + error.message,
		};
	}
};

//отправка комментария на рецепт
export const addNewCommentToRecipeMyDB = async ({ postId, userIdCommented, comment }) => {
	// console.log("getAllCommentsMyDB postId", postId);
	// console.log("getAllCommentsMyDB userIdCommented", userIdCommented);
	// console.log("getAllCommentsMyDB comment", comment);
	try {
		// increment_comment_count

		let { data, error } = await supabase
			.from("comments")
			.insert([
				{
					post_id: postId, // ID поста
					user_id_commented: userIdCommented, // ID пользователя
					comment, // Текст комментария
				},
			])
			.select();

		if (error) {
			console.error("Error adding comment:", error.message);
			return {
				success: false,
				msg: "Error adding comment: " + error.message,
			};
		}

		// console.log('Comment added successfully:', JSON.stringify(data, null, 2));
		return { success: true, data };
	} catch (error) {
		console.error("Unexpected error:", error.message);
		return { success: false, msg: "Unexpected error: " + error.message };
	}
};

//удаление комментария
export const deleteCommentByIdToRecipeMyDB = async (commentId) => {
	try {
		const { error } = await supabase.from("comments").delete().eq("id", commentId); // Фильтруем по id комментария

		if (error) {
			console.error("Error adding comment:", error.message);
			return {
				success: false,
				msg: "Error adding comment: " + error.message,
			};
		}

		// console.log("Комментарий удален успешно");
	} catch (error) {
		console.error("Ошибка при удалении комментария:", error.message);
	}
};

// добавление лайка рецепту
export const addLikeRecipeMyDB = async ({ recipeId, userIdLike }) => {
	try {
		const { data, error } = await supabase.rpc("toggle_recipe_like", {
			p_recipe_id_like: recipeId,
			p_user_id_like: userIdLike,
		});

		if (error) {
			console.error("Error toggling like:", error.message);
			return {
				success: false,
				msg: "Error toggling like: " + error.message,
			};
		}

		return { success: true, data };
	} catch (error) {
		console.error("Unexpected error:", error.message);
		return { success: false, msg: "Unexpected error: " + error.message };
	}
};

// проверка ставил ли пользователь лайк этому рецепту
export const checkIfUserLikedRecipe = async ({ recipeId, userId }) => {
	// console.log('checkIfUserLikedRecipe recipeId', recipeId);
	// console.log('checkIfUserLikedRecipe userId', userId);
	try {
		// Выполняем запрос к базе данных
		const { data, error } = await supabase
			.from("recipes_likes") // Таблица, в которой выполняем поиск
			.select("*") // Выбираем все столбцы (можно ограничить только нужными)
			.eq("recipe_id_like", recipeId) // Условие: ID рецепта
			.eq("user_id_like", userId) // Условие: ID пользователя
			.limit(1); // Лимитируем до одной строки, чтобы не получать лишние данные

		if (error) {
			console.error("Error checking like:", error.message);
			return { success: false, liked: false, msg: error.message };
		}

		// Проверяем, существует ли запись
		const liked = data.length > 0;
		// console.log("checkIfUserLikedRecipe liked:", liked);

		return { success: true, liked };
	} catch (error) {
		console.error("Unexpected error:", error.message);
		return { success: false, liked: false, msg: error.message };
	}
};

//Добавление рейтинга в таблицу recipe_ratings
export const addRecipeRatingMyDB = async ({ recipeId, userId, rating }) => {
	// console.log("addRecipeRatingMyDB", rating);

	try {
		const { data, error } = await supabase.from("recipe_ratings").upsert(
			{
				recipe_id: recipeId,
				user_id: userId,
				number_of_ratings: rating,
				updated_at: new Date().toISOString(),
			},
			{ onConflict: ["recipe_id", "user_id"] } // Указываем уникальные столбцы
		);

		if (error) {
			console.error("Error upserting recipe rating:", error.message);
			return { success: false, msg: error.message };
		}

		// console.log("Добавленный или обновленный рейтинг:", data);
		return { success: true };
	} catch (error) {
		console.error("Unexpected error:", error.message);
		return { success: false, msg: error.message };
	}
};

export const getAllMyLikedRecipes = async (userId) => {
	// console.log('getAllMyLikedRecipes id',id);
	try {
		const { data: likedRecipes, error: likedRecipesError } = await supabase
			.from("recipesLikes")
			.select("recipe_id_like")
			.eq("user_id_like", userId);

		if (likedRecipesError) {
			console.error("Error fetching liked recipes:", likedRecipesError.message);
			return { success: false, msg: likedRecipesError.message };
		}

		if (!likedRecipes || likedRecipes.length === 0) {
			return { success: true, data: [] }; // Нет лайкнутых рецептов
		}

		// Извлекаем массив ID рецептов
		const recipeIds = likedRecipes.map((item) => item.recipe_id_like);

		// Запрашиваем подробности из таблицы shortDesc по массиву ID
		const { data: recipesDetails, error: detailsError } = await supabase
			.from("short_desc")
			.select("*") // Замените '*' на конкретные колонки, которые вам нужны
			.in("fullRecipeId", recipeIds);

		if (detailsError) {
			console.error("Error fetching recipe details:", detailsError.message);
			return { success: false, msg: detailsError.message };
		}

		return { success: true, data: recipesDetails };
	} catch (error) {
		console.error("Unexpected error:", error.message);
		return { success: false, msg: error.message };
	}
};

// get all measurement
export const getMeasurementCreateRecipeMyDB = async () => {
	try {
		let { data, error } = await supabase.from("measurement").select("lang");

		if (error) {
			console.error("Error getMeasurementCreateRecipeMyDB:", error.message);
			return { success: false, msg: error.message };
		}

		// console.log('getMeasurementCreateRecipeMyDB',JSON.stringify(data,null,2));
		// Извлечение только значений 'lang' из полученного массива
		const languages = data.map((item) => item.lang);

		return { success: true, data: languages };
	} catch (error) {
		console.error("getMeasurementCreateRecipeMyDB error:", error.message);
		return { success: false, msg: error.message };
	}
};

// get creatore recipe data for section subscribe
export const getCreatoreRecipeDateMyDB = async (publishedId) => {
	try {
		// console.log("getCreatoreRecipeDateMyDB", publishedId);

		let { data, error } = await supabase
			.from("users")
			.select("user_name, avatar, subscribers")
			.eq("id", publishedId)
			.single();

		if (error) {
			console.error("Error getCreatoreRecipeDateMyDB:", error.message);
			return { success: false, msg: error.message };
		}
		// console.log("getCreatoreRecipeDateMyDB data", data);

		return { success: true, data };
	} catch (error) {
		console.error("Error getMeasurementCreateRecipeMyDB:", error.message);
		return { success: false, msg: error.message };
	}
};

// Проверка статуса подписки
export const getSubscriptionCheckDateMyDB = async (subscriber_id, creator_id) => {
	try {
		// console.log("getSubscriptionCheckDateMyDB subscriber_id", subscriber_id);
		// console.log("getSubscriptionCheckDateMyDB creator_id", creator_id);

		const { data, error } = await supabase
			.from("subscriptions")
			.select("*")
			.eq("subscriber_id", subscriber_id)
			.eq("creator_id", creator_id);

		if (error) {
			console.error("Error checking subscription:", error.message);
			return { success: false, msg: error.message };
		}

		return { success: true, data: data.length > 0 ? data[0] : null };
	} catch (error) {
		console.error("Error getSubscriptionCheckDateMyDB:", error.message);
		return { success: false, msg: error.message };
	}
};

// Подписка на создателя
export const subscribeToCreatorMyDB = async (subscriber_id, creator_id) => {
	try {
		const { data, error } = await supabase.from("subscriptions").insert([{ subscriber_id, creator_id }]).select();

		if (error) {
			console.error("Error subscribing:", error.message);
			return { success: false, msg: error.message };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Error subscribeToCreatorMyDB:", error.message);
		return { success: false, msg: error.message };
	}
};

// Отписка от создателя
export const unsubscribeFromCreatorMyDB = async (subscriber_id, creator_id) => {
	try {
		const { error } = await supabase
			.from("subscriptions")
			.delete()
			.eq("subscriber_id", subscriber_id)
			.eq("creator_id", creator_id);

		if (error) {
			console.error("Error unsubscribing:", error.message);
			return { success: false, msg: error.message };
		}

		return { success: true };
	} catch (error) {
		console.error("Error unsubscribeFromCreatorMyDB:", error.message);
		return { success: false, msg: error.message };
	}
};

// get all my recipes
export const getAllRecipesBayCreatoreListMyDB = async (creatore_id) => {
	try {
		let { data, error } = await supabase
			.from("short_desc")
			.select("*")
			// Фильтр по creatore_id
			.eq("published_id", creatore_id)
			// Сортировка по дате создания (от новых к старым)
			.order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching recipes:", error.message);
			return { success: false, msg: error.message };
		}

		// console.log("getAllRecipesBayCreatoreListMyDB creatore_id:", creatore_id);
		// console.log("Recipes found:", all_recipes_description);

		return { success: true, data };
	} catch (error) {
		console.error("Error in getAllRecipesBayCreatoreListMyDB:", error.message);
		return { success: false, msg: error.message };
	}
};

// get all favorite recipe
export const getAllFavoriteIdisMyDB = async (user_id) => {
	try {
		let { data, error } = await supabase.from("recipes_likes").select("recipe_id_like").eq("user_id_like", user_id);
		// Сортировка по дате создания (от новых к старым)
		// .order("created_at", { ascending: false });

		if (error) {
			console.error("Error fetching recipes:", error.message);
			return { success: false, msg: error.message };
		}

		// console.log("getAllFavoriteListMyDB, user_id", user_id);
		// console.log("getAllFavoriteListMyDB, data", data);

		// Извлекаем только значения recipe_id_like в массив
		const recipe_ids = data.map((item) => item.recipe_id_like);
		// console.log("getAllFavoriteListMyDB, recipe_ids", recipe_ids);

		return { success: true, data: recipe_ids };
	} catch (error) {
		console.error("Error in getAllFavoriteListMyDB:", error.message);
		return { success: false, msg: error.message };
	}
};

// Функция для получения рецептов по ID

export const getAllFavoriteListMyDB = async (recipeIds) => {
	try {
		const { data, error } = await supabase.from("short_desc").select("*").in("full_recipe_id", recipeIds); // Фильтр по массиву ID
		// .order("created_at", { ascending: false }); // Опционально: сортировка по дате

		if (error) {
			console.error("Error fetching recipes by IDs:", error.message);
			return { success: false, msg: error.message };
		}

		return { success: true, data };
	} catch (error) {
		console.error("Error in getAllFavorite:", error.message);
		return { success: false, msg: error.message };
	}
};

// Подписка на уведомления
export const useNotifications = (userId, onNewNotification) => {
	useEffect(() => {
		const subscription = supabase
			.channel("notifications-channel")
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "public",
					table: "notifications",
					filter: `user_id=eq.${userId}`,
				},
				async (payload) => {
					const { actor_id, message } = payload.new;
					// Получаем данные о комментаторе (avatar и user_name)
					const { data: userData } = await supabase
						.from("users")
						.select("user_name, avatar")
						.eq("id", actor_id)
						.single();

					onNewNotification({
						...payload.new,
						actorName: userData?.user_name || "Аноним",
						actorAvatar: userData?.avatar || null,
					});
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, [userId, onNewNotification]);
};
