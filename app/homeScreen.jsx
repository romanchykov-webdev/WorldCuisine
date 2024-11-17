import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SparklesIcon as SparklesIconMicro } from "react-native-heroicons/micro";

const HomeScreen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>HomeScreen works!</Text>
        <SparklesIconMicro />
    </View>
  );
};

const styles = StyleSheet.create({})

export default HomeScreen;
