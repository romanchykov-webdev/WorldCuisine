import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { PlusIcon, ScaleIcon } from "react-native-heroicons/mini";
import { shadowBoxBlack } from "../../../constants/shadow";
import ButtonSmallCustom from "../../Buttons/ButtonSmallCustom";
import ModalCustom from "../../ModalCustom";
import StərɪskCustomComponent from "../../StərɪskCustomComponent";
import ListIngredientsCreateRecipe from "./ListIngredientsCreateRecipe";

//import my hook
import { useDebounce } from "../../../constants/halperFunctions";
import i18n from "../../../lang/i18n";
import TitleDescriptionComponent from "../TitleDescriptionComponent";
import {themes} from "../../../constants/themes";
import {useAuth} from "../../../contexts/AuthContext";

const IngredientsCreateRecipe = ({
	styleInput,
	placeholderText,
	placeholderColor,
	langApp,
	measurement,
	totalLangRecipe,
	setTotalRecipe,
	// refactorRecipe = null, // По умолчанию пустой объект если это создание нового рецепта
}) => {

	const{currentTheme}=useAuth()
	// console.log("measurement",measurement)
	// console.log(totalLangRecipe)
	// console.log(refactorRecipe);
	const [isModalVisible, setIsModalVisible] = useState(false);

	// массив по ключу
	const [measurementLangApp, setMeasurementLangApp] = useState([]);
	// console.log(measurementLangApp)

	// const [ingredients, setIngredients] = useState([]);
	const [ingredients, setIngredients] = useState({ lang: {} }); // Новая структура Начальное состояние

	// console.log("IngredientsCreateRecipe totalLangRecipe ", totalLangRecipe?.length);
	// console.log("IngredientsCreateRecipe ingredients ", ingredients);
	// console.log("IngredientsCreateRecipe ingredients ", Object.keys(ingredients?.lang).length);

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

	// Синхронизация ingredients с refactorRecipe при загрузке или изменении
	// useEffect(() => {
	// 	if (refactorRecipe) {
	// 		// Если переданы данные редактирования, используем их
	// 		// console.log("refactorRecipe", refactorRecipe);

	// 		setIngredients(refactorRecipe);
	// 		console.log("IngredientsCreateRecipe useEfect refactorRecipe not null ", refactorRecipe);
	// 	} else {
	// 		// Если это создание нового рецепта, инициализируем пустую структуру для всех языков
	// 		setIngredients({
	// 			lang: totalLangRecipe.reduce((acc, lang) => ({ ...acc, [lang]: [] }), {}),
	// 		});
	// 		console.log("IngredientsCreateRecipe useEfect refactorRecipe  null ", refactorRecipe);
	// 	}
	// }, [refactorRecipe, totalLangRecipe]);

	const [ingredient, setIngredient] = useState({
		unit: totalLangRecipe.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
		quantity: "1", // Изменено на строку для соответствия желаемой структуре
		ingredient: totalLangRecipe.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
	});

	const debouncedValue = useDebounce(ingredients, 1000);

	// Обновление единиц измерения для текущего языка
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
		if (Object.values(ingredient.ingredient).some((u) => u.trim() === "")) {
			Alert.alert(`${i18n.t("You forgot")}!`, `${i18n.t("Write the name of the ingredient")}`);
			return;
		}
		if (Object.values(ingredient.quantity).some((q) => q.trim() === "")) {
			Alert.alert(`${i18n.t("You forgot")}!`, `${i18n.t("Choose the quantity of the ingredient")}`);
			return;
		}
		if (Object.values(ingredient.unit).some((u) => u.trim() === "")) {
			Alert.alert(`${i18n.t("You forgot")}!`, `${i18n.t("Select the measurement unit for the ingredient")}`);
			return;
		}

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
			unit: totalLangRecipe.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
			quantity: "1",
			ingredient: totalLangRecipe.reduce((acc, lang) => ({ ...acc, [lang]: "" }), {}),
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

	useEffect(() => {
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			ingredients: debouncedValue,
		}));
	}, [debouncedValue]);

	return (
		<View>
			<TitleDescriptionComponent
				titleVisual={true}
				titleText={i18n.t("Ingredients")}
				descriptionVisual={true}
				descriptionText={i18n.t("Add all the ingredients and their quantities to prepare the recipe")}
			/>
			{/* {refactorRecipe ? (
				<View>
					<ListIngredientsCreateRecipe
						ingredients={ingredients}
						setIngredients={setIngredients}
						totalLangRecipe={totalLangRecipe}
					/>
				</View>
			) : (
				Object.keys(ingredients.lang).length > 0 && (
					<View>
						<ListIngredientsCreateRecipe
							ingredients={ingredients}
							setIngredients={setIngredients}
							totalLangRecipe={totalLangRecipe}
						/>
					</View>
				)
			)} */}
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
									handleChange={(value) => handleInputChange(lang, value)}
									currentTheme={currentTheme}
								/>
							</View>
						);
					})}
				</View>

				<View className="flex-row gap-x-2">
					<TouchableOpacity onPress={() => setIsModalVisible(true)} style={shadowBoxBlack()}>
						<ButtonSmallCustom w={60} h={60} icon={ScaleIcon} size={20} tupeButton="refactor" />
					</TouchableOpacity>

					<TouchableOpacity style={shadowBoxBlack()} onPress={addIngredient}>
						<ButtonSmallCustom w={60} h={60} icon={PlusIcon} size={20} tupeButton="add" />
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

export const InputCustom = ({ styleInput, placeholderText, placeholderColor, handleChange, value,currentTheme }) => {
	return (
		<TextInput
			style={[styleInput,{color:themes[currentTheme]?.textColor}]}
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
