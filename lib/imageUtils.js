import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react'
import { Alert } from 'react-native'
import i18n from '../lang/i18n'
/**
 * Сжать изображение
 * @param {string} uri - Путь к изображению (URI)
 * @param {number} [compress] - Степень сжатия (от 0 до 1)
 * @param {number} [width] - Ширина результата
 * @param {number} [height] - Высота результата
 * @returns {Promise<{uri: string, width: number, height: number, base64?: string}>} - Объект с результатом сжатия
 */
export async function compressImage(uri, compress = 0.5, width = 300, height = 300) {
  try {
    const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width, height } }], {
      compress,
      format: ImageManipulator.SaveFormat.JPEG,
    })
    return manipulatedImage // { uri, width, height, base64? }
  }
  catch (error) {
    console.error('Error compressing image:', error)
    throw error
  }
}

/**
 * Сжать изображение, адаптивно уменьшая размеры и качество для оптимизации размера файла
 * @param {string} uri - Путь к изображению (URI)
 * @param {number} [compress] - Степень сжатия качества (от 0 до 1, где 0 - минимальное качество)
 * @param {number} [maxWidth] - Максимальная ширина изображения в пикселях
 * @param {number} [maxHeight] - Максимальная высота изображения в пикселях
 * @returns {Promise<{uri: string, width: number, height: number, base64?: string}>} - Объект с результатом сжатия
 */
export async function compressImage100(uri, compress = 0.5, maxWidth = 1080, maxHeight = 1080) {
  try {
    // Получаем исходные размеры изображения без изменений
    const { width, height } = await ImageManipulator.manipulateAsync(uri, [])

    // Инициализируем новые размеры, изначально равные исходным
    let newWidth = width
    let newHeight = height

    // Проверяем, превышают ли размеры заданные максимальные значения
    if (width > maxWidth || height > maxHeight) {
      // Вычисляем коэффициент масштабирования, сохраняя пропорции
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      newWidth = Math.round(width * ratio) // Округляем новую ширину
      newHeight = Math.round(height * ratio) // Округляем новую высоту
    }

    // Выполняем сжатие изображения с новыми размерами и заданным качеством
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: newWidth, height: newHeight } }], // Уменьшаем размеры
      {
        compress, // Устанавливаем степень сжатия качества
        format: ImageManipulator.SaveFormat.JPEG, // Формат сохранения - JPEG
      },
    )

    // Возвращаем объект с результатом сжатия
    return manipulatedImage
  }
  catch (error) {
    // Логируем ошибку в случае сбоя обработки изображения
    console.error('Error compressing image:', error)
    throw error // Пробрасываем ошибку дальше для обработки вызывающим кодом
  }
}

/**
 * Хук для выбора и добавления нескольких изображений с последующим сжатием
 * @param {Function} addImage - Функция обновления состояния изображений (setState)
 * @param {Function} setAddImage - Сеттер для состояния добавленных изображений
 * @param {Function} setLoadingCompresImg - Сеттер для отображения состояния загрузки
 * @param {number} [maxImages] - Максимальное количество изображений, которое можно добавить
 * @returns {{ addImageRecipeList: Function }} - Функция выбора и добавления изображения
 */
