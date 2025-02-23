import React from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { shadowBoxBlack } from "../../constants/shadow";

const MapСoordinatesComponent = ({ mapСoordinates }) => {
	// console.log("mapСoordinates", mapСoordinates);

	// Функция для открытия координат в нативных картах
	const openInMaps = () => {
		if (
			!mapСoordinates ||
			!mapСoordinates.latitude ||
			!mapСoordinates.longitude
		) {
			console.log("Координаты отсутствуют");
			return;
		}

		const { latitude, longitude } = mapСoordinates;

		// Формируем URL в зависимости от платформы
		const url = Platform.select({
			ios: `maps://?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=10`,
			android: `geo:${latitude},${longitude}?q=${latitude},${longitude}&z=10`,
		});

		// Проверяем, можно ли открыть URL, и открываем его
		Linking.canOpenURL(url)
			.then((supported) => {
				if (supported) {
					Linking.openURL(url);
				} else {
					console.log("Не удалось открыть карты на устройстве");
				}
			})
			.catch((err) => console.error("Ошибка при открытии карт:", err));
	};

	return (
		<View style={shadowBoxBlack()}>
			<MapView
				style={styles.map}
				mapType="hybrid" // Спутниковый вид
				initialRegion={{
					latitude: mapСoordinates.latitude,
					longitude: mapСoordinates.longitude,
					// latitudeDelta: 10,
					// longitudeDelta: 10,
				}}
			>
				{mapСoordinates && (
					<Marker
						coordinate={mapСoordinates}
						// title="Выбранная точка"
						onPress={openInMaps} //Oткрыть при нажатии на маркер
					/>
				)}
			</MapView>
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
});

export default MapСoordinatesComponent;
