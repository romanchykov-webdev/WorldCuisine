import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Platform, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import HeaderComponent from "../components/HeaderComponent";
import SearchComponent from "../components/SearchComponent";
import { hp, wp } from "../constants/responsiveScreen";

import { useAuth } from "../contexts/AuthContext";

// translate
import LoadingComponent from "../components/loadingComponent";
import RecipesMasonryComponent from "../components/RecipesMasonry/RecipesMasonryComponent";
import TopRecipeComponent from "../components/topRecipe/TopRecipeComponent";
import i18n from "../lang/i18n";
import { getCategoriesMyDB, getCategoryRecipeMasonryMyDB } from "../service/getDataFromDB";
import {themes} from "../constants/themes";

const HomeScreen = () => {
	const { user, unreadCommentsCount, unreadLikesCount,currentTheme } = useAuth();
	// const router = useRouter();

	const { language: langDev } = useAuth();
	useEffect(() => {
		i18n.locale = langDev; // Устанавливаем текущий язык
	}, [langDev]);
	// console.log("HomeScreen langDev", langDev);
	// console.log("HomeScreen requiredFields", requiredFields);
	// console.log("HomeScreen unreadCommentsCount", unreadCommentsCount);
	// console.log("HomeScreen unreadLikesCount", unreadLikesCount);

	const [isAuth, setIsAuth] = useState(null);
	const [isRefreshing, setIsRefreshing] = useState(false); // Состояние для отслеживания процесса обновления
	const [isLoading, setIsLoading] = useState(false); // Состояние для отслеживания загрузки данных

	const [activeCategory, setActiveCategory] = useState("Beef");

	const [categories, setCategories] = useState(null);
	// console.log('homescreen user',user)

	const changeLanguage = (newLocale) => {
		if (newLocale !== undefined) {
			i18n.locale = newLocale;
			// console.log("homescreen newLocale", newLocale);
		} else {
			i18n.locale = "en";
			console.log("homescreen newLocale else i18n undefine", newLocale);
		}

		// Здесь можно обновить состояние компонента, чтобы интерфейс обновился
	};

	useEffect(() => {
		if (user) {
			setIsAuth(true);
			changeLanguage(user.lang);
			// console.log("HomeScreen useEffect if user");
		} else if (!user && !isAuth) {
			setIsAuth(false);
		}
	}, [user, isAuth]);

	// get all categories
	const getAllCategories = async () => {
		const res = await getCategoriesMyDB();
		setCategories(res.data);
		// console.log('home screen categories',res)
		// console.log("home screen categories", res);
	};

	// Вызов функции fetchRecipes и присваивание данных в состояние
	// const [recipes, setRecipes] = useState([])
	// const fetchRecipes = async () => {
	//     // console.log('active category', activeCategory);
	//     // const data = await getRecipes(activeCategory)
	//     const recipesMyDB = await getRecipesMyDB(activeCategory)
	//     // console.log('fetchRecipes data',recipesMyDB)
	//     setRecipes(recipesMyDB.data)
	// }

	const [categoryRecipes, setCategoryRecipes] = useState([]);

	const fetchCategoryRecipeMasonry = async () => {
		const res = await getCategoryRecipeMasonryMyDB(user?.lang ?? langDev);
		// const res = await getCategoryRecipeMasonryMyDB("ru");
		// console.log("fetchCategoryRecipeMasonry", res);
		setCategoryRecipes(res.data);
	};

	useEffect(() => {
		getAllCategories();
		// fetchRecipes()
		fetchCategoryRecipeMasonry();
	}, []);

	// const handleChangeCategory = (category) => {
	const handleChangeCategory = (category) => {
		setActiveCategory(category);
		setRecipes([]); // Очищаем рецепты при смене категории

		fetchRecipes(activeCategory);
	};
	// Используем useEffect для вызова fetchRecipes, когда activeCategory изменяется
	useEffect(() => {
		// fetchRecipes(activeCategory)
	}, [activeCategory]); // Следим за изменением activeCategory

	// Функция для обновления данных при свайпе вниз
	const onRefresh = async () => {
		setIsRefreshing(true);
		setIsLoading(true); // Устанавливаем загрузку в true
		await getAllCategories(); // Загрузка категорий
		// await fetchRecipes(activeCategory);  // Загрузка рецептов
		await fetchCategoryRecipeMasonry();
		setIsRefreshing(false); // Завершаем процесс обновления

		setTimeout(() => {
			setIsLoading(false); // Завершаем процесс загрузки
		}, 1000);
	};
	// console.log('homescreen categories',categories)

	return (
		<SafeAreaView style={{backgroundColor:themes[currentTheme].backgroundColor}}>
			<StatusBar style="dark" />
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 20,
					marginBottom: 20,
					marginTop: Platform.OS === "ios" ? 15 : 30,
				}}
				className=" relative"
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={onRefresh} // Вызываем onRefresh при свайпе вниз
					/>
				}
			>
				{/* Лоадер */}
				{isLoading ? (
					<View
						style={{
							width: wp(100),
							height: hp(100),
							position: "absolute",
							justifyContent: "center",
							alignItems: "center",
						}}
						// className="bg-red-500 absolute top-0 left-0 w-full h-full flex-1"
					>
						<LoadingComponent size={"large"} color="green" />
					</View>
				) : (
					<>
						{/*avatar snd ball*/}
						<HeaderComponent
							isAuth={isAuth}
							user={user}
							unreadCommentsCount={unreadCommentsCount}
							unreadLikesCount={unreadLikesCount}
						/>

						{/*    greetings and punchline*/}
						<View gap-y-2>
							<View>
								<Text style={{ fontSize: hp(3) }} className="font-semibold text-neutral-700">
									{i18n.t("Make your own food")},
								</Text>
								<Text style={{ fontSize: hp(3) }} className="font-semibold text-neutral-700">
									{i18n.t("stay at")} <Text className="text-amber-500">{i18n.t("home")}</Text>
								</Text>
							</View>
						</View>

						{/*?search bar*/}
						<SearchComponent />

						{/*    categories*/}
						<TopRecipeComponent />
						{/* {categories ? (
							<Categories
								categories={categories}
								activeCategory={activeCategory}
								setActiveCategory={setActiveCategory}
								handleChangeCategory={handleChangeCategory}
								langApp={user?.lang ?? langDev}
							/>
						) : (
							<LoadingComponent size={"small"} color="grey" />
						)} */}

						{/*    recipes*/}
						{/*{*/}
						{/*    categories*/}
						{/*        ? (*/}

						{/*            <Recipes*/}
						{/*                // categories={categories.length}*/}
						{/*                recipes={recipes}*/}
						{/*                langApp={user?.lang ?? langDev}*/}
						{/*            />*/}
						{/*        )*/}
						{/*        : (*/}
						{/*            <LoadingComponent size={'small'} color='grey'/>*/}
						{/*        )*/}
						{/*}*/}

						{/*    RecipesMasonryComponent*/}
						<RecipesMasonryComponent categoryRecipes={categoryRecipes} langApp={user?.lang ?? langDev} />
					</>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default HomeScreen;
