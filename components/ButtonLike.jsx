import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {HeartIcon} from "react-native-heroicons/solid";
import {shadowBoxWhite} from "../constants/shadow";
import {useRouter} from "expo-router";

// translate
import i18n from '../lang/i18n';

const ButtonLike = ({user}) => {

    // console.log('ButtonLike user',user)
    const router=useRouter();

    const [isLike, setIsLike] = useState(false)

    const toggleLike=async ()=>{
        if (user === null) {
            Alert.alert("Like", `${i18n.t('To add a recipe to your favorites you must log in or create an account')}`, [
                {
                    text: 'Cancel',
                    onPress: () => console.log('modal cancelled'),
                    style: 'cancel'
                },
                {
                    text: 'LogIn-SignUp',
                    onPress: () => router.replace('/ProfileScreen'),
                    style: "default"
                }
            ]);
            // Alert.alert("",{i18n.t('To rate a recipe you must log in or create an account')})
        } else {
            setIsLike(!isLike)
            // add new like
        }

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
