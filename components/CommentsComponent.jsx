import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator,
    FlatList
} from 'react-native';
import {shadowBoxBlack} from "../constants/shadow";
import {hp, wp} from "../constants/responsiveScreen";
import {PaperAirplaneIcon} from "react-native-heroicons/mini";
import LoadingComponent from "./loadingComponent";
import {addNewCommentToRecipeMyDB, getAllCommentsMyDB, getAllUserIdCommentedMyDB} from "../service/getDataFromDB";
import {formatDateTime} from "../constants/halperFunctions";
import AvatarCustom from "./AvatarCustom";


// translate
import i18n from '../lang/i18n'

const CommentsComponent = ({recepId, user,updateLikeCommentCount}) => {

    // console.log('CommentsComponent recepId',recepId)
    // console.log('CommentsComponent user',user)

    const [commentsAll, setCommentsAll] = useState(null)
    const [userIdCommented, setUserIdCommented] = useState(null)

    // полный объект комментариев
    const [allDataComments, setAllDataComments] = useState(null)


    const [inputText, setInputText] = useState('')

    const [loading, setLoading] = useState(false)


    // get all comments for recep
    const fetchComments = async () => {
        try {
            const res = await getAllCommentsMyDB(recepId);
            setCommentsAll(res.data);

            // Извлекаем все userIdCommented из массива commentsAll
            const usersId = res.data.map(comment => comment.userIdCommented);
            setUserIdCommented(usersId)


        } catch (error) {
            console.error('Ошибка при получении комментариев:', error);
        }
    }
    const fetchUserIdCommented = async (userIdCommented) => {
        // console.log('fetchUserIdCommented userIds' ,userIds)
        const res = await getAllUserIdCommentedMyDB(userIdCommented)
        // console.log('commentsAll',commentsAll)
        // console.log('res.data',res.data)

        // Объединение данных
        const mergedData = commentsAll.map(comment => {
            const user = res.data.find(user => user.id === comment.userIdCommented);
            return {
                ...comment,
                ...(user ? {avatar: user.avatar, user_name: user.user_name} : {})
            };
        });

        // console.log('Merged Data:', mergedData);

        setAllDataComments(mergedData);

    }

    useEffect(() => {
        fetchComments()

    }, [recepId])

    useEffect(() => {
        // console.log('useEfect userIdCommented',userIdCommented)
        fetchUserIdCommented(userIdCommented)
    }, [userIdCommented])

    useEffect(() => {
        // console.log('useEffect allDataComments', allDataComments)
    }, [allDataComments])


    const addNewComment = async () => {
        // console.log('inputText recepId',recepId)
        // console.log('inputText user.id',user.id)
        // console.log('inputText comment',inputText)

        // addNewCommentToRecipeMyDB(postId,userIdCommented,comment)

        setLoading(true)
        if (inputText === '') {
            Alert.alert('Comment', 'Write a comment')
        } else {

            if(recepId && user?.id && inputText){
                await addNewCommentToRecipeMyDB({postId:recepId, userIdCommented:user?.id, comment:inputText})
            }


            setTimeout(() => {
                setLoading(false)
                setCommentsAll([inputText, ...commentsAll])

                setInputText('')
            }, 1000)

            await fetchComments()
            updateLikeCommentCount('updateCommentsCount')

        }

        // console.log('commentsAll',commentsAll)

        // add comments to the server
    }
    const changeText = (value) => {
        setInputText(value)
        // console.log(inputText)
    }

    return (
        <View

            className="rounded-[10]   my-4"
        >

            {/*input */}
            {
                user !== null && (
                    <View
                        // style={shadowBoxBlack()}
                        className="flex-row items-center p-2 rounded-[10] mb-5 bg-black/5 ">
                        <TextInput
                            placeholder={i18n.t('Your comment')}
                            placeholderTextColor="gray"
                            multiline={true}
                            value={inputText}
                            onChangeText={value => changeText(value)}
                            style={[{fontSize: hp(1.7)}]}
                            className="flex-1 text-base tracking-wider p-5 mb-1 bg-white rounded-[10]"
                        />
                        <TouchableOpacity
                            onPress={addNewComment}
                            className="bg-white rounded-full p-5 ml-2 к"
                            style={{transform: [{rotate: '-45deg'}]}}
                        >
                            {
                                loading
                                    ? (
                                        <ActivityIndicator/>
                                    )
                                    : (<PaperAirplaneIcon size={hp(2.5)} color="blue"/>)
                            }

                        </TouchableOpacity>
                    </View>
                )
            }


            {/*    comments*/}
            <View className="gap-y-2">


                {
                    allDataComments !== null
                        ? (
                            <>
                                {
                                    allDataComments?.map((comment, index) => {
                                        return (
                                            <View key={index}
                                                  className="border-[1px] border-neutral-300 rounded-[20] p-3 bg-black/5 "
                                            >
                                                {/*data of comment*/}
                                                <Text style={{fontSize: 8, marginBottom: 5}}>
                                                    {formatDateTime(comment?.created_at)}
                                                </Text>

                                                <View className="flex-row gap-x-2">
                                                    {/*avatar*/}
                                                    <View className=" w-[50] overflow-hidden">

                                                        <AvatarCustom
                                                            uri={comment?.avatar}
                                                            style={{
                                                                width: 50,
                                                                height: 50,
                                                                borderRadius: 50,
                                                                // marginTop: wp(1),
                                                                borderWidth: 1,
                                                                borderColor: 'gray'
                                                            }}
                                                        />
                                                        <Text
                                                            style={{fontSize: 8, maxWidth: 50, textAlign: 'center'}}
                                                            numberOfLines={1}
                                                            ellipsizeMode="tail"
                                                        >
                                                            {comment?.user_name}
                                                        </Text>

                                                    </View>

                                                    {/*comment*/}
                                                    <Text
                                                        style={{fontSize: hp(1.7)}}
                                                        className="border-[1px] border-neutral-300 flex-1 p-2 rounded-[10]"
                                                    >
                                                        {comment?.comment}
                                                    </Text>
                                                </View>
                                            </View>

                                        )
                                    })
                                }
                            </>
                        )
                        : (
                            <View>
                                <LoadingComponent/>
                            </View>
                        )
                }
            </View>

        </View>
    );
};

const styles = StyleSheet.create({})

export default CommentsComponent;
