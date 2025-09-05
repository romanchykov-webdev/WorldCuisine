// components/ButtonLike.jsx
import { TouchableOpacity, Text } from 'react-native'
import { HeartIcon } from 'react-native-heroicons/solid'
import { useRouter } from 'expo-router'
import i18n from '../lang/i18n'
import { showCustomAlert } from '../constants/halperFunctions'
import { useIsLiked, useToggleLike } from '../queries/recipeDetails'
import { shadowBoxWhite } from '../constants/shadow'
import { formatNumber } from '../utils/numberFormat'
import { useAuthStore } from '../stores/authStore'

function ButtonLike({ recipeId, isPreview, totalCountLike }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const userId = user?.id

  const { data: liked = false } = useIsLiked(recipeId, userId, !isPreview)
  const { mutate: toggleLike } = useToggleLike(recipeId, userId)

  const onPress = () => {
    // console.log('ButtonLike onPress recipeId', recipeId)
    if (isPreview) return
    if (!userId) {
      showCustomAlert(
        'Like',
        i18n.t('To add a recipe to your favorites you must log in or create an account'),
        router,
      )
      return
    }
    toggleLike()
  }

  const count = totalCountLike ?? 0
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-[50] h-[50] justify-center items-center bg-white rounded-full relative"
      style={shadowBoxWhite()}
      activeOpacity={0.8}
    >
      <HeartIcon size={30} color={liked ? 'red' : 'gray'} />
      <Text className="absolute text-[8px] text-neutral-900">{formatNumber(count)}</Text>
    </TouchableOpacity>
  )
}

export default ButtonLike
