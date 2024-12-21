import {supabase} from "../lib/supabase";
import {Alert} from "react-native";

// get userData
export const getUserData = async (userId) => {
    try {

        const {data, error} = await supabase
            .from('users')
            .select()
            .eq('id', userId)
            .single()

        if (error) {
            return {success: false, msg: error?.message}
        }

        return {success: true, data}

    } catch (error) {
        console.log('error', error)
        return {success: false, msg: error.message}
    }
}

// log out
export const logOut = async ({setAuth,router}) => {
    setAuth(null)

    const {error} = await supabase.auth.signOut();
    if (error) {
        Alert.alert('Sign Out', "Error signing out!");
    }
    router.replace('/homeScreen')
}

//update user data
export const updateUser = async (userId, data) => {
    console.log('userService updateUser', userId, data)
    try {

        const {error} = await supabase
            .from('users')
            .update(data)
            .eq('id', userId)

        if (error) {
            return {success: false, msg: error?.message}
        }

        return {success: true, data}

    } catch (error) {
        console.log('error', error)
        return {success: false, msg: error.message}
    }
}

//delete user account
// export const deleteUser = async (userId) => {
//
//     const {error} = await supabase
//         .from('users')
//         .delete()
//         .eq('id', userId)
//
//     if (error) {
//         console.error('Error deleting user auth data:', error)
//         return { success: false, error }
//     }
//
//     console.log('User auth data deleted successfully')
//     return { success: true }
//
//
// }

// Удаление пользователя
export const deleteUser = async (userId) => {
    try {
        // Удаляем пользователя из таблицы auth.users
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) {
            console.error("Error triggering delete_user_cascade:", error);
            return { success: false, msg: "Failed to trigger delete_user_cascade." };
        }

        console.log("User successfully deleted from auth.users. Trigger handled cascading delete.");
        return { success: true };
    } catch (error) {
        console.error("Unexpected error:", error);
        return { success: false, msg: "Unexpected error occurred." };
    }
};
