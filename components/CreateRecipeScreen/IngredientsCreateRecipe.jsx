import React, {useEffect, useState} from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import {TrashIcon, PlusIcon, ScaleIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../constants/shadow";
import Slider from "@react-native-community/slider";

const IngredientsCreateRecipe = ({placeholderText, placeholderColor, langApp, measurement, totalLangRecipe}) => {

    // console.log(measurement)
    // console.log(langApp)

    const [ingredient, setIngredient] = useState({
        "unit": "",
        "quantity": "",
        "ingredient": ""

    })

    const [isModalVisible, setIsModalVisible] = useState(false);

    // массив по ключу
    const [measurementLangApp, setMeasurementLangApp] = useState([])
    // console.log(measurementLangApp)

    const handleSelect = (item) => {
        setIsModalVisible(false)
        setIngredient({...ingredient, unit: item})
    }

    const [ingredients, setIngredients] = useState([])

    const addIngredient = () => {
        if (ingredient.ingredient === '' || ingredient.unit === '') {
            Alert.alert('Добавьте ингредиент и его единицу измерения')
        } else {
            console.log(ingredient)
            // Добавление ингредиента, если все поля заполнены
            // Например, добавление в массив или другое действие
        }
    }

    useEffect(() => {
        setMeasurementLangApp(measurement[langApp])
    }, [measurement, langApp])

    return (
        <View>

            {/*block visual ingredients*/}
            <View>

            </View>

            <View className=" flex-row  items-center bg-black-500">

                <View className="flex-1">
                    <InputCustom
                        placeholderText={placeholderText}
                        placeholderColor={placeholderColor}
                        ingredient={ingredient}
                        setIngredient={setIngredient}
                        totalLangRecipe={totalLangRecipe}
                    />
                </View>

               <View className="flex-row ">
                   <TouchableOpacity
                       style={shadowBoxBlack()}
                       onPress={() => setIsModalVisible(true)}
                       className="w-[40px] h-[40px] bg-violet-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                       <ScaleIcon color="white" size={20}/>
                   </TouchableOpacity>

                   <TouchableOpacity
                       style={shadowBoxBlack()}
                       onPress={addIngredient}
                       className="w-[40px] h-[40px] bg-green-500 border-2 border-neutral-300 rounded-[10] justify-center items-center ml-[2px]">
                       <PlusIcon color="white" size={20}/>
                   </TouchableOpacity>
               </View>


            </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
                // onRequestClose={closeModal}
            >

                <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View>
                                <Text style={styles.modalTitle}> Выберите единицу измерения.</Text>
                                <Text className="text-neutral-700 text-xs text-center mb-2">
                                    Выберите единицу измерения в которой вы измеряете этот ингредиент.
                                </Text>
                                <Text
                                    className="text-xl text-center mb-2">{ingredient.quantity}
                                </Text>
                                <Slider
                                    style={{width: '100%', height: 40}}
                                    minimumValue={1}
                                    maximumValue={100}
                                    step={1} // Шаг перемещения
                                    value={parseInt(ingredient.quantity, 1)} // Текущее значение
                                    minimumTrackTintColor="#000000"
                                    maximumTrackTintColor="#CCCCCC"
                                    onValueChange={(value) => setIngredient((prev) => ({
                                        ...prev,
                                        quantity: value.toString()
                                    }))}
                                />
                            </View>

                            <FlatList
                                data={measurementLangApp}
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
        </View>
    );
};



const InputCustom = ({placeholderText,placeholderColor,ingredient, setIngredient,totalLangRecipe}) => {
    return (
        <>
            <View className="">
            {
                totalLangRecipe.map((item, index) => {
                    return(

                           <TextInput
                               key={index}
                               value={ingredient.ingredient}
                               onChangeText={(value) => setIngredient({...ingredient, ingredient: value})}
                               placeholder={`placeholderText ${item}`}
                               placeholderTextColor={placeholderColor}
                               className="flex-1 border-2 border-neutral-200 p-3 rounded-[5]  h-[40px]"
                           />

                    )
                })
            }
            </View>
        </>

)
}


const styles = StyleSheet.create({
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
export default IngredientsCreateRecipe;