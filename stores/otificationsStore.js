import { create } from 'zustand'

export const useNotificationsStore = create((set) => ({
  newComments: {},
  newLikes: {},
  unreadCommentsCount: 0,
  unreadLikesCount: 0,

  setNewComments: (val) => set({ newComments: val }),
  setNewLikes: (val) => set({ newLikes: val }),
  setUnreadCommentsCount: (count) => set({ unreadCommentsCount: count }),
  setUnreadLikesCount: (count) => set({ unreadLikesCount: count }),

  markAsRead: (type, recipeId) =>
    set((s) => {
      if (type === 'comment') {
        const updated = { ...s.newComments }
        delete updated[recipeId]
        return { newComments: updated }
      }
      if (type === 'like') {
        const updated = { ...s.newLikes }
        delete updated[recipeId]
        return { newLikes: updated }
      }
      return {}
    }),
}))
