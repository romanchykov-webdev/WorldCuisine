import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabaseUrl } from "../constants/supabaseIndex";
import { supabase } from "../lib/supabase";

/**
 * Получает ссылку на изображение пользователя или возвращает иконку по умолчанию
 * @param {string|null} imagePath - Путь к изображению в хранилище Supabase
 * @returns {object} - Объект с URI изображения или локальным ресурсом
 */
export const getUserImageSrc = (imagePath) => {
	if (imagePath) {
		// return {uri: imagePath};
		return getSupabaseFileUrl(imagePath);
	} else {
		return require("../assets/img/user_icon.png");
	}
};

/**
 * Формирует полный публичный URL к файлу в хранилище Supabase
 * @param {string} filePath - Относительный путь к файлу в бакете
 * @returns {string|null} - Публичный URL файла или null
 */
export const getSupabaseFileUrl = (filePath) => {
	if (filePath) {
		return `${supabaseUrl}/storage/v1/object/public/uploads_image/${filePath}`;
	}
	return null;
};

/**
 * Получает публичный URL изображения рецепта.
 * Если путь не указан, возвращает заглушку.
 * @param {string|null} imagePath - Путь к изображению рецепта
 * @returns {string} - Публичный URL изображения или URL-заглушка
 */
export const getRecipeImageUrl = (imagePath) => {
	if (imagePath) {
		// Используем бакет uploads_image, оставляем recipes_images/ как часть пути
		return `${supabaseUrl}/storage/v1/object/public/uploads_image/${imagePath}`;
	}
	return "https://via.placeholder.com/300";
};

/**
 * Удаляет файл из хранилища Supabase
 * @param {string} filePath - Относительный путь к файлу в бакете
 * @returns {Promise<{success: boolean, msg: string}>} - Результат удаления
 */
export const deleteFile = async (filePath) => {
	try {
		// Убедитесь, что filePath — это строка
		if (typeof filePath !== "string" || !filePath) {
			// console.log("Invalid filePath for deletion:", filePath);
			return { success: false, msg: "Invalid file path" };
		}

		const { error } = await supabase.storage.from("uploads_image").remove([filePath]); // Передаем массив со строкой

		if (error) {
			console.log("File delete error:", error);
			return { success: false, msg: "Could not delete media" };
		}

		// console.log('File deleted successfully:', filePath);
		return { success: true, msg: `File deleted: ${filePath}` };
	} catch (error) {
		console.log("File delete error:", error);
		return { success: false, msg: "Could not delete media" };
	}
};

/**
 * Загружает файл (изображение или видео) в хранилище Supabase
 * @param {string} filePath - Путь директории внутри бакета (например, 'users' или 'recipes')
 * @param {string} fileUri - Локальный URI файла
 * @param {boolean} [isImage=true] - Является ли файл изображением
 * @param {string|null} [oldFilePath=null] - Путь к предыдущему файлу для удаления (если есть)
 * @returns {Promise<{success: boolean, data?: string, msg?: string}>} - Результат загрузки
 */
// export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
// 	try {
// 		// Удаляем старый файл, если передан путь
// 		if (oldFilePath) {
// 			await deleteFile(oldFilePath);
// 		}

// 		// Добавляем уникальный суффикс к пути файла
// 		const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
// 		const fileExtension = isImage ? ".png" : ".mp4"; // или другое расширение
// 		const uniqueFilePath = `${filePath}/${uniqueSuffix}${fileExtension}`;

// 		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
// 			encoding: FileSystem.EncodingType.Base64,
// 		});

// 		const imageData = decode(fileBase64);

// 		const { data, error } = await supabase.storage.from("uploads_image").upload(uniqueFilePath, imageData, {
// 			cacheControl: "3600",
// 			upsert: false,
// 			contentType: isImage ? "image/*" : "video/*",
// 		});

// 		if (error) {
// 			console.log("File upload error", error);
// 			return { success: false, msg: "Could not upload media" };
// 		}

// 		return { success: true, data: data.path };
// 	} catch (error) {
// 		console.log("File upload error", error);
// 		return { success: false, msg: "Could not upload media" };
// 	}
// };

// export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
// 	try {
// 		// Если передан старый путь, он уже используется как filePath, так что удаление не требуется
// 		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
// 			encoding: FileSystem.EncodingType.Base64,
// 		});

// 		const imageData = decode(fileBase64);

// 		const { data, error } = await supabase.storage.from("uploads_image").upload(filePath, imageData, {
// 			cacheControl: "3600",
// 			upsert: true, // Разрешаем переписывание существующего файла
// 			contentType: isImage ? "image/*" : "video/*",
// 		});

// 		if (error) {
// 			console.log("File upload error", error);
// 			return { success: false, msg: "Could not upload media" };
// 		}

// 		return { success: true, data: data.path };
// 	} catch (error) {
// 		console.log("File upload error", error);
// 		return { success: false, msg: "Could not upload media" };
// 	}
// };

export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
	try {
		// Если передан старый путь и он отличается от нового, удаляем старый файл
		if (oldFilePath && oldFilePath !== filePath) {
			console.log("uploadFile: Deleting old file at:", oldFilePath);
			const { error: deleteError } = await supabase.storage.from("uploads_image").remove([oldFilePath]);
			if (deleteError) {
				console.error("uploadFile: Error deleting old file:", deleteError);
			} else {
				console.log("uploadFile: Old file deleted successfully:", oldFilePath);
			}
		}

		console.log("uploadFile: Uploading file to:", filePath);
		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
			encoding: FileSystem.EncodingType.Base64,
		});

		const imageData = decode(fileBase64);

		const { data, error } = await supabase.storage.from("uploads_image").upload(filePath, imageData, {
			cacheControl: "3600",
			upsert: true, // Разрешаем переписывание существующего файла
			contentType: isImage ? "image/*" : "video/*",
		});

		if (error) {
			console.error("uploadFile: File upload error:", error);
			return { success: false, msg: "Could not upload media" };
		}

		console.log("uploadFile: File uploaded successfully:", data.path);
		return { success: true, data: data.path };
	} catch (error) {
		console.error("uploadFile: File upload error:", error);
		return { success: false, msg: "Could not upload media" };
	}
};
