import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Image} from 'expo-image'
import {shadowBoxBlack} from "../../../constants/shadow";

const ViewImageListCreateRecipe = ({image}) => {

    // console.log('ViewImageListCreateRecipe',image[0].uri);
    return (
        <View className="p-[1px]">
           <View style={ shadowBoxBlack({
               offset : {width: 1, height: 1}, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
               opacity : 0.9, // Прозрачность тени (по умолчанию 30%)
           })}>
               <Image
                   source={image[0]?.uri}
                   transition={100}
                   style={styles.image}
                   contentFit="cover" // Заменяем resizeMode на contentFit для 'expo-image'
               />
           </View>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        height: 250,
        borderCurve: 'continuous',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
    }
});

export default ViewImageListCreateRecipe;