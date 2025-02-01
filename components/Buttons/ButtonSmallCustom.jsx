import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const ButtonSmallCustom = ({
                               styleWrapperButton,
                               w = 40,
                               h = 40,
                               icon: Icon,
                               size = 20,
                               color = "white",
                               bg = "white",
                               title,
                               styleText,
                               buttonText = false
                           }) => {
    return (
        <View
            style={{backgroundColor: bg, width: w, height: h, ...styleWrapperButton}}
            className="border-2  border-neutral-300 rounded-[10] justify-center items-center ">
            {Icon && <Icon size={size} color={color}/>}

            {
                buttonText && (
                    <Text style={styleText}>
                        {title}
                    </Text>
                )
            }

        </View>
    );
};

const styles = StyleSheet.create({});

export default ButtonSmallCustom;