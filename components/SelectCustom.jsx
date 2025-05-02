import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {shadowBoxBlack} from "../constants/shadow";
import {ChevronDownIcon, ChevronUpIcon} from "react-native-heroicons/outline";
import {themes} from "../constants/themes";
import {useAuth} from "../contexts/AuthContext";

const SelectCustom = ({title, items, defaultValue, setItems,icon}) => {
    const [isOpen, setIsOpen] = useState(false); // Состояние для управления раскрытием списка
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    const {currentTheme}=useAuth()

    useEffect(()=>{
        setItems(defaultValue)
        setSelectedValue(defaultValue)
    },[defaultValue])

    const handleSelect = (key) => {
        // console.log('handleSelect', key);
        setSelectedValue(key); // Устанавливаем выбранное значение
        setItems(key); // Вызываем функцию для обновления значения в родительском компоненте
        setIsOpen(false); // Закрываем выпадающий список
    };

    // console.log('SelectCustom defaultValue',defaultValue)

    // useEffect(() => {
    //     setSelectedValue(defaultValue);
    //     setItems(defaultValue)
    // },[selectedValue])

    // console.log('SelectCustom defaultValue:',defaultValue)
    // console.log('SelectCustom items:',defaultValue)

    // animated hi
    // console.log('SelectCustom selectedValue',selectedValue)

    // useEffect(()=>{
    //     setItems(defaultValue)
    //     setSelectedValue(defaultValue)
    // },[defaultValue])



    // Validate defaultValue and set a fallback if necessary
    // useEffect(() => {
    //     if (defaultValue && items[defaultValue]) {
    //         setSelectedValue(defaultValue);
    //         setItems(defaultValue); // Ensure parent is updated with valid default
    //     } else {
    //         console.warn("Invalid defaultValue:", defaultValue);
    //         // Set first available key as fallback
    //         const firstKey = Object.keys(items)[0];
    //         if (firstKey) {
    //             setSelectedValue(firstKey);
    //             setItems(firstKey);
    //         }
    //     }
    // }, [defaultValue, items, setItems]);

    // const handleSelect = (key) => {
    //     // console.log('handleSelect', key);
    //     setSelectedValue(key); // Устанавливаем выбранное значение
    //     setItems(key); // Вызываем функцию для обновления значения в родительском компоненте
    //     setIsOpen(false); // Закрываем выпадающий список
    // };
    // const handleSelect = (key) => {
    //     if (key && items[key]) {
    //         setSelectedValue(key);
    //         setItems(key);
    //         setIsOpen(false);
    //     } else {
    //         console.warn("Invalid key selected:", key);
    //     }
    // };
    // //
    // if (!items || Object.keys(items).length === 0) {
    //     return (
    //         <View style={styles.container}>
    //             <Text style={styles.headerText}>No languages available</Text>
    //         </View>
    //     );
    // }
    return (
        <View
            style={[
                styles.container,
                shadowBoxBlack({
                    offset: {width: 1, height: 1},
                    opacity: 0.3,
                    radius: 1,
                    elevation: 1,
                }),
            ]}
        >
            {/* Заголовок выпадающего списка */}

            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)} // Открытие/закрытие списка

            >
                <View
                    style={[styles.header,{backgroundColor:themes[currentTheme]?.backgroundColor}]}
                >
                    <View
                    style={styles.iconWrapper}
                    >
                        {icon && React.createElement(icon, { size: 24, color: "blue" })}
                    </View>
                    <Text style={[styles.headerText,{color:themes[currentTheme]?.textColor}]}>
                        {`${title} `}
                    </Text>
                   <View style={[styles.textValueWrapper]}>
                       <Text style={[{color: themes[currentTheme]?.textColor}]}>
                           {items[selectedValue]}
                       </Text>
                   </View>
                    <View style={[styles.chevronWrapper]}>
                        {
                            isOpen
                                ? (<ChevronUpIcon size={30} color={'grey'}/>)
                                : (<ChevronDownIcon size={30} color={'grey'}/>)
                        }
                    </View>


                </View>

            </TouchableOpacity>


            {/* Список элементов (показывается, если isOpen === true) */}
            {isOpen && (
                <View style={[styles.dropdown,{backgroundColor: themes[currentTheme]?.backgroundColor}]}>
                    {Object.entries(items).map(([key, name], index) => (
                        <TouchableOpacity
                            key={index}
                            style={
                                    [
                                        styles.item,

                                        index===Object.entries(items).length-1 &&{borderBottomColor:"transparent"},

                                    ]
                                }
                            onPress={() => handleSelect(key)}
                        >
                            <Text style={[styles.itemText,{color:themes[currentTheme]?.textColor}]}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'black',
        borderRadius: 10,
        margin: 1
        // overflow: 'hidden',
    },
    header: {
        padding: 15,
        // backgroundColor: 'black',
        borderRadius: 10,
        // display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    iconWrapper:{
        // backgroundColor:'red',
        marginRight:5
    },
    headerText: {
        fontWeight: 'bold',
        color: '#333',
    },
    textValueWrapper:{
        // backgroundColor:'red',
        flex:1,
        alignItems: 'center'
    },
    chevronWrapper:{
       marginLeft:'auto',
        // backgroundColor:'red',
    },
    dropdown: {
        marginTop: 5,
        // backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'gey',
    },
    itemText: {
        textTransform: 'capitalize',
        color: '#555',
    },
});

export default SelectCustom;
