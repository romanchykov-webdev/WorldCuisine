/**
 * ЛЕГАСИ: возвращает объект вида { <key>: string[] } — чтобы не сломать старый вызов.
 * На самом деле ключи не важны — важны только значения массивов (points).
 * @param {Array<any>} recipes
 * @returns {Record<string, string[]>}
 */
export function createCategoryPointObject(recipes) {
  const res = {}
  if (!Array.isArray(recipes) || recipes.length === 0) return res

  // Всё складываем под одним ключом (дешёво и совместимо)
  const all = []
  for (let i = 0; i < recipes.length; i++) {
    const p = recipes[i]?.point
    if (typeof p === 'string' && p.length) all.push(p)
  }
  res.__all__ = all
  return res
}

/**
 * Универсальная фильтрация субкатегорий:
 * - принимает массив категорий (как приходит из БД)
 * - и либо Set разрешённых point, либо объект {key: string[]}
 * Возвращает массив только с теми категориями, в которых остались субкатегории из allowed.
 *
 * Структура категории ожидается примерно такая:
 * { point: string, name: string, image?: string, subcategories?: Array<{ point: string, name: string, image?: string }> }
 *
 * @param {Array<any>} categories
 * @param {Set<string> | Record<string, string[]>} allowed
 * @returns {Array<any>}
 */
export function filterCategoryRecipesBySubcategories(categories, allowed) {
  if (!Array.isArray(categories) || categories.length === 0) return []

  // Приводим allowed к Set — это даёт O(1) contains
  let allowedSet
  if (allowed instanceof Set) {
    allowedSet = allowed
  } else if (allowed && typeof allowed === 'object') {
    const flat = []
    for (const k in allowed) {
      const arr = allowed[k]
      if (Array.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
          const p = arr[i]
          if (typeof p === 'string' && p.length) flat.push(p)
        }
      }
    }
    allowedSet = new Set(flat)
  } else {
    allowedSet = new Set()
  }

  if (allowedSet.size === 0) return []

  const out = []
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    const subs = Array.isArray(cat?.subcategories) ? cat.subcategories : []
    // оставляем только подкатегории, чей point входит в allowedSet
    const filteredSubs = []
    for (let j = 0; j < subs.length; j++) {
      const sub = subs[j]
      const p = sub?.point
      if (typeof p === 'string' && allowedSet.has(p)) filteredSubs.push(sub)
    }
    if (filteredSubs.length > 0) {
      // создаём «плоскую» копию без лишних спредов
      out.push({
        point: cat?.point,
        name: cat?.name,
        image: cat?.image,
        subcategories: filteredSubs,
      })
    }
  }

  return out
}
