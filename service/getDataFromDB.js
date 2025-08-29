import { useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Получить все категории
/**
 * Получает все категории из таблицы "categories".
 */
/**
 * Получает список всех категорий из базы данных
 * @returns {Promise<{success: boolean, data?: Array, msg?: string}>} - Результат запроса с категориями или сообщением об ошибке
 */
export async function getCategoriesMyDB() {
    try {
        const { data, error } = await supabase.from('categories').select('*');
        if (error) {
            return { success: false, msg: error?.message };
        }

        // console.log('data', data)
        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return { success: false, msg: error.message };
    }
}

// получение всех рецептов в категории
/**
 * Получает все рецепты из таблицы "short_desc" по указанной категории.
 * @param {string} category - Название категории.
 */
export async function getRecipesMyDB(category) {
    // console.log("getRecipesMyDB category",category)
    try {
        const { data, error } = await supabase
            .from('short_desc')
            .select('*')
            .eq('category', category);

        if (error) {
            return {
                success: false,
                msg: `getRecipesMyDB error${error?.message}`,
            };
        }

        // console.log('shortDesc', JSON.stringify(data, null, 2));

        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getRecipesMyDB catch error${error.message}`,
        };
    }
}

// получение всех категории getCategoryRecipeMasonryMyDB
/**
 * Получает все категории Masonry с переводом на нужный язык.
 * @param {string} langDew - Язык (например, "en", "ru").
 */
export async function getCategoryRecipeMasonryMyDB(langDew) {
    // console.log("getCategoryRecipeMasonryMyDB langDew", langDew);

    try {
        const { data, error } = await supabase
            .from('categories_masonry')
            .select('*')
            .eq('lang', langDew);

        if (error) {
            return {
                success: false,
                msg: `getCategoryRecipeMasonryMyDB try error${error?.message}`,
            };
        }
        // console.log('getCategoryRecipeMasonryMyDB', JSON.stringify(data[0].title, null, 2))

        return { success: true, data: data[0].title };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getCategoryRecipeMasonry catch error${error.message}`,
        };
    }
}

// получение всех под категории getCategoryRecipeMasonryMyDB
/**
 * Получает все рецепты из таблицы "short_desc" по указанной точке (point).
 * @param {string} point - Идентификатор подкатегории или фильтра.
 */
// export const getAllRecipesPointMasonryMyDB = async (point) => {
// 	try {
// 		// let { data, error } = await supabase.from("shortDesc").select("*").eq("point", point);
// 		let { data, error } = await supabase.from("short_desc").select("*").eq("point", point);

// 		if (error) {
// 			return {
// 				success: false,
// 				msg: "getAllSubCategoriesMasonryMyDB try error" + error?.message,
// 			};
// 		}
// 		// console.log('getAllSubCategoriesMasonryMyDB', data)
// 		// console.log('getAllSubCategoriesMasonryMyDB', JSON.stringify(data[0].title, null, 2))

// 		return { success: true, data: data };
// 	} catch (error) {
// 		console.log("error", error);
// 		return {
// 			success: false,
// 			msg: "getAllSubCategoriesMasonryMyDB catch error" + error.message,
// 		};
// 	}
// };
/**
 * Получает рецепты из таблицы "short_desc" по указанной точке (point) с пагинацией и сортировкой.
 * @param {string} point - Идентификатор подкатегории или фильтра.
 * @param {number} page - Номер страницы (начинается с 1).
 * @param {number} limit - Количество рецептов на страницу (по умолчанию 6).
 * @param {object} sortOptions - Объект с параметрами сортировки.
 * @param {string} sortOptions.sortBy - Название поля для сортировки (по умолчанию, "created_at").
 * @param {boolean} sortOptions.ascending - Направление сортировки: true — по возрастанию, false — по убыванию.
 */
