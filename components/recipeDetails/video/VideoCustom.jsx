import { useEvent } from 'expo'
import { useVideoPlayer, VideoView } from 'expo-video'
import { useEffect, useState } from 'react'

import { StyleSheet, View } from 'react-native'
import YouTubeIframe from 'react-native-youtube-iframe'
import { convertGoogleDriveLink, getYoutubeVideoId } from '../../../constants/halperFunctions'

import { shadowBoxBlack } from '../../../constants/shadow'
// translate
import i18n from '../../../lang/i18n'

import TitleDescriptionComponent from '../../CreateRecipeScreen/TitleDescriptionComponent'
import LoadingComponent from '../../loadingComponent'

function VideoCustom({ video }) {
  // console.log('VideoCustom video', video)

  const [loadingVideo, setLoadingVideo] = useState(true)
  const [ytId, setYtId] = useState(null)

  useEffect(() => {
    if (video) {
      setLoadingVideo(true)
      setYtId(getYoutubeVideoId(video))
    }
    const timeout = setTimeout(() => setLoadingVideo(false), 500)
    return () => clearTimeout(timeout)
  }, [video])

  // // for expo video
  // // Использование expo-video
  // const player = useVideoPlayer(youTobeLink) // Передаем только ссылку на видео
  // // console.log('youTobeLink', youTobeLink)

  // useEffect(() => {
  //   if (player) {
  //     player.loop = true // Настроим плеер на зацикливание
  //     player.pause() // Начинаем воспроизведение
  //   }
  // }, [player])

  // const { isPlaying } = useEvent(player, 'playingChange', {
  //   isPlaying: player.playing,
  // })
  // for expo video

  return (
    <View>
      <TitleDescriptionComponent titleText={i18n.t('Recipe video')} titleVisual />
      <View
        style={shadowBoxBlack()}
        className="rounded-[20px] overflow-hidden border-2 border-neutral-700"
      >
        <View style={styles.frame}>
          {loadingVideo ? (
            <LoadingComponent />
          ) : ytId ? (
            <YouTubeIframe videoId={ytId} height="100%" />
          ) : null}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  frame: {
    height: 200,
  },
})
export default VideoCustom
