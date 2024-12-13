import {Stack, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import "../global.css";

import {useEffect} from "react";
import {supabase} from "../lib/supabase";
import {AuthProvider, useAuth} from "../contexts/AuthContext";


const _layout = () => {
    return (
        <AuthProvider>
            <RootLayout/>
        </AuthProvider>
    )
}

const RootLayout = () => {

    const router = useRouter()

    const {setAuth, user, setUserData} = useAuth();


    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            console.log('session:', session);
            // console.log('session user:', session.user);

            if (session) {
                setAuth(session?.user);
                router.replace('/homeScreen')
                // console.log('user', user)
            } else {
                setAuth(null);
                // router.replace('homeScreen')
            }

        })
    }, [])

    return (
        <Stack>

            <Stack.Screen name="index" options={{headerShown: false}}/>
            <Stack.Screen name="homeScreen" options={{headerShown: false}}/>
            <Stack.Screen name="RecipeDetailsScreen" options={{headerShown: false}}/>
            <Stack.Screen name="ProfileScreen" options={{headerShown: false}}/>
            <Stack.Screen name="ChangeLangScreen" options={{headerShown: false, presentation: "modal"}}/>
            <Stack.Screen name="(auth)/LogInScreen" options={{headerShown: false}}/>
            <Stack.Screen name="(auth)/RegistrationScreen" options={{headerShown: false}}/>
        </Stack>

    );
}
export default _layout;