// useImagePicker
export function useImagePicker(addImage, setAddImage, setLoadingCompresImg, maxImages = 5) {
  const addImageRecipeList = async () => {
    if (addImage.length >= maxImages) {
      Alert.alert(`${i18n.t('You have reached the image limit for one item')}`)
      return
    }

    setLoadingCompresImg(true)

    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (res && res.assets && res.assets[0]) {
        const originalUri = res.assets[0].uri

        // Получаем размер оригинального изображения
        const originalRes = await fetch(originalUri)
        const originalBlob = await originalRes.blob()
        const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2)

        // Сжимаем изображение
        const compressedImage = await compressImage100(originalUri, 0.3)

        // Получаем размер сжатого изображения
        const compressedResponse = await fetch(compressedImage.uri)
        const compressedBlob = await compressedResponse.blob()
        const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)

        // Обновляем состояние
        setAddImage(prev => [...prev, compressedImage])

        // Показываем информацию о размерах
        Alert.alert(
          'Size image',
          `Original size: ${originalSizeInMB} MB\nCompressed size: ${compressedSizeInMB} MB`,
        )

        return compressedResponse.url
      }
      else {
        Alert.alert(`${i18n.t('You haven\'t added an image')}`)
        return null
      }
    }
    catch (error) {
      console.error('Error in image picking:', error)
      Alert.alert('Error', 'Something went wrong while picking the image')
      return null
    }
    finally {
      setLoadingCompresImg(false)
    }
  }

  return { addImageRecipeList }
}

/**
 * Хук для выбора одного изображения с последующим сжатием и обновлением состояния
 * @param {string|null} initialImageUri - URI изображения по умолчанию (если есть)
 * @param {Function} setLoading - Сеттер для состояния загрузки (true/false)
 * @param {number} [compress] - Степень сжатия изображения (от 0 до 1)
 * @returns {{ image: object|null, pickImage: Function }} - Объект с текущим изображением и функцией выбора
 */
// single image useSingleImagePicker
export function useSingleImagePicker(initialImageUri, setLoading, compress = 0.3) {
  const [image, setImage] = useState(initialImageUri ? { uri: initialImageUri } : null)

  const pickImage = async () => {
    setLoading(true)
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (res && res.assets && res.assets[0]) {
        const originalUri = res.assets[0].uri

        // Получаем размер оригинального изображения
        const originalRes = await fetch(originalUri)
        const originalBlob = await originalRes.blob()
        const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2)

        // Сжимаем изображение
        const compressedImage = await compressImage100(originalUri, compress)

        // Получаем размер сжатого изображения
        const compressedResponse = await fetch(compressedImage.uri)
        const compressedBlob = await compressedResponse.blob()
        const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)

        // Обновляем состояние
        setImage(compressedImage)

        // Показываем информацию о размерах
        Alert.alert(
          'Size image',
          `Original size: ${originalSizeInMB} MB\nCompressed size: ${compressedSizeInMB} MB`,
        )

        return compressedImage.uri
      }
      else {
        Alert.alert(`${i18n.t('You haven\'t added an image')}`)
        return null
      }
    }
    catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Something went wrong while picking the image')
      return null
    }
    finally {
      setLoading(false)
    }
  }

  return { image, pickImage }
}

/**
 * Хук для выбора изображения специально для RefactorDescriptionRecipe (локально)
 * @param {string[]} currentImages - Текущий массив изображений шага
 * @param {Function} setTempImages - Функция для обновления временных изображений
 * @param {Function} setLoading - Функция для управления состоянием загрузки
 * @param {number} [maxImages] - Максимальное количество изображений
 * @returns {{ pickImageForRefactor: Function }} - Функция выбора изображения
 */
// export const useImagePickerForRefactor = (currentImages, setTempImages, setLoading, maxImages = 5) => {
// 	const compressImage = async (uri, quality = 0.3) => {
// 		const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], {
// 			compress: quality,
// 			format: ImageManipulator.SaveFormat.PNG,
// 		});
// 		return manipulatedImage;
// 	};

// 	const pickImageForRefactor = async () => {
// 		if (currentImages.length >= maxImages) {
// 			Alert.alert(i18n.t("Limit Reached"), i18n.t("You have reached the limit of 5 images"));
// 			return null;
// 		}

// 		setLoading(true);

// 		try {
// 			let res = await ImagePicker.launchImageLibraryAsync({
// 				mediaTypes: ImagePicker.MediaTypeOptions.Images,
// 				allowsEditing: true,
// 				aspect: [1, 1],
// 				quality: 1,
// 			});

