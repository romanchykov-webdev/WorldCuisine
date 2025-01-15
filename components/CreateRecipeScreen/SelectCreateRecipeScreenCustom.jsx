import React, {useState} from 'react';
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {shadowBoxBlack} from "../../constants/shadow";
import {hp} from "../../constants/responsiveScreen";
import {ClockIcon, FireIcon, Square3Stack3DIcon, UsersIcon} from "react-native-heroicons/mini";
import i18n from "../../lang/i18n";
import {Picker} from "@react-native-picker/picker";

const SelectCreateRecipeScreenCustom = () => {


    const [selectedValue, setSelectedValue] = useState('easy');

    const [isModalVisible, setIsModalVisible] = useState(false);


    return (
        <View
            className="flex-row justify-around ">

            {/*ClockIcon*/}
            <View className="flex rounded-full bg-amber-300  p-1 items-center"
                  style={shadowBoxBlack()}
            >

                <View
                    className="bg-white rounded-full flex items-center justify-around"
                    style={{width: hp(6.5), height: hp(6.5)}}
                >
                    <ClockIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                </View>

                {/*    descriptions*/}
                <View className="flex items-center py-2 gap-y-1">
                    <TextInput
                        value={'00'}
                        style={{fontSize: hp(2)}}
                        className="font-bold  text-neutral-700"
                    />

                    <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500">
                        {i18n.t('Mins')}
                    </Text>
                </View>

            </View>

            {/*users*/}
            <View className="flex rounded-full bg-amber-300  p-1 items-center"
                  style={shadowBoxBlack()}
            >

                <View
                    className="bg-white rounded-full flex items-center justify-around"
                    style={{width: hp(6.5), height: hp(6.5)}}
                >
                    <UsersIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                </View>

                {/*    descriptions*/}
                <View className="flex items-center py-2 gap-y-1">
                    <TextInput
                        value={'1'}
                        style={{fontSize: hp(2)}}
                        className="font-bold  text-neutral-700"
                    />
                    <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                        {i18n.t('Person')}
                    </Text>
                </View>

            </View>

            {/*calories*/}
            <View className="flex rounded-full bg-amber-300  p-1 items-center

                                "
                  style={shadowBoxBlack()}
            >

                <View
                    className="bg-white rounded-full flex items-center justify-around"
                    style={{width: hp(6.5), height: hp(6.5)}}
                >
                    <FireIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                </View>

                {/*    descriptions*/}
                <View className="flex items-center py-2 gap-y-1">
                    <TextInput
                        value={'0'}
                        style={{fontSize: hp(2)}}
                        className="font-bold  text-neutral-700"
                    />
                    <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                        {i18n.t('Cal')}
                    </Text>
                </View>

            </View>

            {/*level*/}
            <View className="flex rounded-full bg-amber-300  p-1 items-center"
                  style={shadowBoxBlack()}
            >

                <View
                    className="bg-white rounded-full flex items-center justify-around"
                    style={{width: hp(6.5), height: hp(6.5)}}
                >
                    <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                </View>

                <TouchableOpacity
                    className="border-2 border-red-500 w[50] h-[50]"
                onPress={() => setIsModalVisible(!isModalVisible)}
                >
                    {/*    descriptions*/}
                    <View className="flex items-center py-2 gap-y-1">

                        {/* Модальное окно */}
                        <Modal
                            transparent={true}
                            visible={isModalVisible}
                            animationType="slide"
                            onRequestClose={() => setIsModalVisible(false)}
                        >
                            <View style={styles.modalOverlay}>
                                <View style={styles.modalContent}>
                                    <Text style={styles.modalTitle}>Выберите уровень</Text>

                                    {/* Выпадающий список */}
                                    <Picker
                                        selectedValue={selectedValue}
                                        onValueChange={(itemValue) => setSelectedValue(itemValue)}
                                    >
                                        <Picker.Item label="Легко" value="easy" />
                                        <Picker.Item label="Средне" value="medium" />
                                        <Picker.Item label="Сложно" value="hard" />
                                    </Picker>

                                    {/* Кнопка закрытия */}
                                    <TouchableOpacity
                                        style={styles.closeButton}
                                        onPress={() => setIsModalVisible(false)}
                                    >
                                        <Text style={styles.closeButtonText}>Закрыть</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </TouchableOpacity>


            </View>

        </View>
    );
};

const styles = StyleSheet.create({

});

export default SelectCreateRecipeScreenCustom;