import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import {useRouter} from "expo-router";
import ButtonBack from "../../components/ButtonBack";
import {hp} from "../../constants/responsiveScreen";
import InputComponent from "../../components/ImputComponent";

import {EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon} from "react-native-heroicons/outline";
import {shadowBoxBlack} from "../../constants/shadow";
import ChangeLangScreen from "../ChangeLangScreen";

const RegistrationScreen = () => {

    const router = useRouter();

    const [lang, setLang] = useState('en'); // Язык по умолчанию

    // Для переключения видимости пароля
    const [secureTextEntry, setSecureTextEntry] = useState(false)

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    useEffect(() => {


    }, [form.password, form.repeatPassword, form.userName, form.email]);


    const submitting = async () => {

        if (form.password !== form.repeatPassword) {
            Alert.alert('Sign Up', "Enter two identical passwords!")
            return;
        }

        setLoading(true);
        console.log('userName', form.userName)
        console.log('email', form.email)
        console.log('password', form.password)
        console.log('repeatPassword', form.repeatPassword)
        if (!form.email || !form.password || !form.repeatPassword || !form.userName) {
            Alert.alert('Sign Up', "Please fill all the fields!")
            setLoading(false);
            return;
        }
        //
        // setLoading(true);
        //
        // let email = form.email.trim();
        // let password = form.password.trim();


        setTimeout(() => {
            setLoading(false);
        }, 1000)

    }
    // console.log('email',form.email);
    return (
        <SafeAreaView
            className="flex-1  mx-5 "
            // style={{ flex: 1, marginHorizontal: 16 }}
        >
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    keyboardDismissMode='on-drag'
                    // contentContainerStyle={{flex: 1}}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingBottom: 20, // добавить немного отступа снизу
                    }}

                >

                    <View className=" h-full">

                        <View className="mb-10">
                            <ButtonBack/>
                        </View>

                        {/*welcome text*/}
                        <View className="mb-5">
                            <Text className="font-bold tracking-widest text-neutral-700"
                                  style={{fontSize: hp(4)}}
                            >Let`s,</Text>
                            <Text className="font-bold tracking-widest text-neutral-700"
                                  style={{fontSize: hp(4)}}
                            >Get Started</Text>

                        </View>

                        {/*    form log in*/}
                        <View className="gap-5">
                            <Text
                                className="text-neutral-500"
                                style={{fontSize: hp(1.2)}}
                            >
                                Please fill the details to create an account
                            </Text>

                            {/*user name*/}
                            <InputComponent
                                icon={<UserCircleIcon size={30} color={'grey'}/>}
                                placeholder="User name"
                                value={form.userName}
                                onChangeText={value => {
                                    setForm({...form, userName: value})
                                }}
                            />

                            {/*email*/}
                            <InputComponent
                                icon={<EnvelopeIcon size={30} color={'grey'}/>}
                                placeholder="Email"
                                value={form.email}
                                onChangeText={value => {
                                    setForm({...form, email: value})
                                }}
                            />

                            {/*password*/}
                            <InputComponent
                                icon={
                                    <TouchableOpacity
                                        onPress={() => setSecureTextEntry(prev => !prev)}
                                    >
                                        {
                                            secureTextEntry
                                                ? <EyeSlashIcon size={30} color={'grey'}/>
                                                : <EyeIcon size={30} color={'grey'}/>
                                        }
                                    </TouchableOpacity>
                                }
                                placeholder="Password"
                                value={form.password}
                                onChangeText={value => {
                                    setForm({...form, password: value})
                                }}
                                secureTextEntry={secureTextEntry}
                            />
                            {/* repeat password*/}
                            <InputComponent
                                icon={
                                    <TouchableOpacity
                                        onPress={() => setSecureTextEntry(prev => !prev)}
                                    >
                                        {
                                            secureTextEntry
                                                ? <EyeSlashIcon size={30} color={'grey'}/>
                                                : <EyeIcon size={30} color={'grey'}/>
                                        }
                                    </TouchableOpacity>
                                }
                                placeholder="Please repeat password"
                                value={form.repeatPassword}
                                onChangeText={value => {
                                    setForm({...form, repeatPassword: value})
                                }}
                                secureTextEntry={secureTextEntry}
                            />

                            <TouchableOpacity
                                // onPress={() => router.push('/ChangeLangScreen')}
                                onPress={() => router.push({ pathname: '/ChangeLangScreen', params: { currentLang: lang } })}
                                style={shadowBoxBlack({
                                    offset: {width: 0, height: 1},
                                    radius: 2,
                                    elevation: 2,
                                })}
                                className="p-5 mb-5 items-center justify-center flex-row w-full border-[1px] border-neutral-300 rounded-full bg-amber-300"
                            >
                                <Text>Change language App</Text>
                            </TouchableOpacity>

                            {/*button submitting sign Up*/}
                            <TouchableOpacity
                                style={shadowBoxBlack({
                                    offset: {width: 0, height: 1},
                                    radius: 2,
                                    elevation: 2,
                                })}
                                onPress={submitting}
                                className=" px-10 p-5 rounded-full items-center mb-5
                            bg-green-500
                            "
                            >
                                {
                                    loading
                                        ? <ActivityIndicator size={30} color={'white'}/>
                                        : <Text className="text-xl font-bold text-neutral-700">Sign Up</Text>
                                }

                            </TouchableOpacity>


                            <View className=" w-full flex-row justify-center items-center">
                                <Text className=" text-xs text-neutral-500">
                                    Already have an account,
                                </Text>
                                <Text
                                    onPress={() => router.push("/(auth)/LogInScreen")}
                                    className="text-amber-500 items-center justify-center ml-2 font-bold"
                                >Log In</Text>
                            </View>

                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default RegistrationScreen;
