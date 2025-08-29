import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    EnvelopeIcon,
    EyeIcon,
    EyeSlashIcon,
} from 'react-native-heroicons/outline';
import ButtonBack from '../../components/ButtonBack';
import InputComponent from '../../components/InputComponent';

import { hp } from '../../constants/responsiveScreen';
import { shadowBoxBlack } from '../../constants/shadow';
import { supabase } from '../../lib/supabase';
import { loginUser } from '../../service/auth/loginUser';

function LogInScreen() {
    const router = useRouter();

    // Для переключения видимости пароля
    const [secureTextEntry, setSecureTextEntry] = useState(true);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const submitting = async () => {
        const email = form.email.trim();
        const password = form.password.trim();

        if (!email || !password) {
            Alert.alert('Log In', 'Please fill all the fields!');
            return;
        }

        setLoading(true);
        const result = await loginUser(email, password);
        setLoading(false);

        if (result.success) {
            setForm({ email: '', password: '' });
            router.push('/homeScreen');
        }
    };

    // console.log('email',form.email);
    return (
        <SafeAreaView className="flex-1  mx-5 ">
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    keyboardDismissMode="on-drag"
                    // contentContainerStyle={{flex: 1}}
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingBottom: 20, // добавить немного отступа снизу
                    }}
                >
                    <View className=" h-full">
                        <View className="mb-10">
                            <ButtonBack />
                        </View>

                        {/* welcome text */}
                        <View className="mb-5">
                            <Text
                                className="font-bold tracking-widest text-neutral-700"
                                style={{ fontSize: hp(4) }}
                            >
                                Hey,
                            </Text>
                            <Text
                                className="font-bold tracking-widest text-neutral-700"
                                style={{ fontSize: hp(4) }}
                            >
                                Welcome Back
                            </Text>
                        </View>

                        {/*    form log in */}
                        <View className="gap-5">
                            <Text
                                className="text-neutral-500"
                                style={{ fontSize: hp(1.5) }}
                            >
                                Please login to continue
                            </Text>

                            {/* email */}
                            <InputComponent
                                icon={<EnvelopeIcon size={30} color="grey" />}
                                placeholder="Enter your email"
                                value={form.email}
                                onChangeText={value => {
                                    setForm({ ...form, email: value });
                                }}
                            />

                            {/* password */}
                            <InputComponent
                                icon={
                                    <TouchableOpacity
                                        onPress={() =>
                                            setSecureTextEntry(prev => !prev)
                                        }
                                    >
                                        {secureTextEntry ? (
                                            <EyeSlashIcon
                                                size={30}
                                                color="grey"
                                            />
                                        ) : (
                                            <EyeIcon size={30} color="grey" />
                                        )}
                                    </TouchableOpacity>
                                }
                                placeholder="Enter your password"
                                value={form.password}
                                onChangeText={value => {
                                    setForm({ ...form, password: value });
                                }}
                                secureTextEntry={secureTextEntry}
                            />

                            <TouchableOpacity
                                style={shadowBoxBlack({
                                    offset: { width: 0, height: 1 },
                                    radius: 2,
                                    elevation: 2,
                                })}
                                onPress={submitting}
                                className=" px-10 p-5 rounded-full items-center mb-5
                            bg-green-500
                            "
                            >
                                {loading ? (
                                    <ActivityIndicator
                                        size={30}
                                        color="white"
                                    />
                                ) : (
                                    <Text className="text-xl font-bold text-neutral-700">
                                        Log In
                                    </Text>
                                )}
                            </TouchableOpacity>

                            <View className=" w-full flex-row justify-center items-center">
                                <Text className=" text-xs text-neutral-500">
                                    If you don't have an account,
                                </Text>
                                <Text
                                    onPress={() =>
                                        router.push(
                                            '/(auth)/RegistrationScreen'
                                        )
                                    }
                                    className="text-amber-500 items-center justify-center ml-2 font-bold"
                                >
                                    Sign Up
                                </Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default LogInScreen;
