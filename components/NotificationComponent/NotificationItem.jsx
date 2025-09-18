import { useEffect } from 'react'
import { Switch, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import { shadowBoxBlack } from '../../constants/shadow'
import i18n from '../../lang/i18n'
import AvatarCustom from '../AvatarCustom'
import Animated, {
  FadeInLeft,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated'

function NotificationItem({
  item,
  index,
  switchStates,
  onToggleRead,
  onNavigate,
  isLiked = false,
}) {
  // Пульсация сердца через Reanimated
  const scale = useSharedValue(1)

  useEffect(() => {
    if (isLiked || item.type === 'like') {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.5, { duration: 700 }),
          withTiming(1, { duration: 700 }),
        ),
        -1, // бесконечно
        true,
      )
    }
  }, [isLiked, item.type])

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <View style={{ overflow: 'hidden' }}>
      <Animated.View
        entering={FadeInDown.delay(200 * index).springify()}
        style={{
          height: 150, // если не используешь collapse-анимацию — фиксируем
          ...shadowBoxBlack({ offset: { width: 1, height: 1 }, opacity: 0.5 }),
        }}
      >
        <View
          style={{
            backgroundColor: 'transparent',
            position: 'relative',
            flex: 1,
          }}
        >
          <View className="w-auto border-2 p-2 h-[130px] bg-transparent border-neutral-500 rounded-[12] gap-x-2 relative overflow-hidden">
            <AvatarCustom
              uri={item.all_recipes_description?.image_header}
              resizeMode="cover"
              style={{
                position: 'absolute',
                borderRadius: 0,
                top: 0,
                left: 0,
                width: '110%',
                height: '120%',
                zIndex: -1,
                opacity: 0.5,
              }}
            />

            {/* Верхняя строка */}
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <Text className="text-xl text-neutral-700">User : </Text>
                <Text className="text-xl">{item.users?.user_name || 'Unknown User'}</Text>
              </View>
              <Switch
                value={switchStates[item.id] ?? true}
                onValueChange={() => onToggleRead(item.id, item.recipe_id)}
                thumbColor={(switchStates[item.id] ?? true) ? '#B2AC88' : 'red'}
                trackColor={{ false: 'rgba(0,0,0,0.2)', true: 'rgba(0,0,0,0.3)' }}
              />
            </View>

            {/* Тело */}
            {item.type === 'comment' ? (
              <View className="flex-row items-center gap-x-2">
                <AvatarCustom uri={item.users?.avatar} size={60} />
                <View className="flex-1">
                  <Text className="flex-1" numberOfLines={7} ellipsizeMode="tail">
                    {item.message}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center gap-x-2 relative">
                <AvatarCustom uri={item.users?.avatar} size={60} />
                <View className="flex-1 items-center absolute left-[40%] ">
                  <Animated.View style={pulseStyle}>
                    <Icon name="heart" size={80} color="red" />
                  </Animated.View>
                </View>
              </View>
            )}

            {/* Низ */}
            <View className="flex-row flex-1 justify-between items-center mt-1">
              <Text style={{ fontSize: 12 }}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
              <TouchableOpacity onPress={() => onNavigate(item.recipe_id)}>
                <Text style={{ fontSize: 12 }}>{i18n.t('Open recipe')} ...</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  )
}

export default NotificationItem
