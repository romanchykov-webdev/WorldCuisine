import React, { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { useDebounce } from "../../constants/halperFunctions";

const InputCreateRecipeScreenCustom = ({
	styleInput,
	placeholderText,
	placeholderColor,
	totalLangRecipe,
	setTotalRecipe,
}) => {
	console.log("totalLangRecipe", totalLangRecipe);

	// Инициализируем состояние как объект
	const [inputValues, setInputValues] = useState({});

	// Добавляем дебонсированное значение
	const debouncedInputValue = useDebounce(inputValues, 1000); // 1000мс = 1 секунда

	// Инициализация начальных значений
	useEffect(() => {
		if (totalLangRecipe && totalLangRecipe.length > 0) {
			const initialValues = {};
			totalLangRecipe.forEach((lang) => {
				initialValues[lang] = "";
			});
			setInputValues(initialValues);
		}
	}, [totalLangRecipe]);

	useEffect(() => {
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			area: debouncedInputValue,
		}));
	}, [debouncedInputValue, setTotalRecipe]);

	// Обработчик изменения значения для конкретного языка
	const handleInputChange = (value, lang) => {
		setInputValues((prevValues) => ({
			...prevValues,
			[lang]: value,
		}));

		// setTotalRecipe((prevRecipe) => ({
		// 	...prevRecipe,
		// 	area: inputValues,
		// }));
	};

	console.log("inputValues", inputValues);

	return (
		<View className="mb-2">
			{totalLangRecipe?.map((lang, index) => (
				<View key={index} className="mb-3">
					<TextInput
						// className="bg-red-500"
						value={inputValues[lang]}
						style={styleInput}
						onChangeText={(value) => handleInputChange(value, lang)}
						placeholder={`${placeholderText} ${lang}`}
						placeholderTextColor={placeholderColor}
					/>
				</View>
			))}
		</View>
	);
};

export default InputCreateRecipeScreenCustom;
