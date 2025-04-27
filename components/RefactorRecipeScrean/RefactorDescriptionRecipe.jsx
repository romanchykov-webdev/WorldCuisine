import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PlusIcon, TrashIcon } from "react-native-heroicons/outline";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import i18n from "../../lang/i18n";
import { useImagePickerForRefactor } from "../../lib/imageUtils";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import TitleDescriptionComponent from "../CreateRecipeScreen/TitleDescriptionComponent";
import LoadingComponent from "../loadingComponent";
import ImageCustom from "../recipeDetails/ImageCustom";
import ImageSliderCustom from "../recipeDetails/ImageSliderCustom";

const RefactorDescriptionRecipe = ({ descriptionsRecipe, langApp, Icon, onUpdateDescription, recipe }) => {
	// console.log("RefactorDescriptionRecipe descriptionsRecipe", JSON.stringify(descriptionsRecipe, null));
	// console.log("RefactorDescriptionRecipe descriptionsRecipe", descriptionsRecipe.lang[langApp]);
	// console.log("RefactorDescriptionRecipe langApp", langApp);
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [selectedStep, setSelectedStep] = useState(null);
	const [editedText, setEditedText] = useState(""); // Временный текст
	const [tempImages, setTempImages] = useState([]); // Временные изображения

	// Преобразуем объект в массив шагов для рендеринга
	// const steps = Object.entries(descriptionsRecipe.lang[langApp]).map(([key, value]) => ({
	// 	step: key,
	// 	...value,
	// }));
	const steps = descriptionsRecipe.lang[langApp]
		? Object.entries(descriptionsRecipe.lang[langApp]).map(([key, value]) => ({
			step: key,
			...value,
		}))
		: [];


	// Хук для выбора изображений, передаём объект recipe
	const currentImages = selectedStep ? descriptionsRecipe.lang[langApp][selectedStep]?.images || [] : [];
	const { pickImageForRefactor } = useImagePickerForRefactor(currentImages, setTempImages, setLoading, recipe, 5);

	// Открытие модального окна для редактирования шага
	const handleRefactorStep = (step) => {
		// console.log("RefactorDescriptionRecipe handleRefactorStep step", step);
		// console.log("RefactorDescriptionRecipe handleRefactorStep descriptionsRecipe.lang", descriptionsRecipe.lang);
		// console.log(
		// 	"RefactorDescriptionRecipe handleRefactorStep descriptionsRecipe.lang[langApp][step]",
		// 	descriptionsRecipe.lang[langApp][step]
		// );
		setSelectedStep(step);
		setEditedText(descriptionsRecipe.lang[langApp][step].text); // Устанавливаем текущий текст для редактирования
		setTempImages(descriptionsRecipe.lang[langApp][step].images || []); // Инициализируем временные изображения
		setModalVisible(true);
	};

	// Открытие модального окна для добавления нового шага
	const handleAddNewStep = () => {
		setSelectedStep(null); // Указываем, что это новый шаг
		setEditedText(""); // Очищаем текст
		setTempImages([]); // Очищаем изображения
		setModalVisible(true);
	};

	// Обновление изображений (add, remove, refactor)
	// const handleImageUpdate = (newImages, action) => {
	// 	const updatedLang = {};
	// 	// Применяем изменения ко всем языкам
	// 	Object.keys(descriptionsRecipe.lang).forEach((lang) => {
	// 		if (descriptionsRecipe.lang[lang][selectedStep]) {
	// 			updatedLang[lang] = {
	// 				...descriptionsRecipe.lang[lang],
	// 				[selectedStep]: {
	// 					...descriptionsRecipe.lang[lang][selectedStep],
	// 					images:
	// 						action === "remove"
	// 							? [] // Удаляем все изображения
	// 							: action === "refactor"
	// 							? newImages // Заменяем все изображения
	// 							: [...descriptionsRecipe.lang[lang][selectedStep].images, ...newImages].slice(0, 5), // Добавляем до 5
	// 				},
	// 			};
	// 		}
	// // 	});

	// 	const updatedDescription = {
	// 		...descriptionsRecipe,
	// 		lang: {
	// 			...descriptionsRecipe.lang,
	// 			...updatedLang,
	// 		},
	// 	};
	// 	onUpdateDescription(updatedDescription); // Передаем обновленные данные в родительский компонент
	// };

	// Обновление временных изображений
	const handleImageUpdate = (newImages, action) => {
		if (action === "remove") {
			setTempImages([]); // Удаляем все изображения
		} else if (action === "refactor") {
			setTempImages(newImages); // Заменяем все изображения
		} else if (action === "add") {
			setTempImages((prev) => [...prev, ...newImages].slice(0, 5)); // Добавляем до 5
		}
	};

	// Удаление всех изображений
	const handleRemoveImage = () => {
		handleImageUpdate([], "remove");
	};

	// Замена всех изображений
	const handleRefactorImage = async () => {
		setLoading(true);
		try {
			const newImageUri = await pickImageForRefactor(); // Получаем URI нового изображения
			console.log("handleRefactorImage: New image URI:", newImageUri);
			if (newImageUri) {
				handleImageUpdate([newImageUri], "refactor"); // Заменяем на новое изображение
			}
		} catch (error) {
			console.error("Error in handleRefactorImage:", error);
			Alert.alert("Error", "Failed to refactor image");
		} finally {
			setLoading(false);
		}
	};

	// Добавление новых изображений
	const handleAddImage = async () => {
		if (tempImages.length >= 5) {
			Alert.alert(i18n.t("Limit Reached"), i18n.t("You have reached the limit of 5 images"));
			return;
		}
		setLoading(true);
		try {
			const newImageUri = await pickImageForRefactor(); // Получаем URI нового изображения
			if (newImageUri) {
				handleImageUpdate([newImageUri], "add"); // Добавляем новое изображение
			}
		} catch (error) {
			console.error("Error in handleAddImage:", error);
		} finally {
			setLoading(false);
		}
	};

	// const handleSave = () => {
	// 	if (selectedStep) {
	// 		const updatedDescription = {
	// 			...descriptionsRecipe,
	// 			lang: {
	// 				...descriptionsRecipe.lang,
	// 				[langApp]: {
	// 					...descriptionsRecipe.lang[langApp],
	// 					[selectedStep]: {
	// 						...descriptionsRecipe.lang[langApp][selectedStep],
	// 						text: editedText, // Обновляем текст
	// 					},
	// 				},
	// 			},
	// 		};
	// 		onUpdateDescription(updatedDescription); // Обновляем данные через проп
	// 		setModalVisible(false);
	// 	}
	// };

	// Сохранение изменений
	// const handleSave = () => {
	// 	if (selectedStep) {
	// 		// Редактирование существующего шага
	// 		const updatedLang = {};
	// 		Object.keys(descriptionsRecipe.lang).forEach((lang) => {
	// 			if (descriptionsRecipe.lang[lang][selectedStep]) {
	// 				updatedLang[lang] = {
	// 					...descriptionsRecipe.lang[lang],
	// 					[selectedStep]: {
	// 						...descriptionsRecipe.lang[lang][selectedStep],
	// 						text: editedText, // Применяем временный текст
	// 						images: tempImages, // Применяем временные изображения
	// 					},
	// 				};
	// 			}
	// 		});

	// 		const updatedDescription = {
	// 			...descriptionsRecipe,
	// 			lang: {
	// 				...descriptionsRecipe.lang,
	// 				...updatedLang,
	// 			},
	// 		};
	// 		onUpdateDescription(updatedDescription);
	// 		setModalVisible(false);
	// 	}
	// };

	// Сохранение изменений
	const handleSave = () => {
		const updatedLang = {};

		if (selectedStep) {
			// Редактирование существующего шага
			Object.keys(descriptionsRecipe.lang).forEach((lang) => {
				if (descriptionsRecipe.lang[lang][selectedStep]) {
					updatedLang[lang] = {
						...descriptionsRecipe.lang[lang],
						[selectedStep]: {
							...descriptionsRecipe.lang[lang][selectedStep],
							text: editedText, // Применяем временный текст
							images: tempImages, // Применяем временные изображения
						},
					};
				}
			});
		} else {
			// Добавление нового шага
			const newStepNumber = steps?.length + 1; // Определяем номер нового шага
			const newStepKey = `${newStepNumber}`; // Например, "Step 1", "Step 2" и т.д.

			Object.keys(descriptionsRecipe.lang).forEach((lang) => {
				updatedLang[lang] = {
					...descriptionsRecipe.lang[lang],
					[newStepKey]: {
						text: editedText, // Новый текст
						images: tempImages, // Новые изображения
					},
				};
			});
		}

		const updatedDescription = {
			...descriptionsRecipe,
			lang: {
				...descriptionsRecipe.lang,
				...updatedLang,
			},
		};
		onUpdateDescription(updatedDescription);
		setModalVisible(false);
	};

	// Отмена изменений
	const handleCancel = () => {
		setEditedText(""); // Сбрасываем временный текст
		setTempImages([]); // Сбрасываем временные изображения
		setModalVisible(false);
	};

	return (
		<View>
			<TitleDescriptionComponent titleText={i18n.t("Recipe Description")} titleVisual={true} />
			{steps?.length > 0 &&
				steps?.map((item, index) => (
					<View key={index} className="w-full mb-5">
						{/* text */}
						<View className="flex-row flex-1 ">
							<Text className="flex-wrap flex-1 mb-3" style={{ fontSize: hp(2.5) }}>
								<Text className="text-amber-500">
									{item.step} {")"}{" "}
								</Text>
								{item.text}
							</Text>
							<TouchableOpacity
								onPress={() => handleRefactorStep(item.step)}
								style={shadowBoxBlack()}
								// className="absolute top-[10px] right-[-10px]"
							>
								<ButtonSmallCustom icon={Icon} tupeButton="refactor" />
							</TouchableOpacity>
						</View>

						{/* Изображения */}
						{Array.isArray(item.images) &&
							item.images.length > 0 &&
							(item.images.length === 1 ? (
								<View>
									{loading ? (
										<View
											style={shadowBoxBlack()}
											className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
										>
											<LoadingComponent />
										</View>
									) : (
										<ImageCustom image={item.images} isPreview={false} refactorScrean={true} />
									)}
								</View>
							) : (
								<View>
									{loading ? (
										<View
											style={shadowBoxBlack()}
											className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
										>
											<LoadingComponent />
										</View>
									) : (
										<ImageSliderCustom images={item.images} isPreview={false} />
									)}
								</View>
							))}
					</View>
				))}
			{/* New Step desc */}
			<View>
				<TouchableOpacity style={shadowBoxBlack()} onPress={handleAddNewStep}>
					<ButtonSmallCustom tupeButton="add" w={"100%"} h={60} icon={PlusIcon} size={40} />
				</TouchableOpacity>
			</View>
			{/* Модальное окно для редактирования */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							{selectedStep
								? `${i18n.t("Edit")} ${selectedStep} (${langApp.toUpperCase()})`
								: `${i18n.t("Add New Step")} (${langApp.toUpperCase()})`}
						</Text>
						<TextInput
							style={styles.input}
							value={editedText}
							onChangeText={setEditedText}
							multiline
							autoFocus
							// placeholder={i18n.t("Enter description")}
						/>

						{/* Изображения в модальном окне */}
						{/* Изображения в модальном окне */}
						{/* {selectedStep &&
							Array.isArray(descriptionsRecipe.lang[langApp][selectedStep]?.images) &&
							(descriptionsRecipe.lang[langApp][selectedStep].images.length > 0 ? (
								descriptionsRecipe.lang[langApp][selectedStep].images.length === 1 ? (
									<View className="w-full relative">
										<ImageCustom
											image={descriptionsRecipe.lang[langApp][selectedStep].images}
											isPreview={false}
											refactorScrean={true}
										/>
										Кнопки управления
										<View className="absolute top-0 right-0 h-full justify-between py-5">
											<TouchableOpacity onPress={handleRemoveImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleRefactorImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={Icon} tupeButton="refactor" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
											</TouchableOpacity>
										</View>
									</View>
								) : (
									<View className="w-full relative">
										<ImageSliderCustom
											images={descriptionsRecipe.lang[langApp][selectedStep].images}
											isPreview={false}
										/>
										Кнопки управления
										<View className="absolute top-0 right-0 h-full justify-between py-5">
											<TouchableOpacity onPress={handleRemoveImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleRefactorImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={Icon} tupeButton="refactor" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
											</TouchableOpacity>
										</View>
									</View>
								)
							) : (
								<TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
									<ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
								</TouchableOpacity>
							))} */}
						{selectedStep &&
							(Array.isArray(tempImages) && tempImages.length > 0 ? (
								tempImages.length === 1 ? (
									<View className="w-full relative">
										<View>
											{loading ? (
												<View
													style={shadowBoxBlack()}
													className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
												>
													<LoadingComponent />
												</View>
											) : (
												<ImageCustom
													image={tempImages}
													// isPreview={true}
												/>
											)}
										</View>
										{/* Кнопки управления */}
										<View className="absolute top-0 right-0 h-full justify-between py-5">
											<TouchableOpacity onPress={handleRemoveImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleRefactorImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={Icon} tupeButton="refactor" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
											</TouchableOpacity>
										</View>
									</View>
								) : (
									<View className="w-full relative">
										<View>
											{loading ? (
												<View
													style={shadowBoxBlack()}
													className="w-[100%] h-[300px] border-[1px] border-neutral-300 rounded-[40px]"
												>
													<LoadingComponent />
												</View>
											) : (
												<ImageSliderCustom
													images={tempImages}
													// isPreview={false}
													// refactorScrean={true}
												/>
											)}
										</View>

										{/* Кнопки управления */}
										<View className="absolute top-0 right-0 h-full justify-between py-5">
											<TouchableOpacity onPress={handleRemoveImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={TrashIcon} tupeButton="remove" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleRefactorImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={Icon} tupeButton="refactor" />
											</TouchableOpacity>
											<TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
												<ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
											</TouchableOpacity>
										</View>
									</View>
								)
							) : (
								<TouchableOpacity onPress={handleAddImage} style={shadowBoxBlack()}>
									<ButtonSmallCustom icon={PlusIcon} tupeButton="add" />
								</TouchableOpacity>
							))}

						<View style={styles.buttonContainer}>
							<TouchableOpacity style={styles.button} onPress={handleSave}>
								<Text style={styles.buttonText}>{i18n.t("Save")}</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.button} onPress={handleCancel}>
								<Text style={styles.buttonText}>{i18n.t("Cancel")}</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,

		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",

		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	modalTitle: {
		fontSize: hp(2.5),
		fontWeight: "bold",
		marginBottom: 15,
	},
	input: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		padding: 10,
		fontSize: hp(2),
		marginBottom: 20,
		minHeight: 100, // Для многострочного ввода
		maxHeight: hp(30),
	},
	buttonContainer: {
		marginTop: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		backgroundColor: "#ff4444",
		padding: 10,
		borderRadius: 5,
		width: "45%",
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontSize: hp(2),
		fontWeight: "bold",
	},
});

export default RefactorDescriptionRecipe;
