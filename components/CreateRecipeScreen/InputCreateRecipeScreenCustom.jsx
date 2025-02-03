import React from 'react';
import {StyleSheet,  TextInput, View} from 'react-native';

const InputCreateRecipeScreenCustom = ({styleInput,placeholderText,placeholderColor}) => {



    return (
       <View className="mb-2">

           {/*/!*title*!/*/}
           {/*<Text>{title}</Text>*/}

           {/*input*/}
           <TextInput
               style={styleInput}
               // style={{fontSize:hp(2)}}
               // className="flex-1 border-[1px] border-neutral-700 p-5
               //  rounded-[15] "
               placeholder={placeholderText}
               placeholderTextColor={placeholderColor}
           />
       </View>
    );
};


export default InputCreateRecipeScreenCustom;