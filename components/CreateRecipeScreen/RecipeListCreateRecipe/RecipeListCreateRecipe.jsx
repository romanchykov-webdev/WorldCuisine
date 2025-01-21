import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {shadowBoxBlack} from "../../../constants/shadow";
import {PlusIcon, PhotoIcon} from "react-native-heroicons/mini";

const RecipeListCreateRecipe = ({placeholderText, placeholderColor,totalLangRecipe}) => {

    const [changeLang, setChangeLang] = useState(totalLangRecipe[0])
    const handleChangeLang = (item) => {
        setChangeLang(item)
    }

    const [recipeArray, setRecipeArray] = useState(() => {
        // Инициализируем пустой объект для каждого языка
        const initialArray = {};
        totalLangRecipe.forEach(lang => {
            initialArray[lang] = { text: '', images: [] };
        });
        return initialArray;
    });

    // console.log(recipeArray)

    const handleTextChange = (lang, value) => {
        setRecipeArray(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                text: value
            }
        }));
    };

    const addStepRecipe = () => {
        setRecipeArray((prev) => {
            const updatedArray = { ...prev };

            totalLangRecipe.forEach((lang) => {
                // Убедимся, что структура для языка существует
                if (!updatedArray[lang]) {
                    updatedArray[lang] = {};
                }

                // Найти следующий номер шага
                const steps = Object.keys(updatedArray[lang])
                    .filter((key) => !isNaN(Number(key)))
                    .map(Number);
                const nextStep = steps.length > 0 ? Math.max(...steps) + 1 : 1;

                // Добавляем новый шаг
                updatedArray[lang][nextStep] = {
                    images: [],
                    text: updatedArray[lang].text || '', // Если есть текст, переносим его
                };

                // Очищаем текст, если он был перенесен
                if (updatedArray[lang].text) {
                    delete updatedArray[lang].text;
                }
            });

            console.log('Updated Recipe Array with Steps:', JSON.stringify(updatedArray,null,2));
            return updatedArray;
        });
    };




    // const resetFields = () => {
    //     // Очищаем все текстовые поля
    //     setRecipeArray(prev => {
    //         const clearedArray = {};
    //         totalLangRecipe.forEach(lang => {
    //             clearedArray[lang] = { ...prev[lang], text: '' };
    //         });
    //         return clearedArray;
    //     });
    // };

    return (
        <View>

            {/*show result description*/}

            <View>
                {/*block lang*/}
                {
                    totalLangRecipe?.length > 1 && (
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

                {
                    // Проверяем, есть ли данные для выбранного языка
                    recipeArray[changeLang] && Object.keys(recipeArray[changeLang]).map((stepIndex) => {
                        // Выводим только те элементы, которые являются шагами (то есть числами)
                        if (!isNaN(Number(stepIndex))) {
                            return (
                                <View key={stepIndex} className="mb-2">
                                    <Text>
                                        <Text className="text-amber-500">
                                            {stepIndex}) {" "}
                                        </Text>
                                        {recipeArray[changeLang][stepIndex]?.text}
                                    </Text>

                                    <View>
                                        {

                                            recipeArray[changeLang][stepIndex]?.images.length > 0 &&(
                                                <View>
                                                    <Text>foto</Text>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            );
                        }
                    })
                }

            </View>

            <Text>
                Здесь вы можете написать рецепт в виде текста или в виде пунктов
                также вы можете добавить фото на каждый пункт можно добавить
                одно фото или если их несколько они будут в виде слайдера
            </Text>

            {
                totalLangRecipe?.map((item, index) => {
                    return (
                        <TextInput
                            key={index}
                            className="border-2 border-neutral-500 rounded-[15] p-2 mb-3"
                            value={recipeArray[item]?.text || ""}
                            onChangeText={value => handleTextChange(item, value)}
                            placeholder={`${placeholderText} ${item}`}
                            placeholderTextColor={placeholderColor}
                            multiline={true}
                            style={{ minHeight: 100 }}
                        />
                    )

                })
            }


            <View className="flex-row gap-x-2">
                <TouchableOpacity
                    style={shadowBoxBlack()}
                    className="flex-1 h-[50px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center">
                    <PhotoIcon color="white" size={20} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={shadowBoxBlack()}
                    onPress={addStepRecipe}
                    className="flex-1 h-[50px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center">
                    <PlusIcon color="white" size={20} />
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

const styles = StyleSheet.create({});

export default RecipeListCreateRecipe;