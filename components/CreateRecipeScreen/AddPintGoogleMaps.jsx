import React, { useState } from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import {MapPinIcon} from "react-native-heroicons/mini"

const AddPointGoogleMaps = () => {
    const [marker, setMarker] = useState(null);
    const [mapVisible, setMapVisible] = useState(false);

    // Обработчик нажатия на карту
    const handleMapPress = (event) => {
        setMarker(event.nativeEvent.coordinate);
    };

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


    return (
        <View className="mb-10">

            {
                marker!==null &&(
                    <View className="flex-row items-center justify-center mb-3">

                        <Text>
                            Здесь находиться торговая точка
                        </Text>

                        <TouchableOpacity onPress={openMap}>

                            <MapPinIcon size={50} color="blue"/>
                        </TouchableOpacity>
                    </View>

                )
            }

            <Text className="mb-4">
                Если у вас есть торговая точка, вы можете добавить её на карте, и клиенты смогут её найти.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => setMapVisible(!mapVisible)}
            >
                <Text style={styles.buttonText}>
                    {mapVisible ? 'Скрыть карту' : 'Открыть карту'}
                </Text>
            </TouchableOpacity>

            {mapVisible && (
                <MapView
                    style={styles.map}
                    mapType="hybrid" // Спутниковый вид
                    initialRegion={{
                        latitude: 48.8566, // Например, Париж (можно изменить)
                        longitude: 2.3522,
                        latitudeDelta: 10,
                        longitudeDelta: 10,
                    }}
                    onPress={handleMapPress}
                >
                    {marker && (
                        <Marker coordinate={marker} title="Выбранная точка" />
                    )}
                </MapView>
            )}

            {marker && (
                <Text className="mt-4">
                    Выбрано местоположение координаты: {marker.latitude}, {marker.longitude}
                </Text>

            )}
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 300,
        marginTop: 10,
        borderRadius: 10,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default AddPointGoogleMaps;
