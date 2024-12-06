import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {shadowBoxBlack} from "../constants/shadow";
import {changeLanguage} from "i18next";

const ChangeLangScreen = () => {

    // Список языков с их названиями
    const languageNames = {
        en: 'English',
        ru: 'Русский',
        it: 'Italiano',
        ua: 'Українська',
        es: 'Español',
    };
    const languages = Object.keys(languageNames); // Массив ключей (кодов языков)
    const [lang, setLang] = useState('en')


    const changeLanguage=async (item)=>{
        setLang(item)



    }

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{gap: 20, padding: 20}}
        >
            {
                languages.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={()=>changeLanguage(item)}
                            style={shadowBoxBlack({
                                offset: {width: 0, height: 1},
                                radius: 2,
                                elevation: 2,
                            })}
                            className={`p-5 mb-5 items-center justify-center flex-row w-full border-[1px] 
                                        border-neutral-300 rounded-full 
                                        ${lang === item ? 'bg-green-300' : 'bg-amber-300'}`
                            } // Изменение цвета для выбранного языка

                        >
                            <Text>{languageNames[item]}</Text>
                        </TouchableOpacity>
                    )
                })
            }


        </ScrollView>
    );
};

const styles = StyleSheet.create({})

export default ChangeLangScreen;
