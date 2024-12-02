import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator
} from 'react-native';
import {supabase} from "../../constants/supabase";
import {useRouter} from "expo-router";
import ButtonBack from "../../components/ButtonBack";

const LogInScreen = () => {

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: '',
    });


    const submitting = async () => {

        if (!form.email || !form.password) {
            Alert.alert('Sign Up', "Please fill all the fields!")
            return;
        }

        setLoading(true);

        let email = form.email.trim();
        let password = form.password.trim();

        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        // if error
        if (error) Alert.alert('Log in', error.message)


        setLoading(false);
        // setTimeout(()=>{
        //     setLoading(false);
        // },1000)c
        // console.log('data', data.session.user.aud)
        console.log('data', data)

        if(data.session.user.aud==='authenticated'){
            router.push('/homeScreen');
        }
        // console.log('email', form.email);
        // console.log('password', form.password);
    }

    return (
        <SafeAreaView className="flex-1  mx-5 "

        >
            <ScrollView
                keyboardDismissMode='on-drag'
                contentContainerStyle={{justifyContent: 'center', flex: 1}}

            >
                <View className="w-full mt-[-100px]  justify-center">

                    <View>
                        <ButtonBack/>
                    </View>

                    <Text className="text-3xl mb-10 text-center">Log In</Text>

                    {/* email*/}
                    <View className="mb-5">
                        <Text className="text-center">Enter your email</Text>
                        <TextInput
                            value={form.email}
                            onChangeText={(value) => setForm({...form, email: value})}
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="p-5 border-[1px] border-neutral-700 rounded-full"
                            placeholder="Enter your email"
                            placeholderTextColor='gray'
                        />
                    </View>

                    {/* password*/}
                    <View className="mb-5">
                        <Text className="text-center">Enter your email</Text>
                        <TextInput
                            value={form.password}
                            onChangeText={(value) => setForm({...form, password: value})}
                            autoCapitalize="none"
                            autoCorrect={false}
                            className="p-5 border-[1px] border-neutral-700 rounded-full"
                            placeholder="Enter your password"
                            placeholderTextColor='gray'
                        />
                    </View>

                    <View>
                        <TouchableOpacity
                            onPress={submitting}
                            className="p-5 items-center rounded-full border-[1px] border-neutral-700 "
                        >
                            {
                                loading
                                    ? (
                                        <ActivityIndicator size={45} color='green'/>
                                    )
                                    : (
                                        <Text>Login</Text>
                                    )
                            }

                        </TouchableOpacity>
                    </View>

                    <View className="mt-5 ">
                        <TouchableOpacity
                            onPress={() => router.replace('(auth)/RegistrationScreen')}
                        >
                            <Text className="text-blue-500 text-3xl">Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({})

export default LogInScreen;
