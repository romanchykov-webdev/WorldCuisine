import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    ActivityIndicator, Alert
} from 'react-native';
import RenameComponent from "../../components/profile/RenameComponent";
import {useAuth} from "../../contexts/AuthContext";
import {useRouter} from "expo-router";
import LanguagesWrapper from "../../components/LanguagesWrapper";
import ThemeWrapper from "../../components/ThemeWrapper";
import {shadowBoxBlack} from "../../constants/shadow";
import {hp, wp} from "../../constants/responsiveScreen";
import ButtonBack from "../../components/ButtonBack";
import AvatarCustom from "../../components/AvatarCustom";
import {CameraIcon} from "react-native-heroicons/mini";
import {deleteUser, logOut, updateUser} from "../../service/userService";
import * as ImagePicker from 'expo-image-picker';
import {getUserImageSrc} from "../../service/imageServices";

import {Image} from 'expo-image'

const EditProfile = () => {
    const {user:currentUser, setAuth, setUserData} = useAuth()
    const router = useRouter()

    // console.log('currentUser',currentUser)
    const userData=currentUser



    const [user, setUser] = useState({
        user_name: '',
        lang: '',
        avatar: '',
        theme: ''
    })
    useEffect(() => {
        if(currentUser){
            setUser({
                user_name: currentUser.user_name || '',
                lang: currentUser.lang || '',
                theme: currentUser.theme || '',
                avatar: currentUser.avatar || '',

            })
        }
    },[])

    const [loading, setLoading] = useState(false);

    // console.log('edit profile userData',userData)

    // const [image, setImage] = useState(null);
    //
    // const [lang, setLang] = useState(user.lang)
    // const [theme, setTheme] = useState(user.theme)
    // const [name, setName] = useState(user.name)
    // // const [avatar, setAvatar] = useState('')

    const [buttonUpdate, setButtonUpdate] = useState(false)
    // console.log('Type of user.lang:',user.lang);
    // console.log('Type of lang:', lang);
    // useEffect(() => {
    //     if (
    //         user.lang && lang &&
    //         user.theme && theme &&
    //         user.name &&
    //         user.lang !== lang ||
    //         user.theme !== theme
    //     ) {
    //         setButtonUpdate(true);
    //     }else{
    //         setButtonUpdate(false);
    //     }
    // },[lang,theme,user])

    // useEffect(() => {
    //     if (user !== null) {
    //         // setIsAuth(true)
    //         // console.log('user not null')
    //         setLang(userData?.lang)
    //         setTheme(userData?.theme)
    //         setName(userData?.user_name)
    //
    //
    //     } else {
    //         // user.avatar
    //
    //         setLang('')
    //         setTheme('')
    //     }
    //
    // }, [user])


    // on submit
    const handleSubmit = async () => {
        setLoading(true);
        // console.log('submit')
        // console.log('submit lang', lang)
        // console.log('submit theme', theme)
        // console.log('submit name', name)
        // const userUpdateDate = {
        //     user_name: name,
        //     lang: lang,
        //     theme: theme,
        //     // avatar: avatar !== '' ? avatar : userData?.avatar,
        //     avatar: userData?.avatar,
        // }
        // console.log('userUpdateDate',userUpdateDate)
        const res = await updateUser(userData?.id, user)

        setTimeout(() => {
            setLoading(false)
        }, 1000)
        // console.log('EditProfile res',res)
        if (res.success) {
            setUserData({...currentUser, ...user})
        }

        router.back()


        // console.log('submit userData avatar',userData?.avatar)
    }

    const handleRename = (currentName) => {
        console.log('ok')
    }
    const updateAvatar = async () => {
        // console.log('updateAvatar')
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        // console.log('result',result);

        // if (!result.canceled) {
        //     setUser({...user, avatar: result.assets[0]})
        // }
        // console.log('result',result)
        // console.log('user avatar update',user.avatar)
        if (result) {
            setUser({...currentUser, avatar: result.assets[0].uri});
            console.log('user avatar update',user)
        } else {
            console.error("Image selection canceled or failed", result);
        }

    }

    let imageSource=user?.avatar && typeof  user.avatar ==='object' ? user.avatar :getUserImageSrc(user?.avatar);
    // let imageSource = user?.avatar && typeof user.avatar.uri === 'object'
    //     ? user.avatar.uri
    //     : getUserImageSrc(user?.avatar);
    // console.log('editprofile imageSource',imageSource)

    const DeleteAccount = async () => {
        try {

            // Удаление пользователя
            const res = await deleteUser(userData?.id);
            if (!res.success) {
                console.error("Error:", res.msg);
                Alert.alert("Error", res.msg);
                return;
            }
            console.log("User deleted successfully.");

            // Выход из сессии
            await logOut({ setAuth, router });

            // Перенаправление после успешного выполнения
            router.replace("/homeScreen");
        } catch (error) {
            console.error("Error deleting user or logging out:", error);
            Alert.alert("Error", "Something went wrong!");
        }
    }

    const handleDeleteProfile = async () => {
        Alert.alert('Confirm', 'Are you sure you want to DELETE ACCOUNT?', [
            {
                text: 'Cancel',
                onPress: () => console.log('modal cancelled'),
                style: 'cancel'
            },
            {
                text: 'DELETE',
                onPress: () => DeleteAccount(),
                style: 'destructive'
            }
        ]);

    };



    return (
        <ScrollView
            keyboardDismissMode={'on-drag'}
            contentContainerStyle={{paddingHorizontal: wp(4)}}
            showsVerticalScrollIndicator={false}
        >
            <SafeAreaView


            >
                {/*header*/}
                <View className="flex-row items-center justify-center pt-5 pb-5">
                    <View className="absolute left-0">
                        <ButtonBack/>
                    </View>
                    <Text style={{fontSize: hp(2)}}>EditProfile works!</Text>
                </View>

                {/*avatar*/}
                <View className="gap-y-5 items-center mb-5 ">
                    <View style={shadowBoxBlack()}>
                        {/*<AvatarCustom*/}
                        {/*    // uri={userData?.avatar}*/}
                        {/*    uri={imageSource}*/}
                        {/*    size={wp(50)}*/}
                        {/*    style={{borderWidth: 0.2}}*/}
                        {/*    rounded={150}*/}
                        {/*/>*/}
                        <Image
                            source={imageSource}
                            style={{width:wp(50),height:wp(50),borderRadius:100}}
                        />
                        <View className="absolute bottom-5 right-5" style={shadowBoxBlack()}>
                            <TouchableOpacity
                                onPress={updateAvatar}
                                className="bg-white p-2 border-[1px] border-neutral-300 rounded-full"
                            >

                                <CameraIcon size={30} color='grey'/>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>


                <View className="mb-5 border-[0.5px] border-neutral-700  rounded-xl pb-2"
                      style={shadowBoxBlack()}
                >
                    <TextInput
                        value={user.user_name}
                        onChangeText={value => setUser({...user,user_name: value})}
                        className="text-neutral-500 text-xl p-3 "

                    />
                </View>

                <View className="mb-5">
                    <LanguagesWrapper lang={user.lang} setLang={(newLang) => setUser({...user, lang: newLang})}/>
                </View>

                {/*theme*/}
                <View className="mb-5">
                    <ThemeWrapper setTheme={(newTheme) => setUser({...user, theme: newTheme})} theme={user.theme}/>
                </View>

                {/*button update profile*/}
                {/*{*/}
                {/*    buttonUpdate &&(*/}
                <TouchableOpacity
                    onPress={handleSubmit}
                    style={shadowBoxBlack()}
                    className="bg-green-500 botder-[1] rounded-full w-full p-5 mb-10 items-center justify-center"
                >
                    {
                        loading
                            ? (
                                <ActivityIndicator color="green" size={20}/>
                            )
                            : (

                                <Text className="text-neutral-700 text-xl">
                                    Update yor Profile
                                </Text>
                            )
                    }

                </TouchableOpacity>

            {/*    delete profile*/}
                <TouchableOpacity
                    onPress={handleDeleteProfile}
                    style={shadowBoxBlack()}
                    className="bg-rose-500 botder-[1] rounded-full w-full p-5 mb-10 items-center justify-center mt-20"
                >
                    {
                        loading
                            ? (
                                <ActivityIndicator color="green" size={20}/>
                            )
                            : (

                                <Text className="text-neutral-700 text-xl">
                                   Delete Profile
                                </Text>
                            )
                    }

                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({})

export default EditProfile;
