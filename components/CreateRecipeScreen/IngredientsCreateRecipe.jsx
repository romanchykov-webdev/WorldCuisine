import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {TrashIcon, PlusIcon,ScaleIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../constants/shadow";

const IngredientsCreateRecipe = () => {

    const [ingredients, setIngredients] = useState([])

    return (
        <View>
            <Text className="text-neutral-700 text-xs mb-3">
                Добавьте все ингредиенты и их количество для приготовления
                рецепта.
            </Text>

           <View className=" flex-row  items-center ">
                  <TextInput
                      placeholder="Ingredients"
                      placeholderTextColor="gray"
                      className="flex-1 border-2 border-neutral-200 p-3 rounded-[5]  h-[40px]"
                  />
               <TouchableOpacity
                   style={shadowBoxBlack()}
                   // onPress={() => removeLang(lang)}
                   className="w-[40px] h-[40px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                   <ScaleIcon color="white" size={20} />
               </TouchableOpacity>
               <TouchableOpacity
                   style={shadowBoxBlack()}
                   // onPress={() => removeLang(lang)}
                   className="w-[40px] h-[40px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                   <PlusIcon color="white" size={20} />
               </TouchableOpacity>
           </View>
        </View>
    );
};

const styles = StyleSheet.create({});

export default IngredientsCreateRecipe;