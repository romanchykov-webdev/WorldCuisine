export const keys = {
  favorites: {
    ids: (userId) => ['favorites', 'ids', userId],
    recipes: (ids) => ['favorites', 'recipes', ids?.length || 0],
    categories: (lang, stamp) => ['favorites', 'categories', lang, stamp], // stamp = завязка на состав избранных
  },
}
