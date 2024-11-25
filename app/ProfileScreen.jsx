import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity} from 'react-native';
import {useRouter} from "expo-router";
import ButtonBack from "../components/ButtonBack";

import {Image} from 'expo-image'
import {wp} from "../constants/responsiveScreen";
import {shadowBoxBlack} from "../constants/shadow";



import {PencilSquareIcon, ArrowLeftEndOnRectangleIcon, CreditCardIcon,StarIcon,HeartIcon,BellIcon} from "react-native-heroicons/mini";

const ProfileScreen = () => {

    const router = useRouter();

    // change avatar
    const changeAvatar = async () => {
        console.log('changeAvatar')
    }

    // log out
    const handleLogUot = () => {
        console.log('log out')
    }

    // handleMyPost
    const handleMyPost = () => {
        console.log('handleMyPost')
    }

    // handleMyFavorite
    const handleMyFavorite = () => {
        console.log('handleMyFavorite')
    }

    return (
        <SafeAreaView>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
            >
                <View className="flex-row justify-between items-center">
                    <View style={shadowBoxBlack()}>

                        <ButtonBack/>
                    </View>

                    <TouchableOpacity
                        onPress={handleLogUot}
                        style={shadowBoxBlack()}
                        className="bg-white p-3 border-[1px] border-neutral-300 rounded-full"
                    >
                        <ArrowLeftEndOnRectangleIcon size={30} color="red"/>
                    </TouchableOpacity>
                </View>


                {/*    avatar and user name*/}
                <View className=" gap-y-5 items-center mb-5">

                    {/*avatar*/}
                    <View className="relative">
                        <View style={shadowBoxBlack()}>
                            <Image
                                source={require('../assets/img/user_icon.png')}
                                style={{width: wp(50), height: wp(50), borderRadius: '50%', marginBottom: 10}}
                                contentFit="cover"
                                transition={1000}
                                // onLoad={loadingImage}
                            />
                        </View>
                        <View className="absolute bottom-10 right-5" style={shadowBoxBlack()}>
                            <TouchableOpacity
                                onPress={changeAvatar}
                                className="bg-white p-2 border-[1px] border-neutral-300 rounded-full"
                            >

                                <PencilSquareIcon size={30} color='grey'/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*userName*/}
                    <Text>user name</Text>
                </View>

                {/*change lang app*/}
                <View className="flex-row items-center mb-10">
                    <TouchableOpacity
                        onPress={()=>router.push('/ChangeLangScreen')}
                        style={shadowBoxBlack()}
                        className="p-5 items-center justify-center flex-row w-full border-[1px] border-neutral-300 rounded-full bg-amber-300"
                    >
                        <Text>Change language App</Text>
                    </TouchableOpacity>
                </View>

                {/*   update profile   may posts may like  may rating*/}
                <View className="flex-row mb-5 items-center justify-around">

                    {/*may posts*/}
                    <TouchableOpacity
                        onPress={handleMyPost}
                        style={shadowBoxBlack()}
                        className="items-center p-2 bg-neutral-200 rounded-[15]"
                    >
                        <CreditCardIcon size={45} color='green'/>
                        <Text style={{fontSize:8}}>May recipes</Text>
                    </TouchableOpacity>

                    {/*may favorite*/}
                    <TouchableOpacity
                        onPress={handleMyFavorite}
                        style={shadowBoxBlack()}
                        className="items-center p-2 bg-neutral-200 rounded-[15]"
                    >
                        <BellIcon size={45} color='gold'/>
                        <Text style={{fontSize:8}}>May Favorite</Text>
                    </TouchableOpacity>

                    {/*may Favorite*/}
                    <TouchableOpacity
                        onPress={handleMyFavorite}
                        style={shadowBoxBlack()}
                        className="items-center p-2 bg-neutral-200 rounded-[15]"
                    >
                        <HeartIcon size={45} color='red'/>
                        <Text style={{fontSize:8}}>May Favorite</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({})

export default ProfileScreen;
