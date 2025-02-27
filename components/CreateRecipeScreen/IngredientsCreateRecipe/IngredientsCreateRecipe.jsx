import React, { useEffect, useState } from "react";
import {
	Alert,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { PlusIcon, ScaleIcon } from "react-native-heroicons/mini";
import { shadowBoxBlack } from "../../../constants/shadow";
import ButtonSmallCustom from "../../Buttons/ButtonSmallCustom";
import ModalCustom from "../../ModalCustom";
import StərɪskCustomComponent from "../../StərɪskCustomComponent";
import ListIngredientsCreateRecipe from "./ListIngredientsCreateRecipe";

//import my hook
import { useDebounce } from "../../../constants/halperFunctions";

const IngredientsCreateRecipe = ({
	styleInput,
	placeholderText,
	placeholderColor,
	langApp,
	measurement,
	totalLangRecipe,
	setTotalRecipe,
}) => {
	// console.log("measurement",measurement)
	// console.log(totalLangRecipe)
	const [isModalVisible, setIsModalVisible] = useState(false);

	// массив по ключу
	const [measurementLangApp, setMeasurementLangApp] = useState([]);
	// console.log(measurementLangApp)

	// const [ingredients, setIngredients] = useState([]);
	const [ingredients, setIngredients] = useState({ lang: {} }); // Новая структура

	// const [ingredient, setIngredient] = useState({
	// 	unit: totalLangRecipe.reduce(
	// 		(acc, lang) => ({ ...acc, [lang]: "" }),
	// 		{}
	// 	),
	// 	quantity: 1,
	// 	ingredient: totalLangRecipe.reduce(
	// 		(acc, lang) => ({ ...acc, [lang]: "" }),
	// 		{}
	// 	),
	// 	// "ingredient": []
	// 	// "ingredient": Array(totalLangRecipe.length).fill('') // Инициализируем пустыми строками
	// });

	const [ingredient, setIngredient] = useState({
		unit: totalLangRecipe.reduce(
			(acc, lang) => ({ ...acc, [lang]: "" }),
			{}
		),
		quantity: "1", // Изменено на строку для соответствия желаемой структуре
		ingredient: totalLangRecipe.reduce(
			(acc, lang) => ({ ...acc, [lang]: "" }),
			{}
		),
	});

	const debouncedValue = useDebounce(ingredients, 1000);

	useEffect(() => {
		if (measurement[langApp]) {
			setMeasurementLangApp(
				Object.entries(measurement[langApp]).map(([key, val]) => ({
					key,
					val,
				}))
			);
		}
	}, [measurement, langApp]);

	const addIngredient = () => {
		// Проверяем, заполнены ли все поля
		// if (
		// 	Object.values(ingredient.unit).some((u) => u.trim() === "") ||
		// 	Object.values(ingredient.ingredient).some((i) => i.trim() === "")
		// ) {
		// 	Alert.alert(
		// 		"Вы забыли!",
		// 		"Написать название ингредиента или выбрать его количество или измерение."
		// 	);
		// 	return;
		// }
		if (Object.values(ingredient.ingredient).some((u) => u.trim() === "")) {
			Alert.alert("Вы забыли!", "Написать название ингредиента.");
			return;
		}
		if (Object.values(ingredient.quantity).some((q) => q.trim() === "")) {
			Alert.alert("Вы забыли!", "Выбрать количество ингредиента.");
			return;
		}
		if (Object.values(ingredient.unit).some((u) => u.trim() === "")) {
			Alert.alert("Вы забыли!", "Выбрать меру измерение ингредиента.");
			return;
		}

		// Добавляем новый ингредиент в массив ingredients
		// setIngredients((prev) => [
		// 	...prev,
		// 	{
		// 		ingredient: { ...ingredient.ingredient },
		// 		quantity: ingredient.quantity,
		// 		unit: { ...ingredient.unit }, // Добавляем unit с переводами
		// 	},
		// ]);
		// Добавляем ингредиент в новую структуру
		setIngredients((prev) => {
			const newLang = { ...prev.lang };

			totalLangRecipe.forEach((lang) => {
				if (!newLang[lang]) {
					newLang[lang] = [];
				}
				newLang[lang].push({
					unit: ingredient.unit[lang],
					quantity: ingredient.quantity.toString(), // Убедимся, что это строка
					ingredient: ingredient.ingredient[lang],
				});
			});

			return { lang: newLang };
		});

		// Сбрасываем состояние для нового ингредиента
		// setIngredient({
		// 	unit: totalLangRecipe.reduce(
		// 		(acc, lang) => ({ ...acc, [lang]: "" }),
		// 		{}
		// 	),
		// 	quantity: 1,
		// 	ingredient: totalLangRecipe.reduce(
		// 		(acc, lang) => ({ ...acc, [lang]: "" }),
		// 		{}
		// 	),
		// });

		// Сбрасываем состояние для нового ингредиента
		setIngredient({
			unit: totalLangRecipe.reduce(
				(acc, lang) => ({ ...acc, [lang]: "" }),
				{}
			),
			quantity: "1",
			ingredient: totalLangRecipe.reduce(
				(acc, lang) => ({ ...acc, [lang]: "" }),
				{}
			),
		});
	};

	const handleInputChange = (lang, value) => {
		setIngredient((prev) => {
			return {
				...prev,
				ingredient: {
					...prev.ingredient,
					[lang]: value, // Обновляем конкретный язык
				},
			};
		});
	};

	const handleSelectUnit = (key) => {
		// setIngredient((prev) => ({...prev, unit: key}));
		// setIsModalVisible(false);
		const updatedUnit = totalLangRecipe.reduce((acc, lang) => {
			acc[lang] = measurement[lang][key] || ""; // Добавляем перевод для каждого языка
			return acc;
		}, {});

		setIngredient((prev) => ({ ...prev, unit: updatedUnit }));
		setIsModalVisible(false);
		// console.log(setIngredient)
	};

	// useEffect(() => {
	// 	// console.log('Current Ingredient:', ingredient); // Для проверки значений
	// 	// console.log('Current Ingredients:', ingredients); // Для проверки значений
	// }, [ingredient, ingredients]);

	useEffect(() => {
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			ingredients: debouncedValue,
		}));
	}, [debouncedValue]);

	return (
		<View>
			{/*block visual ingredients*/}
			{/* {ingredients.length > 0 && ( */}
			{/* Отображение ингредиентов */}
			{Object.keys(ingredients.lang).length > 0 && (
				<View>
					<ListIngredientsCreateRecipe
						ingredients={ingredients}
						setIngredients={setIngredients}
						totalLangRecipe={totalLangRecipe}
					/>
				</View>
			)}

			<View className=" flex-row items-center gap-x-2 ">
				<View className="flex-1 gap-y-2">
					{totalLangRecipe.map((lang, index) => {
						// console.log("lang", lang);
						return (
							<View key={index}>
								<StərɪskCustomComponent />
								<InputCustom
									styleInput={styleInput}
									placeholderText={`${placeholderText} ${lang}`}
									placeholderColor={placeholderColor}
									value={ingredient.ingredient[lang] || ""}
									handleChange={(value) =>
										handleInputChange(lang, value)
									}
								/>
							</View>
						);
					})}
				</View>

				<View className="flex-row gap-x-2">
					<TouchableOpacity
						onPress={() => setIsModalVisible(true)}
						style={shadowBoxBlack()}
					>
						<ButtonSmallCustom
							w={60}
							h={60}
							icon={ScaleIcon}
							size={20}
							bg="#8B5CF6"
						/>
					</TouchableOpacity>

					<TouchableOpacity
						style={shadowBoxBlack()}
						onPress={addIngredient}
					>
						<ButtonSmallCustom
							w={60}
							h={60}
							icon={PlusIcon}
							size={20}
							bg="#22C55E"
						/>
					</TouchableOpacity>
				</View>
			</View>

			{/* Модальное окно */}
			<ModalCustom
				isModalVisible={isModalVisible}
				setIsModalVisible={setIsModalVisible}
				animationType="fade"
				ingredient={ingredient}
				setIngredient={setIngredient}
				array={measurementLangApp}
				onPressHandler={handleSelectUnit}
			/>
		</View>
	);
};

export const InputCustom = ({
	styleInput,
	placeholderText,
	placeholderColor,
	handleChange,
	value,
}) => {
	return (
		<TextInput
			style={styleInput}
			onChangeText={handleChange}
			value={value}
			placeholder={placeholderText}
			placeholderTextColor={placeholderColor}
			// className="mb-2"
			// className="flex-1 border-2 border-neutral-200 p-3 rounded-[5] h-[40px]"
		/>
	);
};

const styles = StyleSheet.create({});
export default IngredientsCreateRecipe;
