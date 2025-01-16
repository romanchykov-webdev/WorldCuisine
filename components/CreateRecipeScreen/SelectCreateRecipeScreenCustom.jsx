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
import ModalCreateRecipe from "./ModalCreateRecipe";

const SelectCreateRecipeScreenCustom = () => {


    const [modalTitle, setModalTitle] = useState('')
    const [modalDescription, setModalDescription] = useState('')
    const [modalArray, setModalArray] = useState([])
    const [modalType, setModalType] = useState()
    const [modalSelectItem, setModalSelectItem] = useState(
        {
            time: '0',
            person: '0',
            calorie: '0',
            level: 'Уровень'
        }
    )

    const [isModalVisible, setIsModalVisible] = useState(false);


    const openModalLevel = async ({title, description, array, type}) => {
        setModalTitle(title)
        setModalDescription(description)
        setModalArray(array)
        setIsModalVisible(true)
        setModalType(type)
    }

    return (
        <View
            className="flex-row justify-around ">

            {/*ClockIcon*/}
            <TouchableOpacity
                onPress={() => openModalLevel({
                        title: 'Время приготовления.',
                        description: 'Здесь вы можете указать примерное время приготовления блюда.',
                        array: [0,299],
                        type: 'time'
                    }
                )}
            >
                <View className="flex rounded-full bg-amber-300  p-1 items-center"
                      style={[{height: 120}, shadowBoxBlack()]}
                >
                    <View className="justify-between flex-col pb-2 flex-1">
                        <View
                            className="bg-white rounded-full flex items-center justify-around"
                            style={{width: hp(6.5), height: hp(6.5)}}
                        >
                            <ClockIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                        </View>

                        {/*    descriptions*/}
                        <View className="flex items-center py-2 gap-y-1">
                            <Text className="font-bold  text-neutral-700">{modalSelectItem.time}</Text>

                            <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500">
                                {i18n.t('Mins')}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

            {/*users*/}
            <TouchableOpacity
                onPress={() => openModalLevel({
                        title: 'Выберите количество персон.',
                        description: 'Здесь вы можете выбрать на какое количество персон рассчитан ваш рецепт.',
                        array: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                        type: 'person'
                    }
                )}
            >

                <View className="flex rounded-full bg-amber-300  p-1 items-center"
                      style={[{height: 120}, shadowBoxBlack()]}
                >
                    <View className="justify-between flex-col pb-2 flex-1">

                        <View
                            className="bg-white rounded-full flex items-center justify-around"
                            style={{width: hp(6.5), height: hp(6.5)}}
                        >
                            <UsersIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                        </View>

                        {/*    descriptions*/}
                        <View className="flex items-center py-2 gap-y-1">
                            <Text className="font-bold  text-neutral-700">{modalSelectItem.person}</Text>
                            <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                {i18n.t('Person')}
                            </Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>

            {/*calories*/}
            <TouchableOpacity
                onPress={() => openModalLevel({
                        title: 'Выберите калорийности.',
                        description: 'Здесь вы можете выбрать уровень калорийности блюда в 100 граммах.',
                        array: [0,3000],
                        type: 'calorie'
                    }
                )}
            >
                <View className="flex rounded-full bg-amber-300  p-1 items-center "
                      style={[{height: 120}, shadowBoxBlack()]}
                >

                    <View className="justify-between flex-col pb-2 flex-1">
                        <View
                            className="bg-white rounded-full flex items-center justify-around"
                            style={{width: hp(6.5), height: hp(6.5)}}
                        >
                            <FireIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                        </View>

                        {/*    descriptions*/}
                        <View className="flex items-center py-2 gap-y-1">
                            <Text className="font-bold  text-neutral-700">{modalSelectItem.calorie}</Text>
                            <Text style={{fontSize: hp(1.2)}} className="font-bold  text-neutral-500
                                        {/*bg-red-500*/}
                                        ">
                                {i18n.t('Cal')}
                            </Text>
                        </View>
                    </View>

                </View>
            </TouchableOpacity>

            {/*level*/}
            <TouchableOpacity
                onPress={() => openModalLevel({
                        title: 'Выберите сложность.',
                        description: 'Здесь вы можете выбрать уровень сложности приготовления рецепта.',
                        array: ["Легко", "Среднее", "Сложно"],
                        type: 'level'
                    }
                )}
            >

                <View className="flex rounded-full bg-amber-300  p-1 items-center"
                      style={[{height: 120}, shadowBoxBlack()]}
                >


                    <View className="justify-between flex-col pb-2 flex-1">
                        <View
                            className="bg-white rounded-full flex items-center justify-around"
                            style={{width: hp(6.5), height: hp(6.5)}}
                        >
                            <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color='gray'/>
                        </View>


                        {/*    descriptions*/}
                        <View className="flex items-center py-2 gap-y-1">
                            <Text style={[styles.text, {fontSize: 8}]}
                                  numberOfLines={1} // Ограничение до одной строки
                                  ellipsizeMode="tail" // Добавляет "..." в конце длинного текста
                            >{modalSelectItem.level}</Text>
                        </View>
                    </View>


                </View>
            </TouchableOpacity>


            {
                isModalVisible && (
                    <ModalCreateRecipe
                        isModalVisible={isModalVisible}
                        setIsModalVisible={setIsModalVisible}
                        title={modalTitle}
                        description={modalDescription}
                        array={modalArray}
                        setModalSelectItem={setModalSelectItem}
                        modalSelectItem={modalSelectItem}
                        modalType={modalType}
                    />
                )
            }


        </View>
    );
};

const styles = StyleSheet.create({});

export default SelectCreateRecipeScreenCustom;