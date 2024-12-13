import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert} from 'react-native';
import {useRouter} from "expo-router";
import ButtonBack from "../components/ButtonBack";

import {Image} from 'expo-image'
import {wp} from "../constants/responsiveScreen";
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

const ProfileScreen = () => {
    const {setAuth,user,setUserData}=useAuth();

    const [isAuth, setIsAuth] = useState(null)

    const [lang, setLang] = useState('')
    const [theme, setTheme] = useState('')
    const [avatar, setAvatar] = useState('')



    // const getAvatar=async()=>{
    //
    //     const {data:users,error}=await supabase
    //         .from('users')
    //         .select('avatar')
    //         .eq('id',user.id)
    //
    //     if (error) {
    //         console.error("Error fetching avatar:", error);
    //         Alert.alert("Error", "Failed to fetch avatar.");
    //         return;
    //     }
    //     setAvatar(users[0].avatar)
    //     // console.log('users',users)
    // }



    // console.log('setAuth ProfileScreen',setAuth)
    // console.log('identities ProfileScreen',user.identities)

    const userData=user?.user_metadata
    // console.log('ProfileScreen userData:',userData)

    useEffect(() => {
        if(user !== null){
            setIsAuth(true)
            setLang(userData?.lang)
            setTheme(userData?.theme)

        }

    },[user])

    const router = useRouter();

    // change avatar
    const changeAvatar = async () => {
        console.log('changeAvatar')
    }

    // log out
    const handleLogUot = async () => {
        console.log('log out')
        setAuth(null)

        const {error}=await supabase.auth.signOut();
        if(error){
            Alert.alert('Sign Out',"Error signing out!");
        }

    }


    const handleMyPost = () => {
        console.log('handleMyPost')


    }

    // handleMyFavorite
    const handleMyFavorite = () => {
        console.log('handleMyFavorite')
    }

    return (
        <SafeAreaView
        contentContainerStyle={{flex:1}}
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
                                            // source={require('../assets/img/user_icon.png')}
                                            source={{uri:avatar}}
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
                                <Text className="capitalize">{userData?.user_name}</Text>
                            </View>

                            {/*change lang app*/}
                            {/*<View className="flex-row items-center mb-10">*/}
                            {/*    <TouchableOpacity*/}
                            {/*        onPress={() => router.push('/ChangeLangScreen')}*/}
                            {/*        style={shadowBoxBlack()}*/}
                            {/*        className="p-5 items-center justify-center flex-row w-full border-[1px] border-neutral-300 rounded-full bg-amber-300"*/}
                            {/*    >*/}
                            {/*        <Text>Change language App</Text>*/}
                            {/*    </TouchableOpacity>*/}
                            {/*</View>*/}
                           <View className="mb-5">
                               <LanguagesWrapper lang={lang} setLang={setLang}/>
                           </View>

                            {/*theme*/}
                            <View className="mb-5">
                                <ThemeWrapper setTheme={setTheme} theme={theme}/>
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
                            contentContainerStyle={{paddingHorizontal: 20,flex:1}}
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
