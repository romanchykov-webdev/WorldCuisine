import React, {useState} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import {TrashIcon, PlusIcon, ArrowUturnLeftIcon} from "react-native-heroicons/mini"
import ModalClearCustom from "../ModalClearCustom";
import InputComponent from "../InputComponent";
import {supabase} from "../../lib/supabase";
import {getCategoryRecipeMasonryMyDB} from "../../service/getDataFromDB";
import LoadingComponent from "../loadingComponent";
import {hp, wp} from "../../constants/responsiveScreen";


const AddCategory = ({langApp}) => {

    const [allCategories, setAllCategories] = useState([])
    const [cat, setCat] = useState(null)
    const [subCategory, setSubCategory] = useState({
        point:"",
        name:"",
    })

    const handleCategory = (cat) => {
        setCat(cat)
        console.log("handleCategory", cat)
    }
    const handleSubCategory = (subCat) => {
        setSubCategory({
            point:subCat.point,
            name:subCat.name,
        })
        setIsModalVisible(false)
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
        // setCat(null)
        // setSubCategory("")
    }
    const handleSave = () => {
        setIsModalVisible(false);


    }

    const handlerBackCat=()=>{
        if(cat !== null){
            setCat(null)
        }else{
            setSubCategory("")
            setCat(null)
            setIsModalVisible(false);
        }
    }

    const handlerRemoveCategory=()=>{
        setCat(null)
        setSubCategory({
            point:"",
            name:"",
        })
    }

    return (
        <View className="mb-5">


            {
                (subCategory.name!=="" && cat !== null) &&(
                    <View className="flex-row gap-x-2 items-center justify-between mb-3 " >
                        <View className="flex-row items-center flex-wrap " style={{maxWidth:wp(80)}}>
                            <Text className="text-xl text-neutral-700 font-bold">Category: </Text>
                            <Text className="text-xl text-neutral-700 font-black">{cat.name} -> </Text>
                            <Text  className="text-xl text-neutral-700 font-medium">{subCategory.name}</Text>
                        </View>

                        <View>
                            <TouchableOpacity onPress={handlerRemoveCategory}>
                                <ButtonSmallCustom
                                    icon={TrashIcon}
                                    bg={"red"}
                                />
                            </TouchableOpacity>

                        </View>
                    </View>
                )
            }

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
                    styleWrapperButton={{flexDirection: "row", gap: 10, justifyContent: "center", alignItems: 'center',borderRadius:15}}
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
                    <TouchableOpacity
                        className="mb-5"
                        onPress={handlerBackCat}
                    >
                        <ButtonSmallCustom
                            icon={ArrowUturnLeftIcon}
                           color={"grey"}
                            styleWrapperButton={{borderRadius:"100%"}}
                        />
                    </TouchableOpacity>
                }
            >

                {
                    allCategories.length === 0 ? (
                        <View className="mb-10">
                            <LoadingComponent/>
                        </View>
                    ) : (

                        <ScrollView
                        style={{maxHeight:hp(60)}}
                        >
                            {
                                cat === null
                                ?(
                                    allCategories.map((category,index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleCategory(category)}
                                                key={index}
                                                className="border-2 border-neutral-700 rounded-[15] mb-3 p-2">
                                                <Text className="text-2xl">{category.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                    )
                                :(
                                    cat.subcategories.map((subCategory,index) => {
                                        return (
                                            <TouchableOpacity
                                                onPress={() => handleSubCategory(subCategory)}
                                                key={index}
                                                className="border-2 border-neutral-700 rounded-[15] mb-3 p-2">
                                                <Text className="text-2xl">{subCategory.name}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                    )





                            }
                        </ScrollView>

                    )

                }

            </ModalClearCustom>


        </View>
    );
};

const styles = StyleSheet.create({});

export default AddCategory;