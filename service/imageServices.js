import * as FileSystem from 'expo-file-system';
import {decode} from 'base64-arraybuffer'
import {supabase} from "../lib/supabase";
import {supabaseUrl} from "../constants/supabaseIndex";


export const getUserImageSrc = imagePath => {
    if (imagePath) {
        // return {uri: imagePath};
        return getSupabaseFileUrl(imagePath);
    } else {
        return require('../assets/img/user_icon.png');
    }
}

export const getSupabaseFileUrl = filePath => {
    if (filePath) {
        return `${supabaseUrl}/storage/v1/object/public/uploads_image/${filePath}`
    }
    return null;
}

// Удалить файл из хранилища
export const deleteFile = async (filePath) => {
    try {
        // Убедитесь, что filePath — это строка
        if (typeof filePath !== 'string' || !filePath) {
            console.log('Invalid filePath for deletion:', filePath);
            return { success: false, msg: 'Invalid file path' };
        }

        const { error } = await supabase
            .storage
            .from('uploads_image')
            .remove([filePath]); // Передаем массив со строкой

        if (error) {
            console.log('File delete error:', error);
            return { success: false, msg: 'Could not delete media' };
        }

        console.log('File deleted successfully:', filePath);
        return { success: true, msg: `File deleted: ${filePath}` };
    } catch (error) {
        console.log('File delete error:', error);
        return { success: false, msg: 'Could not delete media' };
    }
};


//upload file
// export const uploadFile = async (folderName, fileUri, isImage = true) => {
//     try {
//
//         let fileName = getFilePath(folderName, isImage);
//
//         const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
//             encoding: FileSystem.EncodingType.Base64
//         });
//
//         let imageDate = decode(fileBase64);  //array buffer
//
//         let {data, error} = await supabase
//             .storage
//             .from('uploads_image')
//             .upload(fileName, imageDate, {
//                 cacheControl: '3600',
//                 upsert: false,
//                 contentType: isImage ? 'image/*' : 'video/*',
//             });
//         if (error) {
//             console.log('File upload error', error)
//             return {success: false, msg: 'Could not upload media'};
//         }
//
//         console.log('data upload avatar to storage', data);
//         return {success: true, data: data.path};
//
//     } catch (error) {
//         console.log('File upload error', error)
//         return {success: false, msg: 'Could not upload media'};
//     }
// }

export const uploadFile = async (folderName, fileUri, isImage = true,oldFilePath = null) => {
    try {

        // Удаляем старый файл, если передан путь
        console.log('uploadFile oldFilePath',oldFilePath)
        if (oldFilePath) {
            console.log('Deleting old file:', oldFilePath);
            await deleteFile(oldFilePath);
        }
        // after

        let fileName = getFilePath(folderName, isImage);

        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
            encoding: FileSystem.EncodingType.Base64
        });

        let imageDate = decode(fileBase64);  //array buffer

        let {data, error} = await supabase
            .storage
            .from('uploads_image')
            .upload(fileName, imageDate, {
                cacheControl: '3600',
                upsert: false,
                contentType: isImage ? 'image/*' : 'video/*',
            });
        if (error) {
            console.log('File upload error', error)
            return {success: false, msg: 'Could not upload media'};
        }

        console.log('data upload avatar to storage', data);
        return {success: true, data: data.path};

    } catch (error) {
        console.log('File upload error', error)
        return {success: false, msg: 'Could not upload media'};
    }
}

export const getFilePath = (folderName, isImage) => {
    return `/${folderName}/${new Date().getTime()}${isImage ? '.png' : '.mp4'}`;
}