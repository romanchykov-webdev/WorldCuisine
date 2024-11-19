import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useRouter} from "expo-router";
import { ArrowUturnLeftIcon } from "react-native-heroicons/outline";
import {shadowBoxWhite} from "../constants/shadow";

const ButtonBack = () => {

    const router=useRouter();

  return (
      <TouchableOpacity
          onPress={() => router.back()}
          className="w-[50] h-[50] justify-center items-center bg-white rounded-full"
          style={shadowBoxWhite()}
      >
        <ArrowUturnLeftIcon size={30} color='gray'/>


      </TouchableOpacity>
  );
};

const styles = StyleSheet.create({})

export default ButtonBack;
