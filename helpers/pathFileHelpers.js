export function slugify(s) {
  return String(s || '')
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
}
export function basePathForRecipe(recipe) {
  const category = slugify(recipe.category) || 'uncategorized'
  const sub = slugify(recipe.point) || 'default'
  const user = recipe.published_id || 'anonymous'
  const recipeId = recipe.id || 'temp' // ВАЖНО: при create мы подменим на реальный id
  return `recipes_images/${category}/${sub}/${user}/${recipeId}`
}
