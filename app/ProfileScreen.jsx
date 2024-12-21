import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert} from 'react-native';
import {useRouter} from "expo-router";
import ButtonBack from "../components/ButtonBack";

import {Image} from 'expo-image'
import {hp, wp} from "../constants/responsiveScreen";
import {shadowBoxBlack} from "../constants/shadow";


import {
    PencilSquareIcon,
    ArrowLeftEndOnRectangleIcon,
    CreditCardIcon,
    StarIcon,
    HeartIcon,
    BellIcon
} from "react-native-heroicons/mini";
import {useAuth} from "../contexts/AuthContext";
import {supabase} from "../lib/supabase";
import SelectCustom from "../components/SelectCustom";
import LanguagesWrapper from "../components/LanguagesWrapper";
import ThemeWrapper from "../components/ThemeWrapper";
import AvatarCustom from "../components/AvatarCustom";
import {logOut} from "../service/userService";


const ProfileScreen = () => {
    const {setAuth, user, setUserData} = useAuth();



    console.log('Profile user',user)

    const [isAuth, setIsAuth] = useState(null)
    useEffect(() => {

        if(user){
            setIsAuth(true)
        }else{
            setIsAuth(false)
        }
    },[user])


    // console.log('setAuth ProfileScreen',setAuth)
    // console.log('identities ProfileScreen',user.identities)



    // console.log('ProfileScreen userData:',userData)



    const router = useRouter();

    // change avatar
    const updateProfile = async () => {
        // console.log('updateProfile')
        router.push('/(main)/editProfile')
    }

    // // log out
    // const logOut = async () => {
    //     setAuth(null)
    //
    //     const {error} = await supabase.auth.signOut();
    //     if (error) {
    //         Alert.alert('Sign Out', "Error signing out!");
    //     }
    //     router.replace('/homeScreen')
    // }
    const handleLogUot = async () => {
        console.log('log out')


        Alert.alert('Confirm', 'Are you sure you want to log out?', [
            {
                text: 'Cancel',
                onPress: () => console.log('modal cancelled'),
                style: 'cancel'
            },
            {
                text: 'LogOut',
                onPress: () => logOut({setAuth, router}),
                style: 'destructive'
            }
        ]);

    }

    // rename userName



    // console.log('newUserName Input',newUserName)

    const handleMyPost = () => {
        console.log('handleMyPost')


    }

    // handleMyFavorite
    const handleMyFavorite = () => {
        console.log('handleMyFavorite')
    }

    return (
        <SafeAreaView
            contentContainerStyle={{flex: 1}}
            // className="bg-red-500"
        >
            {
                isAuth
                    ? (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 20}}
                        >
                            <View className="flex-row justify-between items-center">
                                <View style={shadowBoxBlack()}>

                                    <ButtonBack/>
                                </View>

                                <Text style={{fontSize:hp(2)}}>Profile</Text>

                                <TouchableOpacity
                                    onPress={handleLogUot}
                                    style={shadowBoxBlack()}
                                    className="bg-white p-3 border-[1px] border-neutral-300 rounded-full"
                                >
                                    <ArrowLeftEndOnRectangleIcon size={30} color="red"/>
                                </TouchableOpacity>
                            </View>


                            {/*    avatar and user name*/}
                            <View className=" gap-y-5 items-center mb-5 ">

                                {/*avatar*/}
                                <View className="relative ">
                                    <View style={shadowBoxBlack()}>
                                        {/*<Image*/}
                                        {/*    source={require('../assets/img/user_icon.png')}*/}
                                        {/*    // source={avatarSource}*/}
                                        {/*    style={{width: wp(50), height: wp(50), borderRadius: '50%', marginBottom: 10}}*/}
                                        {/*    contentFit="cover"*/}
                                        {/*    transition={1000}*/}
                                        {/*    // onLoad={loadingImage}*/}
                                        {/*/>*/}
                                        <AvatarCustom
                                            uri={user?.avatar}
                                            size={wp(50)}
                                            style={{borderWidth: 0.2}}
                                            rounded={150}
                                        />
                                    </View>
                                    <View className="absolute bottom-5 right-5" style={shadowBoxBlack()}>
                                        <TouchableOpacity
                                            onPress={updateProfile}
                                            className="bg-white p-2 border-[1px] border-neutral-300 rounded-full"
                                        >

                                            <PencilSquareIcon size={30} color='grey'/>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/*userName*/}
                                <Text>{user?.user_name}</Text>


                            </View>

                            {/*change lang app*/}


                            {/*   update profile   may posts may like  may rating*/}
                            <View className="flex-row mb-5 items-center justify-around">

                                {/*may posts*/}
                                <TouchableOpacity
                                    onPress={handleMyPost}
                                    style={shadowBoxBlack()}
                                    className="items-center p-2 bg-neutral-200 rounded-[15]"
                                >
                                    <CreditCardIcon size={45} color='green'/>
                                    <Text style={{fontSize: 8}}>May recipes</Text>
                                </TouchableOpacity>

                                {/*may favorite*/}
                                <TouchableOpacity
                                    onPress={handleMyFavorite}
                                    style={shadowBoxBlack()}
                                    className="items-center p-2 bg-neutral-200 rounded-[15]"
                                >
                                    <BellIcon size={45} color='gold'/>
                                    <Text style={{fontSize: 8}}>May Favorite</Text>
                                </TouchableOpacity>

                                {/*may Favorite*/}
                                <TouchableOpacity
                                    onPress={handleMyFavorite}
                                    style={shadowBoxBlack()}
                                    className="items-center p-2 bg-neutral-200 rounded-[15]"
                                >
                                    <HeartIcon size={45} color='red'/>
                                    <Text style={{fontSize: 8}}>May Favorite</Text>
                                </TouchableOpacity>
                            </View>


                        </ScrollView>

                    )
                    : (

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 20, flex: 1}}
                            className="h-full"
                        >
                            {/*button go tu back*/}
                            <View style={shadowBoxBlack()}
                                  className="mt-5"
                            >

                                <ButtonBack/>
                            </View>


                            {/*change lang*/}
                            <View className=" h-full flex-1 justify-center
                            {/*bg-red-500*/}
                            ">

                                {/*block login and sign up*/}
                                <View
                                    className="mb-10 w-full flex-row gap-10 justify-center
                                    {/*bg-red-500*/}
                                    "
                                >
                                    {/*    log in*/}
                                    <TouchableOpacity
                                        onPress={() => router.push('/(auth)/LogInScreen')}
                                        style={shadowBoxBlack()}
                                        className="p-5 pl-10 pr-10 items-center justify-center  border-[1px] border-neutral-300 rounded-full bg-amber-300"
                                    >
                                        <Text>Log In</Text>
                                    </TouchableOpacity>

                                    {/*    sign Up*/}

                                    <TouchableOpacity
                                        onPress={() => router.push('/(auth)/RegistrationScreen')}
                                        style={shadowBoxBlack()}
                                        className="p-5 pl-10 pr-10 items-center justify-center  border-[1px] border-neutral-300 rounded-full bg-amber-300"
                                    >
                                        <Text>Sign Up</Text>
                                    </TouchableOpacity>
                                </View>

                                {/*<TouchableOpacity*/}
                                {/*    onPress={() => router.push('/ChangeLangScreen')}*/}
                                {/*    style={shadowBoxBlack()}*/}
                                {/*    className="p-5 items-center justify-center flex-row w-full border-[1px] border-neutral-300 rounded-full bg-amber-300"*/}
                                {/*>*/}
                                {/*    <Text>Change language App</Text>*/}
                                {/*</TouchableOpacity>*/}
                            </View>
                        </ScrollView>

                    )
            }

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({})

export default ProfileScreen;
