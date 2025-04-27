import base64 from "base-64";
import * as FileSystem from "expo-file-system";
import { supabaseUrl } from "../constants/supabaseIndex";
import {supabase} from "../lib/supabase";

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
// for supabase
// export const deleteFile = async (filePath) => {
// 	try {
// 		// Убедитесь, что filePath — это строка
// 		if (typeof filePath !== "string" || !filePath) {
// 			// console.log("Invalid filePath for deletion:", filePath);
// 			return { success: false, msg: "Invalid file path" };
// 		}

// 		const { error } = await supabase.storage.from("uploads_image").remove([filePath]); // Передаем массив со строкой

// 		if (error) {
// 			console.log("File delete error:", error);
// 			return { success: false, msg: "Could not delete media" };
// 		}

// 		// console.log('File deleted successfully:', filePath);
// 		return { success: true, msg: `File deleted: ${filePath}` };
// 	} catch (error) {
// 		console.log("File delete error:", error);
// 		return { success: false, msg: "Could not delete media" };
// 	}
// };


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
// for supa base
// export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
// 	try {
// 		// Если передан старый путь и он отличается от нового, удаляем старый файл
// 		if (oldFilePath && oldFilePath !== filePath) {
// 			console.log("uploadFile: Deleting old file at:", oldFilePath);
// 			const { error: deleteError } = await supabase.storage.from("uploads_image").remove([oldFilePath]);
// 			if (deleteError) {
// 				console.error("uploadFile: Error deleting old file:", deleteError);
// 			} else {
// 				console.log("uploadFile: Old file deleted successfully:", oldFilePath);
// 			}
// 		}

// 		console.log("uploadFile: Uploading file to:", filePath);
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
// 			console.error("uploadFile: File upload error:", error);
// 			return { success: false, msg: "Could not upload media" };
// 		}

// 		console.log("uploadFile: File uploaded successfully:", data.path);
// 		return { success: true, data: data.path };
// 	} catch (error) {
// 		console.error("uploadFile: File upload error:", error);
// 		return { success: false, msg: "Could not upload media" };
// 	}
// };

// отправлять файл в Cloudinary функция работает но создает виртул папки
// export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
// 	try {
// 		// Если передан старый путь и он отличается от нового, удаляем старый файл
// 		if (oldFilePath && oldFilePath !== filePath) {
// 			console.log("uploadFile: Deleting old file at:", oldFilePath);
// 			const deleteResult = await deleteFile(oldFilePath);
// 			if (!deleteResult.success) {
// 				console.error("uploadFile: Error deleting old file:", deleteResult.msg);
// 			} else {
// 				console.log("uploadFile: Old file deleted successfully:", oldFilePath);
// 			}
// 		}

// 		console.log("uploadFile: Uploading file to:", filePath);

// 		// Читаем файл как base64
// 		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
// 			encoding: FileSystem.EncodingType.Base64,
// 		});

// 		// Формируем FormData для отправки в Cloudinary
// 		const formData = new FormData();
// 		formData.append("file", `data:image/jpeg;base64,${fileBase64}`); // Для изображений
// 		formData.append("upload_preset", "ratatouille-app-upload"); //  имя  Upload Preset
// 		formData.append("folder", filePath.split("/").slice(0, -1).join("/")); // Папка (без имени файла)
// 		formData.append("public_id", filePath.split("/").pop().split(".").slice(0, -1).join(".")); // Имя файла без расширения

// 		// Отправляем файл в Cloudinary
// 		const response = await fetch("https://api.cloudinary.com/v1_1/dq0ymjvhx/image/upload", {
// 			method: "POST",
// 			body: formData,
// 		});

// 		const result = await response.json();

// 		if (result.error) {
// 			console.error("uploadFile: File upload error:", result.error.message);
// 			return { success: false, msg: result.error.message };
// 		}

// 		// Получаем URL загруженного файла
// 		const fileUrl = result.secure_url;
// 		console.log("uploadFile: File uploaded successfully:", fileUrl);
// 		return { success: true, data: fileUrl }; // Возвращаем полный URL
// 	} catch (error) {
// 		console.error("uploadFile: File upload error:", error);
// 		return { success: false, msg: "Could not upload media" };
// 	}
// };


/**
 * Удаляет файл из Cloudinary
 * @param {string} filePath - Путь к файлу в Cloudinary (например, полный URL или путь вроде 'recipes_images/Snacks/Sandwiches/2025_04_25_12_27_24_1b17d89f-441f-490e-bde8-d05453cc7493/header.jpg')
 * @returns {Promise<{success: boolean, msg?: string}>} - Результат удаления
 *  рабочая но ключи надо вынести
 */