// 			if (res && !res.canceled && res.assets && res.assets[0]) {
// 				const originalUri = res.assets[0].uri;

// 				// Сжимаем изображение
// 				const compressedImage = await compressImage(originalUri, 0.3);

// 				// Возвращаем локальный URI сжатого изображения
// 				return compressedImage.uri;
// 			} else {
// 				Alert.alert(`${i18n.t("You haven't added an image")}`);
// 				return null;
// 			}
// 		} catch (error) {
// 			console.error("Error in pickImageForRefactor:", error);
// 			Alert.alert("Error", "Something went wrong while picking the image");
// 			return null;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { pickImageForRefactor };
// };

// export const useImagePickerForRefactor = (currentImages, setTempImages, setLoading, recipe, maxImages = 5) => {
// 	const compressImage = async (uri, quality = 0.3) => {
// 		const manipulatedImage = await ImageManipulator.manipulateAsync(uri, [{ resize: { width: 800 } }], {
// 			compress: quality,
// 			format: ImageManipulator.SaveFormat.PNG,
// 		});
// 		return manipulatedImage;
// 	};

// 	const pickImageForRefactor = async () => {
// 		if (currentImages.length >= maxImages) {
// 			Alert.alert(i18n.t("Limit Reached"), i18n.t("You have reached the limit of 5 images"));
// 			return null;
// 		}

// 		setLoading(true);

// 		try {
// 			// Запрашиваем разрешение на доступ к галерее
// 			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// 			console.log("pickImageForRefactor: Permission status:", status);
// 			if (status !== "granted") {
// 				Alert.alert(
// 					i18n.t("Permission Denied"),
// 					i18n.t("Sorry, we need media library permissions to make this work!")
// 				);
// 				return null;
// 			}

// 			// Открываем галерею для выбора изображения
// 			let res = await ImagePicker.launchImageLibraryAsync({
// 				mediaTypes: ImagePicker.MediaType.image, // Используем новый API
// 				allowsEditing: true,
// 				aspect: [1, 1],
// 				quality: 1,
// 			});
// 			console.log("pickImageForRefactor: ImagePicker result:", res);

// 			if (res && !res.canceled && res.assets && res.assets[0]) {
// 				const originalUri = res.assets[0].uri;
// 				console.log("pickImageForRefactor: Original URI:", originalUri);
// 				// Сжимаем изображение
// 				const compressedImage = await compressImage(originalUri, 0.3);
// 				console.log("pickImageForRefactor: Compressed image URI:", compressedImage.uri);

// 				// Возвращаем локальный URI сжатого изображения
// 				return compressedImage.uri;
// 			} else {
// 				console.log("pickImageForRefactor: No image selected or canceled");
// 				Alert.alert(`${i18n.t("You haven't added an image")}`);
// 				return null;
// 			}
// 		} catch (error) {
// 			console.error("Error in pickImageForRefactor:", error);
// 			Alert.alert("Error", "Something went wrong while picking the image");
// 			return null;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { pickImageForRefactor };
// };

// export const useImagePickerForRefactor = (currentImages, setTempImages, setLoading, recipe, maxImages = 5) => {
// 	const pickImageForRefactor = async () => {
// 		if (currentImages.length >= maxImages) {
// 			Alert.alert(i18n.t("Limit Reached"), i18n.t("You have reached the limit of 5 images"));
// 			return null;
// 		}

// 		setLoading(true);

// 		try {
// 			// Запрашиваем разрешение на доступ к галерее
// 			const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
// 			console.log("pickImageForRefactor: Permission status:", status);
// 			if (status !== "granted") {
// 				Alert.alert(
// 					i18n.t("Permission Denied"),
// 					i18n.t("Sorry, we need media library permissions to make this work!")
// 				);
// 				return null;
// 			}

