import React, {useState} from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import {shadowBoxBlack} from "../../../constants/shadow";
import {TrashIcon, ArrowPathIcon} from "react-native-heroicons/mini";
import Slider from "@react-native-community/slider";
import ModalCustom from "../../ModalCustom";


const ListIngredientsCreateRecipe = ({ingredients, setIngredients, totalLangRecipe}) => {
    // console.log("ListIngredientsCreateRecipe ingredients", ingredients)
    // console.log("ListIngredientsCreateRecipe totalLangRecipe", totalLangRecipe)


    const [changeLang, setChangeLang] = useState(totalLangRecipe[0])

    // const [ingredientForUpdate, setIngredientForUpdate] = useState({})
    //
    // const [isModalVisible, setIsModalVisible] = useState(false);


    const handleChangeLang = (item) => {
        setChangeLang(item)
    }

    const removeIngredient = (item) => {
        // console.log("removeIngredient ingredients",ingredients)
        // console.log("----------------")
        // console.log("removeIngredient", item)

        // Удаляем элемент из массива ingredients
        const updatedIngredients = ingredients.filter(ingredient => {
            // Сравниваем, чтобы исключить ингредиент с таким же объектом
            return ingredient !== item;
        });

        // Обновляем состояние с новым массивом без удаленного элемента
        setIngredients(updatedIngredients);
    }

    // const updateIngredient = (ingredient) => {
    //     console.log("updateIngredient", ingredient)
    //     setIsModalVisible(true);
    //     setIngredientForUpdate(ingredient)
    // }
    //
    // const onPressHandlerList=(key)=>{
    //
    //     console.log(ingredientForUpdate)
    //     // const updatedUnit = totalLangRecipe.reduce((acc, lang) => {
    //     //     acc[lang] = measurement[lang][key] || ''; // Добавляем перевод для каждого языка
    //     //     return acc;
    //     // }, {});
    //     //
    //     // setIngredientForUpdate((prev) => ({...prev, unit: updatedUnit}));
    //     setIsModalVisible(false);
    //     // console.log(setIngredientForUpdate)
    // }

    return (
        <View className="mb-5 ">

            {/*block lang*/}
            {
                totalLangRecipe.length > 1 && (
                    <View className="mb-2">
                        <Text className="mb-2 text-xl text-neutral-700 font-bold">Вид на языке
                            <Text className="capitalize text-amber-500"> {changeLang}</Text>
                        </Text>

                        <View className="flex-row flex-wrap gap-x-2 mb-2 items-center justify-around">
                            {
                                totalLangRecipe.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            style={changeLang === item ? shadowBoxBlack() : null}
                                            className={`border-[1px] border-neutral-500 rounded-2xl px-5 py-2 ${changeLang === item ? `bg-amber-500` : `bg-transparent`} `}
                                            key={index}
                                            onPress={() => {
                                                handleChangeLang(item)
                                            }}
                                        >
                                            <Text>{item}</Text>
                                        </TouchableOpacity>
                                    )
                                })
                            }
                        </View>
                    </View>
                )
            }

            <View className="">
                {
                    ingredients.map((ingredient, index) => {
                        const ingredientName = ingredient.ingredient[changeLang]; // Получаем название ингредиента на выбранном языке
                        const ingredientUnit = ingredient.unit[changeLang]; // Получаем название ингредиента на выбранном языке
                        return (
                            <View
                                key={index}
                                className="flex-row gap-x-4 items-center mb-2">
                                <View style={{height: 20, width: 20}} className="bg-amber-300 rounded-full"/>
                                <View className="flex-row flex-1 gap-x-2 ">

                                    <Text style={{fontSize: 16}} className="font-extrabold text-neutral-700">
                                        {ingredientName}
                                    </Text>
                                    <Text style={{fontSize: 16}} className="font-medium text-neutral-600">
                                        - {ingredient.quantity}

                                    </Text>
                                    <Text style={{fontSize: 16}} className="font-medium text-neutral-600 capitalize">
                                        {ingredientUnit}

                                    </Text>


                                </View>
                                {/*block remove update*/}
                                <View className="flex-row gap-x-3 ">

                                    {/*<TouchableOpacity*/}
                                    {/*    onPress={() => {updateIngredient(ingredient)}}*/}
                                    {/*    style={shadowBoxBlack()}*/}
                                    {/*    className="w-[40px] h-[40px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ">*/}
                                    {/*    <ArrowPathIcon size={20} color='white'/>*/}
                                    {/*</TouchableOpacity>*/}

                                    <TouchableOpacity
                                        style={shadowBoxBlack()}
                                        onPress={() => {
                                            removeIngredient(ingredient)
                                        }}
                                        className="w-[40px] h-[40px] bg-red-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ">
                                        <TrashIcon size={20} color='white'/>

                                    </TouchableOpacity>

                                </View>
                            </View>
                        )
                    })
                }
            </View>
            {/*/!*modal*!/*/}
            {/*<ModalCustom*/}
            {/*    isModalVisible={isModalVisible}*/}
            {/*    setIsModalVisible={setIsModalVisible}*/}
            {/*    animationType="fade"*/}
            {/*    ingredient={ingredientForUpdate}*/}
            {/*    setIngredient={setIngredientForUpdate}*/}
            {/*    array={measurementLangApp}*/}
            {/*    onPressHandler={onPressHandlerList}*/}
            {/*    // setIngredientForUpdate={setIngredientForUpdate}*/}
            {/*/>*/}

        </View>
    );
};

const styles = StyleSheet.create({});

export default ListIngredientsCreateRecipe;