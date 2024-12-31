import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {hp, wp} from "../../constants/responsiveScreen";
import AvatarCustom from "../AvatarCustom";

const ImageCustom = ({image}) => {
  return (
    <View
        className="mb-5 mt-2"
    >
        <AvatarCustom
            uri={image}
            style={{
                width: "100%",
                height: 300,
                borderRadius: 40,
                marginTop: wp(1),
                borderWidth: 0.5,
                borderColor: 'gray'
            }}
        />
    </View>
  );
};

const styles = StyleSheet.create({})

export default ImageCustom;
