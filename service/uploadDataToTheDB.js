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
		let recipeData = { ...totalRecipe };

		// 1. Загружаем изображение imageHeader, если оно есть и это локальный файл
		if (recipeData.imageHeader && typeof recipeData.imageHeader === "string" && recipeData.imageHeader.startsWith("file://")) {
			const imageRes = await uploadFile("recipes", recipeData.imageHeader, true);
			if (imageRes.success) {
				recipeData.imageHeader = imageRes.data; // Заменяем URI на путь в хранилище
			} else {
				console.error("Failed to upload image_header:", imageRes.msg);
				recipeData.imageHeader = null; // Если загрузка не удалась, ставим null
			}
		}

		// 2. Формируем объект для вставки в таблицу с учетом snake_case
		const recipeToInsert = {
			created_at: new Date().toISOString(), // Добавляем дату создания
			category: recipeData.category,
			category_id: recipeData.categoryId,
			image_header: recipeData.imageHeader,
			area: JSON.stringify(recipeData.area),
			title: JSON.stringify(recipeData.title),
			rating: recipeData.rating || 0,
			likes: recipeData.likes || 0,
			comments: recipeData.comments || 0,
			recipe_metrics: JSON.stringify(recipeData.recipeMetrics),
			ingredients: JSON.stringify(recipeData.ingredients),
			instructions: JSON.stringify(recipeData.instructions),
			video: JSON.stringify(recipeData.video),
			source_reference: recipeData.sourceReference,
			tags: JSON.stringify(recipeData.tags),
			published_id: recipeData.publishedId,
			published_user: recipeData.publishedUser ? JSON.stringify(recipeData.publishedUser) : null,
			point: recipeData.point,
			link_copyright: recipeData.linkCopyright,
			map_coordinates: JSON.stringify(recipeData.mapСoordinates),
		};

		// 3. Выполняем запрос на вставку
		const { data, error } = await supabase.from("allRecipesDescription").insert([recipeToInsert]).select();

		if (error) {
			console.error("Supabase insert error:", error);
			return { success: false, msg: error.message };
		}

		console.log("Recipe uploaded successfully:", data);
		return { success: true, data: data[0] }; // Возвращаем вставленный рецепт
	} catch (error) {
		console.error("Error in uploadRecipeToTheServer:", error);
		return { success: false, msg: error.message };
	}
};
