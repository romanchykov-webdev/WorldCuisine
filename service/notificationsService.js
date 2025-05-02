import { supabase } from "../lib/supabase";

const NOTIFICATIONS_TABLE = "notifications";
const PAGE_SIZE = 10;

// export const fetchNotifications = async ({
// 	userId,
// 	isLoadMore = false,
// 	oldestLoadedDate,
// 	notifications = [],
// 	type, // параметр для фильтрации по типу
// }) => {
// 	if (!userId || (isLoadMore && !notifications.length && !oldestLoadedDate)) {
// 		return { data: [], error: null };
// 	}

// 	try {
// 		let query = supabase
// 			.from(NOTIFICATIONS_TABLE)
// 			.select(
// 				`
//                 id,
//                 recipe_id,
//                 message,
//                 created_at,
//                 is_read,
//                 type,
//                 actor_id,
//                 user_id,
//                 users(user_name, avatar),
//                 all_recipes_description(title, image_header)
//                 `
// 			)
// 			.eq("user_id", userId)
// 			.eq("is_read", false)
// 			.order("created_at", { ascending: true })
// 			.limit(PAGE_SIZE);

// 		// Добавляем фильтр по типу, если он указан
// 		if (type) {
// 			query = query.eq("type", type);
// 		}

// 		if (isLoadMore && oldestLoadedDate) {
// 			query = query.gt("created_at", notifications[notifications.length - 1].created_at);
// 		}

// 		const { data, error } = await query;
// 		return { data: Array.isArray(data) ? data : [], error };
// 	} catch (e) {
// 		return { data: [], error: e };
// 	}
// };


/**
 * Подписывает пользователя на уведомления через Supabase Realtime
 * @param {string} userId - Идентификатор пользователя
 * @param {Function} onInsert - Callback-функция, вызываемая при добавлении нового уведомления
 * @returns {Function} - Функция для отписки от уведомлений
 */
export const subscribeToNotifications = (userId, onInsert) => {
	const subscription = supabase
		.channel(`notifications-${userId}`)
		.on(
			"postgres_changes",
			{
				event: "INSERT",
				schema: "public",
				table: NOTIFICATIONS_TABLE,
				filter: `user_id=eq.${userId}`,
			},
			onInsert
		)
		.subscribe();

	return () => supabase.removeChannel(subscription);
};


/**
 * Отмечает уведомление как прочитанное в базе данных
 * @param {string} notificationId - Идентификатор уведомления
 * @returns {Promise<{error?: Object}>} - Результат выполнения или объект ошибки
 */
export const markNotificationAsRead = async (notificationId) => {
	try {
		const { error } = await supabase.from(NOTIFICATIONS_TABLE).update({ is_read: true }).eq("id", notificationId);
		return { error };
	} catch (e) {
		return { error: e };
	}
};

// export const fetchNotificationDetails = async (notificationId) => {
// 	try {
// 		const { data, error } = await supabase
// 			.from(NOTIFICATIONS_TABLE)
// 			.select(
// 				`
//                 id,
//                 recipe_id,
//                 message,
//                 created_at,
//                 is_read,
//                 type,
//                 actor_id,
//                 user_id,
//                 users(user_name, avatar),
//                 all_recipes_description(title, image_header)
//                 `
// 			)
// 			.eq("id", notificationId)
// 			.single();
// 		return { data, error };
// 	} catch (e) {
// 		return { data: null, error: e };
// 	}
// };


/**
 * Получает уведомления пользователя из базы данных
 * @param {Object} options - Параметры запроса
 * @param {string} options.userId - Идентификатор пользователя
 * @param {boolean} [options.isLoadMore=false] - Флаг для загрузки дополнительных уведомлений
 * @param {string} [options.oldestLoadedDate] - Дата самого старого загруженного уведомления для пагинации
 * @param {Array} [options.notifications=[]] - Текущий список уведомлений
 * @param {string} [options.type] - Тип уведомления для фильтрации
 * @returns {Promise<{data: Array, error?: Object}>} - Список уведомлений или объект ошибки
 */
export const fetchNotifications = async ({
	userId,
	isLoadMore = false,
	oldestLoadedDate,
	notifications = [],
	type,
}) => {
	if (!userId || (isLoadMore && !notifications.length && !oldestLoadedDate)) {
		return { data: [], error: null };
	}

	try {
		let query = supabase
			.from(NOTIFICATIONS_TABLE)
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
			users!actor_id(user_name, avatar),
			all_recipes_description(title, image_header)
		  `
			)
			.eq("user_id", userId)
			.eq("is_read", false)
			.order("created_at", { ascending: true })
			.limit(PAGE_SIZE);

		if (type) {
			query = query.eq("type", type);
		}

		if (isLoadMore && oldestLoadedDate) {
			query = query.gt("created_at", notifications[notifications.length - 1].created_at);
		}

		const { data, error } = await query;
		return { data: Array.isArray(data) ? data : [], error };
	} catch (e) {
		return { data: [], error: e };
	}
};


/**
 * Получает детали конкретного уведомления из базы данных
 * @param {string} notificationId - Идентификатор уведомления
 * @returns {Promise<{data: Object | null, error?: Object}>} - Данные уведомления или объект ошибки
 */
export const fetchNotificationDetails = async (notificationId) => {
	try {
		const { data, error } = await supabase
			.from(NOTIFICATIONS_TABLE)
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
			users!actor_id(user_name, avatar),
			all_recipes_description(title, image_header)
		  `
			)
			.eq("id", notificationId)
			.single();
		return { data, error };
	} catch (e) {
		return { data: null, error: e };
	}
};
