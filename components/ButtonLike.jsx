import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {HeartIcon} from "react-native-heroicons/solid";
import {shadowBoxWhite} from "../constants/shadow";

const ButtonLike = () => {

    const [isLike, setIsLike] = useState(false)

    const toggleLike=async ()=>{
        setIsLike(!isLike)
    }

    return (
        <TouchableOpacity
            onPress={toggleLike}
            className="w-[50] h-[50] justify-center items-center bg-white rounded-full"
            style={shadowBoxWhite()}
        >
            {
                isLike
                    ? (
                        <HeartIcon size={30} color='red'/>
                    )
                    : (

                        <HeartIcon size={30} color='gray'/>
                    )
            }


        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({})

export default ButtonLike;
