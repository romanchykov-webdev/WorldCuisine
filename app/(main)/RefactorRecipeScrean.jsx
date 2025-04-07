import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PencilSquareIcon } from "react-native-heroicons/outline";
import HeaderScreanComponent from "../../components/HeaderScreanComponent";
import WrapperComponent from "../../components/WrapperComponent";
import { getMeasurementCreateRecipeMyDB, getRecipesDescriptionMyDB } from "../../service/getDataFromDB";

import ButtonSmallCustom from "../../components/Buttons/ButtonSmallCustom";
import SelectCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom";
import LoadingComponent from "../../components/loadingComponent";
import SelectLangComponent from "../../components/recipeDetails/SelectLangComponent";
import RefactorAreaComponent from "../../components/RefactorRecipeScrean/RefactorAreaComponent";
import RefactorDescriptionRecipe from "../../components/RefactorRecipeScrean/RefactorDescriptionRecipe";
import RefactorImageHeader from "../../components/RefactorRecipeScrean/RefactorImageHeader";
import RefactorIngredientsComponent from "../../components/RefactorRecipeScrean/RefactorIngredientsComponent";
import RefactorTagsComponent from "../../components/RefactorRecipeScrean/RefactorTagsComponent";
import RefactorTitle from "../../components/RefactorRecipeScrean/RefactorTitle";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import { updateRecipeToTheServer } from "../../service/uploadDataToTheDB";

// Функция для глубокого сравнения двух значений
const areEqual = (a, b) => {
	// Если это один и тот же объект или оба undefined/null
	if (a === b) return true;

	// Если один из них null или undefined, а другой нет
	if (a == null || b == null) return false;

	// Если это массивы
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		return a.every((item, index) => areEqual(item, b[index]));
	}

	// Если это объекты
	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b);
		if (keysA.length !== keysB.length) return false;
		return keysA.every((key) => areEqual(a[key], b[key]));
	}

	// Для примитивных типов
	return a === b;
};

