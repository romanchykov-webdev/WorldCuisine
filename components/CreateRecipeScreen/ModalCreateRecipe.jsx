import React from 'react';
import {FlatList, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';
import Slider from '@react-native-community/slider';

const ModalCreateRecipe = ({
                               isModalVisible,
                               setIsModalVisible,
                               title,
                               description,
                               array,
                               modalSelectItem,
                               setModalSelectItem,
                               modalType
                           }) => {

    const changeTime = (time) => {
        if (time < 60) {
            return `${time} минут`;
        } else {
            const hours = Math.floor(time / 60); // Целое количество часов
            const minutes = time % 60;          // Оставшиеся минуты
            return `${hours} час${hours > 1 ? 'а' : ''} ${minutes > 0 ? `${minutes} минут` : ''}`.trim();
        }
    };

    const handleSelect = (item) => {
        switch (modalType) {
            case "time":
                setModalSelectItem((prev) => ({...prev, time: item}));
                break;
            case "person":
                setModalSelectItem((prev) => ({...prev, person: item}));
                break;
            case "calorie":
                setModalSelectItem((prev) => ({...prev, calorie: item}));
                break;
            case "level":
                setModalSelectItem((prev) => ({...prev, level: item}));
                break;
        }
        setIsModalVisible(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
            // onRequestClose={closeModal}
        >

            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Text className="text-neutral-700 text-xs text-center mb-2">
                                {description}
                            </Text>
                        </View>

                        {
                            modalType === "time" || modalType === "calorie"
                                ? (
                                    <>
                                        {
                                            modalType === "time"
                                                ? (
                                                    <View>
                                                        <Text
                                                            className="text-xl text-center mb-2">{changeTime(modalSelectItem.time)}</Text>
                                                        <Slider
                                                            style={{width: '100%', height: 40}}
                                                            minimumValue={array[0]}
                                                            maximumValue={array[1]}
                                                            step={5} // Шаг перемещения
                                                            value={parseInt(modalSelectItem.time, 10)} // Текущее значение
                                                            minimumTrackTintColor="#000000"
                                                            maximumTrackTintColor="#CCCCCC"
                                                            onValueChange={(value) => setModalSelectItem((prev) => ({
                                                                ...prev,
                                                                time: value.toString()
                                                            }))}
                                                        />
                                                    </View>
                                                )
                                                : (
                                                    <View>
                                                        <Text
                                                            className="text-xl text-center mb-2">{modalSelectItem.calorie} calories
                                                        </Text>
                                                        <Slider
                                                            style={{width: '100%', height: 40}}
                                                            minimumValue={array[0]}
                                                            maximumValue={array[1]}
                                                            step={5} // Шаг перемещения
                                                            value={parseInt(modalSelectItem.calorie, 10)} // Текущее значение
                                                            minimumTrackTintColor="#000000"
                                                            maximumTrackTintColor="#CCCCCC"
                                                            onValueChange={(value) => setModalSelectItem((prev) => ({
                                                                ...prev,
                                                                calorie: value.toString()
                                                            }))}
                                                        />
                                                    </View>
                                                )
                                        }
                                    </>
                                )
                                : (
                                    <FlatList
                                        data={array}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({item}) => (
                                            <TouchableOpacity
                                                style={styles.langOption}
                                                onPress={() => handleSelect(item)}
                                            >
                                                <Text style={styles.langText}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                )
                        }


                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalDescription: {
        fontSize: 12,
        color: 'gray',
    },
    langOption: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    langText: {
        fontSize: 16,
    },
    cancelButton: {
        marginTop: 15,
        padding: 10,
        backgroundColor: '#f44336',
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
    },
    selectedLangText: {
        marginTop: 20,
        fontSize: 16,
        fontStyle: 'italic',
    },
});

export default ModalCreateRecipe;