import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ArrowUpOnSquareStackIcon} from "react-native-heroicons/mini";
import InputCustomComponent from "./InputCustomComponent";
import * as ImagePicker from "expo-image-picker";
import {compressImage100} from "../../lib/imageUtils";
import ViewImageListCreateRecipe from "./RecipeListCreateRecipe/ViewImageListCreateRecipe";
import SliderImagesListCreateRecipe from "./RecipeListCreateRecipe/SliderImagesListCreateRecipe";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";
import {TrashIcon} from "react-native-heroicons/mini"

const UploadHeaderImage = ({styleTextDesc, styleInput, langDev, setTotalLangRecipe, totalLangRecipe,setTotalRecipe,totalRecipe}) => {

    const [addImage, setAddImage] = useState([])
    const addImageRecipeList = async () => {
        // console.log('Add Recipe List');
        if (addImage.length >= 5) {
            Alert.alert("Вы достигли лимита изображений на один пункт.")
            return;
        }

        let res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (res && res.assets && res.assets[0]) {
            const originalUri = res.assets[0].uri;

            // Получаем размер оригинального изображения
            const originalRes = await fetch(originalUri);
            const originalBlob = await originalRes.blob();
            const originalSizeInMB = (originalBlob.size / (1024 * 1024)).toFixed(2);
            // console.log(`Original image size: ${originalSizeInMB} MB`);

            // Сжимаем изображение перед использованием
            // const compressedImage = await compressImage(originalUri, 1, 300, 300);
            const compressedImage = await compressImage100(originalUri, 0.1,);

            // Получаем размер сжатого изображения
            const compressedResponse = await fetch(compressedImage.uri);
            const compressedBlob = await compressedResponse.blob();
            const compressedSizeInMB = (compressedBlob.size / (1024 * 1024)).toFixed(2);
            // console.log(`Compressed image size: ${compressedSizeInMB} MB`);

            // Обновляем состояние
            setAddImage(prev => [...prev, compressedImage]);

            // Выводим обновленный список изображений
            // console.log('add image for recipe list', addImages);

            // console.log("addImage",addImage)

            // Выводим информацию в alert
            Alert.alert("Size image",
                `Original size: ${originalSizeInMB} MB\n` +
                `Compressed size:, ${compressedSizeInMB} MB`
            );
            setTotalRecipe((prevRecipe) => ({
                ...prevRecipe,
                imageHeader:compressedResponse.url
            }));
        } else {
            // console.error("Image selection canceled or failed", result);
            Alert.alert("Вы не добавили изображение")
        }
    };

    useEffect(() => {},[addImage])

    const handlerRemoveHeaderImage = () => {
        setAddImage([])
    };
    return (
        <View className="mb-5">

               {
                   addImage[0]?.uri
                       ? (
                           <View className="relative">
                               <TouchableOpacity
                                   onPress={handlerRemoveHeaderImage}
                                   className="absolute top-[-5] right-0 z-10"
                               >
                                   <ButtonSmallCustom
                                       icon={TrashIcon}
                                       bg={"red"}
                                   />
                               </TouchableOpacity>

                               <ViewImageListCreateRecipe
                                   image={addImage}
                               />
                           </View>

                       )
                       : (
                           <TouchableOpacity
                               onPress={addImageRecipeList}
                               className="border-2 border-neutral-200 w-full h-[200]  rounded-[15] justify-center "
                           >
                               <View className="items-center">
                                   <Text className="mb-2">Upload yore header image</Text>
                                   <ArrowUpOnSquareStackIcon size={50} color="green"/>
                               </View>
                           </TouchableOpacity>
                       )
               }


            {/*    title recipe*/}
            <View className="mb-5 mt-5">

                <InputCustomComponent
                    styleTextDesc={styleTextDesc}
                    styleInput={styleInput}
                    langDev={langDev}
                    setTotalLangRecipe={setTotalLangRecipe}
                    totalLangRecipe={totalLangRecipe}
                    setTotalRecipe={setTotalRecipe}
                    totalRecipe={totalRecipe}
                />
            </View>
        </View>
    );
};


export default UploadHeaderImage;