import React, { useEffect, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
// arrow-up-on-square

import ButtonBack from "../../components/ButtonBack";
import ButtonSmallCustom from "../../components/Buttons/ButtonSmallCustom";
import AddCategory from "../../components/CreateRecipeScreen/AddCategory";
import AddLinkVideo from "../../components/CreateRecipeScreen/AddLinkVideo";
import AddPintGoogleMaps from "../../components/CreateRecipeScreen/AddPintGoogleMaps";
import IngredientsCreateRecipe from "../../components/CreateRecipeScreen/IngredientsCreateRecipe/IngredientsCreateRecipe";
import InputCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/InputCreateRecipeScreenCustom";
import LinkToTheCopyright from "../../components/CreateRecipeScreen/LinkToTheCopyright";
import RecipeListCreateRecipe from "../../components/CreateRecipeScreen/RecipeListCreateRecipe/RecipeListCreateRecipe";
import SelectCreateRecipeScreenCustom from "../../components/CreateRecipeScreen/SelectCreateRecipeScreenCustom";
import TagsCustom from "../../components/CreateRecipeScreen/TagsCustom";
import UploadHeaderImage from "../../components/CreateRecipeScreen/UploadHeaderImage";
import { hp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import { getMeasurementCreateRecipeMyDB } from "../../service/getDataFromDB";

const CreateRecipeScreen = () => {
	const { user: userData, language } = useAuth();
	// console.log("userData",userData.id)
	const [totalRecipe, setTotalRecipe] = useState({
		category: null,
		categoryId: null,
		imageHeader: null,
		area: null,
		title: null,
		rating: "0",
		likes: "0",
		comments: "0",
		recipeMetrics: null,
		ingredients: null,
		instructions: null,
		video: null,
		sourceReference: null,
		tags: null,
		linkCopyright: null,
		mapСoordinates: null,
		publishedId: userData.id,
		publishedUser: null,
		point: null,
	});

	useEffect(() => {
		console.log("totalRecipe", JSON.stringify(totalRecipe));
	}, [totalRecipe]);

	// console.log('creating recipe language', language)
	// console.log('creating recipe userData', userData.lang)

	// modal Preview
	const [isModalVisible, setIsModalVisible] = useState(false);

	const openModalPreview = () => {
		setIsModalVisible(true);
	};
	const closeModal = () => {
		setIsModalVisible(false);
	};

	const langApp = userData.lang ?? language;
	// console.log('CreateRecipeScreen',langApp)

	const [totalLangRecipe, setTotalLangRecipe] = useState([langApp]);

	// measurement
	const [measurement, setMeasurement] = useState([]);

	// useEffect(() => {
	//     console.log('CreateRecipeScreen totalLangRecipe',totalLangRecipe)
	// }, [totalLangRecipe]);
	// console.log(totalLangRecipe)

	// get all
	const fetchMeasurement = async () => {
		const res = await getMeasurementCreateRecipeMyDB();
		// console.log(res.data)
		setMeasurement(res.data[0].lang);
	};
	useEffect(() => {
		fetchMeasurement();
	}, []);

	const handlePreview = () => {
		console.log("prevoew");
		// const resPreview=
	};
	return (
		<SafeAreaView
		// contentContainerStyle={{flex: 1}}
		>
			<KeyboardAvoidingView
				// style={{flex: 1}}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					contentContainerStyle={{
						paddingHorizontal: 20,
						marginBottom: 20,
					}}
					showsVerticalScrollIndicator={false}
					keyboardDismissMode={"on-drag"}
				>
					{/*title*/}
					<View className="  p-5">
						<View className="absolute left-0 z-10">
							<ButtonBack />
						</View>
						<Text className="text-center mb-5 text-xl font-bold">
							Create Recipe
						</Text>
					</View>

					{/*add category*/}
					<AddCategory
						langApp={langApp}
						setTotalRecipe={setTotalRecipe}
					/>

					{/* upload header image    */}
					<UploadHeaderImage
						styleTextDesc={styles.styleTextDesc}
						styleInput={styles.styleInput}
						langDev={langApp}
						setTotalLangRecipe={setTotalLangRecipe}
						totalLangRecipe={totalLangRecipe}
						setTotalRecipe={setTotalRecipe}
						totalRecipe={totalRecipe}
					/>

					{/*   aria di recipe*/}
					<View className="mb-5">
						<Text style={styles.styleTextDesc}>
							Country of origin of the recipe
						</Text>

						<InputCreateRecipeScreenCustom
							styleInput={styles.styleInput}
							title="Country of origin of the recipe"
							placeholderText={`Write the country of`}
							placeholderColor="grey"
							totalLangRecipe={totalLangRecipe}
							setTotalRecipe={setTotalRecipe}
						/>
					</View>

					{/*  Tags   */}
					<TagsCustom
						styleInput={styles.styleInput}
						styleTextDesc={styles.styleTextDesc}
						setTotalRecipe={setTotalRecipe}
					/>

					{/*    select */}
					<View className="mb-5">
						<Text style={styles.styleTextDesc}>Description</Text>
						<SelectCreateRecipeScreenCustom
							setTotalRecipe={setTotalRecipe}
						/>
					</View>

					{/*    Ingredients*/}
					<View className="mb-5">
						<Text style={styles.styleTextDesc}>Ingredients</Text>
						<Text className="text-neutral-700 text-xs mb-3">
							Добавьте все ингредиенты и их количество для
							приготовления рецепта.
						</Text>

						<View>
							<IngredientsCreateRecipe
								styleInput={styles.styleInput}
								placeholderText={`Ingredient language`}
								placeholderColor="grey"
								langApp={userData.lang ?? language}
								measurement={measurement}
								totalLangRecipe={totalLangRecipe}
								setTotalRecipe={setTotalRecipe}
							/>
						</View>
					</View>

					{/*    recipe description  */}
					<View className="mb-10">
						<RecipeListCreateRecipe
							placeholderText={`Здесь вы можете описать рецепт на языке`}
							placeholderColor="grey"
							totalLangRecipe={totalLangRecipe}
							setTotalRecipe={setTotalRecipe}
						/>
					</View>

					{/*    add recipe link video*/}
					<View className="mb-10">
						<AddLinkVideo setTotalRecipe={setTotalRecipe} />
					</View>

					{/*    add link to the author*/}
					<LinkToTheCopyright setTotalRecipe={setTotalRecipe} />

					{/*    AddPintGoogleMaps    */}
					<AddPintGoogleMaps setTotalRecipe={setTotalRecipe} />

					{/*    buttons save and preview*/}
					<View className="gap-x-2 flex-row mb-10 flex-1 mt-5">
						<TouchableOpacity
							onPress={handlePreview}
							style={shadowBoxBlack()}
							className="flex-1"
						>
							<ButtonSmallCustom
								buttonText={true}
								title="Preview"
								bg="violet"
								// styleText={styles.buttonTextPrevSave}
								w="100%"
								h={60}
								// styleWrapperButton={styles.buttonTextPrevSavePadding}
							/>
						</TouchableOpacity>

						<TouchableOpacity
							style={shadowBoxBlack()}
							className="flex-1"
						>
							<ButtonSmallCustom
								buttonText={true}
								title="Save"
								bg="green"
								// styleText={styles.buttonTextPrevSave}
								w="100%"
								h={60}
								// styleWrapperButton={styles.buttonTextPrevSavePadding}
							/>
						</TouchableOpacity>
					</View>

					{/*<ModalClearCustom*/}

					{/*/>*/}
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	buttonTextPrevSave: {
		color: "white",
		fontWeight: "bold",
		fontSize: 18,
	},
	buttonTextPrevSavePadding: {
		padding: 10,
	},
	styleTextDesc: {
		fontSize: hp(2),
		fontWeight: "bold",
		marginBottom: 5,
		paddingLeft: 5,
	},
	styleInput: {
		fontSize: hp(2),
		flex: 1,
		borderWidth: 1,
		borderColor: "grey",
		padding: 20,
		borderRadius: 15,
	},
});

export default CreateRecipeScreen;
