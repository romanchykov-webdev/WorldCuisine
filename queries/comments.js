import { addComment, getCommentsWithUsers } from '../service/TQuery/comments'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// get all comments
export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsWithUsers(postId),
    enabled: !!postId,
    // staleTime: 60_000,
  })
}

// add comment
export function useAddComment(postId, currentUser, { onServerCountBump } = {}) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ text }) => addComment({ postId, userId: currentUser.id, text }),
    // оптимистичное добавление
    onMutate: async ({ text }) => {
      await qc.cancelQueries({ queryKey: ['comments', postId] })
      const prev = qc.getQueryData(['comments', postId]) || []

      const optimistic = {
        id: `tmp_${Date.now()}`,
        post_id: postId,
        user_id_commented: currentUser.id,
        comment: text,
        created_at: new Date().toISOString(),
        user: {
          id: currentUser.id,
          avatar: currentUser.avatar,
          user_name: currentUser.user_name,
        },
        _optimistic: true,
      }

      qc.setQueryData(['comments', postId], [optimistic, ...prev])
      onServerCountBump?.('updateCommentsCount')
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['comments', postId], ctx.prev)
    },
    onSuccess: (created) => {
      // заменяем optimistic на реальный
      qc.setQueryData(['comments', postId], (curr = []) => {
        const idx = curr.findIndex((x) => x._optimistic)
        const withUser = {
          ...created,
          user: {
            id: currentUser.id,
            avatar: currentUser.avatar,
            user_name: currentUser.user_name,
          },
        }
        if (idx === -1) return [withUser, ...curr]
        const copy = curr.slice()
        copy[idx] = withUser
        return copy
      })
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}

// delete comment
export function useDeleteComment(postId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (commentId) => deleteComment(commentId),
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: ['comments', postId] })
      const prev = qc.getQueryData(['comments', postId]) || []
      qc.setQueryData(
        ['comments', postId],
        prev.filter((c) => c.id !== commentId),
      )
      return { prev }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(['comments', postId], ctx.prev)
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}
