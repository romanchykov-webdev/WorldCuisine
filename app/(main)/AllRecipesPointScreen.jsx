import MasonryList from "@react-native-seoul/masonry-list";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Modal,
	Platform,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { AdjustmentsVerticalIcon } from "react-native-heroicons/mini";
import Animated, { FadeInDown, FadeInLeft, FadeInRight, FadeInUp } from "react-native-reanimated";
import ButtonBack from "../../components/ButtonBack";
import LoadingComponent from "../../components/loadingComponent";
import RecipePointItemComponent from "../../components/RecipesMasonry/AllRecipesPoint/RecipePointItemComponent";
import TitleScrean from "../../components/TitleScrean";
import { getDeviceType } from "../../constants/getWidthDevice";
import { shadowBoxBlack } from "../../constants/shadow";
import { useAuth } from "../../contexts/AuthContext";
import i18n from "../../lang/i18n";
import { getAllRecipesPointMasonryMyDB } from "../../service/getDataFromDB";

import { ArrowDownIcon, ArrowUpIcon, HeartIcon, StarIcon } from "react-native-heroicons/mini";

const AllRecipesPointScreen = ({
	isScreanAlrecipeBayCreatore = false,
	isScreanAllRecibeData = [],
	isFavoriteScrean = false,
	allFavoriteRecipes = [],
	titleVisible = true,
}) => {
	const { point } = useLocalSearchParams();
	const { language: langApp } = useAuth();

	// console.log("AllRecipesPointScreen point", point);
	// console.log("AllRecipesPointScreen isFavoriteScrean", isFavoriteScrean);

	const [loading, setLoading] = useState(true);

	const [column, setColumn] = useState(0);

	const [allRecipes, setAllRecipes] = useState([]);

	// загрузки новых рецептов пагинация
	const [loadingMore, setLoadingMore] = useState(false); // Для индикации загрузки новых рецептов
	const [page, setPage] = useState(1); // Текущая страница для пагинации

	// modal
	const [isModalVisible, setIsModalVisible] = useState(false);
	// filters
	const [filters, setFilters] = useState({
		newOld: true,
		oldNew: false,
		likes: false,
		rating: false,
	});

	// Открытие модального окна
	const handleOpenFilter = () => {
		setIsModalVisible(true);
	};
	// закрытие модального окна
	const closeModal = () => {
		setIsModalVisible(false);
	};

	// Определяем параметры сортировки на основе текущего фильтра
	const getSortOptions = () => {
		if (filters.newOld) return { sortBy: "created_at", ascending: false };
		if (filters.oldNew) return { sortBy: "created_at", ascending: true };
		if (filters.likes) return { sortBy: "likes", ascending: false };
		if (filters.rating) return { sortBy: "rating", ascending: false };
		return { sortBy: "created_at", ascending: false }; // Значение по умолчанию
	};

	// toggle filter
	const toggleFilter = (filterType) => {
		setFilters({
			newOld: filterType === "newOld",
			oldNew: filterType === "oldNew",
			likes: filterType === "likes",
			rating: filterType === "rating",
		});
		setLoading(true);
		setPage(1); // Сбрасываем страницу
		setAllRecipes([]); // Очищаем текущие рецепты
		setTimeout(() => {
			setIsModalVisible(false);
		}, 200);
		// fetchRecipes(1).then(() => {
		// 	setTimeout(() => {
		// 		setIsModalVisible(false);
		// 	}, 200);
		// 	setTimeout(() => {
		// 		setLoading(false);
		// 	}, 1000);
		// }); // Загружаем данные с новым фильтром
	};

	// ----------------------------------------------------------

	// Определяем количество колонок на основе типа устройства
	useEffect(() => {
		// Определяем тип устройства и обновляем количество колонок
		const type = getDeviceType(window.innerWidth);
		setColumn(type);
	}, []);

	// console.log('AllRecipesPointScreen',point)

	// const fetchGetAllRecipesPointMasonryMyDB = async () => {
	// 	const res = await getAllRecipesPointMasonryMyDB(point);
	// 	// console.log("AllRecipesPointScreen res point", JSON.stringify(res.data, null, 2));
	// 	setAllRecipes(res.data);
	// };

	// useEffect(() => {
	// 	if (!isScreanAlrecipeBayCreatore && !isFavoriteScrean) {
	// 		setLoading(true);
	// 		fetchGetAllRecipesPointMasonryMyDB();
	// 		setTimeout(() => {
	// 			setLoading(false);
	// 		}, 1000);
	// 	}
	// }, [point]);

	// useEffect(() => {
	// 	if (isScreanAlrecipeBayCreatore) {
	// 		setLoading(true);

	// 		setAllRecipes(isScreanAllRecibeData);
	// 		setTimeout(() => {
	// 			setLoading(false);
	// 		}, 1000);

	// 		// console.log("isScreanAlrecipeBayCreatore", allRecipes);
	// 	}
	// }, [isScreanAlrecipeBayCreatore, isScreanAllRecibeData]);

	// useEffect(() => {
	// 	if (isFavoriteScrean) {
	// 		setLoading(true);

	// 		setAllRecipes(allFavoriteRecipes);

	// 		setTimeout(() => {
	// 			setLoading(false);
	// 		}, 1000);

	// 		// console.log("FavoriteScrean", allRecipes);
	// 	}
	// }, [isFavoriteScrean]);

	// Функция для получения рецептов (первая загрузка или подгрузка новых)
	const fetchRecipes = async (pageNum, isLoadMore = false) => {
		if (isLoadMore) {
			setLoadingMore(true);
		} else {
			setLoading(true);
		}

		// const res = await getAllRecipesPointMasonryMyDB(point, pageNum);
		const sortOptions = getSortOptions();
		const res = await getAllRecipesPointMasonryMyDB(point, pageNum, 10, sortOptions);
		if (res.success) {
			// Если это подгрузка, добавляем новые рецепты к существующим
			console.log("fetchRecipes res", res);

			setAllRecipes((prev) => (isLoadMore ? [...prev, ...res.data] : res.data));
		}

		// if (isLoadMore) {
		// 	setLoadingMore(false);
		// } else {
		// 	setLoading(false);
		// }
	};

	// Первая загрузка рецептов
	useEffect(() => {
		if (!isScreanAlrecipeBayCreatore && !isFavoriteScrean) {
			fetchRecipes(1).then(() => {
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			});
		}
	}, [point, filters]);

	// Обработка подгрузки новых рецептов при достижении конца списка
	const handleLoadMore = () => {
		if (!loading && !loadingMore) {
			console.log("Обработка подгрузки новых рецептов при достижении конца списка");

			const nextPage = page + 1;
			setPage(nextPage);
			fetchRecipes(nextPage, true).then(() => {
				setTimeout(() => {
					setLoadingMore(false);
				}, 1000);
			});
		}
	};

	// Экран рецептов создателя
	useEffect(() => {
		if (isScreanAlrecipeBayCreatore) {
			setLoading(true);
			setAllRecipes(isScreanAllRecibeData);
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	}, [isScreanAlrecipeBayCreatore, isScreanAllRecibeData]);

	// Логика для экрана избранных рецептов
	useEffect(() => {
		if (isFavoriteScrean) {
			setLoading(true);
			setAllRecipes(allFavoriteRecipes);
			setTimeout(() => {
				setLoading(false);
			}, 1000);
		}
	}, [isFavoriteScrean, allFavoriteRecipes]);

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* <ScrollView contentContainerStyle={{ marginTop: Platform.OS === "ios" ? null : 30 }}> */}
			<View style={styles.container}>
				<View
					// className={`gap-y-3  ${isScreanAlrecipeBayCreatore || isFavoriteScrean ? null : "p-[20]"}`}
					// style={{ backgroundColor: "red" }}
					style={[
						styles.innerContainer,
						isScreanAlrecipeBayCreatore || isFavoriteScrean ? {} : { padding: 20 },
					]}
				>
					{/* block header*/}
					{titleVisible && (
						<View className=" items-center justify-center mb-5">
							{/* button back */}
							<Animated.View
								entering={FadeInLeft.delay(300).springify().damping(30)}
								className="absolute left-0"
								style={shadowBoxBlack()}
							>
								<ButtonBack />
							</Animated.View>
							{/* title header screan */}
							<Animated.View entering={FadeInUp.delay(500).springify().damping(30)}>
								<TitleScrean title={i18n.t("Recipes")} />
							</Animated.View>

							{/* Filter */}
							<Animated.View
								className="absolute right-0"
								entering={FadeInRight.delay(700).springify().damping(30)}
							>
								<TouchableOpacity
									onPress={handleOpenFilter}
									style={[
										{
											height: 50,
											width: 50,
											borderWidth: 0.2,
											borderColor: "black",
											borderRadius: 50,
											justifyContent: "center",
											alignItems: "center",
											backgroundColor: "white",
										},
										shadowBoxBlack(),
									]}
								>
									<AdjustmentsVerticalIcon color="grey" size={30} />
								</TouchableOpacity>
							</Animated.View>
						</View>
					)}

					{/* block header end*/}

					{/*    masonry*/}
					{loading && !isScreanAlrecipeBayCreatore && !isFavoriteScrean ? (
						<LoadingComponent size="large" color="green" />
					) : allRecipes?.length === 0 ? (
						<Animated.View entering={FadeInDown.delay(300).springify()}>
							<Text className="text-center font-medium text-xl">There are no recipes yet</Text>
						</Animated.View>
					) : (
						<MasonryList
							// data={mealData}
							data={allRecipes}
							keyExtractor={(item) => item.id}
							// numColumns={2}
							contentContainerStyle={styles.containerMasory}
							numColumns={column}
							style={{ gap: 10 }}
							showsVerticalScrollIndicator={false}
							renderItem={({ item, i }) => (
								<RecipePointItemComponent item={item} index={i} langApp={langApp} />
							)}
							onEndReached={handleLoadMore} // Вызывается при достижении конца списка
							onEndReachedThreshold={0.1} // Порог срабатывания (10% от конца списка)
							ListFooterComponent={
								loadingMore ? (
									<View style={styles.footerContainer}>
										<LoadingComponent color="green" />
									</View>
								) : null
							}
						/>
					)}
				</View>
			</View>
			<Modal
				animationType="fade"
				transparent={true}
				visible={isModalVisible}
				onRequestClose={closeModal}
				// onRequestClose={closeModal}
			>
				<TouchableWithoutFeedback onPress={closeModal}>
					<View style={styles.modalOverlay}>
						<View style={styles.modalContent}>
							<View className="gap-y-5">
								{/* от нового к старому стандврт */}
								<TouchableOpacity
									onPress={() => toggleFilter("newOld")}
									style={[styles.itemFilter, filters.newOld ? styles.itemFilterActive : null]}
								>
									<Text>{i18n.t("From newest to oldest")}</Text>
									<ArrowDownIcon size={20} color="green" />
								</TouchableOpacity>

								{/* от старого к нового */}
								<TouchableOpacity
									onPress={() => toggleFilter("oldNew")}
									style={[styles.itemFilter, filters.oldNew ? styles.itemFilterActive : null]}
								>
									<Text>{i18n.t("From old to new")}</Text>
									<ArrowUpIcon size={20} color="blue" />
								</TouchableOpacity>

								{/* лайки от много до мало */}
								<TouchableOpacity
									onPress={() => toggleFilter("likes")}
									style={[styles.itemFilter, filters.likes ? styles.itemFilterActive : null]}
								>
									<Text>{i18n.t("Popular")}</Text>
									<HeartIcon size={20} color="red" />
								</TouchableOpacity>

								{/* рейтинг от много до мало */}
								<TouchableOpacity
									onPress={() => toggleFilter("rating")}
									style={[styles.itemFilter, filters.rating ? styles.itemFilterActive : null]}
								>
									<Text>{i18n.t("High rating")}</Text>
									<StarIcon size={20} color="gold" />
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			{/* </ScrollView> */}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		// backgroundColor: "#fff",
	},
	container: {
		flex: 1,
		marginTop: Platform.OS === "ios" ? 0 : 30,
	},
	innerContainer: {
		flex: 1,
		gap: 10,
	},
	containerMasory: {
		paddingBottom: 50,
		position: "relative",
		// backgroundColor: "red",
	},
	footerContainer: {
		// marginTop: 10,
		position: "absolute",
		height: 50,
		bottom: 0,
		left: 0,
		right: 0,
		// backgroundColor: "red",
		alignItems: "center",
		padding: 10,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContent: {
		width: "80%",
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	itemFilter: {
		padding: 10,
		borderWidth: 0.2,
		borderRadius: 10,
		fontSize: 20,
		justifyContent: "center",
		flexDirection: "row",
		gap: 10,
	},
	itemFilterActive: {
		backgroundColor: "gold",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
});

export default AllRecipesPointScreen;
