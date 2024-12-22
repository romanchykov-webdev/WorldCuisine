import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const LoadingComponent = (props) => {

    const{size,color}=props;
    // Если размер передан как число, приводим его к строковому типу для ActivityIndicator
    const activityIndicatorSize = typeof size === 'number' ? size : 'large';
  return (
    <View className="flex-1 flex justify-center items-center  h-[100]
    {/*bg-red-500*/}
    ">

        <ActivityIndicator size={activityIndicatorSize} color={color} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({})

export default LoadingComponent;
