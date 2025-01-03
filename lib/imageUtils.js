import * as ImageManipulator from 'expo-image-manipulator';

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
        const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width, height } }],
            {
                compress,
                format: ImageManipulator.SaveFormat.JPEG,
            }
        );
        return manipulatedImage; // { uri, width, height, base64? }
    } catch (error) {
        console.error('Error compressing image:', error);
        throw error;
    }
};
