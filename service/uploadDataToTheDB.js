import { supabase } from "../lib/supabase";
import { uploadFile } from "../service/imageServices";

export const uploadRecipeToTheServer = async (totalRecipe) => {
	try {
		// console.log("uploadRecipeToTheServer", totalRecipe);

		// Глубокая копия объекта totalRecipe
		let recipeData = JSON.parse(JSON.stringify(totalRecipe));

		// Формируем subCategory, заменяем пробелы на подчеркивания
		const subCategory = recipeData.point.startsWith(recipeData.category)
			? recipeData.point.replace(recipeData.category, "").trim().replaceAll(" ", "_")
			: recipeData.point.trim().replaceAll(" ", "_");

		// Очищаем category и subCategory от недопустимых символов для пути
		const cleanCategory = recipeData.category
			.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "")
			.trim()
			.replaceAll(" ", "_");
		const cleanSubCategory = subCategory.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "");

		// Формируем путь для изображения
		const date = new Date(); // Текущая дата и время
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const day = String(date.getUTCDate()).padStart(2, "0");
		const hours = String(date.getUTCHours()).padStart(2, "0");
		const minutes = String(date.getUTCMinutes()).padStart(2, "0");
		const seconds = String(date.getUTCSeconds()).padStart(2, "0");

		// Формируем имя папки в формате YYYY_MM_DD_HH_MM_SS
		let folderName = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`;

		// Добавляем user_id для уникальности, если он есть
		const userId = recipeData.published_id || "";
		if (userId) {
			folderName += `_${userId}`;
		}

		const baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${folderName}`;

		// 1. Загружаем image_header, если он есть и это локальный файл
		if (
			recipeData.image_header &&
			typeof recipeData.image_header === "string" &&
			recipeData.image_header.startsWith("file://")
		) {
			const headerExtension = recipeData.image_header.split(".").pop() || "jpg";
			const headerPath = `${baseImagePath}/header.${headerExtension}`;
			const imageRes = await uploadFile(headerPath, recipeData.image_header, true);
			if (imageRes.success) {
				recipeData.image_header = imageRes.data; // Сохраняем только путь как строку
			} else {
				console.error("Failed to upload image_header:", imageRes.msg);
				recipeData.image_header = null;
			}
		}

		// 2. Собираем все уникальные изображения из instructions
		const imageMap = new Map(); // Map для хранения локальный URI → путь в хранилище
		if (recipeData.instructions && recipeData.instructions.lang) {
			for (const lang in recipeData.instructions.lang) {
				const langInstructions = recipeData.instructions.lang[lang];
				for (const step in langInstructions) {
					const stepData = langInstructions[step];
					if (stepData.images && Array.isArray(stepData.images)) {
						stepData.images.forEach((image, index) => {
							if (typeof image === "string" && !image.startsWith("file://")) {
								// Если это уже строка и не локальный файл, оставляем как есть
								imageMap.set(image, image);
							} else if (typeof image === "object" && image.uri && image.uri.startsWith("file://")) {
								// Если это объект с локальным URI
								if (!imageMap.has(image.uri)) {
									imageMap.set(image.uri, null);
								}
							} else if (typeof image === "string" && image.startsWith("file://")) {
								// Если это строка с локальным URI
								if (!imageMap.has(image)) {
									imageMap.set(image, null);
								}
							}
						});
					}
				}
			}

			// 3. Загружаем уникальные локальные изображения
			const uploadPromises = [];
			let imageIndex = 1; // Начинаем с 1 для именования файлов
			for (const [localUri] of imageMap) {
				if (localUri.startsWith("file://")) {
					const extension = localUri.split(".").pop() || "jpg";
					const imagePath = `${baseImagePath}/${imageIndex++}.${extension}`;
					uploadPromises.push(
						uploadFile(imagePath, localUri, true).then((res) => ({
							localUri,
							uploadedPath: res.success ? res.data : null, // Сохраняем только путь
							error: res.success ? null : res.msg,
						}))
					);
				}
			}

			// Ждем завершения всех загрузок
			const uploadResults = await Promise.all(uploadPromises);
			uploadResults.forEach(({ localUri, uploadedPath, error }) => {
				if (error) {
					console.error(`Failed to upload image ${localUri}:`, error);
					imageMap.set(localUri, null);
				} else {
					imageMap.set(localUri, uploadedPath); // Сохраняем только строку с путем
				}
			});

			// 4. Обновляем все images в instructions, заменяя объекты на строки
			for (const lang in recipeData.instructions.lang) {
				const langInstructions = recipeData.instructions.lang[lang];
				for (const step in langInstructions) {
					const stepData = langInstructions[step];
					if (stepData.images && Array.isArray(stepData.images)) {
						stepData.images = stepData.images
							.map((image) => {
								if (typeof image === "string" && !image.startsWith("file://")) {
									// Если это уже путь (не локальный URI), оставляем как есть
									return image;
								} else if (typeof image === "object" && image.uri && imageMap.has(image.uri)) {
									// Если это объект, возвращаем только путь как строку
									return imageMap.get(image.uri);
								} else if (typeof image === "string" && imageMap.has(image)) {
									// Если это строка с локальным URI, возвращаем путь
									return imageMap.get(image);
								}
								return null; // Если что-то пошло не так, возвращаем null
							})
							.filter((img) => img !== null); // Убираем null значения
					}
				}
			}
		}

		// 5. Формируем объект для вставки в таблицу
		const recipeToInsert = {
			category: recipeData.category,
			category_id: recipeData.category_id,
			image_header: recipeData.image_header,
			area: recipeData.area,
			title: recipeData.title,
			rating: recipeData.rating || 0,
			likes: recipeData.likes || 0,
			comments: recipeData.comments || 0,
			recipe_metrics: recipeData.recipe_metrics,
			ingredients: recipeData.ingredients,
			instructions: recipeData.instructions,
			video: recipeData.video,
			social_links: recipeData.social_links,
			source_reference: recipeData.source_reference,
			tags: recipeData.tags,
			published_id: recipeData.published_id,
			published_user: recipeData.published_user ? recipeData.published_user : null,
			point: recipeData.point,
			link_copyright: recipeData.link_copyright,
			map_coordinates: recipeData.map_coordinates,
		};

		// 6. Выполняем запрос на вставку
		const { data, error } = await supabase.from("all_recipes_description").insert([recipeToInsert]).select();

		if (error) {
			console.error("Supabase insert error:", error);
			return { success: false, msg: error.message };
		}

		return { success: true, data: data[0] };
	} catch (error) {
		console.error("Error in uploadRecipeToTheServer:", error);
		return { success: false, msg: error.message };
	}
};
