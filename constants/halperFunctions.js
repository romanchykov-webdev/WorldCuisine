import { useEffect, useState } from "react";
import { Alert } from "react-native";
import i18n from "../lang/i18n";

// Функция для отображения алерта с кастомными параметрами
export const showCustomAlert = (title, message, router) => {
	Alert.alert(title, message, [
		{
			text: "Cancel",
			onPress: () => console.log("modal cancelled"),
			style: "cancel",
		},
		{
			text: "LogIn-SignUp",
			onPress: () => router.replace("/ProfileScreen"),
			style: "default",
		},
	]);
};

// Функция для форматирования чисел  1299 in 1.2K
// export const myFormatNumber = (num) => {
// 	if (num >= 1000) {
// 		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K"; // Убирает ".0" для целых чисел
// 	}
// 	return num.toString(); // Возвращает число как строку, если меньше 1000
// };
export const myFormatNumber = (num) => {
	try {
		// Попытка привести входное значение к числу, если оно не является числом
		if (typeof num !== "number") {
			num = parseFloat(num);
			if (isNaN(num)) {
				throw new Error("Invalid number");
			}
		}

		if (num >= 1000) {
			return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
		}
		return num.toString();
	} catch (error) {
		// Если произошла ошибка, возвращаем "0"
		return "0";
	}
};

// Функция для форматирования date
export const formatDateTime = (isoDateString) => {
	const date = new Date(isoDateString);

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы в JS начинаются с 0
	const year = date.getFullYear();

	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Функция для  видео с Youtobe
// export const getYoutobeVideoId = (url) => {
// 	console.log("getYoutobeVideoId url", url);

// 	// if(url!=null){
// 	const regex = /[?&]v=([^&]+)/;
// 	const match = url.match(regex);

// 	if (match && match[1]) {
// 		console.log("match[1]", match[1]);
// 		return match[1];
// 	}
// 	return null;
// 	// }else{
// 	//     return null;
// 	// }
// };
export const getYoutubeVideoId = (url) => {
	// console.log("getYoutubeVideoId url", url);

	if (!url || typeof url !== "string") {
		return null;
	}

	// Регулярное выражение для полной ссылки (youtube.com/watch?v=)
	const fullUrlRegex = /[?&]v=([^&]+)/;
	const fullUrlMatch = url.match(fullUrlRegex);

	if (fullUrlMatch && fullUrlMatch[1]) {
		return fullUrlMatch[1];
	}

	// Регулярное выражение для сокращенной ссылки (youtu.be)
	const shortUrlRegex = /youtu\.be\/([^?]+)/;
	const shortUrlMatch = url.match(shortUrlRegex);

	if (shortUrlMatch && shortUrlMatch[1]) {
		return shortUrlMatch[1];
	}

	return null;
};

// Функция для  видео с google disk
export const convertGoogleDriveLink = (url) => {
	// console.log('convertGoogleDriveLink url', url);
	if (url != null) {
		return url.replace(/\/file\/d\/(.*?)\/view.*/, "/uc?export=download&id=$1");
	}
	return null;
};

// Кастомный хук для debounce
export const useDebounce = (value, delay) => {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(timer);
	}, [value, delay]);

	return debouncedValue;
};

