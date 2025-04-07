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

export const updateRecipeToTheServer = async (recipeId, updatedData) => {
	try {
		console.log("updateRecipeToTheServer: Received recipeId:", recipeId);
		console.log("updateRecipeToTheServer: Received updatedData:", JSON.stringify(updatedData, null, 2));

		// 1. Получаем текущие данные рецепта из базы
		const { data: existingRecipe, error: fetchError } = await supabase
			.from("all_recipes_description")
			.select("image_header, instructions, category, point, published_id")
			.eq("id", recipeId)
			.single();

		if (fetchError) {
			console.error("Supabase fetch error:", fetchError);
			return { success: false, msg: fetchError.message };
		}

		if (!existingRecipe) {
			return { success: false, msg: "Recipe not found" };
		}

		// 2. Глубокая копия объекта updatedData
		let recipeToUpdate = JSON.parse(JSON.stringify(updatedData));

		// 3. Формируем subCategory
		const category = recipeToUpdate.category || existingRecipe.category;
		const point = recipeToUpdate.point || existingRecipe.point;
		const subCategory = point.startsWith(category)
			? point.replace(category, "").trim().replaceAll(" ", "_")
			: point.trim().replaceAll(" ", "_");

		const cleanCategory = category
			.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "")
			.trim()
			.replaceAll(" ", "_");
		const cleanSubCategory = subCategory.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "");

		// 4. Формируем путь для новых изображений
		const date = new Date();
		const year = date.getUTCFullYear();
		const month = String(date.getUTCMonth() + 1).padStart(2, "0");
		const day = String(date.getUTCDate()).padStart(2, "0");
		const hours = String(date.getUTCHours()).padStart(2, "0");
		const minutes = String(date.getUTCMinutes()).padStart(2, "0");
		const seconds = String(date.getUTCSeconds()).padStart(2, "0");

		let folderName = `${year}${month}${day}${hours}${minutes}${seconds}`;
		const userId = recipeToUpdate.published_id || existingRecipe.published_id || "";
		if (userId) {
			folderName += `_${userId}`;
		}

		const baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${folderName}`;

		// 5. Обрабатываем image_header
		if ("image_header" in recipeToUpdate) {
			if (
				recipeToUpdate.image_header &&
				typeof recipeToUpdate.image_header === "string" &&
				recipeToUpdate.image_header.startsWith("file://")
			) {
				const headerExtension = recipeToUpdate.image_header.split(".").pop() || "jpg";
				// Создаём новый уникальный путь для нового изображения
				const newHeaderPath = `${baseImagePath}/header_${Date.now()}.${headerExtension}`;

				// Загружаем новое изображение
				const imageRes = await uploadFile(newHeaderPath, recipeToUpdate.image_header, true);
				if (imageRes.success) {
					console.log("updateRecipeToTheServer: New image uploaded to:", imageRes.data);

					// Удаляем старое изображение, если оно существует
					if (existingRecipe.image_header) {
						const { error: deleteError } = await supabase.storage
							.from("uploads_image")
							.remove([existingRecipe.image_header]);
						if (deleteError) {
							console.error("updateRecipeToTheServer: Error deleting old image_header:", deleteError);
						} else {
							console.log(
								"updateRecipeToTheServer: Old image_header deleted:",
								existingRecipe.image_header
							);
						}
					}

					// Обновляем image_header на новый путь
					recipeToUpdate.image_header = imageRes.data;
					console.log("updateRecipeToTheServer: Updated image_header:", recipeToUpdate.image_header);
				} else {
					console.error("updateRecipeToTheServer: Failed to upload image_header:", imageRes.msg);
					return { success: false, msg: "Failed to upload image_header" };
				}
			} else if (recipeToUpdate.image_header === null) {
				// Если image_header установлен в null, удаляем старое изображение
				if (existingRecipe.image_header) {
					const { error: deleteError } = await supabase.storage
						.from("uploads_image")
						.remove([existingRecipe.image_header]);
					if (deleteError) {
						console.error("updateRecipeToTheServer: Error deleting old image_header:", deleteError);
					}
				}
				recipeToUpdate.image_header = null;
			}
		}

		// 6. Обрабатываем instructions (оставляем без изменений)
		if ("instructions" in recipeToUpdate && recipeToUpdate.instructions && recipeToUpdate.instructions.lang) {
			const imageMap = new Map();
			for (const lang in recipeToUpdate.instructions.lang) {
				const langInstructions = recipeToUpdate.instructions.lang[lang];
				for (const step in langInstructions) {
					const stepData = langInstructions[step];
					if (stepData.images && Array.isArray(stepData.images)) {
						stepData.images.forEach((image, index) => {
							if (typeof image === "string" && !image.startsWith("file://")) {
								imageMap.set(image, image);
							} else if (typeof image === "object" && image.uri && image.uri.startsWith("file://")) {
								if (!imageMap.has(image.uri)) {
									imageMap.set(image.uri, null);
								}
							} else if (typeof image === "string" && image.startsWith("file://")) {
								if (!imageMap.has(image)) {
									imageMap.set(image, null);
								}
							}
						});
					}
				}
			}

			const uploadPromises = [];
			let imageIndex = 1;
			for (const [localUri] of imageMap) {
				if (localUri.startsWith("file://")) {
					const extension = localUri.split(".").pop() || "jpg";
					const imagePath = `${baseImagePath}/${imageIndex++}.${extension}`;
					uploadPromises.push(
						uploadFile(imagePath, localUri, true).then((res) => ({
							localUri,
							uploadedPath: res.success ? res.data : null,
							error: res.success ? null : res.msg,
						}))
					);
				}
			}

			const uploadResults = await Promise.all(uploadPromises);
			uploadResults.forEach(({ localUri, uploadedPath, error }) => {
				if (error) {
					console.error(`Failed to upload image ${localUri}:`, error);
					imageMap.set(localUri, null);
				} else {
					imageMap.set(localUri, uploadedPath);
				}
			});

			for (const lang in recipeToUpdate.instructions.lang) {
				const langInstructions = recipeToUpdate.instructions.lang[lang];
				for (const step in langInstructions) {
					const stepData = langInstructions[step];
					if (stepData.images && Array.isArray(stepData.images)) {
						stepData.images = stepData.images
							.map((image) => {
								if (typeof image === "string" && !image.startsWith("file://")) {
									return image;
								} else if (typeof image === "object" && image.uri && imageMap.has(image.uri)) {
									return imageMap.get(image.uri);
								} else if (typeof image === "string" && imageMap.has(image)) {
									return imageMap.get(image);
								}
								return null;
							})
							.filter((img) => img !== null);
					}
				}
			}
		}

		// 7. Удаляем поля, которые не должны обновляться
		delete recipeToUpdate.rating;
		delete recipeToUpdate.likes;
		delete recipeToUpdate.comments;

		// 8. Выполняем запрос на обновление
		const { data, error } = await supabase
			.from("all_recipes_description")
			.update(recipeToUpdate)
			.eq("id", recipeId)
			.select();

		if (error) {
			console.error("Supabase update error:", error);
			return { success: false, msg: error.message };
		}

		console.log("updateRecipeToTheServer: Updated recipe:", JSON.stringify(data[0], null, 2));
		return { success: true, data: data[0] };
	} catch (error) {
		console.error("Error in updateRecipeToTheServer:", error);
		return { success: false, msg: error.message };
	}
};
