import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity} from 'react-native';
import {BellIcon} from "react-native-heroicons/outline";
import {hp} from "../constants/responsiveScreen";
import {StatusBar} from "expo-status-bar";
import {MagnifyingGlassIcon, Cog6ToothIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../constants/shadow";
import Categories from "../components/Categories";
import {getCategories, getRecipes} from "../api";
import Recipes from "../components/Rrecipes";
import {useRouter} from "expo-router";
import SearchComponent from "../components/SearchComponent";
import HeaderComponent from "../components/HeaderComponent";

// import kategory
import {categoryData} from '../constants/fakeData'
import {useAuth} from "../contexts/AuthContext";

const HomeScreen = () => {
    const{user,setAuth,setUserData} = useAuth();
    const [isAuth, setIsAuth] = useState(null)

    useEffect(() => {
        if(user){
            setIsAuth(true)
        }
    },[])


    const router = useRouter();

    const [activeCategory, setActiveCategory] = useState('Beef')
    // console.log('activeCategory',activeCategory)

    // const [categories, setCategories] = useState([])
    const [categories, setCategories] = useState(categoryData)
    // Вызов функции getCategories и присваивание данных в состояние
    // const fetchCategories = async () => {
    //     const data = await getCategories()
    //     console.log('data',data.categories)
    //     setCategories(data.categories)
    // }

    // Вызов функции fetchRecipes и присваивание данных в состояние
    const [recipes, setRecipes] = useState([])
    const fetchRecipes = async () => {
        const data = await getRecipes(activeCategory)
        // console.log('data',data)
        setRecipes(data)
    }


    useEffect(() => {

        // fetchCategories()
        fetchRecipes()

    }, [])


    const handleChangeCategory = (category) => {
        // setRecipes([])
        // console.log('activeCategory',activeCategory)
        // console.log('recipes',recipes)
        setTimeout(() => {
            fetchRecipes(category)
        }, 1000)

        setActiveCategory(category)
        setRecipes([])

    }


    return (
        <View className="flex-1">
            <StatusBar style='darck'/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}
                className="gap-y-6 pt-14 mx-4"
            >

                {/*avatar snd ball*/}
                <HeaderComponent isAuth={isAuth} user={user?.user_metadata}/>


                {/*    greetings and punchline*/}
                <View gap-y-2>


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
                <SearchComponent/>

                {/*    categories*/}


                <Categories
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    handleChangeCategory={handleChangeCategory}
                />


                {/*    recipes*/}
                <Recipes categories={categories.length} recipes={recipes}/>


            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({})

export default HomeScreen;
