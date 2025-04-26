import {supabase} from "../lib/supabase";
import {deleteFile} from "./imageServices";
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