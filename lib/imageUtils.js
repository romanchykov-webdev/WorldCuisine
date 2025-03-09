import * as ImageManipulator from "expo-image-manipulator";

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

//w=100% h=100%

/**
 * Сжать изображение, сохраняя его размеры, но уменьшая качество
 * @param {string} uri - Путь к изображению (URI)
 * @param {number} [compress=0.5] - Степень сжатия (от 0 до 1)
 * @returns {Promise<{uri: string, width: number, height: number, base64?: string}>} - Объект с результатом сжатия
 */
// export const compressImage100 = async (uri, compress = 0.5) => {
// 	try {
// 		const manipulatedImage = await ImageManipulator.manipulateAsync(
// 			uri,
// 			[], // Оставляем без изменений размеры
// 			{
// 				compress, // Сжимаем только качество
// 				format: ImageManipulator.SaveFormat.JPEG, // Можно поменять формат, если нужно
// 			}
// 		);
// 		return manipulatedImage; // { uri, width, height, base64? }
// 	} catch (error) {
// 		console.error("Error compressing image:", error);
// 		throw error;
// 	}
// };

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
