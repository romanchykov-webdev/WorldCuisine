// components/RatingComponents.jsx
import { useRouter } from 'expo-router'
import { TouchableOpacity, Text } from 'react-native'
import { Rating } from 'react-native-ratings'
import i18n from '../lang/i18n'
import { showCustomAlert } from '../constants/halperFunctions'
import { useUpsertRating } from '../queries/recipeDetails'
import { useAuthStore } from '../stores/authStore'
import { themes } from '../constants/themes'
import { useThemeStore } from '../stores/themeStore'

function RatingComponents({ rating, recipeId, isPreview }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const userId = user?.id
  const currentTheme = useThemeStore((s) => s.currentTheme)
  const { mutate: upsertRating } = useUpsertRating(recipeId, userId)

  const guard = () => {
    if (!userId) {
      showCustomAlert(
        'Rating',
        i18n.t('To rate a recipe you must log in or create an account'),
        router,
      )
    }
  }

  const onFinish = (value) => {
    if (isPreview || !userId) return
    upsertRating(value)
  }

  return (
    <TouchableOpacity
      onPress={guard}
      activeOpacity={1}
      style={{ backgroundColor: 'transparent', alignItems: 'center' }}
    >
      <Text style={{ color: themes[currentTheme]?.textColor, marginBottom: 8 }}>
        {i18n.t('Rate the recipe')}
      </Text>
      <Rating
        type="star"
        ratingCount={5}
        imageSize={40}
        ratingColor="gold"
        tintColor={themes[currentTheme]?.backgroundColor}
        startingValue={isPreview ? 0 : (rating ?? 0)}
        onFinishRating={onFinish}
        readonly={isPreview || !userId}
        style={{ backgroundColor: 'transparent' }}
      />
    </TouchableOpacity>
  )
}

export default RatingComponents
