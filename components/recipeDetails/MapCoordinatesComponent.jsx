import {
    Linking,
    Platform,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from 'react-native';
import { MapPinIcon } from 'react-native-heroicons/outline';

import { shadowBoxBlack } from '../../constants/shadow';

function MapCoordinatesComponent({ mapLink }) {
    // Функция открытия ссылки на карту
    const openInMaps = () => {
        if (!mapLink) {
            console.log('Ссылка на карту отсутствует');
            return;
        }

        Linking.canOpenURL(mapLink)
            .then(supported => {
                if (supported) {
                    Linking.openURL(mapLink);
                } else {
                    console.log('Не удалось открыть карту на устройстве');
                }
            })
            .catch(err => console.error('Ошибка при открытии карты:', err));
    };

    return (
        <TouchableOpacity
            style={[styles.container, shadowBoxBlack()]}
            onPress={openInMaps}
            activeOpacity={0.7}
        >
            <MapPinIcon size={20} style={{ marginRight: 8 }} />
            <Text> Open map</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#efba11',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },

    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MapCoordinatesComponent;
