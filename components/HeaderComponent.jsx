import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {Cog6ToothIcon} from "react-native-heroicons/mini";

const HeaderComponent = ({isAuth}) => {
    return (
        <View>


            <View className="flex-row  justify-between items-center mb-5">
                <View>
                    {isAuth &&
                        <TouchableOpacity
                            onPress={() => router.push('/ProfileScreen')}
                        >
                            <Image
                                source={require('../assets/img/user_icon.png')}
                                className="rounded-full border-[1px] border-neutral-500"
                                style={{width: hp(5), height: hp(5)}}
                                resizeMode="cover"
                            />
                        </TouchableOpacity>
                    }
                </View>

                <TouchableOpacity>
                    <Cog6ToothIcon size={hp(4)} color="gray"/>
                </TouchableOpacity>

            </View>
            {isAuth && <Text style={{fontSize: hp(1.7)}} className="text-neutral-700">Hello, Serioga!</Text>
            }

        </View>
    );
};

const styles = StyleSheet.create({})

export default HeaderComponent;
