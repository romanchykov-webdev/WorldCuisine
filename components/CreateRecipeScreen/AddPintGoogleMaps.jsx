import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { MapPinIcon, TrashIcon } from "react-native-heroicons/mini";
import Animated, { FadeInDown } from "react-native-reanimated";
import { shadowBoxBlack } from "../../constants/shadow";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";

// import my hook
import { useDebounce } from "../../constants/halperFunctions";
import i18n from "../../lang/i18n";
import TitleDescriptionComponent from "./TitleDescriptionComponent";

const AddPointGoogleMaps = ({ setTotalRecipe, refactorRecipescrean = false, oldCoordinates, updateCoordinates }) => {
	const [marker, setMarker] = useState(null);
	const [mapVisible, setMapVisible] = useState(false);

	// console.log("marker", marker);

	// Добавляем дебонсированное значение
	const debouncedValue = useDebounce(marker, 1000);

	// Обработчик нажатия на карту
	const handleMapPress = (event) => {
		setMarker(event.nativeEvent.coordinate);
	};

	// if refactorRecipescrean = true
	useEffect(() => {
		if (refactorRecipescrean && oldCoordinates) {
			setMarker(oldCoordinates);
		}
	}, []);

	// Открытие карты с выбранными координатами
	const openMap = () => {
		if (marker) {
			const latitude = marker.latitude;
			const longitude = marker.longitude;

			// Формируем ссылку для Google Maps
			const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
			Linking.openURL(url);
		}
	};

	useEffect(() => {
		if (refactorRecipescrean && updateCoordinates) {
			updateCoordinates(marker)
		} else {
			setTotalRecipe((prevRecipe) => ({
				...prevRecipe,
				map_coordinates: debouncedValue,
			}));
		}
	}, [debouncedValue]);

	return (
		<View className="mb-5">
			{marker !== null && (
				<Animated.View
					entering={FadeInDown.delay(100).springify()}
					className="flex-row items-center justify-betwen mb-3"
				>
					<View className="flex-row items-center  flex-1">
						<TouchableOpacity onPress={openMap}>
							<MapPinIcon size={50} color="blue" />
						</TouchableOpacity>
						<Text>{i18n.t("There is a store here")}</Text>
					</View>

					<TouchableOpacity onPress={() => setMarker(null)}>
						<ButtonSmallCustom tupeButton="remove" icon={TrashIcon} w={60} h={60} />
					</TouchableOpacity>
				</Animated.View>
			)}

			<TitleDescriptionComponent
				titleText={i18n.t("If you have a store")}
				titleVisual={true}
				descriptionVisual={true}
				descriptionText={i18n.t("You can add it to the map, and customers can find it")}
			/>

			<TouchableOpacity
				// style={styles.button}
				style={shadowBoxBlack()}
				onPress={() => setMapVisible(!mapVisible)}
			>
				{/*<Text style={styles.buttonText}>*/}
				{/*    {mapVisible ? 'Скрыть карту' : 'Открыть карту'}*/}
				{/*</Text>*/}
				<ButtonSmallCustom
					tupeButton="add"
					h={60}
					w="100%"
					title={
						mapVisible ? `${i18n.t("Hide")} ${i18n.t("the map")}` : `${i18n.t("Open")} ${i18n.t("the map")}`
					}
					buttonText={true}
				/>
			</TouchableOpacity>

			{mapVisible && (
				<MapView
					style={styles.map}
					mapType="hybrid" // Спутниковый вид
					initialRegion={{
						latitude: 48.8566, // Например, Париж
						longitude: 2.3522,
						latitudeDelta: 10,
						longitudeDelta: 10,
					}}
					onPress={handleMapPress}
				>
					{marker && <Marker coordinate={marker} title={i18n.t("Selected point")} />}
				</MapView>
			)}

			{/* {marker && (
				<Text className="mt-4">
					Выбрано местоположение координаты: {marker.latitude}, {marker.longitude}
				</Text>
			)} */}
		</View>
	);
};

const styles = StyleSheet.create({
	map: {
		width: "100%",
		height: 300,
		marginTop: 10,
		borderRadius: 10,
	},
	button: {
		backgroundColor: "#007AFF",
		padding: 10,
		borderRadius: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
});

export default AddPointGoogleMaps;
