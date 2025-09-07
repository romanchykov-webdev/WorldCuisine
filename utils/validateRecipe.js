import i18n from '../lang/i18n'

export function validateRecipeStructure(recipe) {
  if (!recipe?.title || Object.keys(recipe.title).length === 0) {
    return { ok: false, msg: i18n.t('Please add a title') }
  }
  if (!recipe?.category_id) {
    return { ok: false, msg: i18n.t('Please select a category') }
  }
  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    return { ok: false, msg: i18n.t('Please add at least one ingredient') }
  }
  if (!Array.isArray(recipe.instructions) || recipe.instructions.length === 0) {
    return { ok: false, msg: i18n.t('Please add at least one instruction step') }
  }
  return { ok: true }
}