const RefactorRecipeScrean = () => {
	const router = useRouter();

	const { user } = useAuth();

	const [langApp, setLangApp] = useState(user?.lang);

	const [loading, setLoading] = useState(true);

	const [recipeDish, setRecipeDish] = useState(null);
	// console.log("",JSON.stringify(recipeDish,null));

	const [originalRecipe, setOriginalRecipe] = useState(null); // Исходный рецепт

	const params = useLocalSearchParams();

	// Инициализируем totalLangRecipe с текущим языком
	const [totalLangRecipe, setTotalLangRecipe] = useState([langApp]);

	// console.log(params);
	const { recipe_id, isRefactorRecipe } = params;

	// console.log("RefactorRecipeScrean recipe_id", recipe_id);
	// console.log("RefactorRecipeScrean isRefactorRecipe", isRefactorRecipe);
	// console.log("RefactorRecipeScrean isRefactorRecipe", isRefactorRecipe);

	const fetchGetRecipeForRefactoring = async (id) => {
		try {
			const res = await getRecipesDescriptionMyDB(id);
			//
			if (res.success && res.data.length > 0) {
				setRecipeDish(res.data[0]);

				// setOriginalRecipe(res.data[0]); // Сохраняем исходный рецепт
				setOriginalRecipe(JSON.parse(JSON.stringify(res.data[0]))); // Глубокая копия
				// console.log("RefactorRecipeScrean res.data[0]", JSON.stringify(res.data[0], null));

				// Обновляем totalLangRecipe, добавляя все языки из ingredients
				const ingredientLangs = res.data[0]?.ingredients?.lang ? Object.keys(res.data[0].ingredients.lang) : [];
				const uniqueLangs = [...new Set([langApp, ...ingredientLangs])];
				setTotalLangRecipe(uniqueLangs);
			} else {
				Alert.alert("Error", "Recipe not found");
			}
		} catch (error) {
			console.error("Error loading recipe:", error);
			Alert.alert("Error", "Failed to load recipe");
		} finally {
			setTimeout(() => {
				setLoading(false);
			}, 500);
		}
	};

	const [measurement, setMeasurement] = useState([]);

	// get all
	const fetchMeasurement = async () => {
		const res = await getMeasurementCreateRecipeMyDB();
		// console.log(res.data);
		setMeasurement(res.data[0].lang);
	};

	useEffect(() => {
		if (recipe_id && isRefactorRecipe) {
			setLoading(true);
			fetchGetRecipeForRefactoring(recipe_id);
			fetchMeasurement();
		} else {
			setLoading(false);
		}
	}, [recipe_id, isRefactorRecipe]);

	/*
    *  надо создать микс createRecipe Screan c recipedetailsscrean
     чтобы нидит как деталь рецепта но свозможностью редактировать тоесть стиреть или изменить
    
    */

	const handleLangChange = (lang) => {
		console.log("RefactorRecipeScrean handleLangChange lang", lang);

		setLangApp(lang);
	};
	// console.log("RefactorRecipeScrean recipeDish?.area", recipeDish?.area);

	// update image header
	const handleImageUpdate = (newImage) => {
		setRecipeDish((prev) => ({ ...prev, image_header: newImage }));
		// console.log("handleImageUpdate recipeDish.image_header", recipeDish.image_header);
	};

	// update header title
	const updateHeaderTitle = async (newTitle, lang) => {
		setRecipeDish((prev) => {
			const updatedDish = { ...prev };

			// Находим индекс записи для указанного языка
			const langIndex = updatedDish.title.lang.findIndex((item) => item.lang === lang);

			// Если язык существует, обновляем его; если нет, добавляем новый
			if (langIndex !== -1) {
				updatedDish.title.lang[langIndex] = {
					...updatedDish.title.lang[langIndex],
					name: newTitle,
				};
			} else {
				updatedDish.title.lang.push({
					lang: lang,
					name: newTitle,
				});
			}

			// Обновляем strTitle, если изменяется английский язык
			if (lang === "en") {
				updatedDish.title.strTitle = newTitle;
			}
			// console.log("RefactorRecipeScrean updateHeaderTitle updatedDish", JSON.stringify(updatedDish, null, 2));
			return updatedDish;
		});

		// console.log("Обновленный заголовок:", newTitle, "для языка:", lang);
	};
	// update area text
	const updateAreaText = async (text, lang) => {
		setRecipeDish((prev) => ({
			...prev,
			area: { ...prev.area, [lang]: text },
		}));
	};

	// update tags
	const updateTags = async (newTags) => {
		setRecipeDish((prev) => ({
			...prev,
			tags: newTags,
		}));
	};

	// изменения ингредиентов
	// const updateIngredients = (newIngredients) => {
	// 	console.log("RefactorRecipeScrean updateIngredients", newIngredients);
	// 	setRecipeDish((prev) => ({
	// 		...prev,
	// 		ingredients: newIngredients,
	// 	}));
	// };
	const updateIngredients = (updatedData, lang) => {
		// console.log("RefactorRecipeScrean updatedData", updatedData);
		// console.log("RefactorRecipeScrean lang", lang);
		console.log("RefactorRecipeScrean recipeDish.ingredients", JSON.stringify(recipeDish.ingredients, null));
		setRecipeDish((prev) => ({
			...prev,
			ingredients: updatedData,
		}));
	};

	const onUpdateDescription = (updateDescription) => {
		setRecipeDish((prev) => ({
			...prev,
			instructions: updateDescription,
		}));
	};

	// Функция для получения измененных полей
	// const getChangedFields = async () => {
	// 	const changedFields = {};
	// 	// console.log("recipeDish before comparison:", JSON.stringify(recipeDish, null, 2));
	// 	// console.log("originalRecipe before comparison:", JSON.stringify(originalRecipe, null, 2));

	// 	// Проверяем каждое поле на изменение
	// 	for (const key in recipeDish) {
	// 		if (key === "rating" || key === "likes" || key === "comments") continue; // Пропускаем неизменяемые поля

	// 		if (!areEqual(recipeDish[key], originalRecipe[key])) {
	// 			if (key === "image_header" && recipeDish[key].startsWith("file://")) {
	// 				// Загружаем новое изображение, если это локальный файл
	// 				const headerExtension = recipeDish[key].split(".").pop() || "jpg";
	// 				const cleanCategory = recipeDish.category
	// 					.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "")
	// 					.trim()
	// 					.replaceAll(" ", "_");
	// 				const cleanSubCategory = recipeDish.point
	// 					.replace(recipeDish.category, "")
	// 					.trim()
	// 					.replaceAll(" ", "_")
	// 					.replace(/[^a-zA-Z0-9а-яА-ЯёЁ _-]/g, "");
	// 				const folderName = `${new Date().toISOString().replace(/[^0-9]/g, "")}_${recipeDish.published_id}`;
	// 				const headerPath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${folderName}/header.${headerExtension}`;
	// 				const imageRes = await uploadFile(headerPath, recipeDish[key], true);
	// 				if (imageRes.success) {
	// 					changedFields[key] = imageRes.data; // Сохраняем путь
	// 				} else {
	// 					throw new Error(`Failed to upload image_header: ${imageRes.msg}`);
	// 				}
	// 			} else {
	// 				changedFields[key] = recipeDish[key];
	// 			}
	// 		}
	// 	}

	// 	return changedFields;
	// };

	// Функция для получения изменённых полей
	const getChangedFields = () => {
		const changedFields = {};

		for (const key in recipeDish) {
			if (key === "rating" || key === "likes" || key === "comments") continue;

			if (!areEqual(recipeDish[key], originalRecipe[key])) {
				changedFields[key] = recipeDish[key];
			}
		}

		return changedFields;
	};

	// save refactor recipe
	// const saveRefactor = async () => {
	// 	try {
	// 		setLoading(true);

	// 		// Валидация полной структуры рецепта
	// 		//   const validationResult = validateRecipeStructure(recipeDish);
	// 		//   if (!validationResult.isValid) {
	// 		// 	Alert.alert("Ошибка валидации", validationResult.message);
	// 		// 	return;
	// 		//   }

	// 		// Получаем только измененные поля
	// 		const changedFields = await getChangedFields();
	// 		// console.log("Changed fields:", JSON.stringify(changedFields, null, 2));

	// 		if (Object.keys(changedFields).length === 0) {
	// 			Alert.alert("Информация", "Ничего не изменено");
	// 			return;
	// 		}

	// 		// Отправляем только измененные поля
	// 		const response = await updateRecipeMyDB({ id: recipeDish.id, ...changedFields });
	// 		if (response.success) {
	// 			// Обновляем исходный рецепт после успешного сохранения
	// 			setOriginalRecipe({ ...recipeDish });
	// 			Alert.alert("Успех", "Рецепт успешно сохранен!");
	// 		} else {
	// 			throw new Error(response.msg || "Ошибка при сохранении рецепта");
	// 		}

	// 		// паосле сохранения переходим на экран рецепта
	// 		router.replace({
	// 			pathname: "RecipeDetailsScreen",
	// 			params: { id: recipeDish.id },
	// 		});
	// 	} catch (error) {
	// 		console.error("Ошибка при сохранении:", error);
	// 		Alert.alert("Ошибка", error.message || "Не удалось сохранить рецепт");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	const saveRefactor = async () => {
		try {
			setLoading(true);

			// Получаем изменённые поля
			const changedFields = getChangedFields();
			console.log("saveRefactor: Changed fields:", JSON.stringify(changedFields, null, 2));

			if (Object.keys(changedFields).length === 0) {
				Alert.alert("Информация", "Ничего не изменено");
				return;
			}

			// Отправляем только изменённые поля
			const response = await updateRecipeToTheServer(recipeDish.id, changedFields);
			if (response.success) {
				setOriginalRecipe(response.data); // Обновляем исходный рецепт
				setRecipeDish(response.data); // Обновляем текущий рецепт
				Alert.alert("Успех", "Рецепт успешно сохранен!");
				router.replace({
					pathname: "RecipeDetailsScreen",
					params: { id: recipeDish.id },
				});
			} else {
				throw new Error(response.msg || "Ошибка при сохранении рецепта");
			}
		} catch (error) {
			console.error("saveRefactor: Error:", error);
			Alert.alert("Ошибка", error.message || "Не удалось сохранить рецепт");
		} finally {
			setLoading(false);
		}
	};

	// Пока данные загружаются, показываем только индикатор загрузки
	if (loading) {
		return (
			<WrapperComponent>
				<LoadingComponent />
			</WrapperComponent>
		);
	}

	// Если данные не загрузились или отсутствуют
	if (!recipeDish) {
		return (
			<WrapperComponent>
				<HeaderScreanComponent titleScreanText={"Refactor Recipe"} />
				<View className="flex-1 justify-center items-center">
					<Text>No recipe data available</Text>
				</View>
			</WrapperComponent>
		);
	}
	// console.log("recipeDish?.ingredients", recipeDish);

	return (
		<WrapperComponent>
			<View className="gap-y-5">
				{/* header */}
				<HeaderScreanComponent titleScreanText={i18n.t("Edit")} />

				{/* section select lang */}
				<SelectLangComponent
					recipeDishArea={recipeDish?.area}
					handleLangChange={handleLangChange}
					langApp={langApp}
				/>

				{/* top image button back and like*/}
				<RefactorImageHeader
					imageUri={recipeDish?.image_header}
					onImageUpdate={handleImageUpdate}
					Icon={PencilSquareIcon}
				/>

				{/*    dish and description*/}
				<RefactorTitle
					title={recipeDish?.title}
					// area={recipeDish?.area}
					langApp={langApp}
					updateHeaderTitle={updateHeaderTitle}
					// updateAreaText={updateAreaText}
					Icon={PencilSquareIcon}
				/>

				{/* refactor Area */}
				<RefactorAreaComponent
					area={recipeDish?.area}
					langApp={langApp}
					updateAreaText={updateAreaText}
					Icon={PencilSquareIcon}
				/>

				{/* tags */}
				<RefactorTagsComponent tags={recipeDish?.tags} updateTags={updateTags} langApp={langApp} />

				{/* block time person cal level */}
				<View className="mb-5">
					<SelectCreateRecipeScreenCustom
						setTotalRecipe={setRecipeDish}
						recipeDish={recipeDish}
						reafctorScrean={true}
					/>
				</View>

				{/*    Ingredients*/}
				<RefactorIngredientsComponent
					langApp={langApp}
					ingredients={recipeDish?.ingredients}
					updateIngredients={updateIngredients}
					iconRefactor={PencilSquareIcon}
					measurement={measurement}
				/>

				{/* descritpion recipe */}
				<RefactorDescriptionRecipe
					descriptionsRecipe={recipeDish?.instructions}
					langApp={langApp}
					Icon={PencilSquareIcon}
					onUpdateDescription={onUpdateDescription}
					recipe={recipeDish}
				/>
				{/* verif reafactor and save */}
				<View className="flex-1 flex-row justify-center mt-10 gap-x-2">
					{/* cancel */}
					<TouchableOpacity style={shadowBoxBlack()} className="flex-1">
						<ButtonSmallCustom buttonText={true} title={i18n.t("Cancel")} w={"100%"} h={60} bg="red" />
					</TouchableOpacity>

					{/* Save */}
					<TouchableOpacity style={shadowBoxBlack()} className="flex-1" onPress={saveRefactor}>
						<ButtonSmallCustom buttonText={true} title={i18n.t("Save")} w={"100%"} h={60} bg="green" />
					</TouchableOpacity>
				</View>
			</View>
		</WrapperComponent>
	);
};

const styles = StyleSheet.create({
	styleInput: {
		fontSize: hp(2),
		flex: 1,
		borderWidth: 1,
		borderColor: "grey",
		padding: 20,
		borderRadius: 15,
	},
});

export default RefactorRecipeScrean;
