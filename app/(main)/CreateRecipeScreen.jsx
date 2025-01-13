import React, {useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
// arrow-up-on-square

// icons
import {
    ArrowUpOnSquareStackIcon,
    ArrowUpOnSquareIcon,
} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../constants/shadow";
import {useAuth} from "../../contexts/AuthContext";
import ButtonBack from "../../components/ButtonBack";
import AddLangComponent from "../../components/CreateRecipeScreen/AddLangComponent";
import InputCustomComponent from "../../components/CreateRecipeScreen/InputCustomComponent";

const CreateRecipeScreen = () => {

    const {user: userId, language} = useAuth()
    console.log('creating recipe language', language)


    return (
        <SafeAreaView
            contentContainerStyle={{flex: 1}}
        >
            <ScrollView
                contentContainerStyle={{paddingHorizontal: 20, marginBottom: 20,}}
                showsVerticalScrollIndicator={false}
            >
                {/*title*/}
                <View className="  p-5">
                    <View className="absolute left-0 z-10">
                        <ButtonBack/>
                    </View>
                    <Text className="text-center mb-5">Create Recipe</Text>

                </View>
                {/* upload header image    */}
                <View
                    className="border-2 border-neutral-200 mb-5 w-full h-[200] rounded-[15] justify-center items-center"
                >
                    <Text className="mb-2">Upload yore header image</Text>
                    <ArrowUpOnSquareStackIcon size={50} color="green"/>
                </View>

                {/*    title recipe*/}
                <View>

                    <InputCustomComponent langDev={language}/>
                </View>

                <Text>
                    Мясо
                        Свинина
                        Говядина
                        Баранина
                    Рыба/ морепродукты
                    Птица
                        Курица
                        Перепела
                        Индейка
                        Утка
                        Другие птицы
                    Салаты
                        Мясные
                        Рыбные
                        Овощные
                        Эксклюзивные
                    Закуски
                        Сандвичи
                        Рыбные закуски
                        Мясные закуски
                    Десерт
                        Торты
                        Преложенные
                        Мороженое
                        Выпечка
                        Желе
                        Пряник
                        Конфеты
                        Печенье
                    Напитки
                        Смузи
                        Коктейль
                        Настойки

                </Text>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({});

export default CreateRecipeScreen;