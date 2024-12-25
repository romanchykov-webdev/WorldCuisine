import {supabase} from "../lib/supabase";
import {Alert} from "react-native";

// Получить все категории
export const getCategoriesMyDB = async () => {
    try {

        const {data, error} = await supabase
            .from('categories')
            .select()
        if (error) {
            return {success: false, msg: error?.message}
        }

        // console.log('data', JSON.stringify(data,null, 2))
        return {success: true, data}

    } catch (error) {
        console.log('error', error)
        return {success: false, msg: error.message}
    }
}

//получение всех рецептов в категории
export const getRecipesMyDB = async (category) => {
    try {

        let { data: shortdesc, error } = await supabase
            .from('shortdesc')
            .select('id')

        if (error) {
            return {success: false, msg: error?.message}
        }

        // console.log('data', JSON.stringify(data,null, 2))


    }catch(error) {
        console.log('error', error)
        return {success: false, msg: error.message}
    }
}