import { Alert } from 'react-native';
import { supabase } from '../../lib/supabase';

export async function loginUser(email, password) {
    try {
        console.log();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            Alert.alert('Log In', error.message);
            return { success: false, error };
        }

        return { success: true };
    } catch (e) {
        Alert.alert('Log In', e?.message ?? 'Unknown error');
        return { success: false, error: e };
    }
}
