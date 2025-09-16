import { create } from 'zustand'

export const useNotificationsStore = create((set, get) => ({
  unreadCommentsCount: 0,
  unreadLikesCount: 0,
  newComments: {}, // { [recipeId]: true }
  newLikes: {}, // { [recipeId]: true }

  setUnread(type, count) {
    if (type === 'comment') set({ unreadCommentsCount: count })
    else if (type === 'like') set({ unreadLikesCount: count })
  },

  markRecipeFlag(type, recipeId, hasNew) {
    if (type === 'comment') {
      const map = { ...get().newComments }
      if (hasNew) map[recipeId] = true
      else delete map[recipeId]
      set({ newComments: map })
    } else {
      const map = { ...get().newLikes }
      if (hasNew) map[recipeId] = true
      else delete map[recipeId]
      set({ newLikes: map })
    }
  },

  reset() {
    set({
      unreadCommentsCount: 0,
      unreadLikesCount: 0,
      newComments: {},
      newLikes: {},
    })
  },
}))
