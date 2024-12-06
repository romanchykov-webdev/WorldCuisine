import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {hp} from "../constants/responsiveScreen";
import {Cog6ToothIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../constants/shadow";
import {useRouter} from "expo-router";

const HeaderComponent = ({isAuth}) => {

    const router = useRouter();

    return (
        <View>


            <View className="flex-row  justify-between items-center mb-5">
                <Text className="text-neutral-700"
                      style={{fontSize: 24}}
                >Ratatouille</Text>
                <View style={shadowBoxBlack({
                    offset: {width: 2, height: 2}, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
                    opacity: 0.3, // Прозрачность тени (по умолчанию 30%)
                    radius: 5,
                })}
                >
                    {isAuth
                        ? (
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
                        )
                        : (
                            <View className="flex-row">

                                {/*    login*/}
                                <TouchableOpacity
                                    onPress={() => router.push('(auth)/LogInScreen')}
                                >
                                    <Text>LogIn</Text>
                                </TouchableOpacity>

                                <Text> / </Text>

                                {/*    sign Up*/}
                                <TouchableOpacity
                                    onPress={() => router.push('(auth)/RegistrationScreen')}
                                >
                                    <Text>SignUp</Text>
                                </TouchableOpacity>


                            </View>

                        )

                    }
                </View>

                {/*<TouchableOpacity>*/}
                {/*    <Cog6ToothIcon size={hp(4)} color="gray"/>*/}
                {/*</TouchableOpacity>*/}

            </View>
            {isAuth && <Text style={{fontSize: hp(1.7)}} className="text-neutral-700">Hello, Serioga!</Text>
            }

        </View>
    );
};

const styles = StyleSheet.create({})

export default HeaderComponent;
