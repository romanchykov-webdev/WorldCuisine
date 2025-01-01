import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import {BellIcon} from "react-native-heroicons/outline";
import {hp, wp} from "../constants/responsiveScreen";
import {StatusBar} from "expo-status-bar";
import {MagnifyingGlassIcon, Cog6ToothIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../constants/shadow";
import Categories from "../components/Categories";
import {getCategories, getRecipes} from "../api";
import {useRouter} from "expo-router";
import SearchComponent from "../components/SearchComponent";
import HeaderComponent from "../components/HeaderComponent";

// import kategory
import {categoryData} from '../constants/fakeDataDB'
import {useAuth} from "../contexts/AuthContext";

// translate
import i18n from '../lang/i18n'
import {getCategoriesMyDB, getRecipesMyDB} from "../service/getDataFromDB";
import LoadingComponent from "../components/loadingComponent";
import Recipes from "../components/Rrecipes";

const HomeScreen = () => {
    const {user, setAuth, setUserData} = useAuth();
    const router = useRouter();

    const { language:langDev } = useAuth();
    useEffect(() => {
        i18n.locale = langDev; // Устанавливаем текущий язык
    }, [langDev]);


    const [isAuth, setIsAuth] = useState(null)
    const [isRefreshing, setIsRefreshing] = useState(false);  // Состояние для отслеживания процесса обновления
    const [isLoading, setIsLoading] = useState(false);  // Состояние для отслеживания загрузки данных

    const [activeCategory, setActiveCategory] = useState('Beef')


    const [categories, setCategories] = useState(null)
    // console.log('homescreen user',user)



    const changeLanguage = (newLocale) => {
        if (newLocale) {
            i18n.locale = newLocale;
            console.log('homescreen newLocale', newLocale)
        } else {
            i18n.locale = 'en'
            console.log('homescreen newLocale else i18n undefine', newLocale)
        }

        // Здесь можно обновить состояние компонента, чтобы интерфейс обновился
    };

    useEffect(() => {
        if (user) {
            setIsAuth(true);
            changeLanguage(user.lang)

        } else if (!user && !isAuth) {
            setIsAuth(false);
        }
    }, [user, isAuth]);

    // get all categories
    const getAllCategories = async () => {
        const res = await getCategoriesMyDB()
        setCategories(res.data)
        // console.log('home screen categories',res)
    }


    // Вызов функции fetchRecipes и присваивание данных в состояние
    const [recipes, setRecipes] = useState([])
    const fetchRecipes = async () => {
        // console.log('active category', activeCategory);
        // const data = await getRecipes(activeCategory)
        const recipesMyDB = await getRecipesMyDB(activeCategory)
        // console.log('fetchRecipes data',recipesMyDB)
        setRecipes(recipesMyDB.data)
    }


    useEffect(() => {

        getAllCategories()
        // fetchRecipes()

    }, [])


    // const handleChangeCategory = (category) => {
    const handleChangeCategory = (category) => {


        setActiveCategory(category);
        setRecipes([]);  // Очищаем рецепты при смене категории

        fetchRecipes(activeCategory);

    }
// Используем useEffect для вызова fetchRecipes, когда activeCategory изменяется
    useEffect(() => {
        fetchRecipes(activeCategory)

    }, [activeCategory]); // Следим за изменением activeCategory

    // Используем useEffect для вызова fetchRecipes, когда activeCategory изменяется
    // useEffect(() => {
    //     const fetchRecipes = async () => {
    //         console.log('active category', activeCategory);
    //         // const data = await getRecipes(activeCategory); // Получаем рецепты для актуальной категории
    //         const data = await getRecipes(activeCategory); // Получаем рецепты для актуальной категории
    //         setRecipes(data);
    //     };
    //
    //     if (activeCategory) {
    //         // console.log("activeCategory", activeCategory);
    //         fetchRecipes(); // Загружаем рецепты при изменении категории
    //     }
    // }, [activeCategory]); // Следим за изменением activeCategory

    // Функция для обновления данных при свайпе вниз
    const onRefresh = async () => {
        setIsRefreshing(true);
        setIsLoading(true);  // Устанавливаем загрузку в true
        await getAllCategories(); // Загрузка категорий
        await fetchRecipes(activeCategory);  // Загрузка рецептов
        setIsRefreshing(false);  // Завершаем процесс обновления

        setTimeout(() => {
            setIsLoading(false);  // Завершаем процесс загрузки
        }, 1000)
    };
    // console.log('homescreen categories',categories)

    return (
        <View className="flex-1">
            <StatusBar style='darck'/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 50}}
                className="gap-y-6 pt-14 mx-4 relative"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}  // Вызываем onRefresh при свайпе вниз
                    />
                }
            >

                {/* Лоадер */}
                {
                    isLoading
                        ? (
                            <View
                                style={{
                                    width: wp(100),
                                    height: hp(100),
                                    position: "absolute",
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                // className="bg-red-500 absolute top-0 left-0 w-full h-full flex-1"

                            >
                                <LoadingComponent size={'large'} color='green'/>
                            </View>
                        )
                        : (
                            <>
                                {/*avatar snd ball*/}
                                <HeaderComponent isAuth={isAuth} user={user} />


                                {/*    greetings and punchline*/}
                                <View gap-y-2>


                                    <View>
                                        <Text style={{fontSize: hp(3)}} className="font-semibold text-neutral-700">
                                            {i18n.t('Make your own food')},
                                        </Text>
                                        <Text style={{fontSize: hp(3)}} className="font-semibold text-neutral-700">
                                            {i18n.t('stay at')} <Text className="text-amber-500">{i18n.t('home')}</Text>
                                        </Text>
                                    </View>
                                </View>

                                {/*?search bar*/}
                                <SearchComponent/>

                                {/*    categories*/}
                                {
                                    categories
                                        ? (
                                            <Categories
                                                categories={categories}
                                                activeCategory={activeCategory}
                                                setActiveCategory={setActiveCategory}
                                                handleChangeCategory={handleChangeCategory}
                                                langApp={user?.lang ?? langDev}
                                            />
                                        )
                                        : (
                                            <LoadingComponent size={'small'} color='grey'/>
                                        )
                                }


                                {/*    recipes*/}
                                {
                                    categories
                                        ? (

                                            <Recipes
                                                categories={categories.length}
                                                recipes={recipes}
                                                langApp={user?.lang ?? langDev}
                                            />
                                        )
                                        : (
                                            <LoadingComponent size={'small'} color='grey'/>
                                        )
                                }

                            </>
                        )
                }


            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({})

export default HomeScreen;
