import React from 'react';
import {StyleSheet} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {Image} from 'expo-image'
import {getUserImageSrc} from "../service/imageServices";

const AvatarCustom = ({
                          uri,
                          size = hp(4.5),
                          style = {},
                          // rounded = 'rounded-full'
                          rounded = '100'
                      }) => {
    // console.log('AvatarCustom uri',uri)
    return (
        <Image
            source={getUserImageSrc(uri)}
            transition={100}
            style={[styles.avatar, {height: size, width: size, borderRadius: rounded}, style]}
        />
    );
};

const styles = StyleSheet.create({
    avatar: {
        borderCurve: 'continuous',
        borderColor: 'black',
        borderWidth: 1,
    }
})

export default AvatarCustom;
