import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {shadowBoxBlack} from "../constants/shadow";
import {ChevronDownIcon, ChevronUpIcon} from "react-native-heroicons/outline";

const SelectCustom = ({title, items, defaultValue, setItems,icon}) => {
    const [isOpen, setIsOpen] = useState(false); // Состояние для управления раскрытием списка
    const [selectedValue, setSelectedValue] = useState(defaultValue);

    // console.log('SelectCustom defaultValue',defaultValue)

    // useEffect(() => {
    //     setSelectedValue(defaultValue);
    //     setItems(defaultValue)
    // },[selectedValue])

    // console.log('SelectCustom defaultValue:',defaultValue)
    // console.log('SelectCustom items:',defaultValue)

    // animated hi
    // console.log('SelectCustom selectedValue',selectedValue)

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
                    style={styles.header}
                >
                    <View
                    style={styles.iconWrapper}
                    >
                        {icon && React.createElement(icon, { size: 24, color: 'grey' })}
                    </View>
                    <Text style={styles.headerText}>
                        {`${title} `}
                    </Text>
                   <View style={styles.textValueWrapper}>
                       <Text >
                           {items[selectedValue]}
                       </Text>
                   </View>
                    <View style={styles.chevronWrapper}>
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
                <View style={styles.dropdown}>
                    {Object.entries(items).map(([key, name], index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.item}
                            onPress={() => handleSelect(key)}
                        >
                            <Text style={styles.itemText}>{name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        margin: 1
        // overflow: 'hidden',
    },
    header: {
        padding: 15,
        backgroundColor: 'white',
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
        backgroundColor: 'white',
        borderRadius: 10,
        overflow: 'hidden',
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemText: {
        textTransform: 'capitalize',
        color: '#555',
    },
});

export default SelectCustom;
