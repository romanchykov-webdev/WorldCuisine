import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { wp } from "../../constants/responsiveScreen";
import { shadowBoxBlack } from "../../constants/shadow";
import { getUserImageSrc } from "../../service/imageServices";
// import {sliderImages} from '../constants'
// import {shadowBox, shadowBoxBlack} from "../hooks";
// import {sliderImagesArray} from "../constants/sliderImg";

// const {width, height} = Dimensions.get('window');
const width = wp(100);
// const ITEM_WIDTH = width * 0.8;
const ITEM_WIDTH = width * 0.9;
const ITEM_HEIGHT = ITEM_WIDTH * 1.47;
// const ITEM_HEIGHT = 200;

const ImageSliderCustom = ({ images, createRecipe = false, isPreview }) => {
	// console.log("createRecipe",createRecipe)

	const [activeIndex, setActiveIndex] = useState(0); // Состояние для активного индекса

	const scrollX = useRef(new Animated.Value(0)).current;

	// console.log("ImageSliderCustom images", images);

	const animatedValues = useRef(images.map(() => new Animated.Value(0))).current; // Массив Animated.Value для индикаторов

	useEffect(() => {
		animatedValues.forEach((animatedValue, index) => {
			Animated.timing(animatedValue, {
				toValue: index === activeIndex ? 1 : 0, // 1 для активного индикатора, 0 для остальных
				duration: 300, // Длительность анимации
				useNativeDriver: false,
			}).start();
		});
	}, [activeIndex]);

	const handleMomentumScrollEnd = (event) => {
		const offsetX = event.nativeEvent.contentOffset.x;
		const newIndex = Math.round(offsetX / width); // Вычисление активного индекса
		setActiveIndex(newIndex);
	};

	return (
		<View className="mt-2">
			<View style={{ borderRadius: 25, overflow: "hidden", height: 300 }}>
				<Animated.FlatList
					// data={sliderImages}
					data={images}
					keyExtractor={(_, index) => index.toString()}
					horizontal
					showsHorizontalScrollIndicator={false}
					pagingEnabled={true}
					onMomentumScrollEnd={handleMomentumScrollEnd} // Отслеживание конца скролла
					onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
						useNativeDriver: true,
					})}
					renderItem={({ item, index }) => {
						const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

						// for translate x
						const translateX = scrollX.interpolate({
							inputRange,
							outputRange: [-width * 0.7, 0, width * 0.7],
						});

						// for scale
						const scale = scrollX.interpolate({
							inputRange,
							outputRange: [1, 1.5, 1],
						});
						// console.log('item',item)
						return (
							<View
								style={[
									{
										width,
										justifyContent: "center",
										alignItems: "center",
										// paddingVertical: 15
									},
								]}

								// className="bg-red-500"
							>
								<View
									style={{
										height: 300,
										width: ITEM_WIDTH * 1.2, // Ширина чуть больше для перекрытия
										overflow: "hidden",
										alignItems: "center",
										borderRadius: 25,
									}}
								>
									<Animated.Image
										// source={{ uri: item }}

										source={{
											uri: createRecipe || isPreview ? item.uri : getUserImageSrc(item),
										}}
										// onLoad={() => handleImageLoad(index)}
										style={{
											// borderRadius: '30px',
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
						color: "#000", // Цвет тени для блоков (по умолчанию чёрный)
						offset: { width: 2, height: 2 }, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
						opacity: 0.5, // Прозрачность тени (по умолчанию 30%)
						radius: 2, // Радиус размытия тени (по умолчанию 5px)
						elevation: 2, // Высота "подъема" для создания тени на Android (по умолчанию 6)
					})}
				>
					{images.map((_, index) => {
						const animatedWidth = animatedValues[index].interpolate({
							inputRange: [0, 1],
							outputRange: [10, 20], // Анимация ширины от 5 до 10
						});

						const animatedColor = animatedValues[index].interpolate({
							inputRange: [0, 1],
							outputRange: ["#1C1C1E", "#f59e0b"], // Анимация цвета от светлого к темному
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
		width: 20, // Увеличенная ширина для активного индикатора
		backgroundColor: "#000", // Более темный цвет для активного индикатора
	},
});

export default ImageSliderCustom;
