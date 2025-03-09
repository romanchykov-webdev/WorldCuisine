import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PhotoIcon, PlusIcon, TrashIcon } from "react-native-heroicons/mini";
import Animated, { FadeInDown } from "react-native-reanimated";
import { shadowBoxBlack } from "../../../constants/shadow";
import { compressImage100 } from "../../../lib/imageUtils";
import ButtonSmallCustom from "../../Buttons/ButtonSmallCustom";
import SliderImagesListCreateRecipe from "./SliderImagesListCreateRecipe";
import ViewImageListCreateRecipe from "./ViewImageListCreateRecipe";

//import my hook
import { useDebounce } from "../../../constants/halperFunctions";
import i18n from "../../../lang/i18n";
import LoadingComponent from "../../loadingComponent";
import TitleDescriptionComponent from "../TitleDescriptionComponent";

const RecipeListCreateRecipe = ({ placeholderText, placeholderColor, totalLangRecipe, setTotalRecipe }) => {
	const [addImages, setAddImages] = useState([]);
	useEffect(() => {}, [addImages]);

	const [changeLang, setChangeLang] = useState(totalLangRecipe[0]);
	const handleChangeLang = (item) => {
		setChangeLang(item);
	};

	const [loadingCompresImg, setLoadingCompresImg] = useState(false);

	// const [recipeArray, setRecipeArray] = useState(() => {
	// 	// Инициализируем пустой объект для каждого языка
	// 	const initialArray = {};
	// 	totalLangRecipe.forEach((lang) => {
	// 		initialArray[lang] = { text: "", images: [] };
	// 	});
	// 	return initialArray;
	// });
	const [recipeArray, setRecipeArray] = useState({});
	// добавить проверку если обьект пуст то просто не отрисоввывать !!!!!!!!!!!!!

	// Добавляем дебонсированное значение
	const debouncedValue = useDebounce(recipeArray, 1000);
	// console.log("recipeArray", recipeArray);
	// console.log("debouncedValue", debouncedValue);
	useEffect(() => {
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			instructions: { lang: debouncedValue },
		}));
	}, [debouncedValue]);

	const handleTextChange = (lang, value) => {
		setRecipeArray((prev) => ({
			...prev,
			[lang]: {
				...prev[lang],
				text: value,
			},
		}));
	};

	const addImageRecipeList = async () => {
		// console.log('Add Recipe List');
		if (addImages.length >= 5) {
			Alert.alert(`${i18n.t("You have reached the image limit for one item")}`);
			return;
		}

		setLoadingCompresImg(true);

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (result && result.assets && result.assets[0]) {
			const originalUri = result.assets[0].uri;

			// Получаем размер оригинального изображения
			const originalResponse = await fetch(originalUri);
			const originalBlob = await originalResponse.blob();
			const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2);
			// console.log(`Original image size: ${originalSizeInMB} MB`);

			// Сжимаем изображение перед использованием
			// const compressedImage = await compressImage(originalUri, 1, 300, 300);
			const compressedImage = await compressImage100(originalUri, 0.2);

			// Получаем размер сжатого изображения
			const compressedResponse = await fetch(compressedImage.uri);
			const compressedBlob = await compressedResponse.blob();
			const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);
			// console.log(`Compressed image size: ${compressedSizeInMB} MB`);

			// Обновляем состояние
			setAddImages((prev) => [...prev, compressedImage]);

			// Выводим обновленный список изображений
			// console.log('add image for recipe list', addImages);

			// Выводим информацию в alert
			Alert.alert(
				"Size image",
				`Original size: ${originalSizeInMB} MB\n` + `Compressed size:, ${compressedSizeInMB} MB`
			);
			setLoadingCompresImg(false);
		} else {
			// console.error("Image selection canceled or failed", result);
			Alert.alert(`${i18n.t("You did not add an image")}`);
		}
	};

	const addStepRecipe = () => {
		// console.log(recipeArray);

		// Проверка на наличие пустых полей
		const hasEmptyFields = totalLangRecipe.some((lang) => {
			const text = recipeArray[lang]?.text;
			return typeof text !== "string" || !text.trim();
		});

		if (hasEmptyFields) {
			Alert.alert("Ошибка добавления.", "Заполните все поля перед добавлением нового шага.");
			return;
		}

		setRecipeArray((prev) => {
			const updatedArray = { ...prev };

			// Добавляем новый шаг для каждого языка
			totalLangRecipe.forEach((lang) => {
				const steps = Object.keys(updatedArray[lang] || {})
					.filter((key) => !isNaN(Number(key)))
					.map(Number);

				const nextStep = steps.length > 0 ? Math.max(...steps) + 1 : 1;

				// Убедимся, что структура языка существует
				updatedArray[lang] = {
					...updatedArray[lang],
					[nextStep]: {
						images: addImages,
						text: updatedArray[lang]?.text?.trim() || "",
					},
				};

				// Удаляем верхнеуровневые поля `text` и `images`
				delete updatedArray[lang].text;
				delete updatedArray[lang].images;
			});

			setAddImages([]);
			// console.log('Updated Recipe Array with Steps:', JSON.stringify(updatedArray, null, 2));
			return updatedArray;
		});
	};

	const removeStepRecipe = (item) => {
		console.log("remove stepRecipe", item);
		console.log("remove stepRecipe recipeArray", recipeArray);

		setRecipeArray((prevArray) => {
			const updatedArray = { ...prevArray }; // Создаем копию текущего состояния

			// Перебираем все языки в объекте
			Object.keys(updatedArray).forEach((lang) => {
				// Проверяем, есть ли шаг с номером item (номер шага)
				if (updatedArray[lang][item]) {
					// Удаляем шаг по номеру
					delete updatedArray[lang][item];
				}
			});

			console.log("Updated recipeArray after removal:", updatedArray);
			return updatedArray; // Возвращаем обновленный объект
		});
	};

	return (
		<View>
			{/*show result description*/}

			<View>
				{/*block lang*/}
				{totalLangRecipe?.length > 1 && (
					<View className="mb-2">
						<Text className="mb-2 text-xl text-neutral-700 font-bold">
							{i18n.t("View in language")}
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

				{
					// Проверяем, есть ли данные для выбранного языка
					recipeArray[changeLang]
						? Object.keys(recipeArray[changeLang]).map((stepIndex, index) => {
								// Выводим только те элементы, которые являются шагами (то есть числами)
								if (!isNaN(Number(stepIndex))) {
									return (
										<Animated.View
											entering={FadeInDown.duration(300).springify()}
											key={stepIndex}
											className="mb-5 "
										>
											<View className="flex-1 flex-row">
												<Text className="mb-2 flex-1">
													<Text className="text-amber-500">
														{/*{stepIndex}) {" "}*/}
														{index + 1}){" "}
													</Text>
													{recipeArray[changeLang][stepIndex]?.text}
												</Text>

												{/*    button remove */}
												<TouchableOpacity
													onPress={() => {
														removeStepRecipe(stepIndex);
													}}
													style={shadowBoxBlack()}
												>
													<ButtonSmallCustom icon={TrashIcon} color="white" bg="#EF4444" />
												</TouchableOpacity>
											</View>

											<View>
												{recipeArray[changeLang][stepIndex]?.images.length > 0 &&
													(recipeArray[changeLang][stepIndex]?.images.length === 1 ? (
														<ViewImageListCreateRecipe
															image={recipeArray[changeLang][stepIndex]?.images}
														/>
													) : (
														<SliderImagesListCreateRecipe
															createRecipe={true}
															images={recipeArray[changeLang][stepIndex]?.images}
														/>
													))}
											</View>
										</Animated.View>
									);
								}
						  })
						: null
				}
			</View>

			<TitleDescriptionComponent
				titleText={i18n.t("Recipe Description")}
				titleVisual={true}
				descriptionVisual={true}
				descriptionText={i18n.t("Here you can write a recipe as text or in bullet points")}
			/>

			{totalLangRecipe?.map((item, index) => {
				return (
					<TextInput
						key={index}
						className="border-2 border-neutral-500 rounded-[15] p-2 mb-3"
						value={recipeArray[item]?.text || ""}
						onChangeText={(value) => handleTextChange(item, value)}
						placeholder={`${placeholderText} ${item}`}
						placeholderTextColor={placeholderColor}
						multiline={true}
						style={{ minHeight: 100 }}
					/>
				);
			})}

			<View className="flex-row gap-x-2 ">
				<TouchableOpacity
					onPress={addImageRecipeList}
					style={shadowBoxBlack()}
					className="flex-1 h-[50px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center "
				>
					<PhotoIcon color="white" size={20} />
					{addImages?.length > 0 && (
						<Animated.View
							entering={FadeInDown.duration(200).springify()} // Добавим нужную анимацию с параметрами
							style={[
								shadowBoxBlack({
									offset: { width: 1, height: 1 },
								}),
								{
									position: "absolute",
									top: -5,
									right: 10,
									width: 25,
									height: 25,
									justifyContent: "center",
									alignItems: "center",
								},
							]}
							className="border-2 border-neutral-500 rounded-3xl bg-violet-700"
						>
							<Text className="text-neutral-900 text-[16px]">{addImages?.length}</Text>
						</Animated.View>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={shadowBoxBlack()}
					onPress={loadingCompresImg ? null : addStepRecipe}
					className="flex-1 h-[50px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center"
				>
					{loadingCompresImg ? <LoadingComponent /> : <PlusIcon color="white" size={20} />}
				</TouchableOpacity>

				{/*<TouchableOpacity*/}
				{/*    style={shadowBoxBlack()}*/}
				{/*    onPress={resetFields}*/}
				{/*    className="flex-1 h-[50px] bg-red-500 border-2 border-neutral-300 rounded-[10] justify-center items-center">*/}
				{/*    <Text style={{ color: 'white' }}>Reset</Text>*/}
				{/*</TouchableOpacity>*/}
			</View>
		</View>
	);
};

export default RecipeListCreateRecipe;
