import React, {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    // Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {TrashIcon, PlusIcon, ScaleIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../../constants/shadow";
import Slider from "@react-native-community/slider";
import ListIngredientsCreateRecipe from "./ListIngredientsCreateRecipe";
import ModalCustom from "../../ModalCustom";

const IngredientsCreateRecipe = ({placeholderText, placeholderColor, langApp, measurement, totalLangRecipe}) => {

    // console.log("measurement",measurement)
    // console.log(totalLangRecipe)

    const [ingredient, setIngredient] = useState({
        unit: totalLangRecipe.reduce((acc, lang) => ({...acc, [lang]: ''}), {}),
        "quantity": 1,
        ingredient: totalLangRecipe.reduce((acc, lang) => ({...acc, [lang]: ''}), {})
        // "ingredient": []
        // "ingredient": Array(totalLangRecipe.length).fill('') // Инициализируем пустыми строками
    })



    const [isModalVisible, setIsModalVisible] = useState(false);

    // массив по ключу
    const [measurementLangApp, setMeasurementLangApp] = useState([])
    // console.log(measurementLangApp)

    const [ingredients, setIngredients] = useState([]);


    useEffect(() => {
        if (measurement[langApp]) {
            setMeasurementLangApp(Object.entries(measurement[langApp]).map(([key, val]) => ({key, val})));
        }
    }, [measurement, langApp]);

    const addIngredient = () => {
        // Проверяем, заполнены ли все поля
        if (Object.values(ingredient.unit).some(u => u.trim() === '') || Object.values(ingredient.ingredient).some(i => i.trim() === '')) {
            Alert.alert('Заполните все поля ингредиента');
            return;
        }
        // Добавляем новый ингредиент в массив ingredients
        setIngredients((prev) => [
            ...prev,
            {
                ingredient: {...ingredient.ingredient},
                quantity: ingredient.quantity,
                unit: {...ingredient.unit}  // Добавляем unit с переводами
            }
        ]);

        // Сбрасываем состояние для нового ингредиента
        setIngredient({
            unit: totalLangRecipe.reduce((acc, lang) => ({...acc, [lang]: ''}), {}),
            quantity: 1,
            ingredient: totalLangRecipe.reduce((acc, lang) => ({...acc, [lang]: ''}), {})
        });

    };


    const handleInputChange = (lang, value) => {
        setIngredient((prev) => {
            return {
                ...prev,
                ingredient: {
                    ...prev.ingredient,
                    [lang]: value // Обновляем конкретный язык
                }
            };
        });
    };

    const handleSelectUnit = (key) => {
        // setIngredient((prev) => ({...prev, unit: key}));
        // setIsModalVisible(false);
        const updatedUnit = totalLangRecipe.reduce((acc, lang) => {
            acc[lang] = measurement[lang][key] || ''; // Добавляем перевод для каждого языка
            return acc;
        }, {});

        setIngredient((prev) => ({...prev, unit: updatedUnit}));
        setIsModalVisible(false);
        console.log(setIngredient)
    };


    useEffect(() => {
        // console.log('Current Ingredient:', ingredient); // Для проверки значений
        // console.log('Current Ingredients:', ingredients); // Для проверки значений
    }, [ingredient, ingredients]);


    return (
        <View>

            {/*block visual ingredients*/}
            {
                ingredients.length > 0 && (
                    <View className="mb-2">
                        <ListIngredientsCreateRecipe
                            ingredients={ingredients}
                            setIngredients={setIngredients}
                            totalLangRecipe={totalLangRecipe}

                        />
                    </View>
                )
            }


            <View className=" flex-row  items-center bg-black-500">

                <View className="flex-1">
                    {
                        totalLangRecipe.map((lang, index) => (
                            <View key={index} className="mb-2">
                                <InputCustom
                                    placeholderText={`${placeholderText} ${lang}`}
                                    placeholderColor={placeholderColor}
                                    value={ingredient.ingredient[lang] || ''}
                                    handleChange={(value) => handleInputChange(lang, value)}
                                />
                            </View>
                        ))
                    }
                </View>

                <View className="flex-row ">
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        style={shadowBoxBlack()}
                        className="w-[40px] h-[40px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                        <ScaleIcon color="white" size={20}/>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={shadowBoxBlack()}
                        onPress={addIngredient}
                        className="w-[40px] h-[40px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                        <PlusIcon color="white" size={20}/>
                    </TouchableOpacity>
                </View>


            </View>

            {/*modal*/}
            <ModalCustom
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                animationType="fade"
                ingredient={ingredient}
                setIngredient={setIngredient}
                array={measurementLangApp}
                onPressHandler={handleSelectUnit}
            />



        </View>
    );
};


export const InputCustom = ({placeholderText, placeholderColor, handleChange, value}) => {
    return (
        <TextInput
            onChangeText={handleChange}
            value={value}
            placeholder={placeholderText}
            placeholderTextColor={placeholderColor}
            className="flex-1 border-2 border-neutral-200 p-3 rounded-[5] h-[40px]"
        />
    );
};


const styles = StyleSheet.create({

});
export default IngredientsCreateRecipe;