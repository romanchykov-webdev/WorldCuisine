import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {Cog6ToothIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../constants/shadow";
import {useRouter} from "expo-router";
import {useAuth} from "../contexts/AuthContext";
import AvatarCustom from "./AvatarCustom";

const HeaderComponent = ({isAuth,user}) => {



    const router = useRouter();


    // console.log('user HeaderComponent',user)

    // console.log('home component isAuth',isAuth)

    return (
        <View>


            <View className="flex-row  justify-between items-center mb-5">
                <View className="flex-row items-center">
                    <Image
                        source={require('../assets/img/ratatouille.png')}
                        className="w-[25] h-[25] rounded-full mr-1"
                        resizeMode="cover"
                    />
                    <Text className="text-neutral-700"
                          style={{fontSize: 24}}
                    >Ratatouille</Text>
                </View>
                <View
                >
                    {isAuth
                        ? (
                            <TouchableOpacity
                                style={shadowBoxBlack({
                                    offset: {width: 2, height: 2}, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
                                    opacity: 0.3, // Прозрачность тени (по умолчанию 30%)
                                    radius: 5,
                                })}
                                onPress={() => router.push('/ProfileScreen')}

                            >
                                {/*<Image*/}
                                {/*    source={require('../assets/img/user_icon.png')}*/}
                                {/*    className="rounded-full border-[1px] border-neutral-500"*/}
                                {/*    style={{width: hp(5), height: hp(5)}}*/}
                                {/*    resizeMode="cover"*/}
                                {/*/>*/}
                                <AvatarCustom
                                    uri={user?.avatar}
                                    size={hp(4.3)}
                                    style={{borderWidth:0.2}}
                                    rounded={50}
                                />
                            </TouchableOpacity>
                        )
                        : (
                            <View className="flex-row">

                            {/*    sign to settings*/}
                                <TouchableOpacity
                                    onPress={() => router.push('/ProfileScreen')}
                                    className="p-2"
                                >
                                    <Cog6ToothIcon size={hp(3)} color="gray"/>
                                </TouchableOpacity>
                                

                            </View>

                        )

                    }
                </View>

                {/*<TouchableOpacity>*/}
                {/*    <Cog6ToothIcon size={hp(4)} color="gray"/>*/}
                {/*</TouchableOpacity>*/}

            </View>
            {isAuth && 
                <View className="flex-row">
                    <Text style={{fontSize: hp(1.7)}} className="text-neutral-700">Hello, </Text>
                    <Text style={{fontSize: hp(1.7)}} className="text-neutral-700 capitalize">{user?.user_name} !</Text>
                </View>
            }

        </View>
    );
};

const styles = StyleSheet.create({})

export default HeaderComponent;
