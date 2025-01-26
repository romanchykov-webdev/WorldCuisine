import React, {useEffect, useState} from 'react';
import {Alert,  Text, TextInput, TouchableOpacity, View} from 'react-native';
import {shadowBoxBlack} from "../../../constants/shadow";
import {PlusIcon, PhotoIcon, TrashIcon} from "react-native-heroicons/mini";
import * as ImagePicker from 'expo-image-picker';
import {compressImage100} from "../../../lib/imageUtils";
import ViewImageListCreateRecipe from "./ViewImageListCreateRecipe";
import SliderImagesListCreateRecipe from "./SliderImagesListCreateRecipe";
import Animated, {FadeInDown} from "react-native-reanimated";
import ButtonSmallCustom from "../../Buttons/ButtonSmallCustom";

const RecipeListCreateRecipe = ({placeholderText, placeholderColor, totalLangRecipe}) => {

    const [addImages, setAddImages] = useState([])
    useEffect(() => {
    }, [addImages])

    const [changeLang, setChangeLang] = useState(totalLangRecipe[0])
    const handleChangeLang = (item) => {
        setChangeLang(item)
    }

    const [recipeArray, setRecipeArray] = useState(() => {
        // Инициализируем пустой объект для каждого языка
        const initialArray = {};
        totalLangRecipe.forEach(lang => {
            initialArray[lang] = {text: '', images: []};
        });
        return initialArray;
    });
    // console.log(recipeArray)

    const handleTextChange = (lang, value) => {
        setRecipeArray(prev => ({
            ...prev,
            [lang]: {
                ...prev[lang],
                text: value
            }
        }));
    };


    const addImageRecipeList = async () => {
        // console.log('Add Recipe List');
        if (addImages.length >= 5) {
            Alert.alert("Вы достигли лимита изображений на один пункт.")
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (result && result.assets && result.assets[0]) {
            const originalUri = result.assets[0].uri;

            // Получаем размер оригинального изображения
            const originalResponse = await fetch(originalUri);
            const originalBlob = await originalResponse.blob();
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
            setAddImages(prev => [...prev, compressedImage]);

            // Выводим обновленный список изображений
            // console.log('add image for recipe list', addImages);



            // Выводим информацию в alert
            Alert.alert("Size image",
                `Original size: ${originalSizeInMB} MB\n` +
                `Compressed size:, ${compressedSizeInMB} MB`
            );
        } else {
            // console.error("Image selection canceled or failed", result);
            Alert.alert("Вы не добавили изображение")
        }
    };

    const addStepRecipe = () => {
        // console.log(recipeArray);

        // Проверка на наличие пустых полей
        const hasEmptyFields = totalLangRecipe.some((lang) => {
            const text = recipeArray[lang]?.text;
            return typeof text !== 'string' || !text.trim();
        });

        if (hasEmptyFields) {
            Alert.alert('Ошибка добавления.', 'Заполните все поля перед добавлением нового шага.');
            return;
        }

        setRecipeArray((prev) => {
            const updatedArray = {...prev};

            // Проверяем все языки на наличие пустых шагов
            // for (const lang of totalLangRecipe) {
            //     const steps = Object.keys(updatedArray[lang] || {})
            //         .filter((key) => !isNaN(Number(key))) // Только числовые ключи
            //         .map((key) => updatedArray[lang][key]?.text);
            //
            //     if (steps.some((stepText) => !stepText?.trim())) {
            //         Alert.alert('Ошибка stepText', 'Заполните все поля перед добавлением нового шага.');
            //         return prev;
            //     }
            // }

            // Добавляем новый шаг для каждого языка
            totalLangRecipe.forEach((lang) => {
                const steps = Object.keys(updatedArray[lang] || {})
                    .filter((key) => !isNaN(Number(key)))
                    .map(Number);

                const nextStep = steps.length > 0 ? Math.max(...steps) + 1 : 1;

                // Убедимся, что структура языка существует
                updatedArray[lang] = {
                    ...updatedArray[lang],
                    [nextStep]: {
                        images: addImages,
                        text: updatedArray[lang]?.text?.trim() || '',
                    },
                };

                // Удаляем текст на верхнем уровне
                delete updatedArray[lang]?.text;
            });

            setAddImages([]);
            // console.log('Updated Recipe Array with Steps:', JSON.stringify(updatedArray, null, 2));
            return updatedArray;
        });
    };

    const removeStepRecipe = (item) => {
        console.log("remove stepRecipe", item);
        console.log("remove stepRecipe recipeArray", recipeArray);


        setRecipeArray((prevArray) => {
            const updatedArray = {...prevArray}; // Создаем копию текущего состояния

            // Перебираем все языки в объекте
            Object.keys(updatedArray).forEach((lang) => {
                // Проверяем, есть ли шаг с номером item (номер шага)
                if (updatedArray[lang][item]) {
                    // Удаляем шаг по номеру
                    delete updatedArray[lang][item];
                }
            });

            console.log("Updated recipeArray after removal:", updatedArray);
            return updatedArray; // Возвращаем обновленный объект
        });


    }


    // add image for list recipe
    // const addImageRecipeList=async () => {
    //     console.log('Add Recipe List');
    //     // setChangeLang()
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ['images'],
    //         // mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         aspect: [1, 1],
    //         quality: 1,
    //     });
    //
    //     if (result) {
    //         // Сжимаем изображение перед использованием
    //         const compressedImage = await compressImage(result.assets[0].uri, 0.7, 300, 300);
    //         setAddImages(prev=>[...prev,  compressedImage]);
    //         // console.log('Compressed image:', compressedImage);
    //         // setUser({...user, avatar: result.assets[0]});
    //         console.log('add image for recipe list', addImages);
    //     } else {
    //         console.error("Image selection canceled or failed", result);
    //     }
    // }




    // const resetFields = () => {
    //     // Очищаем все текстовые поля
    //     setRecipeArray(prev => {
    //         const clearedArray = {};
    //         totalLangRecipe.forEach(lang => {
    //             clearedArray[lang] = { ...prev[lang], text: '' };
    //         });
    //         return clearedArray;
    //     });
    // };

    return (
        <View >

            {/*show result description*/}

            <View>
                {/*block lang*/}
                {
                    totalLangRecipe?.length > 1 && (
                        <View className="mb-2">
                            <Text className="mb-2 text-xl text-neutral-700 font-bold">Вид на языке
                                <Text className="capitalize text-amber-500"> {changeLang}</Text>
                            </Text>

                            <View className="flex-row flex-wrap gap-x-2 mb-2 items-center justify-around">
                                {
                                    totalLangRecipe.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                style={changeLang === item ? shadowBoxBlack() : null}
                                                className={`border-[1px] border-neutral-500 rounded-2xl px-5 py-2 ${changeLang === item ? `bg-amber-500` : `bg-transparent`} `}
                                                key={index}
                                                onPress={() => {
                                                    handleChangeLang(item)
                                                }}
                                            >
                                                <Text>{item}</Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    )
                }

                {
                    // Проверяем, есть ли данные для выбранного языка
                    recipeArray[changeLang] && Object.keys(recipeArray[changeLang]).map((stepIndex, index) => {
                        // Выводим только те элементы, которые являются шагами (то есть числами)
                        if (!isNaN(Number(stepIndex))) {
                            return (
                                <Animated.View
                                    entering={FadeInDown.duration(300).springify()}
                                    key={stepIndex} className="mb-5 ">
                                    <View className="flex-1 flex-row">
                                        <Text className="mb-2 flex-1">
                                            <Text className="text-amber-500">
                                                {/*{stepIndex}) {" "}*/}
                                                {index + 1}) {" "}
                                            </Text>
                                            {recipeArray[changeLang][stepIndex]?.text}
                                        </Text>

                                        {/*    button remove */}
                                        <TouchableOpacity
                                            onPress={() => {
                                                removeStepRecipe(stepIndex)
                                            }}
                                            style={shadowBoxBlack()}
                                        >
                                            <ButtonSmallCustom icon={TrashIcon} color="white" bg="#EF4444"/>
                                        </TouchableOpacity>
                                    </View>

                                    <View>
                                        {

                                            recipeArray[changeLang][stepIndex]?.images.length > 0 && (
                                                recipeArray[changeLang][stepIndex]?.images.length === 1 ? (
                                                    <ViewImageListCreateRecipe
                                                        image={recipeArray[changeLang][stepIndex]?.images}
                                                    />
                                                ) : (
                                                    <SliderImagesListCreateRecipe
                                                        createRecipe={true}
                                                        images={recipeArray[changeLang][stepIndex]?.images}
                                                    />
                                                )
                                            )
                                        }
                                    </View>
                                </Animated.View>
                            );
                        }
                    })
                }

            </View>

            <Text>
                Здесь вы можете написать рецепт в виде текста или в виде пунктов
                также вы можете добавить фото на каждый пункт можно добавить
                одно фото или если их несколько они будут в виде слайдера максимальное
                количество изображений на один пункт 5 изображений.
            </Text>

            {
                totalLangRecipe?.map((item, index) => {
                    return (
                        <TextInput
                            key={index}
                            className="border-2 border-neutral-500 rounded-[15] p-2 mb-3"
                            value={recipeArray[item]?.text || ""}
                            onChangeText={value => handleTextChange(item, value)}
                            placeholder={`${placeholderText} ${item}`}
                            placeholderTextColor={placeholderColor}
                            multiline={true}
                            style={{minHeight: 100}}
                        />
                    )

                })
            }


            <View className="flex-row gap-x-2 ">
                <TouchableOpacity
                    onPress={addImageRecipeList}
                    style={shadowBoxBlack()}
                    className="flex-1 h-[50px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ">
                    <PhotoIcon color="white" size={20}/>
                    {
                        addImages?.length > 0 && (
                            <Animated.View
                                entering={FadeInDown.duration(200).springify()}  // Добавим нужную анимацию с параметрами
                                style={[
                                    shadowBoxBlack({
                                        offset: {width: 1, height: 1},
                                    }),
                                    {
                                        position: 'absolute',
                                        top: -5,
                                        right: 10,
                                        width: 25,
                                        height: 25,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }
                                ]}
                                className="border-2 border-neutral-500 rounded-3xl bg-violet-700"
                            >
                                <Text className="text-neutral-900 text-[16px]">
                                    {addImages?.length}
                                </Text>
                            </Animated.View>
                        )
                    }

                </TouchableOpacity>

                <TouchableOpacity
                    style={shadowBoxBlack()}
                    onPress={addStepRecipe}
                    className="flex-1 h-[50px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center">
                    <PlusIcon color="white" size={20}/>
                </TouchableOpacity>

                {/*<TouchableOpacity*/}
                {/*    style={shadowBoxBlack()}*/}
                {/*    onPress={resetFields}*/}
                {/*    className="flex-1 h-[50px] bg-red-500 border-2 border-neutral-300 rounded-[10] justify-center items-center">*/}
                {/*    <Text style={{ color: 'white' }}>Reset</Text>*/}
                {/*</TouchableOpacity>*/}
            </View>

        </View>
    );
};


export default RecipeListCreateRecipe;