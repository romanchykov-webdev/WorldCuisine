import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

const InputCreateRecipeScreenCustom = ({title,placeholderText,placeholderColor,totalLangRecipe}) => {



    return (
       <View>

           {/*/!*title*!/*/}
           {/*<Text>{title}</Text>*/}

           {/*input*/}
           <TextInput
               className="flex-1 border-2 border-neutral-200 p-3 rounded-[5] mb-2 mr-[1] h-[40]"
               placeholder={placeholderText}
               placeholderTextColor={placeholderColor}
           />
       </View>
    );
};

const styles = StyleSheet.create({});

export default InputCreateRecipeScreenCustom;