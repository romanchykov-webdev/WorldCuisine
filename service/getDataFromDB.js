import {supabase} from "../lib/supabase";
import {Alert} from "react-native";

// Получить все категории
export const getCategoriesMyDB = async () => {
    try {

        const {data, error} = await supabase
            .from('categories')
            .select('*')
        if (error) {
            return {success: false, msg: error?.message}
        }

        // console.log('data', data)
        return {success: true, data}

    } catch (error) {
        console.log('error', error)
        return {success: false, msg: error.message}
    }
}

//получение всех рецептов в категории
export const getRecipesMyDB = async (category) => {
    // console.log("getRecipesMyDB category",category)
    try {

        let {data, error} = await supabase
            .from('shortDesc')
            .select('*')
            .eq('category', category)

        if (error) {
            return {success: false, msg: 'getRecipesMyDB error' + error?.message}
        }


        // console.log('shortDesc', JSON.stringify(data, null, 2));

        return {success: true, data: data}


    } catch (error) {
        console.log('error', error)
        return {success: false, msg: 'getRecipesMyDB catch error' + error.message}
    }
}

//получение description рецепта
export const getRecipesDescriptionMyDB = async (id) => {
    // console.log("getRecipesDescriptionMyDB receps id",id)
    // console.log('ok:',tableCategory)
    // if (tableCategory.includes(' ')) {
    //     console.log('Строка содержит пробелы');
    // } else {
    //     console.log('Строка не содержит пробелы');
    // }
    try {

        let {data, error} = await supabase
            .from('allRecipesDescription')
            .select('*')
            .eq('id', id); // Фильтр по id

        if (error) {
            return {success: false, msg: 'getRecipesDescriptionMyDB error' + error?.message}
        }


        // console.log('shortDesc', JSON.stringify(data, null, 2));

        return {success: true, data}


    } catch (error) {
        console.log('error', error)
        return {success: false, msg: 'getRecipesDescriptionMyDB catch error' + error.message}
    }
}

//получение all comments рецепта
export const getAllCommentsMyDB = async (id) => {
    // console.log('getAllCommentsMyDB id',id)
    try {

        let {data, error} = await supabase
            .from('comments')
            .select('*')
            .eq('postId', id); // Фильтр по id

        if (error) {
            return {success: false, msg: 'getRecipesDescriptionMyDB error' + error?.message}
        }


        // console.log('shortDesc', JSON.stringify(data, null, 2));

        return {success: true, data}


    } catch (error) {
        console.log('error', error)
        return {success: false, msg: 'getRecipesDescriptionMyDB catch error' + error.message}
    }
}

//получение all users avatar name
export const getAllUserIdCommentedMyDB = async (ids) => {
    // console.log('getAllCommentsMyDB id', ids)
    try {
        // Запрос по массиву id, с использованием .in() для выборки данных по нескольким id
        let {data, error} = await supabase
            .from('users')
            .select('id, avatar, user_name')  // Выбираем только нужные поля
            .in('id', ids);  // Фильтруем по массиву id

        if (error) {
            return {success: false, msg: 'getAllUserIdCommentedMyDB error: ' + error.message};
        }

        // console.log('Fetched user data:', JSON.stringify(data, null, 2));

        return {success: true, data}


    } catch (error) {
        console.log('error', error)
        return {success: false, msg: 'getRecipesDescriptionMyDB catch error' + error.message}
    }
}