import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {shadowBoxBlack, shadowBoxWhite} from "../constants/shadow";
import {changeLanguage} from "i18next";
import ButtonBack from "../components/ButtonBack";
import {ArrowUturnLeftIcon} from "react-native-heroicons/outline";
import {useRouter} from "expo-router";

const ChangeLangScreen = () => {

    const router=useRouter()

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
        // console.log('ChangeLangScreen lang',item)



    }

    const handleBack = (selectedLang) => {
        // console.log('selectedLang',selectedLang)
        router.replace({ pathname: '/(auth)/RegistrationScreen', params: { lang: selectedLang } });
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{gap: 20, padding: 20}}
        >
            <View>
                <TouchableOpacity
                    onPress={() => handleBack(lang)}
                    className="w-[50] h-[50] justify-center items-center bg-white rounded-full"
                    style={shadowBoxWhite()}
                >
                    <ArrowUturnLeftIcon size={30} color='gray'/>


                </TouchableOpacity>
            </View>
            {
                languages.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            // onPress={()=>changeLanguage(item)}
                            onPress={() => {
                                changeLanguage(item); // Обновляем локальный язык
                                handleBack(item); // Возвращаемся с выбранным языком
                            }}
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
