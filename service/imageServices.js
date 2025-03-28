import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabaseUrl } from "../constants/supabaseIndex";
import { supabase } from "../lib/supabase";

export const getUserImageSrc = (imagePath) => {
	if (imagePath) {
		// return {uri: imagePath};
		return getSupabaseFileUrl(imagePath);
	} else {
		return require("../assets/img/user_icon.png");
	}
};

export const getSupabaseFileUrl = (filePath) => {
	if (filePath) {
		return `${supabaseUrl}/storage/v1/object/public/uploads_image/${filePath}`;
	}
	return null;
};

//
export const getRecipeImageUrl = (imagePath) => {
	if (imagePath) {
		// Используем бакет uploads_image, оставляем recipes_images/ как часть пути
		return `${supabaseUrl}/storage/v1/object/public/uploads_image/${imagePath}`;
	}
	return "https://via.placeholder.com/300";
};

// Удалить файл из хранилища
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

export const uploadFile = async (filePath, fileUri, isImage = true, oldFilePath = null) => {
	try {
		// Удаляем старый файл, если передан путь
		if (oldFilePath) {
			await deleteFile(oldFilePath);
		}

		// Добавляем уникальный суффикс к пути файла
		const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
		const fileExtension = isImage ? ".png" : ".mp4"; // или другое расширение
		const uniqueFilePath = `${filePath}/${uniqueSuffix}${fileExtension}`;

		const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
			encoding: FileSystem.EncodingType.Base64,
		});

		const imageData = decode(fileBase64);

		const { data, error } = await supabase.storage.from("uploads_image").upload(uniqueFilePath, imageData, {
			cacheControl: "3600",
			upsert: false,
			contentType: isImage ? "image/*" : "video/*",
		});

		if (error) {
			console.log("File upload error", error);
			return { success: false, msg: "Could not upload media" };
		}

		return { success: true, data: data.path };
	} catch (error) {
		console.log("File upload error", error);
		return { success: false, msg: "Could not upload media" };
	}
};
