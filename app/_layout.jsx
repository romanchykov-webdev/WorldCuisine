import {Stack, useRouter} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import "../global.css";

import {useEffect, useState} from "react";
import {supabase} from "../lib/supabase";
import {AuthProvider, useAuth} from "../contexts/AuthContext";
import {getUserData} from "../service/userService";

//translate
// import i18n from'../i18n'


const _layout = () => {
    return (
        <AuthProvider>
            <RootLayout/>
        </AuthProvider>

    )
}

const RootLayout = () => {

    const router = useRouter()

    const {setAuth, setUserData} = useAuth();

    const [isLoading, setIsLoading] = useState(true); // Добавляем состояние загрузки


    useEffect(() => {


        const {data: authListener} = supabase.auth.onAuthStateChange(async (_event, session) => {
            // console.log('session:', session);

            if (session) {
                setAuth(session?.user);
                try {
                    await updateUserData(session?.user);
                } catch (error) {
                    console.error("Ошибка при обновлении данных пользователя:", error);
                }
                router.replace('/homeScreen');
            } else {
                setAuth(null);
                router.replace('/(main)/welcome');
            }

            setTimeout(() => {
                // setIsLoading(false); // Загрузка завершена
            }, 2000)

        });

        // Отписка от подписчика при размонтировании
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);


    // get update userData
    const updateUserData = async (user) => {
        let res = await getUserData(user?.id)
        // console.log('user Data layout:', res)

        if (res.success) {
            setUserData(res?.data)
        }

    }
    //
    // if (isLoading) {
    //     // Показываем страницу индекса (или индикатор загрузки), пока идет проверка
    //     return (
    //         <Stack>
    //             <Stack.Screen name="index" options={{headerShown: false}}/>
    //         </Stack>
    //     );
    // }


    return (
            <Stack>

                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="(main)/welcome" options={{headerShown: false}}/>

                <Stack.Screen name="homeScreen" options={{headerShown: false}}/>
                <Stack.Screen name="RecipeDetailsScreen" options={{headerShown: false}}/>
                <Stack.Screen name="ProfileScreen" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)/LogInScreen" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)/RegistrationScreen" options={{headerShown: false}}/>
                <Stack.Screen name="(main)/editProfile" options={{headerShown: false}}/>


            </Stack>

    );
}
export default _layout;