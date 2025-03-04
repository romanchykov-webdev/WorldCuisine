import { supabase } from "../lib/supabase";
import { uploadFile } from "../service/imageServices";
// import { supabase } from "../lib/supabase";
// upload recipe to the server
// export const uploadRecipeToTheServer = async (totalRecipe) => {
// 	try {
// 		console.log("uploadRecipeToTheServer", totalRecipe);

// 		const { data, error } = await supabase;
// 		// .from('allRecipesDescription')
// 		// .insert([
// 		//   { some_column: 'someValue' },
// 		//   { some_column: 'otherValue' },
// 		// ])
// 		// .select()

// 		return { success: true };
// 	} catch (error) {
// 		console.error("Error:", error);
// 		return { success: false, msg: error.message };
// 	}
// };

export const uploadRecipeToTheServer = async (totalRecipe) => {
	try {
		console.log("uploadRecipeToTheServer", totalRecipe);

		// Копируем объект totalRecipe, чтобы не изменять исходный
		// let recipeData = { ...totalRecipe };
		// Глубокая копия объекта totalRecipe
		let recipeData = JSON.parse(JSON.stringify(totalRecipe));

		// Формируем subCategory, заменяем пробелы на подчеркивания
		const subCategory = recipeData.point.startsWith(recipeData.category)
			? recipeData.point.replace(recipeData.category, "").trim().replaceAll(" ", "_")
			: recipeData.point.trim().replaceAll(" ", "_"); // Если category не префикс, берем весь point

		// Очищаем category и subCategory от недопустимых символов для пути
		const cleanCategory = recipeData.category
			.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "")
			.trim()
			.replaceAll(" ", "_");
		const cleanSubCategory = subCategory.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "");

		// Формируем путь для изображения (добавляем timestamp для уникальности)
		const timestamp = Date.now();
		const baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${timestamp}`;

		// 1. Загружаем изображение image_header, если оно есть и это локальный файл
		// if (
		// 	recipeData.image_header &&
		// 	typeof recipeData.image_header === "string" &&
		// 	recipeData.image_header.startsWith("file://")
		// ) {
		// 	const imageRes = await uploadFile(imagePath, recipeData.image_header, true);
		// 	if (imageRes.success) {
		// 		recipeData.image_header = imageRes.data; // Заменяем URI на путь в хранилище
		// 	} else {
		// 		console.error("Failed to upload image_header:", imageRes.msg);
		// 		recipeData.image_header = null; // Если загрузка не удалась, ставим null
		// 	}
		// }
		if (
			recipeData.image_header &&
			typeof recipeData.image_header === "string" &&
			recipeData.image_header.startsWith("file://")
		) {
			const imageRes = await uploadFile(`${baseImagePath}/header`, recipeData.image_header, true);
			if (imageRes.success) {
				recipeData.image_header = imageRes.data;
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
							if (typeof image === "string") {
								// Если это уже путь (не file://), оставляем как есть
								if (!image.startsWith("file://")) {
									imageMap.set(image, image);
								}
							} else if (image.uri && image.uri.startsWith("file://")) {
								// Добавляем локальный URI в Map, если его еще нет
								if (!imageMap.has(image.uri)) {
									imageMap.set(image.uri, null); // Пока путь неизвестен
								}
							}
						});
					}
				}
			}

			// 3. Загружаем уникальные локальные изображения
			// const uploadPromises = [];
			// let imageIndex = 0;
			// for (const [localUri] of imageMap) {
			// 	if (localUri.startsWith("file://")) {
			// 		const imagePath = `${baseImagePath}/instr_${imageIndex++}`;
			// 		uploadPromises.push(
			// 			uploadFile(imagePath, localUri, true).then((res) => ({
			// 				localUri,
			// 				uploadedUri: res.success ? res.data : null,
			// 				error: res.success ? null : res.msg,
			// 			}))
			// 		);
			// 	}
			// }
			// 3. Загружаем уникальные локальные изображения
			const uploadPromises = [];
			let imageIndex = 1; // Начинаем с 1 для простоты
			for (const [localUri] of imageMap) {
				if (localUri.startsWith("file://")) {
					const imagePath = `${baseImagePath}/${imageIndex++}`; // Имя файла — просто номер
					uploadPromises.push(
						uploadFile(imagePath, localUri, true).then((res) => ({
							localUri,
							uploadedUri: res.success ? res.data : null,
							error: res.success ? null : res.msg,
						}))
					);
				}
			}

			// Ждем завершения всех загрузок
			const uploadResults = await Promise.all(uploadPromises);
			uploadResults.forEach(({ localUri, uploadedUri, error }) => {
				if (error) {
					console.error(`Failed to upload image ${localUri}:`, error);
					imageMap.set(localUri, null);
				} else {
					imageMap.set(localUri, uploadedUri);
				}
			});

			// 4. Обновляем все images в instructions
			for (const lang in recipeData.instructions.lang) {
				const langInstructions = recipeData.instructions.lang[lang];
				for (const step in langInstructions) {
					const stepData = langInstructions[step];
					if (stepData.images && Array.isArray(stepData.images)) {
						stepData.images = stepData.images.map((image) => {
							if (typeof image === "string") {
								return image; // Оставляем строковые пути как есть
							} else if (image.uri && imageMap.has(image.uri)) {
								return {
									...image,
									uri: imageMap.get(image.uri), // Заменяем локальный URI на загруженный
								};
							}
							return image;
						});
					}
				}
			}
		}

		// // 2. Формируем объект для вставки в таблицу
		// const recipeToInsert = {
		// 	// created_at: new Date().toISOString(), // Добавляем дату создания
		// 	category: recipeData.category,
		// 	category_id: recipeData.category_id,
		// 	image_header: recipeData.image_header,
		// 	area: recipeData.area,
		// 	title: recipeData.title,
		// 	rating: recipeData.rating || 0,
		// 	likes: recipeData.likes || 0,
		// 	comments: recipeData.comments || 0,
		// 	recipe_metrics: recipeData.recipe_metrics,
		// 	ingredients: recipeData.ingredients,
		// 	instructions: recipeData.instructions,
		// 	video: recipeData.video,
		// 	source_reference: recipeData.source_reference,
		// 	tags: recipeData.tags,
		// 	published_id: recipeData.published_id,
		// 	published_user: recipeData.published_user ? recipeData.published_user : null,
		// 	point: recipeData.point,
		// 	link_copyright: recipeData.link_copyright,
		// 	map_coordinates: recipeData.map_coordinates,
		// };
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
			source_reference: recipeData.source_reference,
			tags: recipeData.tags,
			published_id: recipeData.published_id,
			published_user: recipeData.published_user ? recipeData.published_user : null,
			point: recipeData.point,
			link_copyright: recipeData.link_copyright,
			map_coordinates: recipeData.map_coordinates,
		};

		// 3. Выполняем запрос на вставку
		const { data, error } = await supabase.from("allRecipesDescription").insert([recipeToInsert]).select();

		if (error) {
			console.error("Supabase insert error:", error);
			return { success: false, msg: error.message };
		}

		// console.log("Recipe uploaded successfully:", data);
		return { success: true, data: data[0] }; // Возвращаем вставленный рецепт
	} catch (error) {
		console.error("Error in uploadRecipeToTheServer:", error);
		return { success: false, msg: error.message };
	}
};
