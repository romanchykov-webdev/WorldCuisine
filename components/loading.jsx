import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

const Loading = (props) => {
  return (
    <View className="flex-1 flex justify-center items-center  h-[100]
    {/*bg-red-500*/}
    ">
      <ActivityIndicator {...props}/>
    </View>
  );
};

const styles = StyleSheet.create({})

export default Loading;
