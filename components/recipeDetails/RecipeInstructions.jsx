import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoadingComponent from "../loadingComponent";

const RecipeInstructions = ({instructions,langDev}) => {

    // console.log("RecipeInstructions instructions ",JSON.stringify(instructions,null,2));
    // console.log("RecipeInstructions langDev ",langDev)

    // Проверяем, есть ли язык, соответствующий langDev
    const selectedLang = instructions.lang[langDev]
        ? instructions.lang[langDev]
        : Object.values(instructions.lang)[0]; // Если языка нет, берем первый доступный

    // console.log('selectedLang',selectedLang)

    // Преобразуем объект в массив для FlatList
    const steps = Object.entries(selectedLang).map(([key, value]) => ({
        step: key,
        ...value,
    }));

    console.log('steps',steps)


  return (
    <View >
        {
            steps
            ?(
                <>
                    {
                        steps.map((item,index) => {
                            return (
                                <View key={index} className="w-full bg-red-500">
                                    <View className="flex-row"
                                        style={{flexWrap: 'wrap'}}
                                        >
                                        <Text>{item.step}) </Text>
                                        <Text className="flex-wrap">{item.text}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </>
                )
                :(
                    <View>
                        <LoadingComponent/>
                    </View>
                )
        }
    </View>
  );
};

const styles = StyleSheet.create({})

export default RecipeInstructions;