// 			// Открываем галерею для выбора изображения
// 			console.log("pickImageForRefactor: Launching image library...");
// 			let res = await ImagePicker.launchImageLibraryAsync({
// 				mediaTypes: ImagePicker.MediaTypeOptions.Images, // Используем синтаксис, совместимый с твоей версией
// 				allowsEditing: true,
// 				aspect: [1, 1],
// 				quality: 1,
// 			});
// 			console.log("pickImageForRefactor: ImagePicker result:", res);

// 			if (res && res.assets && res.assets[0]) {
// 				const originalUri = res.assets[0].uri;
// 				console.log("pickImageForRefactor: Original URI:", originalUri);

// 				// Получаем размер оригинального изображения
// 				const originalRes = await fetch(originalUri);
// 				const originalBlob = await originalRes.blob();
// 				const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2);

// 				// Сжимаем изображение
// 				const compressedImage = await compressImage100(originalUri, 0.3);
// 				console.log("pickImageForRefactor: Compressed image URI:", compressedImage.uri);

// 				// Получаем размер сжатого изображения
// 				const compressedResponse = await fetch(compressedImage.uri);
// 				const compressedBlob = await compressedResponse.blob();
// 				const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);

// 				// Показываем информацию о размерах
// 				Alert.alert(
// 					"Size image",
// 					`Original size: ${originalSizeInMB} MB\nCompressed size: ${compressedSizeInMB} MB`
// 				);

// 				// Возвращаем локальный URI сжатого изображения
// 				return compressedImage.uri;
// 			} else {
// 				console.log("pickImageForRefactor: No image selected or canceled");
// 				Alert.alert(`${i18n.t("You haven't added an image")}`);
// 				return null;
// 			}
// 		} catch (error) {
// 			console.error("Error in pickImageForRefactor:", error);
// 			Alert.alert("Error", "Something went wrong while picking the image");
// 			return null;
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	return { pickImageForRefactor };
// };

export function useImagePickerForRefactor(currentImages, setTempImages, setLoading, recipe, maxImages = 5) {
  // console.log("useImagePickerForRefactor currentImages", currentImages);
  // console.log("useImagePickerForRefactor maxImages", maxImages);

  const pickImageForRefactor = async () => {
    if (currentImages.length >= maxImages) {
      Alert.alert(i18n.t('Limit Reached'), i18n.t('You have reached the limit of 5 images'))
      return null
    }

    setLoading(true)

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      console.log('pickImageForRefactor: Permission status:', status)
      if (status !== 'granted') {
        Alert.alert(
          i18n.t('Permission Denied'),
          i18n.t('Sorry, we need media library permissions to make this work!'),
        )
        return null
      }

      console.log('pickImageForRefactor: Launching image library...')
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Используем синтаксис из useSingleImagePicker
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      console.log('pickImageForRefactor: ImagePicker result:', res)

      if (res && res.assets && res.assets[0]) {
        const originalUri = res.assets[0].uri
        console.log('pickImageForRefactor: Original URI:', originalUri)

        const originalRes = await fetch(originalUri)
        const originalBlob = await originalRes.blob()
        const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2)

        const compressedImage = await compressImage100(originalUri, 0.3)
        console.log('pickImageForRefactor: Compressed image URI:', compressedImage.uri)

        const compressedResponse = await fetch(compressedImage.uri)
        const compressedBlob = await compressedResponse.blob()
        const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)

        Alert.alert(
          'Size image',
          `Original size: ${originalSizeInMB} MB\nCompressed size: ${compressedSizeInMB} MB`,
        )

        return compressedImage.uri
      }
      else {
        console.log('pickImageForRefactor: No image selected or canceled')
        Alert.alert(`${i18n.t('You haven\'t added an image')}`)
        return null
      }
    }
    catch (error) {
      console.error('Error in pickImageForRefactor:', error)
      Alert.alert('Error', 'Something went wrong while picking the image')
      return null
    }
    finally {
      setLoading(false)
    }
  }

  return { pickImageForRefactor }
}
