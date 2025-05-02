import { Alert } from "react-native";
import { supabase } from "../lib/supabase";

// get userData
/**
 * Получает данные пользователя из базы данных по его идентификатору
 * @param {string} userId - Идентификатор пользователя
 * @returns {Promise<{success: boolean, data?: Object, msg?: string}>} - Результат запроса с данными пользователя или сообщением об ошибке
 */
export const getUserData = async (userId) => {
	try {
		const { data, error } = await supabase.from("users").select().eq("id", userId).single();

		if (error) {
			return { success: false, msg: error?.message };
		}

		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return { success: false, msg: error.message };
	}
};

// log out
/**
 * Выполняет выход пользователя из системы
 * @param {Object} options - Объект с параметрами
 * @param {Function} options.setAuth - Функция для установки состояния аутентификации
 * @param {Object} options.router - Объект маршрутизатора для навигации
 * @returns {Promise<void>} - Промис, завершающийся после выполнения выхода
 */
export const logOut = async ({ setAuth, router }) => {
	setAuth(null);

	const { error } = await supabase.auth.signOut();
	if (error) {
		Alert.alert("Sign Out", "Error signing out!");
	}
	router.replace("/homeScreen");
};

//update user data
/**
 * Обновляет данные пользователя в базе данных
 * @param {string} userId - Идентификатор пользователя
 * @param {Object} data - Объект с обновленными данными пользователя
 * @returns {Promise<{success: boolean, data?: Object, msg?: string}>} - Результат обновления с данными или сообщением об ошибке
 */
export const updateUser = async (userId, data) => {
	// console.log("userService updateUser", userId, data);
	try {
		const { error } = await supabase.from("users").update(data).eq("id", userId);

		if (error) {
			return { success: false, msg: error?.message };
		}

		return { success: true, data };
	} catch (error) {
		console.log("error", error);
		return { success: false, msg: error.message };
	}
};

//delete user account
// export const deleteUser = async (userId) => {
//
//     const {error} = await supabase
//         .from('users')
//         .delete()
//         .eq('id', userId)
//
//     if (error) {
//         console.error('Error deleting user auth data:', error)
//         return { success: false, error }
//     }
//
//     console.log('User auth data deleted successfully')
//     return { success: true }
//
//
// }

// Удаление пользователя
/**
 * Удаляет пользователя из базы данных по его идентификатору
 * @param {string} userId - Идентификатор пользователя
 * @returns {Promise<{success: boolean, msg?: string}>} - Результат удаления или сообщение об ошибке
 */
export const deleteUser = async (userId) => {
	try {
		// Удаляем пользователя из таблицы auth.users
		const { error } = await supabase.from("users").delete().eq("id", userId);

		if (error) {
			console.error("Error triggering delete_user_cascade:", error);
			return { success: false, msg: "Failed to trigger delete_user_cascade." };
		}

		// console.log("User successfully deleted from auth.users. Trigger handled cascading delete.");
		return { success: true };
	} catch (error) {
		console.error("Unexpected error:", error);
		return { success: false, msg: "Unexpected error occurred." };
	}
};
