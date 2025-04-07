import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { wp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { getUserImageSrc } from "../../service/imageServices";

const width = wp(100);
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;

const ImageSliderCustom = ({ images, createRecipe = false, isPreview, refactorScrean = false }) => {
	// console.log("ImageSliderCustom images", images);

	// Нормализуем данные: преобразуем массив строк или объектов в массив объектов { uri: string }
	const normalizedImages = images.map((item) => {
		if (typeof item === "string") {
			return { uri: item };
		}
		return item;
	});

	const [activeIndex, setActiveIndex] = useState(0);
	const scrollX = useRef(new Animated.Value(0)).current;
	// const animatedValuesRef = useRef([]);
	// Инициализируем animatedValues сразу при создании компонента
	const animatedValuesRef = useRef(
		normalizedImages.map((_, index) => new Animated.Value(index === 0 ? 1 : 0)) // Первый индикатор активен
	).current;

	// Обновляем анимацию при изменении activeIndex
	useEffect(() => {
		animatedValuesRef.forEach((animatedValue, index) => {
			Animated.timing(animatedValue, {
				toValue: index === activeIndex ? 1 : 0,
				duration: 300,
				useNativeDriver: false,
			}).start();
		});
	}, [activeIndex]); // Зависимость только от activeIndex

	// Синхронизируем animatedValues при изменении normalizedImages
	useEffect(() => {
		// Если длина normalizedImages изменилась, обновляем animatedValues
		if (animatedValuesRef.length !== normalizedImages.length) {
			animatedValuesRef.length = 0; // Очищаем массив
			normalizedImages.forEach((_, index) => {
				animatedValuesRef.push(new Animated.Value(index === activeIndex ? 1 : 0));
			});
		}
	}, [normalizedImages]);

	const handleMomentumScrollEnd = (event) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		const newIndex = Math.round(offsetX / width);
		setActiveIndex(newIndex);
	};

	return (
		<View className="mt-2">
			<View style={{ borderRadius: 25, overflow: "hidden", height: 300 }}>
				<Animated.FlatList
					data={normalizedImages}
					keyExtractor={(_, index) => index.toString()}
					horizontal
					showsHorizontalScrollIndicator={false}
					pagingEnabled={true}
					onMomentumScrollEnd={handleMomentumScrollEnd}
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
						useNativeDriver: true,
					})}
					renderItem={({ item, index }) => {
						const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

						const translateX = scrollX.interpolate({
							inputRange,
							outputRange: [-width * 0.7, 0, width * 0.7],
						});

						const scale = scrollX.interpolate({
							inputRange,
							outputRange: [1, 1.5, 1],
						});

						const uri = item.uri;
						if (!uri) {
							// console.log("ImageSliderCustom: uri is undefined for item", item);
							return (
								<View
									style={{
										width,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<View
										style={{
											height: 300,
											width: ITEM_WIDTH * 1.2,
											overflow: "hidden",
											alignItems: "center",
											borderRadius: 25,
										}}
									>
										<Animated.Image
											source={require("../../assets/img/ratatouille.png")} // путь к placeholder-изображению
											style={{
												width: ITEM_WIDTH * 1.4,
												height: 300,
												resizeMode: "cover",
												transform: [{ translateX }, { scale }],
											}}
										/>
									</View>
								</View>
							);
						}

						const isLocalFile = uri?.startsWith("file://");
						const isFullUrl = uri?.startsWith("http://") || uri?.startsWith("https://");
						const sourceUri =
							isLocalFile || isFullUrl || isPreview || refactorScrean ? uri : getUserImageSrc(uri);
						// console.log("ImageSliderCustom item", item, "sourceUri", sourceUri);

						return (
							<View
								style={{
									width,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<View
									style={{
										height: 300,
										width: ITEM_WIDTH * 1.2,
										overflow: "hidden",
										alignItems: "center",
										borderRadius: 25,
									}}
								>
									<Animated.Image
										source={{ uri: sourceUri }}
										style={{
											width: ITEM_WIDTH * 1.4,
											height: 300,
											resizeMode: "cover",
											transform: [{ translateX }, { scale }],
										}}
									/>
								</View>
							</View>
						);
					}}
				/>
			</View>

			{/* Block indicator slider */}
			<View className="items-center py-5">
				<View
					className="gap-2 flex-row"
					style={shadowBoxBlack({
						color: "#000",
						offset: { width: 2, height: 2 },
						opacity: 0.5,
						radius: 2,
						elevation: 2,
					})}
				>
					{normalizedImages.map((_, index) => {
						// Проверяем, существует ли animatedValues для этого индекса
						if (!animatedValuesRef[index]) {
							console.log(`animatedValues[${index}] is undefined`);
							return null; // Пропускаем индикатор, если animatedValue не существует
						}

						const animatedWidth = animatedValuesRef[index].interpolate({
							inputRange: [0, 1],
							outputRange: [10, 20],
						});

						const animatedColor = animatedValuesRef[index].interpolate({
							inputRange: [0, 1],
							outputRange: ["#1C1C1E", "#f59e0b"],
						});

						return (
							<Animated.View
								key={index.toString()}
								style={[
									styles.indicator,
									{
										width: animatedWidth,
										backgroundColor: animatedColor,
									},
								]}
							/>
						);
					})}
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	indicator: {
		width: 10,
		height: 10,
		backgroundColor: "#1C1C1E",
		borderRadius: 50,
	},
	activeIndicator: {
		width: 20,
		backgroundColor: "#000",
	},
});

export default ImageSliderCustom;
