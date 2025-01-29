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
import InputComponent from "../../components/InputComponent";

import {EnvelopeIcon, EyeIcon, EyeSlashIcon, UserCircleIcon} from "react-native-heroicons/outline";
import {shadowBoxBlack} from "../../constants/shadow";
import {supabase} from "../../lib/supabase";
import {useSearchParams} from "expo-router/build/hooks";
import SelectCustom from "../../components/SelectCustom";
import LanguagesWrapper from "../../components/LanguagesWrapper";
import ThemeWrapper from "../../components/ThemeWrapper";

// translate
import i18n from '../../lang/i18n'


const RegistrationScreen = () => {

    // translate

    // translate

    const router = useRouter();

    // change lang
    const [lang, setLang] = useState('en'); // Устанавливаем язык
    // console.log('lang', lang);

    // change theme
    const [theme, setTheme] = useState('auto')
    // console.log('theme', theme);

    // Для переключения видимости пароля
    const [secureTextEntry, setSecureTextEntry] = useState(true)

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        userName: '',
        email: '',
        password: '',
        repeatPassword: '',
    });

    useEffect(() => {


    }, [form.password, form.repeatPassword, form.userName, form.email,lang,theme]);



    const submitting = async () => {
        let email = form.email.trim();
        let userName = form.userName.trim();
        let password = form.password.trim();
        let repeatPassword = form.repeatPassword.trim();

        if (password !== repeatPassword) {
            Alert.alert('Sign Up', "Enter two identical passwords!")
            return;
        }

        setLoading(true);
        // console.log('userName', form.userName)
        // console.log('email', form.email)
        // console.log('password', form.password)
        // console.log('repeatPassword', form.repeatPassword)


        if (!email || !password || !repeatPassword || !userName) {
            Alert.alert('Sign Up', "Please fill all the fields!")
            setLoading(false);
            return;
        }




        try {
            const {
                data: {session},
                error,
            } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        user_name: userName,
                        lang: lang,
                        theme: theme,
                        avatar:null
                    },
                },
            })



            if (error) throw error;

            setForm({
                userName: '',
                email: '',
                password: '',
                repeatPassword: '',
            })
            setLang('En')
            setTheme('Auto')

            // console.log('session', session)
        } catch (error) {
            Alert.alert('Sign Up', error.message);
        } finally {
            setLoading(false);
            setLang('En')
            setTheme('Auto')
        }


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
                            >{i18n.t('Let`s,')}</Text>
                            <Text className="font-bold tracking-widest text-neutral-700"
                                  style={{fontSize: hp(3.9)}}
                            >{i18n.t('Get Started')}</Text>

                        </View>

                        {/*    form sign up*/}
                        <View className="gap-5">
                            <Text
                                className="text-neutral-500"
                                style={{fontSize: hp(1.2)}}
                            >
                                {i18n.t('Please fill the details to create an account')}
                            </Text>

                            {/*user name*/}
                            <InputComponent
                                icon={<UserCircleIcon size={30} color={'grey'}/>}
                                placeholder={i18n.t('User name')}
                                value={form.userName}
                                onChangeText={value => {
                                    setForm({...form, userName: value})
                                }}
                            />

                            {/*email*/}
                            <InputComponent
                                icon={<EnvelopeIcon size={30} color={'grey'}/>}
                                placeholder={i18n.t('Email')}
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
                                placeholder={i18n.t('Password')}
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
                                placeholder={i18n.t('Please repeat password')}
                                value={form.repeatPassword}
                                onChangeText={value => {
                                    setForm({...form, repeatPassword: value})
                                }}
                                secureTextEntry={secureTextEntry}
                            />



                            {/*Select lang*/}
                            <LanguagesWrapper setLang={setLang} lang={lang}/>

                            {/*theme wrapper*/}
                            <ThemeWrapper setTheme={setTheme} theme={theme}/>


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
                                        : <Text className="text-xl font-bold text-neutral-700">{i18n.t("Sign Up")}</Text>
                                }

                            </TouchableOpacity>


                            <View className=" w-full flex-row justify-center items-center">
                                <Text className=" text-xs text-neutral-500">
                                    {i18n.t('Already have an account,')}
                                </Text>
                                <Text
                                    onPress={() => router.push("/(auth)/LogInScreen")}
                                    className="text-amber-500 items-center justify-center ml-2 font-bold"
                                >{i18n.t("Log In")}</Text>
                            </View>

                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};


export default RegistrationScreen;
