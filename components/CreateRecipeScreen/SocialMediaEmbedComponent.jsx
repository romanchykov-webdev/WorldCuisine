import { useEffect, useState } from 'react'
import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native'
import { TrashIcon } from 'react-native-heroicons/mini'
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import ButtonSmallCustom from '../Buttons/ButtonSmallCustom'

// Компонент для отображения одной ссылки с анимацией
function SocialMediaLink({ platform, url, onRemove }) {
  const [isVisible, setIsVisible] = useState(true)
  const positionY = useSharedValue(100) // Начальная позиция для анимации (вне экрана снизу)
  const opacity = useSharedValue(1) // Начальная прозрачность

  // Анимация появления
  useEffect(() => {
    positionY.value = withTiming(0, { duration: 300 }) // Появление снизу вверх
  }, [])

  // Анимация удаления
  const handleRemove = () => {
    positionY.value = withTiming(100, { duration: 300 }) // Уход вниз
    opacity.value = withTiming(0, { duration: 300 }) // Уменьшение прозрачности
    setTimeout(() => {
      setIsVisible(false) // Скрываем элемент после анимации
      onRemove(platform) // Удаляем ссылку из previewUrl
    }, 300)
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: positionY.value }],
    opacity: opacity.value, // Анимация прозрачности
  }))

  const handleOpenOriginal = () => {
    Linking.openURL(url).catch(err => console.error('Failed to open URL:', err))
  }

  // Определяем цвет и заголовок в зависимости от платформы
  const getPlatformStyles = () => {
    switch (platform) {
      case 'facebook':
        return { bg: '#1877F2', title: 'Facebook' }
      case 'instagram':
        return { bg: '#E1306C', title: 'Instagram' }
      case 'tiktok':
        return { bg: 'black', title: 'TikTok' }
      default:
        return { bg: 'gray', title: 'Unknown' }
    }
  }

  const { bg, title } = getPlatformStyles()

  // Отображаем только если isVisible === true
  if (!isVisible)
    return null

  return (
    <Animated.View className="flex-row mb-5" entering={FadeInDown.duration(100)}>
      <Animated.View style={animatedStyle} className="flex-row  flex-1">
        <TouchableOpacity className="flex-1" onPress={handleOpenOriginal}>
          <ButtonSmallCustom
            bg={bg}
            w="100%"
            h={60}
            title={title}
            buttonText={true}
            styleText={{ margin: 0, color: 'white', flex: 1 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRemove}>
          <ButtonSmallCustom tupeButton="remove" w={60} h={60} icon={TrashIcon} />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

// Основной компонент
function SocialMediaEmbedComponent({ previewUrl = {}, setPreviewUrl }) {
  const [embedContent, setEmbedContent] = useState(null)

  const removeLink = (social) => {
    setPreviewUrl(prev => ({
      ...prev,
      [social]: null,
    }))
  }

  useEffect(() => {
    const content = []

    if (previewUrl.facebook) {
      content.push(
        <SocialMediaLink key="facebook" platform="facebook" url={previewUrl.facebook} onRemove={removeLink} />,
      )
    }

    if (previewUrl.instagram) {
      content.push(
        <SocialMediaLink
          key="instagram"
          platform="instagram"
          url={previewUrl.instagram}
          onRemove={removeLink}
        />,
      )
    }

    if (previewUrl.tiktok) {
      content.push(
        <SocialMediaLink key="tiktok" platform="tiktok" url={previewUrl.tiktok} onRemove={removeLink} />,
      )
    }

    setEmbedContent(content.length > 0 ? content : null)
  }, [previewUrl])

  return <View style={styles.container}>{embedContent}</View>
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
})

export default SocialMediaEmbedComponent
