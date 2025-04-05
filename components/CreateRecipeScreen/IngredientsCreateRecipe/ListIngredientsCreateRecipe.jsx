import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { TrashIcon } from "react-native-heroicons/mini";
import { shadowBoxBlack } from "../../../constants/shadow";
import ButtonSmallCustom from "../../Buttons/ButtonSmallCustom";

const ListIngredientsCreateRecipe = ({ ingredients, setIngredients, totalLangRecipe }) => {
	// console.log("ListIngredientsCreateRecipe ingredients", ingredients)
	// console.log("ListIngredientsCreateRecipe totalLangRecipe", totalLangRecipe)

	const [changeLang, setChangeLang] = useState(totalLangRecipe[0]);

	// const [ingredientForUpdate, setIngredientForUpdate] = useState({})
	//
	// const [isModalVisible, setIsModalVisible] = useState(false);

	const handleChangeLang = (item) => {
		setChangeLang(item);
	};

	// const removeIngredient = (item) => {
	//     // console.log("removeIngredient ingredients",ingredients)
	//     // console.log("----------------")
	//     // console.log("removeIngredient", item)

	//     // Удаляем элемент из массива ingredients
	//     const updatedIngredients = ingredients.filter(ingredient => {
	//         // Сравниваем, чтобы исключить ингредиент с таким же объектом
	//         return ingredient !== item;
	//     });

	//     // Обновляем состояние с новым массивом без удаленного элемента
	//     setIngredients(updatedIngredients);
	// }

	const removeIngredient = (lang, index) => {
		setIngredients((prev) => {
			const newLang = { ...prev.lang };
			newLang[lang] = newLang[lang].filter((_, i) => i !== index);
			return { lang: newLang };
		});
	};

	return (
		<View className="mb-5 ">
			{/* Блок выбора языка */}
			{totalLangRecipe.length > 1 && (
				<View className="mb-2">
					<Text className="mb-2 text-xl text-neutral-700 font-bold">
						Вид на языке
						<Text className="capitalize text-amber-500"> {changeLang}</Text>
					</Text>

					<View className="flex-row flex-wrap gap-x-2 mb-2 items-center justify-around">
						{totalLangRecipe.map((item, index) => {
							return (
								<TouchableOpacity
									style={changeLang === item ? shadowBoxBlack() : null}
									className={`border-[1px] border-neutral-500 rounded-2xl px-5 py-2 ${
										changeLang === item ? `bg-amber-500` : `bg-transparent`
									} `}
									key={index}
									onPress={() => {
										handleChangeLang(item);
									}}
								>
									<Text>{item}</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</View>
			)}
			{/* Список ингредиентов */}
			{/* <View className="">
				{ingredients.map((ingredient, index) => {
					const ingredientName = ingredient.ingredient[changeLang]; // Получаем название ингредиента на выбранном языке
					const ingredientUnit = ingredient.unit[changeLang]; // Получаем название ингредиента на выбранном языке
					return (
						<View
							key={index}
							className="flex-row gap-x-4 items-center mb-2"
						>
							<View
								style={{ height: 20, width: 20 }}
								className="bg-amber-300 rounded-full"
							/>
							<View className="flex-row flex-1 gap-x-2 ">
								<Text
									style={{ fontSize: 16 }}
									className="font-extrabold text-neutral-700"
								>
									{ingredientName}
								</Text>
								<Text
									style={{ fontSize: 16 }}
									className="font-medium text-neutral-600"
								>
									- {ingredient.quantity}
								</Text>
								<Text
									style={{ fontSize: 16 }}
									className="font-medium text-neutral-600 capitalize"
								>
									{ingredientUnit}
								</Text>
							</View> */}
			{/*block remove update*/}
			{/* <View className="flex-row gap-x-3 "> */}
			{/*<TouchableOpacity*/}
			{/*    onPress={() => {updateIngredient(ingredient)}}*/}
			{/*    style={shadowBoxBlack()}*/}
			{/*    className="w-[40px] h-[40px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ">*/}
			{/*    <ArrowPathIcon size={20} color='white'/>*/}
			{/*</TouchableOpacity>*/}

			{/* <TouchableOpacity
									style={shadowBoxBlack()}
									onPress={() => {
										removeIngredient(ingredient);
									}}
									// className="w-[40px] h-[40px] bg-red-500 border-2 border-neutral-300 rounded-[10] justify-center items-center "
								>
									<ButtonSmallCustom
										icon={TrashIcon}
										size={20}
										bg="#EF4444"
									/>
									{/*<TrashIcon size={20} color='white'/>*/}
			{/* </TouchableOpacity> */}
			{/* </View> */}
			{/* </View> */}
			{/* ); */}
			{/* })} */}
			{/* </View> */}
			<View>
				{ingredients.lang && ingredients.lang[changeLang] ? (
					ingredients.lang[changeLang].map((ingredient, index) => (
						<View key={index} className="flex-row gap-x-4 items-center mb-2">
							<View style={{ height: 20, width: 20 }} className="bg-amber-300 rounded-full" />
							<View className="flex-row flex-1 gap-x-2">
								<Text style={{ fontSize: 16 }} className="font-extrabold text-neutral-700">
									{ingredient.ingredient}
								</Text>
								<Text style={{ fontSize: 16 }} className="font-medium text-neutral-600">
									- {ingredient.quantity}
								</Text>
								<Text style={{ fontSize: 16 }} className="font-medium text-neutral-600 capitalize">
									{ingredient.unit}
								</Text>
							</View>
							{/* Блок удаления */}
							<View className="flex-row gap-x-3">
								<TouchableOpacity
									style={shadowBoxBlack()}
									onPress={() => removeIngredient(changeLang, index)}
								>
									<ButtonSmallCustom icon={TrashIcon} size={20} bg="#EF4444" />
								</TouchableOpacity>
							</View>
						</View>
					))
				) : (
					<Text>Нет ингредиентов для этого языка</Text>
				)}
			</View>
		</View>
	);
};

export default ListIngredientsCreateRecipe;
