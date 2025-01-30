import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from 'react-native';

import {PlayCircleIcon, CircleStackIcon, TrashIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../constants/shadow";
import ModalClearCustom from "../ModalClearCustom";
import VideoCustom from "../recipeDetails/video/VideoCustom";
import ButtonSmallCustom from "../Buttons/ButtonSmallCustom";


const AddLinkVideo = () => {

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [inputLink, setInputLink] = useState("")

    const [link, setLink] = useState(null)

    const [linkVideo, setLinkVideo] = useState({
        "strYoutube": null,
        "strYouVideo": null
    })

    useEffect(() => {
        console.log("Обновленный linkVideo:", linkVideo);
    }, [linkVideo])


    const closeModal = () => {
        setIsModalVisible(false);
    }

    const handleSave = () => {
        setIsModalVisible(false);
        if (inputLink.trim() === "") {
            setInputLink("")
            return;
        }
        if (link === "YouTube") {

            setLinkVideo({
                "strYoutube": inputLink,
                "strYouVideo": null
            })
        }
        if (link === "Google Disk") {
            setLinkVideo({
                "strYoutube": null,
                "strYouVideo": inputLink
            })
        }

    }

    const handleTuLink = (link) => {

        if (link === "YouTube") {
            setLink("YouTube")
            // console.log("YouTube")
            setIsModalVisible(true)
        }
        if (link === "Google Disk") {
            // console.log("googleDisk")
            setLink("Google Disk")
            setIsModalVisible(true)
        }
    }

    const removeLink = async () => {
        setInputLink("")
        // setLinkVideo({
        //     "strYoutube": null,
        //     "strYouVideo": null,
        // })
        // setIsModalVisible(false)
        // setLink(null)
    }

    const removeVideo = () => {
        setLinkVideo({
            "strYoutube": null,
            "strYouVideo": null,
        })
    }

    return (
        <View>
            {
                (linkVideo.strYoutube !== null || linkVideo.strYouVideo !== null) && (
                    <View>
                        <VideoCustom video={linkVideo}/>

                        <TouchableOpacity
                            className="absolute top-0 right-0"
                            onPress={removeVideo}
                        >
                            <ButtonSmallCustom
                                icon={TrashIcon}
                                bg="red"
                                w={30}
                                h={30}
                            />
                        </TouchableOpacity>
                    </View>
                )
            }


            <Text className="mt-2 mb-2">Add link to video</Text>
            <View className="gap-x-2 flex-row flex-1">

                {/*YouTube*/}
                <TouchableOpacity
                    onPress={() => handleTuLink("YouTube")}
                    style={[shadowBoxBlack(), styles.buttonWrapper, {backgroundColor: "#EF4444"}]}

                >
                    <PlayCircleIcon size={25} color="white"/>
                    <Text style={styles.ButtonText}>YouTube</Text>
                </TouchableOpacity>

                {/*Google disk*/}
                <TouchableOpacity
                    onPress={() => handleTuLink("Google Disk")}
                    style={[shadowBoxBlack(), styles.buttonWrapper, {backgroundColor: "green"}]}
                >

                    <CircleStackIcon size={25} color="white"/>
                    <Text style={styles.ButtonText}>Google Disk</Text>
                </TouchableOpacity>

            </View>


            <ModalClearCustom
                // icon={<LinkIcon size={30} color={'grey'}/>}
                isModalVisible={isModalVisible}
                // setIsModalVisible={setIsModalVisible}
                closeModal={closeModal}
                handleSave={handleSave}
                animationType={"fade"}
                inputLink={inputLink}
                setInputLink={setInputLink}
                removeLink={removeLink}
                link={link}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#d1d5db",

    },
    ButtonText: {
        fontSize: 18,
        marginLeft: 5,
        fontWeight: "bold",
    }

});

export default AddLinkVideo;