import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {shadowBoxBlack} from "../../../constants/shadow";
import {PlusIcon, ScaleIcon} from "react-native-heroicons/mini";

const RecipeListCreateRecipe = () => {
    return (
        <View>
            <Text>
                Здесь вы можете написать рецепт в виде текста или в виде пунктов
                также вы можете добавить фото на каждый пункт можно добавить
                одно фото или если их несколько они будут в виде слайдера
            </Text>

            <TextInput
                className="border-2 border-neutral-500  rounded-[15] p-2"
                multiline={true}
                minLength={10}
            />

            <View className="flex-row ">
                <TouchableOpacity
                    // onPress={() => setIsModalVisible(true)}
                    style={shadowBoxBlack()}
                    className="w-[40px] h-[40px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                    <ScaleIcon color="white" size={20}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={shadowBoxBlack()}
                    // onPress={addIngredient}
                    className="w-[40px] h-[40px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                    <PlusIcon color="white" size={20}/>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({});

export default RecipeListCreateRecipe;