// функция проверки структуры данных totalRecipe
export const validateRecipeStructure = (recipe) => {
	// Проверка базовых обязательных полей
	const requiredFields = ["category", "image_header", "title", "area", "rating", "likes", "comments", "recipe_metrics", "ingredients", "published_id"];

	for (const field of requiredFields) {
		if (!recipe?.hasOwnProperty(field)) {
			return {
				isValid: false,
				message: `${i18n.t("Field is missing")} ${field}`,
			};
		}
	}

	// Проверка типа данных
	if (typeof recipe.category !== "string" || typeof recipe.image_header !== "string" || typeof recipe.rating !== "number" || typeof recipe.likes !== "number" || typeof recipe.comments !== "number" || typeof recipe.published_id !== "string") {
		return {
			isValid: false,
			message: `${i18n.t("All required fields marked must be filled in")} \u2736.`,
		};
	}

	// Проверка title (not null)
	if (recipe.title === null) {
		return {
			isValid: false,
			message: `${i18n.t("Fill in the recipe name field")}`,
		};
	}

	// Проверка title (объект с lang и strTitle)
	if (
		typeof recipe.title !== "object" ||
		!recipe.title.hasOwnProperty("lang") ||
		!Array.isArray(recipe.title.lang) ||
		recipe.title.lang.length === 0 // Массив lang не должен быть пустым
	) {
		return {
			isValid: false,
			message: `${i18n.t("Fill in the recipe name field")}`,
		};
	}
	// Проверка каждого объекта в массиве lang
	for (const item of recipe.title.lang) {
		if (
			!item.hasOwnProperty("lang") ||
			!item.hasOwnProperty("name") ||
			typeof item.lang !== "string" ||
			item.lang.trim() === "" || // Ключ lang не может быть пустой строкой после trim
			typeof item.name !== "string" ||
			item.name.trim() === "" // Ключ name не может быть пустой строкой после trim
		) {
			return {
				isValid: false,
				message: "Каждый объект в поле title.lang должен содержать непустые строки для ключей lang и name после удаления пробелов.",
			};
		}
	}

	// Проверка strTitle
	if (
		!recipe.title.hasOwnProperty("strTitle") ||
		typeof recipe.title.strTitle !== "string" ||
		recipe.title.strTitle.trim() === "" // strTitle не может быть пустой строкой после trim
	) {
		return {
			isValid: false,
			message: "Поле title.strTitle должно быть непустой строкой после удаления пробелов.",
		};
	}

	// Проверка area (объект с переводами)
	// if (typeof recipe.area !== "object" || recipe.area === null) {
	// 	return {
	// 		isValid: false,
	// 		message: "Поле area должно быть объектом.",
	// 	};
	// }
	// Проверка, что все значения в объекте area не являются пустыми строками
	for (const key in recipe.area) {
		if (recipe.area.hasOwnProperty(key)) {
			const value = recipe.area[key];
			if (typeof value === "string" && value.trim() === "") {
				return {
					isValid: false,
					message: `${i18n.t("Add the name of the country where the recipe comes from, for the language")} "${key}" .`,
				};
			}
		}
	}

	// Проверка recipe_metrics (объект с time, persons, calories, difficulty)
	if (typeof recipe.recipe_metrics !== "object" || recipe.recipe_metrics === null || !recipe.recipe_metrics.hasOwnProperty("time") || !recipe.recipe_metrics.hasOwnProperty("persons") || !recipe.recipe_metrics.hasOwnProperty("calories") || !recipe.recipe_metrics.hasOwnProperty("difficulty")) {
		return {
			isValid: false,
			message: "Поле recipe_metrics должно содержать time, persons, calories, difficulty.",
		};
	}

	// Проверка ingredients (объект с lang и массивами ингредиентов)
	if (typeof recipe.ingredients !== "object" || !recipe.ingredients.hasOwnProperty("lang") || typeof recipe.ingredients.lang !== "object") {
		return {
			isValid: false,
			message: `${i18n.t("At least one ingredient is required")}`,
		};
	}
	// Проверка, что в lang есть минимум один ключ с массивом, содержащим минимум один объект
	const langKeys = Object.keys(recipe.ingredients.lang);
	if (langKeys.length === 0) {
		return {
			isValid: false,
			message: `${i18n.t("At least one ingredient is required")}`,
		};
	}

	for (const lang of langKeys) {
		const ingredientsArray = recipe.ingredients.lang[lang];
		if (!Array.isArray(ingredientsArray) || ingredientsArray.length === 0) {
			return {
				isValid: false,
				message: `${i18n.t("Add the name of the ingredient for the language")} "${lang}" .`,
			};
		}

		for (const ingredient of ingredientsArray) {
			if (typeof ingredient !== "object" || !ingredient.hasOwnProperty("unit") || !ingredient.hasOwnProperty("quantity") || !ingredient.hasOwnProperty("ingredient")) {
				return {
					isValid: false,
					message: `${i18n.t("For the ingredient in the language")} "${lang}". ${i18n.t("You forgot to add")} ${i18n.t("quantity")} ${i18n.t("or")} ${i18n.t("measure of measurement")}.`,
				};
			}

			// Проверка, что значения не являются пустыми строками после trim
			if (typeof ingredient.unit === "string" && ingredient.unit.trim() === "") {
				return {
					isValid: false,
					message: `${i18n.t("For the ingredient in the language")} "${lang}". ${i18n.t("You forgot to add")} ${i18n.t("measure of measurement")}.`,
				};
			}

			if (typeof ingredient.ingredient === "string" && ingredient.ingredient.trim() === "") {
				return {
					isValid: false,
					message: `${i18n.t("For the ingredient in the language")} "${lang}". ${i18n.t("You forgot to add")} ${i18n.t("title")}.`,
				};
			}

			// Проверка quantity (может быть строкой или числом, но не пустой строкой, если строка)
			if (typeof ingredient.quantity === "string" && ingredient.quantity.trim() === "") {
				return {
					isValid: false,
					message: `${i18n.t("For the ingredient in the language")} "${lang}". ${i18n.t("You forgot to add")} ${i18n.t("quantity")}.`,
				};
			}
		}
	}

	// Проверка instructions (объект с lang и шагами)
	// if (
	// 	typeof recipe.instructions !== "object" ||
	// 	!recipe.instructions.hasOwnProperty("lang") ||
	// 	typeof recipe.instructions.lang !== "object"
	// ) {
	// 	return {
	// 		isValid: false,
	// 		message:
	// 			"Поле instructions должно содержать корректную структуру lang.",
	// 	};
	// }

	// Проверка video, sourceReference, tags, linkCopyright, mapCoordinates (опциональные поля)
	//   if (
	//     recipe.video !== null &&
	//     typeof recipe.video !== "object" &&
	//     !recipe.video.hasOwnProperty("strYoutube") &&
	//     !recipe.video.hasOwnProperty("strYouVideo")
	//   ) {
	//     return {
	//       isValid: false,
	//       message: "Поле video должно быть объектом с корректной структурой (strYoutube или strYouVideo).",
	//     };
	//   }

	//   if (
	//     recipe.sourceReference !== null &&
	//     typeof recipe.sourceReference !== "string"
	//   ) {
	//     return {
	//       isValid: false,
	//       message: "Поле sourceReference должно быть строкой или null.",
	//     };
	//   }

	// Проверка tags ( поле, минимум 1 элемент, если не null)
	if (recipe.tags !== null) {
		if (!Array.isArray(recipe.tags)) {
			return {
				isValid: false,
				message: `${i18n.t("A tag, there must be at least one, but the more tags, the easier it is for the user to find your recipe")}`,
			};
		}
		if (recipe.tags.length < 1) {
			return {
				isValid: false,
				message: `${i18n.t("A tag, there must be at least one, but the more tags, the easier it is for the user to find your recipe")}`,
			};
		}
		if (!recipe.tags.every((tag) => typeof tag === "string")) {
			return {
				isValid: false,
				message: "Все Теги должны быть строками.",
			};
		}
	}
	// if (
	// 	recipe.tags !== null &&
	// 	(!Array.isArray(recipe.tags) ||
	// 		!recipe.tags.every((tag) => typeof tag === "string"))
	// ) {
	// 	return {
	// 		isValid: false,
	// 		message: "Поле tags должно быть массивом строк или null.",
	// 	};
	// }

	//   if (
	//     recipe.linkCopyright !== null &&
	//     typeof recipe.linkCopyright !== "string"
	//   ) {
	//     return {
	//       isValid: false,
	//       message: "Поле linkCopyright должно быть строкой или null.",
	//     };
	//   }

	//   if (
	//     recipe.mapСoordinates !== null &&
	//     (typeof recipe.mapСoordinates !== "object" ||
	//       !recipe.mapСoordinates.hasOwnProperty("latitude") ||
	//       !recipe.mapСoordinates.hasOwnProperty("longitude") ||
	//       typeof recipe.mapСoordinates.latitude !== "number" ||
	//       typeof recipe.mapСoordinates.longitude !== "number")
	//   ) {
	//     return {
	//       isValid: false,
	//       message: "Поле mapCoordinates должно быть объектом с latitude и longitude (числа) или null.",
	//     };
	//   }

	return { isValid: true, message: "Структура данных корректна." };
};