// export const getAllRecipesPointMasonryMyDB = async (point, page = 1, limit = 2, filter = "created_at") => {
export async function getAllRecipesPointMasonryMyDB(
    point,
    page = 1,
    limit = 2,
    sortOptions = { sortBy: 'created_at', ascending: false }
) {
    try {
        // Вычисляем диапазон для пагинации
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // Запрос к Supabase: выбираем рецепты по point, сортируем по created_at (от новых к старым),
        // применяем пагинацию с помощью range
        const { data, error } = await supabase
            .from('short_desc')
            .select('*')
            .eq('point', point)
            // .order(filter, { ascending: false }) // Сортировка от новых к старым по умолчанию created_at
            .order(sortOptions.sortBy, { ascending: sortOptions.ascending })
            .range(from, to); // Ограничение выборки для пагинации

        if (error) {
            return {
                success: false,
                msg: `getAllRecipesPointMasonryMyDB error: ${error?.message}`,
            };
        }

        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getAllRecipesPointMasonryMyDB catch error: ${error.message}`,
        };
    }
}

// получение description рецепта
/**
 * Получает описание рецепта из базы данных по его идентификатору
 * @param {string} id - Идентификатор рецепта
 * @returns {Promise<{success: boolean, data?: Array, msg?: string}>} - Результат запроса с данными рецепта или сообщением об ошибке
 */
export async function getRecipesDescriptionMyDB(id) {
    try {
        const { data, error } = await supabase
            .from('all_recipes_description')
            .select('*')
            .eq('id', id); // Фильтр по id

        if (error) {
            return {
                success: false,
                msg: `getRecipesDescriptionMyDB error${error?.message}`,
            };
        }

        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getRecipesDescriptionMyDB catch error${error.message}`,
        };
    }
}

// получение description рецепта его количества комментариев и рейтинга
/**
 * Получает данные о лайках, рейтинге или комментариях рецепта из базы данных
 * @param {object} options - Параметры запроса
 * @param {string} options.id - Идентификатор рецепта
 * @param {string} options.payload - Тип данных для получения (например, 'updateCommentsCount')
 * @returns {Promise<{success: boolean, data?: Array, msg?: string}>} - Результат запроса с данными или сообщением об ошибке
 */
export async function getRecipesDescriptionLikeRatingMyDB({ id, payload }) {
    // console.log("getRecipesDescriptionLikeRatingMyDB recipe id",id)
    // console.log("getRecipesDescriptionLikeRatingMyDB recipe payload",payload)
    // console.log('ok:',tableCategory)

    try {
        let query;
        if (payload === 'updateCommentsCount') {
            query = 'comments';
        }
        // console.log('getRecipesDescriptionLikeRatingMyDB query',query)

        const { data, error } = await supabase
            .from('all_recipes_description')
            .select(query)
            .eq('id', id); // Фильтр по id

        if (error) {
            return {
                success: false,
                msg: `getRecipesDescriptionLikeRatingMyDB error${error?.message}`,
            };
        }
        //
        //

        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getRecipesDescriptionMyDB catch error${error.message}`,
        };
    }
}

// получение all comments рецепта
/**
 * Получает все комментарии к рецепту из базы данных по его идентификатору
 * @param {string} id - Идентификатор рецепта
 * @returns {Promise<{success: boolean, data?: Array, msg?: string}>} - Результат запроса с комментариями или сообщением об ошибке
 */
export async function getAllCommentsMyDB(id) {
    // console.log('getAllCommentsMyDB id',id)
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', id) // Фильтр по id
            .order('created_at', { ascending: false }); // Сортировка от нового к старому

        if (error) {
            return {
                success: false,
                msg: `getRecipesDescriptionMyDB error${error?.message}`,
            };
        }

        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getRecipesDescriptionMyDB catch error${error.message}`,
        };
    }
}

// получение all users avatar name
/**
 * Получает данные пользователей, оставивших комментарии, по их идентификаторам
 * @param {string[]} ids - Массив идентификаторов пользователей
 * @returns {Promise<{success: boolean, data?: Array, msg?: string}>} - Результат запроса с данными пользователей или сообщением об ошибке
 */
export async function getAllUserIdCommentedMyDB(ids) {
    // console.log('getAllCommentsMyDB id', ids)
    try {
        // Запрос по массиву id, с использованием .in() для выборки данных по нескольким id
        const { data, error } = await supabase
            .from('users')
            .select('id, avatar, user_name') // Выбираем только нужные поля
            .in('id', ids); // Фильтруем по массиву id

        if (error) {
            return {
                success: false,
                msg: `getAllUserIdCommentedMyDB error: ${error.message}`,
            };
        }

        // console.log('Fetched user data:', JSON.stringify(data, null, 2));

        return { success: true, data };
    } catch (error) {
        console.log('error', error);
        return {
            success: false,
            msg: `getRecipesDescriptionMyDB catch error${error.message}`,
        };
    }
}

