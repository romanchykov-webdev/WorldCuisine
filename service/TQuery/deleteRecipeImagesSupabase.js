import { supabase } from '../../lib/supabase'
import { normalizeToStoragePath } from '../../utils/storage'

const BUCKET = 'uploads_image'

// собрать картинки из разных схем instructions
/**
 *
 * @param instructions
 * @returns {*[]}
 */
function extractInstructionImages(instructions) {
  const out = []
  if (!instructions) return out

  // формат: [{ images: [...] }, ...]
  if (Array.isArray(instructions)) {
    for (const step of instructions) {
      if (step && Array.isArray(step.images)) {
        for (const img of step.images) if (typeof img === 'string') out.push(img)
      }
    }
    return out
  }

  return out
}

// удаление директори рецепта
/**
 *
 * @param storagePaths
 * @returns {Promise<void>}
 */
async function removeWholeRecipeFolderIfPossible(storagePaths) {
  if (!Array.isArray(storagePaths) || storagePaths.length === 0) return
  const firstPath = storagePaths[0]
  const lastSlash = firstPath.lastIndexOf('/')
  if (lastSlash < 0) return

  const folder = firstPath.slice(0, lastSlash) // recipes_images/.../<user>/<recipeId>
  const pageSize = 100
  let offset = 0
  let batch = []
  try {
    while (true) {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(folder, { limit: pageSize, offset })
      if (error) break
      if (!Array.isArray(data) || data.length === 0) break
      batch.push(...data.map((f) => `${folder}/${f.name}`))
      if (data.length < pageSize) break
      offset += pageSize
    }
    // не удаляем те, что уже удалили ранее
    batch = batch.filter((p) => !storagePaths.includes(p))
    if (batch.length) await supabase.storage.from(BUCKET).remove(batch)
  } catch {
    // best-effort: игнорим ошибки зачистки папки
  }
}

/**
 * Удаляет рецепт и его изображения из Supabase Storage.
 * Внешние ссылки (не из бакета) игнорируются.
 *
 * @param {object} recipeObj - объект рецепта
 * @returns {Promise<{success:boolean, msg?:string}>}
 */
export async function deleteRecipeImages_sbTq(recipeObj) {
  try {
    if (!recipeObj || !recipeObj.id) {
      return { success: false, msg: 'Recipe object with id is required' }
    }

    // собираем все «картинки», что записаны в объекте
    const collected = []
    if (typeof recipeObj.image_header === 'string') {
      collected.push(recipeObj.image_header)
    }
    collected.push(...extractInstructionImages(recipeObj.instructions))

    // превращаем в относительные пути внутри BUCKET и отфильтровываем внешние URL
    let storagePaths = collected.map((v) => normalizeToStoragePath(v)).filter(Boolean)
    storagePaths = Array.from(new Set(storagePaths)) // uniq

    // удаляем файлы в сторадже
    if (storagePaths.length) {
      const { error: removeErr } = await supabase.storage
        .from(BUCKET)
        .remove(storagePaths)
      if (removeErr) {
        console.warn('Storage remove warning:', removeErr.message)
      }
      //  подчистить всю директорию рецепта
      await removeWholeRecipeFolderIfPossible(storagePaths)
    }

    // удаляем рецепт
    const { error: deleteErr } = await supabase
      .from('all_recipes_description')
      .delete()
      .eq('id', recipeObj.id)
    if (deleteErr) {
      return { success: false, msg: deleteErr.message || 'Failed to delete recipe row' }
    }

    return { success: true }
  } catch (e) {
    return { success: false, msg: e?.message || 'Unexpected error' }
  }
}