// export const deleteFile = async (filePath) => {
// 	try {
// 		const apiKey = "249794684119177";
// 		const apiSecret = "HDW7kW7XY7WD1RvHG75Hm4B6_Ck";
// 		const authString = base64.encode(`${apiKey}:${apiSecret}`);
//
// 		// Извлекаем public_id из filePath
// 		let publicId = filePath;
//
// 		if (filePath.startsWith("https://res.cloudinary.com")) {
// 			const urlParts = filePath.split("/image/upload/")[1];
// 			const pathWithoutVersion = urlParts.split("/").slice(1).join("/"); // Убираем версию (v1745587070) и ratatouille_images
// 			publicId = pathWithoutVersion.split(".").slice(0, -1).join("."); // Убираем расширение файла
// 		} else {
// 			publicId = filePath
// 				.replace(/^ratatouille_images\//, '') // Удаляем префикс, если он есть
// 				.split('.')
// 				.slice(0, -1)
// 				.join('.');
// 		}
//
// 		console.log("deleteFile: Deleting file with public_id:", publicId);
//
// 		const response = await fetch(`https://api.cloudinary.com/v1_1/dq0ymjvhx/resources/image/upload`, {
// 			method: "DELETE",
// 			headers: {
// 				Authorization: `Basic ${authString}`,
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify({
// 				public_ids: [publicId],
// 			}),
// 		});
//
// 		const result = await response.json();
//
// 		if (result.error) {
// 			console.error("deleteFile: Error deleting file:", result.error.message);
// 			return { success: false, msg: result.error.message };
// 		}
//
// 		console.log("deleteFile: File deleted successfully:", result);
// 		return { success: true };
// 	} catch (error) {
// 		console.error("deleteFile: Error:", error);
// 		return { success: false, msg: error.message };
// 	}
// };

//----------------------------  Удаляет файл из Cloudinary через серверную функцию Supabase


/**
 * Удаляет файл из Cloudinary через серверную функцию Supabase
 * @param {string} filePath - Путь к файлу в Cloudinary (например, полный URL или путь вроде 'recipes_images/Snacks/Sandwiches/2025_04_25_12_27_24_1b17d89f-441f-490e-bde8-d05453cc7493/header.jpg')
 * @returns {Promise<{success: boolean, msg?: string}>} - Результат удаления
 */
export const deleteFile = async (filePath) => {
	try {
		// Извлекаем public_id из filePath
		let publicId = filePath;

		if (filePath.startsWith("https://res.cloudinary.com")) {
			const urlParts = filePath.split("/image/upload/")[1];
			const pathWithoutVersion = urlParts.split("/").slice(1).join("/"); // Убираем версию (v1745587070) и ratatouille_images
			publicId = pathWithoutVersion.split(".").slice(0, -1).join("."); // Убираем расширение файла
		} else {
			publicId = filePath
				.replace(/^ratatouille_images\//, '') // Удаляем префикс, если он есть
				.split('.')
				.slice(0, -1)
				.join('.');
		}

		console.log("deleteFile: Deleting file with public_id:", publicId);

		// Вызываем серверную функцию Supabase
		const { data, error } = await supabase.rpc("delete_cloudinary_images", {
			public_ids: [publicId],
		});

		if (error) {
			console.error("deleteFile: Error deleting file:", error.message);
			return { success: false, msg: error.message };
		}

		if (!data.success) {
			console.error("deleteFile: Error deleting file:", data.error);
			return { success: false, msg: data.error || "Failed to delete file" };
		}

		console.log("deleteFile: File deleted successfully:", data);
		return { success: true };
	} catch (error) {
		console.error("deleteFile: Error:", error);
		return { success: false, msg: error.message };
	}
};




// ---------------------------

/**
 * Создает папку в Cloudinary внутри директории 'ratatouille_images'
 * @param {string} folderPath - Имя папки, которую необходимо создать (например, 'users' или 'recipes')
 * @returns {Promise<{success: boolean, data?: object, msg?: string}>} - Результат создания папки
 */
const createFolderInCloudinary = async (folderPath) => {
	try {
		const apiKey = "249794684119177";
		const apiSecret = "HDW7kW7XY7WD1RvHG75Hm4B6_Ck";
		const authString = base64.encode(`${apiKey}:${apiSecret}`);

		const response = await fetch(`https://api.cloudinary.com/v1_1/dq0ymjvhx/folders/ratatouille_images/${folderPath}`, {
			method: "POST",
			headers: {
				Authorization: `Basic ${authString}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}), // Тело запроса может быть пустым для создания папки
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
		}

		const result = await response.json();
		console.log("Folder creation result:", result);
		return { success: true, data: result };
	} catch (error) {
		console.error("Error creating folder:", error);
		return { success: false, msg: error.message };
	}
};
/**
 * Загружает файл (изображение или видео) в хранилище Supabase
 * @param {string} filePath - Путь директории внутри cloudinary (например, 'users' или 'recipes')
 * @param {string} fileUri - Локальный URI файла
 * @param {boolean} [isImage=true] - Является ли файл изображением
 * @param {string|null} [oldFilePath=null] - Путь к предыдущему файлу для удаления (если есть)
 * @returns {Promise<{success: boolean, data?: string, msg?: string}>} - Результат загрузки
 */
export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
	try {
		if (oldFilePath && oldFilePath !== filePath) {
			console.log("uploadFile: Deleting old file at:", oldFilePath);
			const deleteResult = await deleteFile(oldFilePath);
			if (!deleteResult.success) {
				console.error("uploadFile: Error deleting old file:", deleteResult.msg);
			} else {
				console.log("uploadFile: Old file deleted successfully:", oldFilePath);
			}
		}

		console.log("uploadFile: Uploading file to:", filePath);

		// Читаем файл как base64
		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
			encoding: FileSystem.EncodingType.Base64,
		});

		// Формируем FormData для отправки в Cloudinary
		const formData = new FormData();
		formData.append("file", `data:image/jpeg;base64,${fileBase64}`); // Для изображений
		formData.append("upload_preset", "ratatouille-app-upload"); // Имя Upload Preset

		// Извлекаем путь к папке из filePath
		const folderPath = filePath.split("/").slice(0, -1).join("/");
		formData.append("folder", folderPath); // Указываем только путь, например: recipes_images/Dessert/Cakes/15c5d29d-e68c-44b0-b876-6914f1f9a3ba

		// Задаём public_id как имя файла без расширения
		const fileName = filePath.split("/").pop().split(".").slice(0, -1).join(".");
		formData.append("public_id", fileName); // Только имя файла, например: header

		// Отправляем файл в Cloudinary
		const response = await fetch("https://api.cloudinary.com/v1_1/dq0ymjvhx/image/upload", {
			method: "POST",
			body: formData,
		});

		const result = await response.json();

		if (result.error) {
			console.error("uploadFile: File upload error:", result.error.message);
			return { success: false, msg: result.error.message };
		}

		// Получаем URL загруженного файла
		const fileUrl = result.secure_url;
		console.log("uploadFile: File uploaded successfully:", fileUrl);
		return { success: true, data: fileUrl }; // Возвращаем полный URL
	} catch (error) {
		console.error("uploadFile: File upload error:", error);
		return { success: false, msg: "Could not upload media" };
	}
};
// export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
// 	try {
// 		if (oldFilePath && oldFilePath !== filePath) {
// 			console.log("uploadFile: Deleting old file at:", oldFilePath);
// 			const deleteResult = await deleteFile(oldFilePath);
// 			if (!deleteResult.success) {
// 				console.error("uploadFile: Error deleting old file:", deleteResult.msg);
// 			} else {
// 				console.log("uploadFile: Old file deleted successfully:", oldFilePath);
// 			}
// 		}
//
// 		console.log("uploadFile: Uploading file to:", filePath);
//
// 		// Извлекаем путь к папке
// 		const folderPath = filePath.split("/").slice(0, -1).join("/");
// 		console.log("Creating folder if not exists:", folderPath);
//
// 		// Создаём папку в Cloudinary
// 		const folderResult = await createFolderInCloudinary(folderPath);
// 		if (!folderResult.success) {
// 			console.error("Failed to create folder:", folderResult.msg);
// 			// Продолжаем загрузку, так как Cloudinary всё равно создаст виртуальную папку
// 		} else {
// 			console.log("Folder created successfully:", folderPath);
// 		}
//
// 		// Читаем файл как base64
// 		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
// 			encoding: FileSystem.EncodingType.Base64,
// 		});
//
// 		// Формируем FormData для отправки в Cloudinary
// 		const formData = new FormData();
// 		formData.append("file", `data:image/jpeg;base64,${fileBase64}`); // Для изображений
// 		formData.append("upload_preset", "ratatouille-app-upload"); // Имя Upload Preset
// 		// formData.append("folder", folderPath); // Папка
// 		formData.append("folder", `ratatouille_images/${folderPath}`); // Полный путь папки, например: ratatouille_images/recipes_images/Snacks/Sandwiches/2025_04_25_12_14_18_1b17d89f-441f-490e-bde8-d05453cc7493
//
//
// 		// formData.append("public_id", filePath.split("/").pop().split(".").slice(0, -1).join(".")); // Имя файла без расширения
// 		// Задаём public_id как имя файла без пути и расширения
// 		const fileName = filePath.split("/").pop().split(".").slice(0, -1).join("."); // Например: header
// 		formData.append("public_id", fileName); // Только имя файла, например: header
//
//
//
// 		// Отправляем файл в Cloudinary
// 		const response = await fetch("https://api.cloudinary.com/v1_1/dq0ymjvhx/image/upload", {
// 			method: "POST",
// 			body: formData,
// 		});
//
// 		const result = await response.json();
//
// 		if (result.error) {
// 			console.error("uploadFile: File upload error:", result.error.message);
// 			return { success: false, msg: result.error.message };
// 		}
//
// 		// Получаем URL загруженного файла
// 		const fileUrl = result.secure_url;
// 		console.log("uploadFile: File uploaded successfully:", fileUrl);
// 		return { success: true, data: fileUrl }; // Возвращаем полный URL
// 	} catch (error) {
// 		console.error("uploadFile: File upload error:", error);
// 		return { success: false, msg: "Could not upload media" };
// 	}
// };
