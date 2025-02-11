import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import {LinkIcon, PlusIcon, XMarkIcon} from "react-native-heroicons/mini"
import ModalClearCustom from "../ModalClearCustom";
import InputComponent from "../InputComponent";
import {supabase} from "../../lib/supabase";
import {getCategoryRecipeMasonryMyDB} from "../../service/getDataFromDB";
import LoadingComponent from "../loadingComponent";
import {hp} from "../../constants/responsiveScreen";


const AddCategory = ({langApp}) => {

    const [allCategories, setAllCategories] = useState([])
    const [cat, setCat] = useState(null)
    const [subCategory, setSubCategory] = useState("")

    const handleCategory = (cat) => {
        setCat(cat)
        console.log("handleCategory", cat)
    }
    const handleSubCategory = (subCat) => {
        setSubCategory(subCat)
        console.log("handleSubCategory", subCat)
    }

    // console.log("AddCategory",langApp);

    const handlerAddCategory = async () => {
        setIsModalVisible(true)
        console.log("handlerAddCategory")

        const resp = await getCategoryRecipeMasonryMyDB(langApp)
        // console.log("handlerAddCategory",JSON.stringify(resp.data, null, 2))
        // setAllCategories(resp.data)
        // setTimeout(() => {
        setAllCategories(resp.data)
        // }, 1000)
    }

    const [isModalVisible, setIsModalVisible] = useState(false)
    const closeModal = () => {
        setIsModalVisible(false);
    }
    const handleSave = () => {
        setIsModalVisible(false);


    }

    return (
        <View className="mb-5">
            <TouchableOpacity
                onPress={handlerAddCategory}
                className="flex-row gap-x-2 items-center justify-center "
            >


                <ButtonSmallCustom
                    buttonText={true}
                    // styleWrapperButton={}
                    bg={"green"}
                    w={"100%"}
                    h={60}
                    title="Add category"
                    icon={PlusIcon}
                    styleWrapperButton={{flexDirection: "row", gap: 10, justifyContent: "center", alignItems: 'center'}}
                    styleText={{fontSize: 20, fontWeight: 'bold'}}
                />
            </TouchableOpacity>

            <ModalClearCustom
                titleHeader={"Выберете к какой категории относится ваш рецепт."}
                textButton={"Save"}
                isModalVisible={isModalVisible}
                closeModal={closeModal}
                handleSave={handleSave}
                animationType={"fade"}
                childrenSubheader={
                    <Text className="underline font-bold text-[18px] mb-[15] text-center ">
                        {/* {link}. */}
                    </Text>
                }
            >
                {
                    allCategories.length === 0 ? (
                        <View className="mb-10">
                            <LoadingComponent/>
                        </View>
                    ) : (
                        allCategories.map((category, index) => {
                            // Если категория не выбрана, показываем все категории
                            if (cat === null) {
                                return (
                                    <TouchableOpacity
                                        onPress={() => handleCategory(category)}
                                        key={index} className="border-2 border-neutral-700 rounded-[15] mb-3 p-2">
                                        <Text className="text-2xl">{category.name}</Text>
                                    </TouchableOpacity>
                                );
                            } else {
                                // Если категория выбрана, показываем ее подкатегории
                                return category.subcategories.map((subcategory, subIndex) => (
                                    <TouchableOpacity
                                        onPress={() => handleSubCategory(subcategory.point)}
                                        key={subIndex}
                                        className="border-2 border-neutral-700 rounded-[15] mb-3 p-2">
                                        <Text className="text-2xl">{subcategory.name}</Text>
                                    </TouchableOpacity>
                                ));
                            }
                        }
                        )
                    )
                }
            </ModalClearCustom>


        </View>
    );
};

const styles = StyleSheet.create({});

export default AddCategory;