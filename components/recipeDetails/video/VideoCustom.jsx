import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';

import { StyleSheet, View } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe';
import {
    convertGoogleDriveLink,
    getYoutubeVideoId,
} from '../../../constants/halperFunctions';

import { shadowBoxBlack } from '../../../constants/shadow';
// translate
import i18n from '../../../lang/i18n';

import TitleDescriptionComponent from '../../CreateRecipeScreen/TitleDescriptionComponent';
import LoadingComponent from '../../loadingComponent';

function VideoCustom({ video }) {
    // console.log('VideoCustom video', video);

    const [loadingVideo, setLoadingVideo] = useState(true);

    const [youTobeLink, setYouTobeLink] = useState(null);
    const [youVideoLink, setYouVideoLink] = useState(null);

    useEffect(() => {
        if (video) {
            setLoadingVideo(true);
            setYouTobeLink(getYoutubeVideoId(video));

            setTimeout(() => {
                setLoadingVideo(false);
            }, 2000);
        }
    }, [video]);

    // for expo video
    // Использование expo-video
    const player = useVideoPlayer(youVideoLink); // Передаем только ссылку на видео

    useEffect(() => {
        if (player) {
            player.loop = true; // Настроим плеер на зацикливание
            player.pause(); // Начинаем воспроизведение
        }
    }, [player]);

    const { isPlaying } = useEvent(player, 'playingChange', {
        isPlaying: player.playing,
    });
    // for expo video

    return (
        <View>
            <TitleDescriptionComponent
                titleText={i18n.t('Recipe video')}
                titleVisual={true}
            />
            <View
                style={shadowBoxBlack({
                    color: '#000',
                    offset: { width: 1, height: 1 },
                    opacity: 1,
                    radius: 2,
                    elevation: 2,
                })}
            >
                {youTobeLink != null && (
                    <View>
                        <View
                            style={[{ height: 200 }]}
                            className="rounded-[20] overflow-hidden border-2 border-neutral-700"
                        >
                            {loadingVideo ? (
                                <LoadingComponent />
                            ) : (
                                <YouTubeIframe
                                    videoId={youTobeLink}
                                    height="100%"
                                />
                            )}
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

export default VideoCustom;
