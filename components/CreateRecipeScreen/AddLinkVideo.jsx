import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {PlayCircleIcon, CircleStackIcon} from "react-native-heroicons/mini";
import {shadowBoxBlack} from "../../constants/shadow";

const AddLinkVideo = () => {

    const [linkVideo, setLinkVideo] = useState(false) //if false  YouTube

    return (
        <View>
            <Text>Add link</Text>
            <View className="gap-x-2 flex-row flex-1">

                {/*YouTube*/}
                <TouchableOpacity
                    style={[shadowBoxBlack(), styles.buttonWrapper, {backgroundColor: "#EF4444"}]}

                >
                    <PlayCircleIcon size={25} color="white"/>
                    <Text style={styles.ButtonText}>YouTube</Text>
                </TouchableOpacity>

                {/*Google disk*/}
                <TouchableOpacity
                    style={[shadowBoxBlack(), styles.buttonWrapper, {backgroundColor: "green"}]}
                >

                    <CircleStackIcon size={25} color="white"/>
                    <Text style={styles.ButtonText}>Google disk</Text>
                </TouchableOpacity>

            </View>
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
        borderWidth:2,
        borderColor: "#d1d5db",

    },
    ButtonText:{
        fontSize: 18,
        marginLeft:5,
        fontWeight: "bold",
    }

});

export default AddLinkVideo;