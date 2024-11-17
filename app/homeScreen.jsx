import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity} from 'react-native';
import {BellIcon} from "react-native-heroicons/outline";
import {hp} from "../constants/responsiveScreen";
import {StatusBar} from "expo-status-bar";
import {MagnifyingGlassIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../constants/shadow";
import Categories from "../components/Categories";
import {getCategories} from "../api";
import Recipes from "../components/Rrecipes";

const HomeScreen = () => {

    const [activeCategory, setActiveCategory] = useState('')
    // console.log('activeCategory',activeCategory)

    const [categories, setCategories] = useState([])

    useEffect(()=>{

        // Вызов функции getCategories и присваивание данных в состояние
        const fetchCategories=async()=>{
            const data=await getCategories()
            // console.log('data',data.categories)
            setCategories(data.categories)
        }

        fetchCategories()
    },[])

    return (
        <View className="flex-1">
            <StatusBar style='darck'/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}
                className="gap-y-6 pt-14 mx-4"
            >

                {/*avatar snd ball*/}
                <View className="flex-row  justify-between items-center mb-5">

                    <Image
                        source={require('../assets/img/user_icon.png')}
                        className="rounded-full border-[1px] border-neutral-500"
                        style={{width: hp(5), height: hp(5)}}
                        resizeMode="cover"
                    />
                    <BellIcon size={hp(4)} color="gray"/>
                </View>

                {/*    greetings and punchline*/}
                <View gap-y-2>
                    <Text style={{fontSize: hp(1.7)}} className="text-neutral-700">Hello, Serioga!</Text>

                    <View>
                        <Text style={{fontSize: hp(3)}} className="font-semibold text-neutral-700">
                            Make your own food,
                        </Text>
                        <Text style={{fontSize: hp(3)}} className="font-semibold text-neutral-700">
                            stay at <Text className="text-amber-500">home</Text>
                        </Text>
                    </View>
                </View>

                {/*?search bar*/}
                <View
                    style={shadowBoxBlack}
                    className="rounded-full bg-black/5 p-[6] mt-5 mb-5"
                >
                    <View className="flex-row items-center rounded-full bg-transparent">
                        <TextInput
                            placeholder="Search any food"
                            placeholderTextColor="gray"
                            style={[{fontSize: hp(1.7)}]}
                            className="flex-1 text-base tracking-wider p-3 mb-1"
                        />
                        <TouchableOpacity

                            className="bg-white rounded-full p-5">
                            <MagnifyingGlassIcon size={hp(2.5)} color="gray"/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/*    categories*/}
                {
                    categories.length>0 &&(
                        <Categories categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}/>
                    )
                }

            {/*    recipes*/}
                <Recipes categories={categories.length}/>



            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({})

export default HomeScreen;