// отправка комментария на рецепт
/**
 * Добавляет новый комментарий к рецепту.
 * @param {object} param
 * @param {number} param.postId - ID рецепта.
 * @param {number} param.userIdCommented - ID пользователя.
 * @param {string} param.comment - Текст комментария.
 */
export async function addNewCommentToRecipeMyDB({
    postId,
    userIdCommented,
    comment,
}) {
    // console.log("getAllCommentsMyDB postId", postId);
    // console.log("getAllCommentsMyDB userIdCommented", userIdCommented);
    // console.log("getAllCommentsMyDB comment", comment);
    try {
        // increment_comment_count

        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    post_id: postId, // ID поста
                    user_id_commented: userIdCommented, // ID пользователя
                    comment, // Текст комментария
                },
            ])
            .select();

        if (error) {
            console.error('Error adding comment:', error.message);
            return {
                success: false,
                msg: `Error adding comment: ${error.message}`,
            };
        }

        // console.log('Comment added successfully:', JSON.stringify(data, null, 2));
        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return { success: false, msg: `Unexpected error: ${error.message}` };
    }
}

// удаление комментария
/**
 * Удаляет комментарий к рецепту из базы данных по его идентификатору
 * @param {string} commentId - Идентификатор комментария
 * @returns {Promise<{success: boolean, msg?: string} | undefined>} - Результат удаления или сообщение об ошибке
 */
export async function deleteCommentByIdToRecipeMyDB(commentId) {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId); // Фильтруем по id комментария

        if (error) {
            console.error('Error adding comment:', error.message);
            return {
                success: false,
                msg: `Error adding comment: ${error.message}`,
            };
        }

        // console.log("Комментарий удален успешно");
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error.message);
    }
}

// добавление лайка рецепту
/**
 * Добавляет или убирает лайк для рецепта в базе данных
 * @param {object} params - Параметры запроса
 * @param {string} params.recipeId - Идентификатор рецепта
 * @param {string} params.userIdLike - Идентификатор пользователя, ставящего лайк
 * @returns {Promise<{success: boolean, data?: object, msg?: string}>} - Результат выполнения или сообщение об ошибке
 */
