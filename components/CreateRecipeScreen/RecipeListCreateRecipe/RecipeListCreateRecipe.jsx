import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {shadowBoxBlack} from "../../../constants/shadow";
import {PlusIcon, PhotoIcon} from "react-native-heroicons/mini";

const RecipeListCreateRecipe = ({placeholderText, placeholderColor,totalLangRecipe}) => {

    console.log(totalLangRecipe)

    const [textArea, setTextArea] = useState('')

    const [recipeArray, setRecipeArray] = useState({
        "": {
            "text": "",
            "images": []
        }
    })

    const addStepRecipe = () => {

    }

    return (
        <View>
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
                            className="border-2 border-neutral-500  rounded-[15] p-2 mb-3"
                            value={textArea}
                            onChangeText={value => setTextArea(value)}
                            placeholder={`${placeholderText} ${item}`}
                            placeholderTextColor={placeholderColor}
                            multiline={true}
                            minLength={10}
                            style={{minHeight: 100}}
                        />
                    )

                })
            }


            <View className="flex-row gap-x-2">
                <TouchableOpacity
                    // onPress={() => setIsModalVisible(true)}
                    style={shadowBoxBlack()}
                    className="flex-1 h-[50px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ">
                    <PhotoIcon color="white" size={20}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={shadowBoxBlack()}
                    // onPress={addIngredient}
                    className="flex-1 h-[50px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ">
                    <PlusIcon color="white" size={20}/>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({});

export default RecipeListCreateRecipe;