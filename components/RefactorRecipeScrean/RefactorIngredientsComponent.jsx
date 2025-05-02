import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlusIcon, TrashIcon } from "react-native-heroicons/outline";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import TitleDescriptionComponent from "../CreateRecipeScreen/TitleDescriptionComponent";
import ModalEditComponent from "./ModalEditComponent";
import RefactorAddIngredientModal from "./RefactorAddIngredientModal";
import { useAuth } from "../../contexts/AuthContext";
import { themes } from "../../constants/themes";

const RefactorIngredientsComponent = ({ langApp, ingredients, updateIngredients, iconRefactor, measurement }) => {
	// console.log("RefactorIngredientsComponent handleSave ingredients", Object.keys(ingredients.lang));
	// console.log("RefactorIngredientsComponent handleSave ingredients", JSON.stringify(ingredients, null));

	const [newIngredient, setNewIngredient] = useState("");
	const { currentTheme } = useAuth();
	//
	const [modalVisible, setModalVisible] = useState(false);

	const [selectedIngredient, setSelectedIngredient] = useState(null);

	const [selectedIndex, setSelectedIndex] = useState(null);

	const [addModalVisible, setAddModalVisible] = useState(false);

	const [quontityLang, setQuontityLang] = useState([]);
	useEffect(() => {
		setQuontityLang(Object.keys(ingredients.lang));
	}, []);

	const refactorIngredient = (ingredient, index) => {
		// console.log("Refactor ingredient:", ingredient);
		setSelectedIngredient(ingredient);
		setSelectedIndex(index);

		setModalVisible(true);
	};

	const handleAddNewIngredient = () => {
		setAddModalVisible(true);
	};

	// // Функция валидации ингредиентов
	// const validateIngredientData = (ingredientsByLang, quantity, unit, quontityLang) => {
	// 	const isQuantityValid = quantity !== "" && parseFloat(quantity) > 0; // Проверяем, что quantity не пустое и больше 0
	// 	const isUnitValid = unit !== ""; // Проверяем, что unit не пустое
	// 	const areIngredientsValid = quontityLang.every(
	// 		(langItem) => ingredientsByLang[langItem]?.ingredient?.trim() !== ""
	// 	); // Проверяем, что все ингредиенты заполнены

	// 	if (!isQuantityValid || !isUnitValid || !areIngredientsValid) {
	// 		Alert.alert(
	// 			i18n.t("Attention"),
	// 			`${i18n.t("Please fill in all fields")} : ${i18n.t("ingredient name, quantity, and unit")}`
	// 		);
	// 		return false;
	// 	}
	// 	return true;
	// };
	// Функция валидации ингредиентов
	const validateIngredientData = (data, quontityLang) => {
		// Если это объект с несколькими языками (для добавления)
		if (typeof data === "object" && !("ingredient" in data)) {
			const isQuantityValid =
				data[quontityLang[0]]?.quantity !== "" && parseFloat(data[quontityLang[0]]?.quantity) > 0;
			const isUnitValid = data[quontityLang[0]]?.unit !== "";
			const areIngredientsValid = quontityLang.every((langItem) => data[langItem]?.ingredient?.trim() !== "");

			if (!isQuantityValid || !isUnitValid || !areIngredientsValid) {
				Alert.alert(
					i18n.t("Attention"),
					`${i18n.t("Please fill in all fields")} : ${i18n.t("ingredient name, quantity, and unit")}`,
				);
				return false;
			}
			return true;
		}

		// Если это объект одного ингредиента (для редактирования)
		if ("ingredient" in data) {
			const isQuantityValid = data.quantity !== "" && parseFloat(data.quantity) > 0;
			const isUnitValid = data.unit !== "";
			const isIngredientValid = data.ingredient.trim() !== "";

			if (!isQuantityValid || !isUnitValid || !isIngredientValid) {
				Alert.alert(
					i18n.t("Attention"),
					`${i18n.t("Please fill in all fields")} : ${i18n.t("ingredient name, quantity, and unit")}`,
				);
				return false;
			}
			return true;
		}

		return false; // На случай некорректных данных
	};
	// const handleSave = (updatedData, lang) => {
	// 	// Обновляем ингредиенты через переданную функцию updateIngredients
	// 	// console.log("RefactorIngredientsComponent handleSave updatedData", updatedData);
	// 	// console.log("RefactorIngredientsComponent handleSave lang", lang);
	// 	// console.log("RefactorIngredientsComponent handleSave ingredients", JSON.stringify(ingredients, null));

	// 	// Обновляем ингредиенты, заменяя объект на selectedIndex новым updatedData
	// 	const updatedIngredients = {
	// 		...ingredients,
	// 		lang: {
	// 			...ingredients.lang,
	// 			[lang]: ingredients.lang[lang].map((item, idx) => (idx === selectedIndex ? updatedData : item)),
	// 		},
	// 	};

	// 	// Передаем обновленные ингредиенты в updateIngredients
	// 	updateIngredients(updatedIngredients, lang);
	// 	setModalVisible(false);
	// };

	const handleSave = (updatedData, lang) => {
		const updatedIngredients = {
			...ingredients,
			lang: {
				...ingredients.lang,
				[lang]: ingredients.lang[lang].map((item, idx) => (idx === selectedIndex ? updatedData : item)),
			},
		};

		// Передаем обновленные ингредиенты в updateIngredients
		updateIngredients(updatedIngredients, lang);
		setModalVisible(false);
	};

	const handleAddSave = (updatedData) => {
		const updatedIngredients = { ...ingredients };
		for (const language of quontityLang) {
			updatedIngredients.lang[language] = updatedIngredients.lang[language] || [];
			updatedIngredients.lang[language].push(
				updatedData[language] || { ingredient: "", quantity: "1", unit: "" },
			);
		}
		updateIngredients(updatedIngredients, langApp);
		setAddModalVisible(false);
	};

	const handleDelete = (index, lang) => {
		const updatedIngredients = {
			...ingredients,
			lang: {
				...ingredients.lang,
				[langApp]: ingredients.lang[langApp].filter((_, idx) => idx !== index),
			},
		};
		updateIngredients(updatedIngredients, lang);
	};

	return (
		<View className="mb-5">
			<TitleDescriptionComponent titleVisual={true} titleText={i18n.t("Ingredients")} />
			<View className="mb-5">
				{ingredients.lang[langApp]?.map((ingredient, index) => (
					<View key={index} className="flex-row gap-x-4 items-center mb-2">
						<View className="flex-1 flex-row flex-wrap gap-x-2">
							<View style={{ height: 20, width: 20 }} className="bg-amber-300 rounded-full" />
							<View className="flex-row flex-1 gap-x-2 items-center">
								<Text
									style={{ fontSize: 16, color: themes[currentTheme]?.secondaryTextColor }}
									className="font-extrabold  max-w-[60%]"
								>
									{ingredient.ingredient}
								</Text>
								<Text
									style={{ fontSize: 16, color: themes[currentTheme]?.secondaryTextColor }}
									className="font-medium "
								>
									- {ingredient.quantity}
								</Text>
								<Text
									style={{ fontSize: 16, color: themes[currentTheme]?.secondaryTextColor }}
									className="font-medium  capitalize"
								>
									{ingredient.unit}
								</Text>
							</View>
						</View>
						{/* Блок рефакторинга */}
						<View className="flex-row gap-x-3">
							<TouchableOpacity
								style={shadowBoxBlack()}
								onPress={() => refactorIngredient(ingredient, index)}
							>
								<ButtonSmallCustom icon={iconRefactor} size={20} tupeButton="refactor" />
							</TouchableOpacity>
						</View>
						{/* Блок удаления */}
						<View className="flex-row gap-x-3">
							<TouchableOpacity style={shadowBoxBlack()} onPress={() => handleDelete(index)}>
								<ButtonSmallCustom icon={TrashIcon} size={20} tupeButton="remove" />
							</TouchableOpacity>
						</View>
					</View>
				))}
			</View>

			{/* New ingredient */}
			<View>
				<TouchableOpacity style={shadowBoxBlack()} onPress={handleAddNewIngredient}>
					<ButtonSmallCustom tupeButton="add" w={"100%"} h={60} icon={PlusIcon} size={40} />
				</TouchableOpacity>
			</View>

			{/* Модальное окно для редактирования ингредиента */}
			<ModalEditComponent
				visible={modalVisible}
				initialData={selectedIngredient} // Передаем весь объект ингредиента
				lang={langApp}
				type="ingredients"
				onSave={handleSave}
				onClose={() => setModalVisible(false)}
				measurement={measurement}
				quontityLang={quontityLang}
				validateIngredientData={validateIngredientData}
			/>
			{/* Modal для добавления */}
			<RefactorAddIngredientModal
				visible={addModalVisible}
				onClose={() => setAddModalVisible(false)}
				onSave={handleAddSave}
				quontityLang={quontityLang}
				measurement={measurement}
				validateIngredientData={validateIngredientData}
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RefactorIngredientsComponent;
