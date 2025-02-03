import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import AddLangComponent from "./AddLangComponent";
import {langArray} from "../../constants/langArray"

// icons
import {
    TrashIcon
} from "react-native-heroicons/mini";

const InputCustomComponent = ({styleTextDesc,styleInput,langDev, setTotalLangRecipe, totalLangRecipe}) => {

    // const languages = [
    //     {code: 'en', name: 'English'},
    //     {code: 'it', name: 'Italian'},
    //     {code: 'es', name: 'Spanish'},
    //     {code: 'ua', name: 'Ukrainian'},
    //     {code: 'ru', name: 'Russian'},
    // ];

    const [languages, setLanguages] = useState([])

    useEffect(() => {
        setLanguages(langArray);
    }, [languages])


    const [choiceLang, setChoiceLang] = useState(null);
    const [selectedLang, setSelectedLang] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [totLang, setTotLang] = useState([])
    useEffect(() => {

        const res = languages?.filter(language => language.code.toString() === langDev.toLowerCase())
        // console.log('res',res[0]?.name)
        setTotLang([res[0]?.name])
    }, [languages]);
    // console.log(langDev)

    const selectLanguage = (lang) => {
        setSelectedLang(lang);
        setModalVisible(false);
        setTotLang([...totLang, lang.name]);
        // setTotalLangRecipe([...totalLangRecipe, lang.code]);
        setTotalLangRecipe((prev) => [...prev, lang.code]) // Обновляем состояние в CreateRecipeScreen
        // console.log(`Selected language: ${lang.name}`);
    };
    // console.log(totLang)

    const removeLang = (lang) => {
        const res = totLang.filter((item) => item !== lang)
        console.log(' removeLang lang', lang)
        const updatedLangCodes = totalLangRecipe.filter((code) => {
            const langObj = languages.find((l) => l.code === code);
            return langObj?.name !== lang;
        });
        setTotLang(res);
        console.log(' removeLang updatedLangCodes', updatedLangCodes)
        setTotalLangRecipe(updatedLangCodes); // Передаем обновленный список языков
    }

    return (
        <View>

            {
                totLang && totLang.map((lang, index) => {
                    console.log('totLang', lang)
                    return (
                        <View key={index}
                              className="mb-5"

                        >
                            <Text
                                style={styleTextDesc}
                                // className="pl-2 mb-2"
                            >Language {lang}</Text>
                            <View className="flex-row items-center ">
                                <TextInput
                                    style={styleInput}
                                    placeholder="Enter new recipe name"
                                    placeholderTextColor='grey'
                                />
                                {
                                    totLang[0] !== lang && (
                                        <TouchableOpacity
                                            // style={shadowBoxBlack()}
                                            onPress={() => removeLang(lang)}
                                            className="w-[60] h-[60] ml-2 bg-red-500 border-[1px] border-neutral-300 rounded-[10] justify-center items-center">
                                            <TrashIcon color="white" size={30}/>
                                        </TouchableOpacity>
                                    )
                                }

                            </View>
                        </View>
                    )
                })
            }


            <AddLangComponent
                languages={languages}
                selectLanguage={selectLanguage}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                totLang={totLang}
                langDev={langDev}

            />
        </View>
    );
};


export default InputCustomComponent;