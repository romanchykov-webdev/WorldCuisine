import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecipeDetailsTQ, getRecipeCommentsCountTQ } from '../service/TQuery/recipes'
import { isRecipeLikedTQ, toggleLikeTQ } from '../service/TQuery/likes'
import { upsertRatingTQ } from '../service/TQuery/rating'
import {
  getCreatorDataTQ,
  isSubscribedTQ,
  subscribeTQ,
  unsubscribeTQ,
} from '../service/TQuery/subscriptions'

/** Детали рецепта */
export function useRecipeDetails(id, opts = {}) {
  return useQuery({
    queryKey: ['recipeDetails', id],
    queryFn: () => getRecipeDetailsTQ({ id }),
    enabled: !!id && !opts.preview,
    staleTime: 60_000,
  })
}

/** Лайк: проверка */
export function useIsLiked(recipeId, userId, enabled = true) {
  return useQuery({
    queryKey: ['isLiked', recipeId, userId],
    queryFn: () => isRecipeLikedTQ({ recipeId, userId }),
    enabled: !!recipeId && !!userId && enabled,
    staleTime: 30_000,
  })
}

/** Лайк: тоггл c оптимистичным апдейтом списка деталей */
export function useToggleLike(recipeId, userId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => toggleLikeTQ({ recipeId, userId }),
    onMutate: async () => {
      const key = ['recipeDetails', recipeId]
      await qc.cancelQueries({ queryKey: key })
      const prev = qc.getQueryData(key)
      // оптимистично меняем likes
      if (prev) {
        qc.setQueryData(key, { ...prev, likes: (prev.likes ?? 0) + 1 }) // временно +1
      }
      return { prev }
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['recipeDetails', recipeId], ctx.prev)
    },
    onSuccess: (res) => {
      // финально скорректируем по delta
      qc.setQueryData(['recipeDetails', recipeId], (cur) =>
        cur ? { ...cur, likes: (cur.likes ?? 0) + (res?.delta ?? 0) } : cur,
      )
      qc.invalidateQueries({ queryKey: ['isLiked', recipeId, userId] })
    },
  })
}

/** Рейтинг */
export function useUpsertRating(recipeId, userId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (rating) => upsertRatingTQ({ recipeId, userId, rating }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['recipeDetails', recipeId] })
    },
  })
}

/** Автор (создатель) */
export function useCreatorData(creatorId) {
  return useQuery({
    queryKey: ['creator', creatorId],
    queryFn: () => getCreatorDataTQ({ creatorId }),
    enabled: !!creatorId,
    staleTime: 60_000,
  })
}

/** Подписка: проверка/тоггл */
export function useSubscription(subscriberId, creatorId) {
  const qc = useQueryClient()
  const check = useQuery({
    queryKey: ['isSubscribed', subscriberId, creatorId],
    queryFn: () => isSubscribedTQ({ subscriberId, creatorId }),
    enabled: !!subscriberId && !!creatorId,
    staleTime: 30_000,
  })

  const subscribe = useMutation({
    mutationFn: () => subscribeTQ({ subscriberId, creatorId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['isSubscribed', subscriberId, creatorId] })
      qc.invalidateQueries({ queryKey: ['creator', creatorId] })
    },
  })

  const unsubscribe = useMutation({
    mutationFn: () => unsubscribeTQ({ subscriberId, creatorId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['isSubscribed', subscriberId, creatorId] })
      qc.invalidateQueries({ queryKey: ['creator', creatorId] })
    },
  })

  return { check, subscribe, unsubscribe }
}
