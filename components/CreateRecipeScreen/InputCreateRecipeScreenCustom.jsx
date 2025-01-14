import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';

const InputCreateRecipeScreenCustom = ({title,placeholderText,placeholderColor,totalLangRecipe}) => {



    return (
       <View>

           {/*/!*title*!/*/}
           {/*<Text>{title}</Text>*/}

           {/*input*/}
           <TextInput
               className=""
               placeholder={placeholderText}
               placeholderTextColor={placeholderColor}
           />
       </View>
    );
};

const styles = StyleSheet.create({});

export default InputCreateRecipeScreenCustom;