import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ArrowUpOnSquareStackIcon, TrashIcon } from "react-native-heroicons/mini";
import i18n from "../../lang/i18n";
import { useImagePicker } from "../../lib/imageUtils";
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

	//  кастомный хук
	const { addImageRecipeList } = useImagePicker(addImage, setAddImage, setLoadingCompresImg);

	const handleImagePick = async () => {
		const imageUrl = await addImageRecipeList();
		if (imageUrl) {
			setTotalRecipe((prevRecipe) => ({
				...prevRecipe,
				image_header: imageUrl,
			}));
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
					onPress={handleImagePick}
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
