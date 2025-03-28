import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import i18n from "../lang/i18n";
/**
 * Сжать изображение
 * @param {string} uri - Путь к изображению (URI)
 * @param {number} [compress=0.5] - Степень сжатия (от 0 до 1)
 * @param {number} [width=300] - Ширина результата
 * @param {number} [height=300] - Высота результата
 * @returns {Promise<{uri: string, width: number, height: number, base64?: string}>} - Объект с результатом сжатия
 */
export const compressImage = async (uri, compress = 0.5, width = 300, height = 300) => {
	try {
		const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width, height } }], {
			compress,
			format: ImageManipulator.SaveFormat.JPEG,
		});
		return manipulatedImage; // { uri, width, height, base64? }
	} catch (error) {
		console.error("Error compressing image:", error);
		throw error;
	}
};

/**
 * Сжать изображение, адаптивно уменьшая размеры и качество для оптимизации размера файла
 * @param {string} uri - Путь к изображению (URI)
 * @param {number} [compress=0.5] - Степень сжатия качества (от 0 до 1, где 0 - минимальное качество)
 * @param {number} [maxWidth=1080] - Максимальная ширина изображения в пикселях
 * @param {number} [maxHeight=1080] - Максимальная высота изображения в пикселях
 * @returns {Promise<{uri: string, width: number, height: number, base64?: string}>} - Объект с результатом сжатия
 */
export const compressImage100 = async (uri, compress = 0.5, maxWidth = 1080, maxHeight = 1080) => {
	try {
		// Получаем исходные размеры изображения без изменений
		const { width, height } = await ImageManipulator.manipulateAsync(uri, []);

		// Инициализируем новые размеры, изначально равные исходным
		let newWidth = width;
		let newHeight = height;

		// Проверяем, превышают ли размеры заданные максимальные значения
		if (width > maxWidth || height > maxHeight) {
			// Вычисляем коэффициент масштабирования, сохраняя пропорции
			const ratio = Math.min(maxWidth / width, maxHeight / height);
			newWidth = Math.round(width * ratio); // Округляем новую ширину
			newHeight = Math.round(height * ratio); // Округляем новую высоту
		}

		// Выполняем сжатие изображения с новыми размерами и заданным качеством
		const manipulatedImage = await ImageManipulator.manipulateAsync(
			uri,
			[{ resize: { width: newWidth, height: newHeight } }], // Уменьшаем размеры
			{
				compress, // Устанавливаем степень сжатия качества
				format: ImageManipulator.SaveFormat.JPEG, // Формат сохранения - JPEG
			}
		);

		// Возвращаем объект с результатом сжатия
		return manipulatedImage;
	} catch (error) {
		// Логируем ошибку в случае сбоя обработки изображения
		console.error("Error compressing image:", error);
		throw error; // Пробрасываем ошибку дальше для обработки вызывающим кодом
	}
};

// useImagePicker
export const useImagePicker = (addImage, setAddImage, setLoadingCompresImg, maxImages = 5) => {
	const addImageRecipeList = async () => {
		if (addImage.length >= maxImages) {
			Alert.alert(`${i18n.t("You have reached the image limit for one item")}`);
			return;
		}

		setLoadingCompresImg(true);

		try {
			let res = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});

			if (res && res.assets && res.assets[0]) {
				const originalUri = res.assets[0].uri;

				// Получаем размер оригинального изображения
				const originalRes = await fetch(originalUri);
				const originalBlob = await originalRes.blob();
				const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2);

				// Сжимаем изображение
				const compressedImage = await compressImage100(originalUri, 0.3);

				// Получаем размер сжатого изображения
				const compressedResponse = await fetch(compressedImage.uri);
				const compressedBlob = await compressedResponse.blob();
				const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);

				// Обновляем состояние
				setAddImage((prev) => [...prev, compressedImage]);

				// Показываем информацию о размерах
				Alert.alert(
					"Size image",
					`Original size: ${originalSizeInMB} MB\nCompressed size: ${compressedSizeInMB} MB`
				);

				return compressedResponse.url;
			} else {
				Alert.alert(`${i18n.t("You haven't added an image")}`);
				return null;
			}
		} catch (error) {
			console.error("Error in image picking:", error);
			Alert.alert("Error", "Something went wrong while picking the image");
			return null;
		} finally {
			setLoadingCompresImg(false);
		}
	};

	return { addImageRecipeList };
};

// single image useSingleImagePicker
export const useSingleImagePicker = (initialImageUri, setLoading, compress = 0.3) => {
	const [image, setImage] = useState(initialImageUri ? { uri: initialImageUri } : null);

	const pickImage = async () => {
		setLoading(true);
		try {
			let res = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
			});

			if (res && res.assets && res.assets[0]) {
				const originalUri = res.assets[0].uri;

				// Получаем размер оригинального изображения
				const originalRes = await fetch(originalUri);
				const originalBlob = await originalRes.blob();
				const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2);

				// Сжимаем изображение
				const compressedImage = await compressImage100(originalUri, compress);

				// Получаем размер сжатого изображения
				const compressedResponse = await fetch(compressedImage.uri);
				const compressedBlob = await compressedResponse.blob();
				const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);

				// Обновляем состояние
				setImage(compressedImage);

				// Показываем информацию о размерах
				Alert.alert(
					"Size image",
					`Original size: ${originalSizeInMB} MB\nCompressed size: ${compressedSizeInMB} MB`
				);

				return compressedImage.uri;
			} else {
				Alert.alert(`${i18n.t("You haven't added an image")}`);
				return null;
			}
		} catch (error) {
			console.error("Error picking image:", error);
			Alert.alert("Error", "Something went wrong while picking the image");
			return null;
		} finally {
			setLoading(false);
		}
	};

	return { image, pickImage };
};
