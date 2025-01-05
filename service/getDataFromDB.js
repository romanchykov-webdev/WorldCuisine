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

//получение description рецепта его количества комментариев и рейтинга
export const getRecipesDescriptionLikeRatingMyDB = async ({id,payload}) => {
    // console.log("getRecipesDescriptionLikeRatingMyDB recipe id",id)
    // console.log("getRecipesDescriptionLikeRatingMyDB recipe payload",payload)
    // console.log('ok:',tableCategory)

    try {
        let query;
        if(payload==='updateCommentsCount'){
            query='comments'
        }
        // console.log('getRecipesDescriptionLikeRatingMyDB query',query)

        let { data, error } = await supabase
            .from('allRecipesDescription')
            .select(query)
            .eq('id', id); // Фильтр по id

        if (error) {
            return {success: false, msg: 'getRecipesDescriptionLikeRatingMyDB error' + error?.message}
        }
        //
        //
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
            .eq('postId', id) // Фильтр по id
            .order('created_at', {ascending: false}); // Сортировка от нового к старому

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

//отправка комментария на рецепт
export const addNewCommentToRecipeMyDB = async ({postId, userIdCommented, comment}) => {
    // console.log('getAllCommentsMyDB postId', postId)
    // console.log('getAllCommentsMyDB userIdCommented', userIdCommented)
    // console.log('getAllCommentsMyDB comment', comment)
    try {

        // increment_comment_count

        let {data, error} = await supabase
            .from('comments')
            .insert([
                {
                    postId,           // ID поста
                    userIdCommented,  // ID пользователя
                    comment           // Текст комментария
                },
            ])
            .select()

        if (error) {
            console.error('Error adding comment:', error.message);
            return {success: false, msg: 'Error adding comment: ' + error.message};
        }

        // console.log('Comment added successfully:', JSON.stringify(data, null, 2));
        return {success: true, data};

    } catch (error) {
        console.error('Unexpected error:', error.message);
        return {success: false, msg: 'Unexpected error: ' + error.message};
    }
};

//удаление комментария
export const deleteCommentByIdToRecipeMyDB = async (commentId) => {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId); // Фильтруем по id комментария

        if (error) {
            console.error('Error adding comment:', error.message);
            return {success: false, msg: 'Error adding comment: ' + error.message};
        }

        console.log('Комментарий удален успешно');
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error.message);
    }
};

// добавление лайка рецепту
export const addLikeRecipeMyDB = async ({recipeId,userIdLike}) => {

    // console.log('addLikeRecipeMyDB recipeId',recipeId)
    // console.log('addLikeRecipeMyDB userIdLike',userIdLike)
    try {
        let {data, error} = await supabase
            .from('recipesLikes')
            .insert([
                {
                    recipeId:recipeId,           // ID поста
                    userIdLike:userIdLike,  // ID пользователя
                },
            ])
            .select()

        if (error) {
            console.error('Error adding comment:', error.message);
            return {success: false, msg: 'Error adding comment: ' + error.message};
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
        return {success: false, msg: 'Unexpected error: ' + error.message};
    }
}
