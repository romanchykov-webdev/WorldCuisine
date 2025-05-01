import {supabase} from "../lib/supabase";
import {deleteFile} from "./imageServices";


/**
 * Удаляет рецепт из базы данных и связанные с ним изображения из хранилища
 * @param {string} recipeId - Идентификатор рецепта
 * @returns {Promise<{success: boolean, msg?: string}>} - Результат удаления или сообщение об ошибке
 */
export const deleteRecipeFromMyDB = async (recipeId) => {
    console.log("deleteRecipe", recipeId);
    try {
        // 1. Получаем данные рецепта, чтобы найти все изображения
        const { data: recipe, error: fetchError } = await supabase
            .from("all_recipes_description")
            .select("image_header, instructions")
            .eq("id", recipeId)
            .single();

        if (fetchError) {
            console.error("deleteRecipeFromMyDB: Error fetching recipe:", fetchError);
            return { success: false, msg: "Failed to fetch recipe for deletion" };
        }

        if (!recipe) {
            return { success: false, msg: "Recipe not found" };
        }

        // 2. Собираем все изображения для удаления
        const imagesToDelete = [];

        if (recipe.image_header) {
            imagesToDelete.push(recipe.image_header);
        }

        if (recipe.instructions && recipe.instructions.lang) {
            for (const lang in recipe.instructions.lang) {
                const langInstructions = recipe.instructions.lang[lang];
                for (const step in langInstructions) {
                    const stepData = langInstructions[step];
                    if (stepData.images && Array.isArray(stepData.images)) {
                        stepData.images.forEach((image) => {
                            if (typeof image === "string" && !image.startsWith("file://")) {
                                imagesToDelete.push(image);
                            }
                        });
                    }
                }
            }
        }

        // 3. Удаляем изображения из Cloudinary
        for (const image of imagesToDelete) {
            const deleteResult = await deleteFile(image);
            if (!deleteResult.success) {
                console.error("deleteRecipeFromMyDB: Error deleting image:", deleteResult.msg);
            } else {
                console.log("deleteRecipeFromMyDB: Image deleted successfully:", image);
            }
        }

        // 4. Удаляем запись из Supabase
        const { error: deleteError } = await supabase
            .from("all_recipes_description")
            .delete()
            .eq("id", recipeId);

        if (deleteError) {
            console.error("deleteRecipeFromMyDB: Error deleting recipe:", deleteError);
            return { success: false, msg: "Failed to delete recipe from database" };
        }

        console.log("deleteRecipeFromMyDB: Recipe deleted successfully:", recipeId);
        return { success: true, msg: "Recipe deleted successfully" };
    } catch (error) {
        console.error("deleteRecipeFromMyDB: Error:", error);
        return { success: false, msg: error.message || "An unexpected error occurred" };
    }
};



/**
 * Удаляет рецепт из базы данных Supabase и связанные изображения из Cloudinary
 * @param {string} recipeId - ID рецепта
 * @returns {Promise<{success: boolean, msg?: string, logs?: string[]}>} - Результат удаления с логами
 */
// export const deleteRecipeFromMyDB = async (recipeId) => {
//     console.log("deleteRecipeFromMyDB: Deleting recipe with ID:", recipeId);
//     const logs = []; // Собираем все логи для возврата
//
//     try {
//         // 1. Получаем данные рецепта, чтобы найти все изображения
//         const { data: recipe, error: fetchError } = await supabase
//             .from("all_recipes_description")
//             .select("image_header, instructions")
//             .eq("id", recipeId)
//             .single();
//
//         if (fetchError) {
//             console.error("deleteRecipeFromMyDB: Error fetching recipe:", fetchError);
//             logs.push(`Error fetching recipe: ${fetchError.message}`);
//             return { success: false, msg: "Failed to fetch recipe for deletion", logs };
//         }
//
//         if (!recipe) {
//             logs.push("Recipe not found");
//             return { success: false, msg: "Recipe not found", logs };
//         }
//
//         // 2. Собираем все изображения для удаления
//         const imagesToDelete = [];
//         if (recipe.image_header) {
//             imagesToDelete.push(recipe.image_header);
//         }
//
//         if (recipe.instructions && recipe.instructions.lang) {
//             for (const lang in recipe.instructions.lang) {
//                 const langInstructions = recipe.instructions.lang[lang];
//                 for (const step in langInstructions) {
//                     const stepData = langInstructions[step];
//                     if (stepData.images && Array.isArray(stepData.images)) {
//                         stepData.images.forEach((image) => {
//                             if (typeof image === "string" && !image.startsWith("file://")) {
//                                 imagesToDelete.push(image);
//                             }
//                         });
//                     }
//                 }
//             }
//         }
//
//         logs.push(`Found ${imagesToDelete.length} images to delete: ${imagesToDelete.join(", ")}`);
//
//         // 3. Удаляем изображения из Cloudinary
//         let allImagesDeleted = true;
//         for (const image of imagesToDelete) {
//             const deleteResult = await deleteFile(image);
//             logs.push(...deleteResult.logs); // Добавляем логи от deleteFile
//
//             if (!deleteResult.success) {
//                 console.error("deleteRecipeFromMyDB: Error deleting image:", image, deleteResult.msg);
//                 allImagesDeleted = false;
//                 logs.push(`Failed to delete image ${image}: ${deleteResult.msg}`);
//             } else {
//                 console.log("deleteRecipeFromMyDB: Image deleted successfully:", image);
//                 logs.push(`Image deleted successfully: ${image}`);
//             }
//         }
//
//         // 4. Удаляем запись из Supabase только если все изображения удалены (опционально)
//         if (!allImagesDeleted) {
//             logs.push("Some images failed to delete, aborting recipe deletion");
//             return { success: false, msg: "Some images failed to delete", logs };
//         }
//
//         const { error: deleteError } = await supabase
//             .from("all_recipes_description")
//             .delete()
//             .eq("id", recipeId);
//
//         if (deleteError) {
//             console.error("deleteRecipeFromMyDB: Error deleting recipe:", deleteError);
//             logs.push(`Error deleting recipe: ${deleteError.message}`);
//             return { success: false, msg: "Failed to delete recipe from database", logs };
//         }
//
//         console.log("deleteRecipeFromMyDB: Recipe deleted successfully:", recipeId);
//         logs.push(`Recipe deleted successfully: ${recipeId}`);
//         return { success: true, msg: "Recipe deleted successfully", logs };
//
//     } catch (error) {
//         console.error("deleteRecipeFromMyDB: Unexpected error:", error);
//         logs.push(`Unexpected error: ${error.message}`);
//         return { success: false, msg: error.message || "An unexpected error occurred", logs };
//     }
// };