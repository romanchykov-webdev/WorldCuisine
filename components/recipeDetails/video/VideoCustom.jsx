import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {convertGoogleDriveLink, getYoutobeVideoId} from "../../../constants/halperFunctions";


import Animated, {FadeInDown, FadeInUp} from "react-native-reanimated";
import YouTubeIframe from "react-native-youtube-iframe";
import {hp} from "../../../constants/responsiveScreen";
import {shadowBoxBlack} from "../../../constants/shadow";

import {useVideoPlayer, VideoView} from 'expo-video';
import {useEvent} from "expo";
import LoadingComponent from "../../loadingComponent";

// translate
import i18n from '../../../lang/i18n'

const VideoCustom = ({video}) => {
    // console.log("VideoCustom video", video)

    const [loadingVideo, setLoadingVideo] = useState(true)
    // getYoutobeVideoId


    const [youTobeLink, setYouTobeLink] = useState(null);
    const [youVideoLink, setYouVideoLink] = useState(null);

    useEffect(() => {
        if (video) {
            if (video.strYoutube) {
                setLoadingVideo(true)
                setYouTobeLink(getYoutobeVideoId(video.strYoutube));

                setTimeout(() => {
                    setLoadingVideo(false)
                }, 2000)

            }
            if (video.strYouVideo) {

                setLoadingVideo(true)
                setYouVideoLink(convertGoogleDriveLink(video.strYouVideo));

                setTimeout(() => {
                    setLoadingVideo(false)
                }, 2000)
            }
        }
    }, [video]);
    // {
    //     "strYoutube": "https://www.youtube.com/watch?v=nMyBC9staMU",
    //     "strYouVideo": null
    // }   // {
    //     "strYoutube": "https://www.youtube.com/watch?v=nMyBC9staMU",
    //     "strYouVideo": "https://drive.google.com/file/d/1X-T2ywbRxQBc7RvwzXVjBYZ4vbmCxSf_/view?usp=sharing"
    // }

    // for expo video
    // Использование expo-video
    const player = useVideoPlayer(youVideoLink); // Передаем только ссылку на видео

    useEffect(() => {
        if (player) {
            player.loop = true;  // Настроим плеер на зацикливание
            player.pause();       // Начинаем воспроизведение
        }
    }, [player]);

    const {isPlaying} = useEvent(player, 'playingChange', {isPlaying: player.playing});
    // for expo video

    return (
        <View>
            <Text
                style={[{fontSize: hp(2.5)}, shadowBoxBlack()]}
                className="font-bold text-neutral-700 mb-2"
            >
                {i18n.t('Recipe video')}
            </Text>
            <View style={shadowBoxBlack({
                color: '#000', // Цвет тени для блоков (по умолчанию чёрный)
                offset: {width: 1, height: 1}, // Смещение тени по горизонтали и вертикали (по умолчанию вниз на 4px)
                opacity: 1, // Прозрачность тени (по умолчанию 30%)
                radius: 2, // Радиус размытия тени (по умолчанию 5px)
                elevation: 2, // Высота "подъема" для создания тени на Android (по умолчанию 6)
            })}>
                {
                    youTobeLink != null && (
                        <View
                            // entering={FadeInDown.delay(900)}

                        >

                            {/*    player*/}
                            <View
                                style={[{height: hp(24)},]}
                                className="rounded-[20] overflow-hidden border-2 border-neutral-700"
                            >
                                {
                                    loadingVideo
                                        ? (
                                            <LoadingComponent/>
                                        )
                                        : (
                                            <YouTubeIframe

                                                videoId={youTobeLink}
                                                // videoId='nMyBC9staMU'
                                                height='100%'
                                            />
                                        )
                                }

                            </View>
                        </View>
                    )
                }
                {
                    youVideoLink != null && (
                        <View>

                            {/*    player*/}
                            <View style={[{height: hp(24)},]}
                                  className="rounded-[20] overflow-hidden border-2 border-neutral-700">

                                {
                                    loadingVideo
                                        ? (
                                            <LoadingComponent/>
                                        )
                                        : (
                                            <>
                                                <VideoView style={styles.video} player={player} allowsFullscreen
                                                           allowsPictureInPicture/>
                                                <View style={styles.controlsContainer}></View>
                                            </>
                                        )
                                }


                            </View>
                        </View>
                    )
                }

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    video: {
        width: '100%',
        height: '100%',
    },
    controlsContainer: {
        padding: 10,
    },
})

export default VideoCustom;
