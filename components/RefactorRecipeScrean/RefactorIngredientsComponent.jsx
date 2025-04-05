import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/outline";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import TitleDescriptionComponent from "../CreateRecipeScreen/TitleDescriptionComponent";
import ModalEditComponent from "./ModalEditComponent";

const RefactorIngredientsComponent = ({ langApp, ingredients, updateIngredients, iconRefactor, measurement }) => {
	//
	const [modalVisible, setModalVisible] = useState(false);

	const [selectedIngredient, setSelectedIngredient] = useState(null);

	const [selectedIndex, setSelectedIndex] = useState(null);

	const refactorIngredient = (ingredient, index) => {
		console.log("Refactor ingredient:", ingredient);
		setSelectedIngredient(ingredient);
		setSelectedIndex(index);
		setModalVisible(true);
	};

	const handleSave = (updatedData, lang) => {
		// Обновляем ингредиенты через переданную функцию updateIngredients
		// console.log("RefactorIngredientsComponent handleSave updatedData", updatedData);
		// console.log("RefactorIngredientsComponent handleSave lang", lang);
		// console.log("RefactorIngredientsComponent handleSave ingredients", JSON.stringify(ingredients, null));

		// Обновляем ингредиенты, заменяя объект на selectedIndex новым updatedData
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
			<View>
				{ingredients.lang[langApp]?.map((ingredient, index) => (
					<View key={index} className="flex-row gap-x-4 items-center mb-2">
						<View className="flex-1 flex-row flex-wrap gap-x-2">
							<View style={{ height: 20, width: 20 }} className="bg-amber-300 rounded-full" />
							<View className="flex-row flex-1 gap-x-2 items-center">
								<Text style={{ fontSize: 16 }} className="font-extrabold text-neutral-700 max-w-[60%]">
									{ingredient.ingredient}
								</Text>
								<Text style={{ fontSize: 16 }} className="font-medium text-neutral-600">
									- {ingredient.quantity}
								</Text>
								<Text style={{ fontSize: 16 }} className="font-medium text-neutral-600 capitalize">
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
								<ButtonSmallCustom icon={iconRefactor} size={20} bg="#EF4444" />
							</TouchableOpacity>
						</View>
						{/* Блок удаления */}
						<View className="flex-row gap-x-3">
							<TouchableOpacity style={shadowBoxBlack()} onPress={() => handleDelete(index)}>
								<ButtonSmallCustom icon={TrashIcon} size={20} bg="#EF4444" />
							</TouchableOpacity>
						</View>
					</View>
				))}
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
			/>
		</View>
	);
};

const styles = StyleSheet.create({});

export default RefactorIngredientsComponent;
