import React from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {shadowBoxBlack} from "../constants/shadow";
import {hp} from "../constants/responsiveScreen";
import {MagnifyingGlassIcon} from "react-native-heroicons/mini";

// translate
import i18n from '../lang/i18n'

const SearchComponent = () => {
  return (
      <View
          style={shadowBoxBlack}
          className="rounded-full bg-black/5 p-[6] mt-5 mb-5"
      >
          <View className="flex-row items-center rounded-full bg-transparent">
              <TextInput
                  placeholder={i18n.t("Search any food")}
                  placeholderTextColor="gray"
                  style={[{fontSize: hp(1.7)}]}
                  className="flex-1 text-base tracking-wider p-3 mb-1"
              />
              <TouchableOpacity

                  className="bg-white rounded-full p-5">
                  <MagnifyingGlassIcon size={hp(2.5)} color="gray"/>
              </TouchableOpacity>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({})

export default SearchComponent;
