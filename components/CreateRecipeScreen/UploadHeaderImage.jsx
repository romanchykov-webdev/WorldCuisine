import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ArrowUpOnSquareStackIcon, TrashIcon } from "react-native-heroicons/mini";
import i18n from "../../lang/i18n";
import { compressImage100 } from "../../lib/imageUtils";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import LoadingComponent from "../loadingComponent";
import StərɪskCustomComponent from "../StərɪskCustomComponent";
import InputCustomComponent from "./InputCustomComponent";
import ViewImageListCreateRecipe from "./RecipeListCreateRecipe/ViewImageListCreateRecipe";

const UploadHeaderImage = ({
	styleTextDesc,
	styleInput,
	langDev,
	setTotalLangRecipe,
	totalLangRecipe,
	setTotalRecipe,
	totalRecipe,
}) => {
	const [addImage, setAddImage] = useState([]);

	const [loadingCompresImg, setLoadingCompresImg] = useState(false);

	const addImageRecipeList = async () => {
		// console.log('Add Recipe List');
		if (addImage.length >= 5) {
			Alert.alert(`${i18n.t("You have reached the image limit for one item")}`);
			return;
		}

		setLoadingCompresImg(true);

		let res = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsEditing: true,
			aspect: [1, 1],
			quality: 1,
		});

		if (res && res.assets && res.assets[0]) {
			const originalUri = res.assets[0].uri;

			// Получаем размер оригинального изображения
			const originalRes = await fetch(originalUri);
			const originalBlob = await originalRes.blob();
			const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2);
			// console.log(`Original image size: ${originalSizeInMB} MB`);

			// Сжимаем изображение перед использованием
			// const compressedImage = await compressImage(originalUri, 1, 300, 300);
			const compressedImage = await compressImage100(originalUri, 0.3);

			// Получаем размер сжатого изображения
			const compressedResponse = await fetch(compressedImage.uri);
			const compressedBlob = await compressedResponse.blob();
			const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);
			// console.log(`Compressed image size: ${compressedSizeInMB} MB`);

			// Обновляем состояние
			setAddImage((prev) => [...prev, compressedImage]);

			// Выводим обновленный список изображений
			// console.log('add image for recipe list', addImages);

			// console.log("addImage",addImage)

			// Выводим информацию в alert
			Alert.alert(
				"Size image",
				`Original size: ${originalSizeInMB} MB\n` + `Compressed size:, ${compressedSizeInMB} MB`
			);
			setTotalRecipe((prevRecipe) => ({
				...prevRecipe,
				image_header: compressedResponse.url,
			}));
			setLoadingCompresImg(false);
		} else {
			// console.error("Image selection canceled or failed", result);
			Alert.alert(`${i18n.t("You haven't added an image")}`);
		}
	};

	useEffect(() => {}, [addImage]);

	const handlerRemoveHeaderImage = () => {
		setAddImage([]);
	};
	return (
		<View className="mb-5 relative">
			<StərɪskCustomComponent />
			{addImage[0]?.uri ? (
				<View className="relative">
					<TouchableOpacity onPress={handlerRemoveHeaderImage} className="absolute top-[-5] right-0 z-10">
						<ButtonSmallCustom icon={TrashIcon} bg={"red"} />
					</TouchableOpacity>

					<ViewImageListCreateRecipe image={addImage} />
				</View>
			) : (
				<TouchableOpacity
					onPress={addImageRecipeList}
					className="border-2 border-neutral-200 w-full h-[200]  rounded-[15] justify-center "
				>
					<View className="items-center">
						{loadingCompresImg ? (
							<LoadingComponent />
						) : (
							<>
								<Text className="mb-2">{i18n.t("Upload your image")}</Text>
								<ArrowUpOnSquareStackIcon size={50} color="green" />
							</>
						)}
					</View>
				</TouchableOpacity>
			)}

			{/*    title recipe*/}
			<View className="mb-5 mt-5">
				<InputCustomComponent
					styleTextDesc={styleTextDesc}
					styleInput={styleInput}
					langDev={langDev}
					setTotalLangRecipe={setTotalLangRecipe}
					totalLangRecipe={totalLangRecipe}
					setTotalRecipe={setTotalRecipe}
					totalRecipe={totalRecipe}
				/>
			</View>
		</View>
	);
};

export default UploadHeaderImage;