export async function addLikeRecipeMyDB({ recipeId, userIdLike }) {
    try {
        const { data, error } = await supabase.rpc('toggle_recipe_like', {
            p_recipe_id_like: recipeId,
            p_user_id_like: userIdLike,
        });

        if (error) {
            console.error('Error toggling like:', error.message);
            return {
                success: false,
                msg: `Error toggling like: ${error.message}`,
            };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return { success: false, msg: `Unexpected error: ${error.message}` };
    }
}

// проверка ставил ли пользователь лайк этому рецепту
/**
 * Проверяет, поставил ли пользователь лайк конкретному рецепту.
 *
 * @async
 * @function
 * @param {object} params - Параметры запроса.
 * @param {string} params.recipeId - ID рецепта, который проверяется.
 * @param {string} params.userId - ID пользователя, который мог поставить лайк.
 * @returns {Promise<object>} Результат проверки.
 * @returns {boolean} return.success - Флаг успешности запроса.
 * @returns {boolean} return.liked - Флаг, указывающий, поставил ли пользователь лайк.
 * @returns {string} [return.msg] - Сообщение об ошибке (если есть).
 */
export async function checkIfUserLikedRecipe({ recipeId, userId }) {
    // console.log('checkIfUserLikedRecipe recipeId', recipeId);
    // console.log('checkIfUserLikedRecipe userId', userId);
    try {
        // Выполняем запрос к базе данных
        const { data, error } = await supabase
            .from('recipes_likes') // Таблица, в которой выполняем поиск
            .select('*') // Выбираем все столбцы (можно ограничить только нужными)
            .eq('recipe_id_like', recipeId) // Условие: ID рецепта
            .eq('user_id_like', userId) // Условие: ID пользователя
            .limit(1); // Лимитируем до одной строки, чтобы не получать лишние данные

        if (error) {
            console.error('Error checking like:', error.message);
            return { success: false, liked: false, msg: error.message };
        }

        // Проверяем, существует ли запись
        const liked = data.length > 0;
        // console.log("checkIfUserLikedRecipe liked:", liked);

        return { success: true, liked };
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return { success: false, liked: false, msg: error.message };
    }
}

// Добавление рейтинга в таблицу recipe_ratings
/**
 * Добавляет или обновляет рейтинг рецепта от пользователя в базе данных.
 *
 * Если рейтинг от данного пользователя для указанного рецепта уже существует,
 * он будет обновлён. Иначе будет добавлена новая запись.
 *
 * @async
 * @function
 * @param {object} params - Параметры функции.
 * @param {string} params.recipeId - ID рецепта, которому ставится рейтинг.
 * @param {string} params.userId - ID пользователя, ставящего рейтинг.
 * @param {number} params.rating - Числовое значение рейтинга.
 * @returns {Promise<object>} Результат операции.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {string} [return.msg] - Сообщение об ошибке, если она произошла.
 */
export async function addRecipeRatingMyDB({ recipeId, userId, rating }) {
    // console.log("addRecipeRatingMyDB", rating);

    try {
        const { data, error } = await supabase.from('recipe_ratings').upsert(
            {
                recipe_id: recipeId,
                user_id: userId,
                number_of_ratings: rating,
                updated_at: new Date().toISOString(),
            },
            { onConflict: ['recipe_id', 'user_id'] } // Указываем уникальные столбцы
        );

        if (error) {
            console.error('Error upserting recipe rating:', error.message);
            return { success: false, msg: error.message };
        }

        // console.log("Добавленный или обновленный рейтинг:", data);
        return { success: true };
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return { success: false, msg: error.message };
    }
}

/**
 * Получает все рецепты, лайкнутые пользователем, включая их подробности.
 *
 * Сначала выполняется запрос к таблице `recipesLikes`, чтобы получить все ID рецептов,
 * лайкнутых пользователем. Затем по этим ID извлекаются подробности из таблицы `short_desc`.
 *
 * @async
 * @function
 * @param {string} userId - ID пользователя, чьи лайкнутые рецепты нужно получить.
 * @returns {Promise<object>} Результат выполнения функции.
 * @returns {boolean} return.success - Флаг успешности запроса.
 * @returns {Array<object>} [return.data] - Массив объектов с данными рецептов (если найдено).
 * @returns {string} [return.msg] - Сообщение об ошибке (если есть).
 */
export async function getAllMyLikedRecipes(userId) {
    // console.log('getAllMyLikedRecipes id',id);
    try {
        const { data: likedRecipes, error: likedRecipesError } = await supabase
            .from('recipesLikes')
            .select('recipe_id_like')
            .eq('user_id_like', userId);

        if (likedRecipesError) {
            console.error(
                'Error fetching liked recipes:',
                likedRecipesError.message
            );
            return { success: false, msg: likedRecipesError.message };
        }

        if (!likedRecipes || likedRecipes.length === 0) {
            return { success: true, data: [] }; // Нет лайкнутых рецептов
        }

        // Извлекаем массив ID рецептов
        const recipeIds = likedRecipes.map(item => item.recipe_id_like);

        // Запрашиваем подробности из таблицы shortDesc по массиву ID
        const { data: recipesDetails, error: detailsError } = await supabase
            .from('short_desc')
            .select('*') // Замените '*' на конкретные колонки, которые вам нужны
            .in('fullRecipeId', recipeIds);

        if (detailsError) {
            console.error(
                'Error fetching recipe details:',
                detailsError.message
            );
            return { success: false, msg: detailsError.message };
        }

        return { success: true, data: recipesDetails };
    } catch (error) {
        console.error('Unexpected error:', error.message);
        return { success: false, msg: error.message };
    }
}

// get all measurement
/**
 * Получает список единиц измерения (на языках), используемых при создании рецепта.
 *
 * Выполняется запрос к таблице `measurement` для извлечения значений поля `lang`.
 *
 * @async
 * @function
 * @returns {Promise<object>} Результат выполнения функции.
 * @returns {boolean} return.success - Флаг успешности запроса.
 * @returns {Array<string>} [return.data] - Массив строк с названиями единиц измерения.
 * @returns {string} [return.msg] - Сообщение об ошибке, если она произошла.
 */
export async function getMeasurementCreateRecipeMyDB() {
    try {
        const { data, error } = await supabase
            .from('measurement')
            .select('lang');

        if (error) {
            console.error(
                'Error getMeasurementCreateRecipeMyDB:',
                error.message
            );
            return { success: false, msg: error.message };
        }

        // console.log(
        //     'getMeasurementCreateRecipeMyDB',
        //     JSON.stringify(data, null, 2)
        // );
        // Извлечение только значений 'lang' из полученного массива
        const languages = data.map(item => item.lang);
        // console.log(
        //     'getMeasurementCreateRecipeMyDB',
        //     JSON.stringify(languages, null, 2)
        // );

        return { success: true, data: languages };
    } catch (error) {
        console.error('getMeasurementCreateRecipeMyDB error:', error.message);
        return { success: false, msg: error.message };
    }
}

// get creatore recipe data for section subscribe
/**
 * Получает данные о создателе рецепта по его ID.
 *
 * Выполняется запрос к таблице `users`, чтобы получить имя пользователя, аватар и количество подписчиков.
 *
 * @async
 * @function
 * @param {string} publishedId - ID пользователя (создателя рецепта).
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности запроса.
 * @returns {object} [return.data] - Объект с данными пользователя: `user_name`, `avatar`, `subscribers`.
 * @returns {string} [return.msg] - Сообщение об ошибке, если она произошла.
 */
export async function getCreatoreRecipeDateMyDB(publishedId) {
    try {
        // console.log("getCreatoreRecipeDateMyDB", publishedId);

        const { data, error } = await supabase
            .from('users')
            .select('user_name, avatar, subscribers')
            .eq('id', publishedId)
            .single();

        if (error) {
            console.error('Error getCreatoreRecipeDateMyDB:', error.message);
            return { success: false, msg: error.message };
        }
        // console.log('getCreatoreRecipeDateMyDB data', data)

        return { success: true, data };
    } catch (error) {
        console.error('Error getMeasurementCreateRecipeMyDB:', error.message);
        return { success: false, msg: error.message };
    }
}

// Проверка статуса подписки
/**
 * Проверяет, подписан ли пользователь на автора рецепта.
 *
 * Выполняет запрос к таблице `subscriptions`, чтобы определить наличие подписки между подписчиком и создателем.
 *
 * @async
 * @function
 * @param {string} subscriber_id - ID пользователя, который, возможно, подписан.
 * @param {string} creator_id - ID пользователя, на которого проверяется подписка.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности запроса.
 * @returns {object | null} [return.data] - Объект с данными подписки, если она есть, или `null`, если нет.
 * @returns {string} [return.msg] - Сообщение об ошибке, если она произошла.
 */
export async function getSubscriptionCheckDateMyDB(subscriber_id, creator_id) {
    try {
        // console.log("getSubscriptionCheckDateMyDB subscriber_id", subscriber_id);
        // console.log("getSubscriptionCheckDateMyDB creator_id", creator_id);

        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('subscriber_id', subscriber_id)
            .eq('creator_id', creator_id);

        if (error) {
            console.error('Error checking subscription:', error.message);
            return { success: false, msg: error.message };
        }

        return { success: true, data: data.length > 0 ? data[0] : null };
    } catch (error) {
        console.error('Error getSubscriptionCheckDateMyDB:', error.message);
        return { success: false, msg: error.message };
    }
}

// Подписка на создателя
/**
 * Подписывает пользователя на создателя рецепта.
 *
 * Выполняет вставку новой записи в таблицу `subscriptions` с указанием ID подписчика и создателя.
 *
 * @async
 * @function
 * @param {string} subscriber_id - ID пользователя, который подписывается.
 * @param {string} creator_id - ID пользователя, на которого происходит подписка.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {object[]} [return.data] - Массив с данными созданной записи подписки.
 * @returns {string} [return.msg] - Сообщение об ошибке, если она произошла.
 */
export async function subscribeToCreatorMyDB(subscriber_id, creator_id) {
    try {
        const { data, error } = await supabase
            .from('subscriptions')
            .insert([{ subscriber_id, creator_id }])
            .select();

        if (error) {
            console.error('Error subscribing:', error.message);
            return { success: false, msg: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error subscribeToCreatorMyDB:', error.message);
        return { success: false, msg: error.message };
    }
}

// Отписка от создателя
/**
 * Отписывает пользователя от создателя рецепта.
 *
 * Удаляет запись из таблицы `subscriptions` по совпадению `subscriber_id` и `creator_id`.
 *
 * @async
 * @function
 * @param {string} subscriber_id - ID пользователя, который отписывается.
 * @param {string} creator_id - ID пользователя, от которого происходит отписка.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {string} [return.msg] - Сообщение об ошибке, если она произошла.
 */
export async function unsubscribeFromCreatorMyDB(subscriber_id, creator_id) {
    try {
        const { error } = await supabase
            .from('subscriptions')
            .delete()
            .eq('subscriber_id', subscriber_id)
            .eq('creator_id', creator_id);

        if (error) {
            console.error('Error unsubscribing:', error.message);
            return { success: false, msg: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error unsubscribeFromCreatorMyDB:', error.message);
        return { success: false, msg: error.message };
    }
}

// get all my recipes
/**
 * Получает список всех рецептов, опубликованных конкретным пользователем (создателем).
 *
 * Выполняет запрос к таблице `short_desc`, фильтруя по `published_id`,
 * и сортирует результаты по дате создания (от новых к старым).
 *
 * @async
 * @function
 * @param {string} creatore_id - ID пользователя, опубликовавшего рецепты.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {Array<object>} [return.data] - Массив рецептов при успешном выполнении.
 * @returns {string} [return.msg] - Сообщение об ошибке, если операция завершилась с ошибкой.
 */
export async function getAllRecipesBayCreatoreListMyDB(creatore_id) {
    try {
        const { data, error } = await supabase
            .from('short_desc')
            .select('*')
            // Фильтр по creatore_id
            .eq('published_id', creatore_id)
            // Сортировка по дате создания (от новых к старым)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching recipes:', error.message);
            return { success: false, msg: error.message };
        }

        // console.log("getAllRecipesBayCreatoreListMyDB creatore_id:", creatore_id);
        // console.log("Recipes found:", all_recipes_description);

        return { success: true, data };
    } catch (error) {
        console.error(
            'Error in getAllRecipesBayCreatoreListMyDB:',
            error.message
        );
        return { success: false, msg: error.message };
    }
}

// get all favorite recipe
/**
 * Получает список ID всех рецептов, добавленных в избранное пользователем.
 *
 * Выполняет запрос к таблице `recipes_likes`, фильтруя по `user_id_like`,
 * и извлекает массив значений `recipe_id_like`.
 *
 * @async
 * @function
 * @param {string} user_id - ID пользователя, чьи избранные рецепты нужно получить.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {Array<string>} [return.data] - Массив ID избранных рецептов.
 * @returns {string} [return.msg] - Сообщение об ошибке, если операция завершилась с ошибкой.
 */
export async function getAllFavoriteIdisMyDB(user_id) {
    try {
        const { data, error } = await supabase
            .from('recipes_likes')
            .select('recipe_id_like')
            .eq('user_id_like', user_id);
        // Сортировка по дате создания (от новых к старым)
        // .order("created_at", { ascending: false });

        if (error) {
            console.error('Error fetching recipes:', error.message);
            return { success: false, msg: error.message };
        }

        // console.log("getAllFavoriteListMyDB, user_id", user_id);
        // console.log("getAllFavoriteListMyDB, data", data);

        // Извлекаем только значения recipe_id_like в массив
        const recipe_ids = data.map(item => item.recipe_id_like);
        // console.log("getAllFavoriteListMyDB, recipe_ids", recipe_ids);

        return { success: true, data: recipe_ids };
    } catch (error) {
        console.error('Error in getAllFavoriteListMyDB:', error.message);
        return { success: false, msg: error.message };
    }
}

// Функция для получения рецептов по ID
/**
 * Получает список рецептов по массиву ID рецептов.
 *
 * Выполняет запрос к таблице `short_desc`, фильтруя по массиву `recipeIds`,
 * и извлекает все данные рецептов, соответствующие этим ID.
 *
 * @async
 * @function
 * @param {Array<string>} recipeIds - Массив ID рецептов, которые необходимо получить.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {Array<object>} [return.data] - Массив рецептов при успешном выполнении.
 * @returns {string} [return.msg] - Сообщение об ошибке, если операция завершилась с ошибкой.
 */
export async function getAllFavoriteListMyDB(recipeIds) {
    try {
        const { data, error } = await supabase
            .from('short_desc')
            .select('*')
            .in('full_recipe_id', recipeIds); // Фильтр по массиву ID
        // .order("created_at", { ascending: false }); // Опционально: сортировка по дате

        if (error) {
            console.error('Error fetching recipes by IDs:', error.message);
            return { success: false, msg: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error in getAllFavorite:', error.message);
        return { success: false, msg: error.message };
    }
}

// Подписка на уведомления
export function useNotifications(userId, onNewNotification) {
    useEffect(() => {
        const subscription = supabase
            .channel('notifications-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                async payload => {
                    const { actor_id, message } = payload.new;
                    // Получаем данные о комментаторе (avatar и user_name)
                    const { data: userData } = await supabase
                        .from('users')
                        .select('user_name, avatar')
                        .eq('id', actor_id)
                        .single();

                    onNewNotification({
                        ...payload.new,
                        actorName: userData?.user_name || 'Аноним',
                        actorAvatar: userData?.avatar || null,
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [userId, onNewNotification]);
}

// функция для обновления рецепта
export async function updateRecipeMyDB(recipe) {
    try {
        if (!recipe.id) {
            throw new Error('ID рецепта отсутствует');
        }

        // Убираем id из объекта для обновления
        const { id, ...fieldsToUpdate } = recipe;

        const { data, error } = await supabase
            .from('all_recipes_description')
            .update(fieldsToUpdate)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Ошибка при обновлении рецепта:', error.message);
            return { success: false, msg: error.message };
        }

        // console.log("Рецепт успешно обновлен:", JSON.stringify(data[0], null, 2));
        return { success: true, data: data[0] };
    } catch (error) {
        console.error(
            'Неожиданная ошибка при обновлении рецепта:',
            error.message
        );
        return { success: false, msg: error.message };
    }
}

// getRecipesByQuerySearchcreenMyDB
/**
 * Выполняет поиск рецептов по запросу на основе тега.
 *
 * Выполняет вызов функции `search_recipes_by_tag` через `rpc` на Supabase,
 * передавая запрос с тегом для поиска соответствующих рецептов.
 * Возвращает рецепты, соответствующие запросу.
 *
 * @async
 * @function
 * @param {string} query - Тег или ключевое слово для поиска рецептов.
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {Array<object>} [return.data] - Массив рецептов при успешном выполнении.
 * @returns {string} [return.msg] - Сообщение об ошибке, если операция завершилась с ошибкой.
 */
export async function getRecipesByQuerySearchcreenMyDB(query) {
    // console.log("getRecipesByQuerySearchcreenMyDB", query);
    if (query === '') return;
    try {
        const { data, error } = await supabase.rpc('search_recipes_by_tag', {
            tag_query: query,
        });

        if (error) {
            console.error('Error fetching recipes:', error);
            return { success: false, msg: error.message };
        }

        // console.log("getRecipesByQuerySearchcreenMyDB data", data);
        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, msg: error.message };
    }
}

// getTopRecipeHomeScreenMyDB
/**
 * Получает топ рецептов для главного экрана на основе количества лайков.
 *
 * Выполняет запрос к базе данных Supabase, выбирая рецепты с количеством лайков больше нуля,
 * сортирует их по количеству лайков в убывающем порядке и ограничивает результат до 50 записей.
 *
 * @async
 * @function
 * @returns {Promise<object>} Результат выполнения запроса.
 * @returns {boolean} return.success - Флаг успешности операции.
 * @returns {Array<object>} [return.data] - Массив рецептов с топовыми лайками.
 * @returns {string} [return.msg] - Сообщение об ошибке, если операция завершилась с ошибкой.
 */
export async function getTopRecipeHomeScreenMyDB() {
    // console.log("getTopRecipeHomeScreenMyDB");

    try {
        const { data, error } = await supabase
            .from('short_desc')
            .select('*')
            .gt('likes', 0)
            .order('likes', { ascending: false })
            .limit(50);

        if (error) {
            console.error('Error fetching recipes:', error);
            return { success: false, msg: error.message };
        }

        // console.log("getTopRecipeHomeScreenMyDB data", data);
        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error:', error);
        return { success: false, msg: error.message };
    }
}
