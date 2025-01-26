import React from 'react';
import {StyleSheet,View} from 'react-native';
import {shadowBoxBlack} from "../../constants/shadow";

const ButtonSmallCustom = ({w=40,h=40, icon: Icon,size=20,color="white" ,bg="white"}) => {
    return (
        <View
            style={{backgroundColor:bg,width:w,height:h}}
            className="border-2  border-neutral-300 rounded-[10] justify-center items-center ">
            {Icon && <Icon size={size} color={color} />}

        </View>
    );
};

const styles = StyleSheet.create({});

export default ButtonSmallCustom;