import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ArrowUpOnSquareStackIcon} from "react-native-heroicons/mini";
import InputCustomComponent from "./InputCustomComponent";

const UploadHeaderImage = ({styleTextDesc,styleInput, langDev, setTotalLangRecipe, totalLangRecipe}) => {
    return (
        <View className="mb-5">
            <View
                className="border-2 border-neutral-200 mb-5 w-full h-[200] rounded-[15] justify-center items-center"
            >
                <Text className="mb-2">Upload yore header image</Text>
                <ArrowUpOnSquareStackIcon size={50} color="green"/>
            </View>

            {/*    title recipe*/}
            <View className="mb-5">

                <InputCustomComponent
                    styleTextDesc={styleTextDesc}
                    styleInput={styleInput}
                    langDev={langDev}
                    setTotalLangRecipe={setTotalLangRecipe}
                    totalLangRecipe={totalLangRecipe}
                />
            </View>
        </View>
    );
};


export default UploadHeaderImage;