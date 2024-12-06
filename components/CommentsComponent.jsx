import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator} from 'react-native';
import {shadowBoxBlack} from "../constants/shadow";
import {hp} from "../constants/responsiveScreen";
import {PaperAirplaneIcon} from "react-native-heroicons/mini";
import LoadingComponent from "./loadingComponent";

const CommentsComponent = ({comments}) => {

    const [commentsAll, setCommentsAll] = useState(comments)
    const [inputText, setInputText] = useState('')

    const [loading, setLoading] = useState(false)


    const addNewComment = async () => {
        // console.log('inputText',inputText)
        setLoading(true)
        if (inputText === '') {
            Alert.alert('Comment', 'Write a comment')
        } else {
            setTimeout(() => {
                setLoading(false)
                setCommentsAll([inputText, ...commentsAll])

                setInputText('')
            }, 1000)

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

            className="rounded-[10]  p-[4]  m-4"
        >

            {/*input */}
            <View
                // style={shadowBoxBlack()}
                className="flex-row items-center p-2 rounded-[10] mb-5 bg-black/5 ">
                <TextInput
                    placeholder="Your comment"
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

            {/*    comments*/}
            <View className="gap-y-2">
                {
                    commentsAll?.map((comment, index) => {
                        return (
                            <View key={index}
                                  className="border-[1px] border-neutral-300 rounded-[20] p-3 bg-black/5 "
                            >
                                {/*data of comment*/}
                                <Text style={{fontSize: 8, marginBottom: 5}}>23.17.2024 17:50</Text>

                                <View className="flex-row gap-x-2">
                                    {/*avatar*/}
                                    <View className=" w-[50] overflow-hidden
                                {/*bg-red-500*/}
                                ">
                                        <Image
                                            source={require('../assets/img/user_icon.png')}
                                            className="rounded-full border-[1px] border-neutral-500"
                                            style={{width: 50, height: 50}}
                                            resizeMode="cover"
                                        />
                                        <Text
                                            style={{fontSize: 8, maxWidth: 50, textAlign: 'center'}}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            User Name
                                        </Text>

                                    </View>

                                    {/*comment*/}
                                    <Text
                                        style={{fontSize: hp(1.7)}}
                                        className="border-[1px] border-neutral-300 flex-1 p-2 rounded-[10]"
                                    >{comment}</Text>
                                </View>
                            </View>

                        )
                    })
                }
            </View>

        </View>
    );
};

const styles = StyleSheet.create({})

export default CommentsComponent;
