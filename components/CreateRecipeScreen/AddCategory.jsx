import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ArrowUturnLeftIcon, PlusIcon, TrashIcon } from "react-native-heroicons/mini";
import { hp, wp } from "../../constants/responsiveScreen";
import i18n from "../../lang/i18n";
import { getCategoryRecipeMasonryMyDB } from "../../service/getDataFromDB";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import LoadingComponent from "../loadingComponent";
import ModalClearCustom from "../ModalClearCustom";
import StərɪskCustomComponent from "../StərɪskCustomComponent";

const AddCategory = ({ langApp, setTotalRecipe }) => {
	const [allCategories, setAllCategories] = useState([]);
	const [cat, setCat] = useState(null);
	const [subCategory, setSubCategory] = useState({
		point: "",
		name: "",
	});

	const handleCategory = (cat) => {
		setCat(cat);
		// console.log("handleCategory", cat)
		// console.log("handleCategory", cat.point);
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			category: cat.point,
		}));
	};
	const handleSubCategory = (subCat) => {
		setSubCategory({
			point: subCat.point,
			name: subCat.name,
		});
		setIsModalVisible(false);
		// console.log("handleSubCategory", subCat);
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			point: subCat.point,
		}));
	};

	// console.log("AddCategory",langApp);

	const handlerAddCategory = async () => {
		setIsModalVisible(true);
		// console.log("handlerAddCategory");

		const resp = await getCategoryRecipeMasonryMyDB(langApp);
		// console.log("handlerAddCategory",JSON.stringify(resp.data, null, 2))
		// setAllCategories(resp.data)
		// setTimeout(() => {
		setAllCategories(resp.data);
		// }, 1000)
	};

	const [isModalVisible, setIsModalVisible] = useState(false);
	const closeModal = () => {
		setIsModalVisible(false);
		// setCat(null)
		// setSubCategory("")
	};
	const handleSave = () => {
		setIsModalVisible(false);
	};

	const handlerBackCat = () => {
		if (cat !== null) {
			setCat(null);
			// console.log("cat !== null")
			setTotalRecipe((prevRecipe) => ({
				...prevRecipe,
				point: null,
				category: null,
			}));
		} else {
			setSubCategory({
				point: "",
				name: "",
			});
			setCat(null);
			setIsModalVisible(false);
			setTotalRecipe((prevRecipe) => ({
				...prevRecipe,
				point: null,
				category: null,
			}));
		}
	};

	const handlerRemoveCategory = () => {
		setCat(null);
		setSubCategory({
			point: "",
			name: "",
		});
		setTotalRecipe((prevRecipe) => ({
			...prevRecipe,
			point: null,
			category: null,
		}));
	};

	const titleModal = i18n.t("To subscribe, you need to log in or create an account."); // Убедитесь, что ключ точно совпадает
	console.log("titleModal key check:", "To subscribe, you need to log in or create an account." === i18n.t("To subscribe, you need to log in or create an account.") ? "Match" : "No match");

	return (
		<View className="mb-5">
			{subCategory.name !== "" && cat !== null && (
				<View className="flex-row gap-x-2 items-center justify-between mb-3 ">
					<View className="flex-row items-center flex-wrap " style={{ maxWidth: wp(80) }}>
						<Text className="text-xl text-neutral-700 font-bold">Category: </Text>
						<Text className="text-xl text-neutral-700 font-black">
							{cat.name} {" ->"}
						</Text>
						<Text className="text-xl text-neutral-700 font-medium">{subCategory.name}</Text>
					</View>

					<View>
						<TouchableOpacity onPress={handlerRemoveCategory}>
							<ButtonSmallCustom icon={TrashIcon} bg={"red"} />
						</TouchableOpacity>
					</View>
				</View>
			)}

			<TouchableOpacity onPress={handlerAddCategory} className="flex-row gap-x-2 items-center justify-center relative ">
				<ButtonSmallCustom
					buttonText={true}
					// styleWrapperButton={}
					bg="green"
					w="100%"
					h={60}
					title={i18n.t("Add category")}
					icon={PlusIcon}
					styleWrapperButton={{
						flexDirection: "row",
						gap: 10,
						justifyContent: "center",
						alignItems: "center",
						borderRadius: 15,
					}}
					// styleText={{fontSize: 20, fontWeight: 'bold'}}
				/>
				<StərɪskCustomComponent />
			</TouchableOpacity>

			<ModalClearCustom
				titleHeader={i18n.t("To add a recipe to your favorites you must log in or create an account")}
				textButton={"Save"}
				isModalVisible={isModalVisible}
				// closeModal={closeModal}
				handleSave={handleSave}
				animationType={"fade"}
				childrenSubheader={
					<View className="flex-row items-center mb-5">
						<TouchableOpacity
							//    className="bg-red-500"
							onPress={() => handlerBackCat()}
							style={{ zIndex: 10 }}
						>
							<ButtonSmallCustom icon={ArrowUturnLeftIcon} color={"grey"} styleWrapperButton={{ borderRadius: "100%" }} />
						</TouchableOpacity>
						<Text className="flex-1 text-center ml-[-40]">{cat?.name}</Text>
					</View>
				}
			>
				{allCategories.length === 0 ? (
					<View className="mb-10">
						<LoadingComponent />
					</View>
				) : (
					<ScrollView style={{ maxHeight: hp(60) }}>
						{cat === null
							? allCategories.map((category, index) => {
									return (
										<TouchableOpacity onPress={() => handleCategory(category)} key={index} className="border-2 border-neutral-700 rounded-[15] mb-3 p-2">
											<Text className="text-2xl">{category.name}</Text>
										</TouchableOpacity>
									);
							  })
							: cat.subcategories.map((subCategory, index) => {
									return (
										<TouchableOpacity onPress={() => handleSubCategory(subCategory)} key={index} className="border-2 border-neutral-700 rounded-[15] mb-3 p-2">
											<Text className="text-2xl">{subCategory.name}</Text>
										</TouchableOpacity>
									);
							  })}
					</ScrollView>
				)}
			</ModalClearCustom>
		</View>
	);
};

const styles = StyleSheet.create({});

export default AddCategory;
