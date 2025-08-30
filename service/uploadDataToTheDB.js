import { supabase } from '../lib/supabase'
import { deleteFile, uploadFile } from './imageServices'

/**
 * Загружает рецепт на сервер, включая изображения и данные
 * @param {object} totalRecipe - Объект с данными рецепта, включая категории, изображения, инструкции и т.д.
 * @returns {Promise<{success: boolean, data?: object, msg?: string}>} - Результат загрузки рецепта
 */
export async function uploadRecipeToTheServer(totalRecipe) {
  try {
    const recipeData = JSON.parse(JSON.stringify(totalRecipe))

    // helpers
    const slugify = (s) =>
      String(s || '')
        .normalize('NFKD')
        .replace(/[^\w\s-]/g, '') // убрать всё лишнее
        .trim()
        .replace(/\s+/g, '_') // пробелы -> _

    // Если рецепт уже создан, лучше использовать его id.
    // Если создаёшь новый — сгенерируй uuid или короткий ts-ключ.
    const uniqueId = recipeData.id || Date.now().toString(36) // <-- замени на свой uuid если есть

    // Два коротких слуга
    const catSlug = slugify(recipeData.category) // например: "Drinks"
    const pointSlug = slugify(
      recipeData.point.startsWith(recipeData.category)
        ? recipeData.point.replace(recipeData.category, '').trim()
        : recipeData.point,
    ) // например: "Infusions"

    // Итоговый базовый путь — компактный и стабильный:
    const userPart = recipeData.published_id ? `${recipeData.published_id}/` : ''
    const baseImagePath = `recipes_images/${userPart}${catSlug}/${pointSlug}/${uniqueId}`

    // ---- image_header
    if (
      recipeData.image_header &&
      typeof recipeData.image_header === 'string' &&
      recipeData.image_header.startsWith('file://')
    ) {
      const headerExtension = recipeData.image_header.split('.').pop() || 'jpg'
      const headerPath = `${baseImagePath}/header.${headerExtension}`
      const imageRes = await uploadFile(headerPath, recipeData.image_header, true)
      recipeData.image_header = imageRes.success ? imageRes.data : null
      if (!imageRes.success) console.error('Failed to upload image_header:', imageRes.msg)
    }

    // ---- Сбор всех локальных картинок из instructions (НОВЫЙ ФОРМАТ)
    // instructions: Array< { ..., images: string[] } >
    const imageMap = new Map() // localUri -> uploadedUrl (или null пока)
    if (Array.isArray(recipeData.instructions)) {
      recipeData.instructions.forEach((step) => {
        if (step?.images && Array.isArray(step.images)) {
          step.images.forEach((img) => {
            // уже удалённые url пропускаем
            if (typeof img === 'string') {
              if (img.startsWith('file://')) {
                if (!imageMap.has(img)) imageMap.set(img, null)
              } else {
                // уже URL — оставляем как есть
                if (!imageMap.has(img)) imageMap.set(img, img)
              }
            }
          })
        }
      })
    }

    // ---- Загрузка локальных изображений
    const uploadPromises = []
    let imageIndex = 1
    for (const [localUri, uploaded] of imageMap.entries()) {
      if (uploaded === null && localUri.startsWith('file://')) {
        const extension = localUri.split('.').pop() || 'jpg'
        const imagePath = `${baseImagePath}/${imageIndex++}.${extension}`
        uploadPromises.push(
          uploadFile(imagePath, localUri, true).then((res) => ({
            localUri,
            uploadedPath: res.success ? res.data : null,
            error: res.success ? null : res.msg,
          })),
        )
      }
    }

    const uploadResults = await Promise.all(uploadPromises)
    uploadResults.forEach(({ localUri, uploadedPath, error }) => {
      if (error) {
        console.error(`Failed to upload image ${localUri}:`, error)
        imageMap.set(localUri, null)
      } else {
        imageMap.set(localUri, uploadedPath)
      }
    })

    // ---- Подмена локальных URI на URL в instructions
    if (Array.isArray(recipeData.instructions)) {
      recipeData.instructions = recipeData.instructions.map((step) => {
        if (!step || !Array.isArray(step.images)) return step
        const images = step.images
          .map((img) => {
            if (typeof img !== 'string') return null
            if (img.startsWith('file://')) return imageMap.get(img) || null
            return img // уже URL
          })
          .filter(Boolean)
        return { ...step, images }
      })
    }

    // 5. Формируем объект для вставки в таблицу
    const recipeToInsert = {
      category: recipeData.category,
      category_id: recipeData.category_id,
      image_header: recipeData.image_header,
      area: recipeData.area,
      title: recipeData.title,
      rating: recipeData.rating || 0,
      likes: recipeData.likes || 0,
      comments: recipeData.comments || 0,
      recipe_metrics: recipeData.recipe_metrics,
      ingredients: recipeData.ingredients,
      instructions: recipeData.instructions,
      video: recipeData.video,
      social_links: recipeData.social_links,
      source_reference: recipeData.source_reference,
      tags: recipeData.tags,
      published_id: recipeData.published_id,
      published_user: recipeData.published_user ? recipeData.published_user : null,
      point: recipeData.point,
      link_copyright: recipeData.link_copyright,
      map_coordinates: recipeData.map_coordinates,
    }

    // 6. Выполняем запрос на вставку
    const { data, error } = await supabase
      .from('all_recipes_description')
      .insert([recipeToInsert])
      .select()

    if (error) {
      console.error('Supabase insert error:', error)
      return { success: false, msg: error.message }
    }

    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error in uploadRecipeToTheServer:', error)
    return { success: false, msg: error.message }
  }
}

/**
 * Обновляет данные рецепта на сервере, включая изображения и инструкции
 * @param {string} recipeId - Идентификатор рецепта в базе данных
 * @param {object} updatedData - Объект с обновленными данными рецепта
 * @returns {Promise<{success: boolean, data?: object, msg?: string}>} - Результат обновления рецепта
 */
export async function updateRecipeToTheServer(recipeId, updatedData) {
  try {
    // 1) Текущие данные рецепта
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('all_recipes_description')
      .select('image_header, instructions, category, point, published_id')
      .eq('id', recipeId)
      .single()

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return { success: false, msg: fetchError.message }
    }
    if (!existingRecipe) return { success: false, msg: 'Recipe not found' }

    // 2) Копия
    const recipeToUpdate = JSON.parse(JSON.stringify(updatedData))

    // 3) Путь к папке
    const category = recipeToUpdate.category || existingRecipe.category
    const point = recipeToUpdate.point || existingRecipe.point
    const subCategory = point.startsWith(category)
      ? point.replace(category, '').trim().replaceAll(' ', '_')
      : point.trim().replaceAll(' ', '_')

    const cleanCategory = category
      .replace(/[^\wа-яА-ЯёЁ -]/g, '')
      .trim()
      .replaceAll(' ', '_')
    const cleanSubCategory = subCategory.replace(/[^\wа-яА-ЯёЁ -]/g, '')

    let baseImagePath
    if (existingRecipe.image_header && existingRecipe.image_header.includes('/image/upload/')) {
      const pathParts = existingRecipe.image_header.split('/image/upload/')[1].split('/')
      pathParts.shift() // ratatouille_images
      pathParts.pop() // header.jpg
      baseImagePath = pathParts.join('/') // recipes_images/.../folder
    } else {
      baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${recipeId}`
    }

    // 4) image_header
    if ('image_header' in recipeToUpdate) {
      if (
        recipeToUpdate.image_header &&
        typeof recipeToUpdate.image_header === 'string' &&
        recipeToUpdate.image_header.startsWith('file://')
      ) {
        const headerExtension = recipeToUpdate.image_header.split('.').pop() || 'jpg'
        const newHeaderPath = `${baseImagePath}/header.${headerExtension}`
        const imageRes = await uploadFile(
          newHeaderPath,
          recipeToUpdate.image_header,
          true,
          existingRecipe.image_header,
        )
        if (imageRes.success) {
          recipeToUpdate.image_header = imageRes.data
        } else {
          console.error('updateRecipeToTheServer: Failed to upload image_header:', imageRes.msg)
          return { success: false, msg: 'Failed to upload image_header' }
        }
      } else if (recipeToUpdate.image_header === null) {
        // удалить старый
        if (existingRecipe.image_header) {
          const del = await deleteFile(existingRecipe.image_header)
          if (!del.success) console.error('delete image_header failed:', del.msg)
        }
        recipeToUpdate.image_header = null
      }
    }

    // 5) instructions: массив шагов
    if ('instructions' in recipeToUpdate && Array.isArray(recipeToUpdate.instructions)) {
      const imageMap = new Map() // localUri -> uploadedUrl/null
      const oldImages = new Set() // все старые URL-ы из существующих шагов

      // собрать старые
      if (Array.isArray(existingRecipe.instructions)) {
        existingRecipe.instructions.forEach((step) => {
          if (step?.images && Array.isArray(step.images)) {
            step.images.forEach((img) => {
              if (typeof img === 'string' && !img.startsWith('file://')) {
                oldImages.add(img)
              }
            })
          }
        })
      }

      // собрать новые
      recipeToUpdate.instructions.forEach((step) => {
        if (step?.images && Array.isArray(step.images)) {
          step.images.forEach((img) => {
            if (typeof img === 'string') {
              if (img.startsWith('file://')) {
                if (!imageMap.has(img)) imageMap.set(img, null)
              } else {
                imageMap.set(img, img) // уже URL
              }
            }
          })
        }
      })

      // какие старые нужно удалить (их нет среди новых)
      const newImageUrls = new Set(
        Array.from(imageMap.entries())
          .map(([k, v]) => (v && !k.startsWith('file://') ? v : null))
          .filter(Boolean),
      )
      const toDelete = Array.from(oldImages).filter((img) => !newImageUrls.has(img))
      for (const url of toDelete) {
        const del = await deleteFile(url)
        if (!del.success) console.error('delete old instruction image failed:', del.msg)
      }

      // залить новые локальные в ту же папку
      // найдём максимальный индекс уже существующих файлов <n>.ext
      let imageIndex = 1
      const existingIndexes = Array.from(oldImages).map((url) => {
        const file = url.split('/').pop() || ''
        const nameOnly = file.split('.')[0]
        return /^\d+$/.test(nameOnly) ? parseInt(nameOnly, 10) : 0
      })
      if (existingIndexes.length) {
        imageIndex = Math.max(...existingIndexes) + 1
      }

      const uploadPromises = []
      for (const [localUri, uploaded] of imageMap.entries()) {
        if (uploaded === null && localUri.startsWith('file://')) {
          const extension = localUri.split('.').pop() || 'jpg'
          const imagePath = `${baseImagePath}/${imageIndex++}.${extension}`
          uploadPromises.push(
            uploadFile(imagePath, localUri, true).then((res) => ({
              localUri,
              uploadedPath: res.success ? res.data : null,
              error: res.success ? null : res.msg,
            })),
          )
        }
      }
      const uploadResults = await Promise.all(uploadPromises)
      uploadResults.forEach(({ localUri, uploadedPath, error }) => {
        if (error) {
          console.error(`Failed to upload image ${localUri}:`, error)
          imageMap.set(localUri, null)
        } else {
          imageMap.set(localUri, uploadedPath)
        }
      })

      // подмена в шагах
      recipeToUpdate.instructions = recipeToUpdate.instructions.map((step) => {
        if (!step || !Array.isArray(step.images)) return step
        const images = step.images
          .map((img) => {
            if (typeof img !== 'string') return null
            if (img.startsWith('file://')) return imageMap.get(img) || null
            return img
          })
          .filter(Boolean)
        return { ...step, images }
      })
    }

    // 6) Удаляем поля, которые не должны обновляться
    delete recipeToUpdate.rating
    delete recipeToUpdate.likes
    delete recipeToUpdate.comments

    // 7) карта —
    if ('map_coordinates' in recipeToUpdate && recipeToUpdate.map_coordinates === undefined) {
      // ничего
    }

    // 8. Выполняем запрос на обновление
    const { data, error } = await supabase
      .from('all_recipes_description')
      .update(recipeToUpdate)
      .eq('id', recipeId)
      .select()

    if (error) {
      console.error('Supabase update error:', error)
      return { success: false, msg: error.message }
    }

    console.log('updateRecipeToTheServer: Updated recipe:', JSON.stringify(data[0], null, 2))
    return { success: true, data: data[0] }
  } catch (error) {
    console.error('Error in updateRecipeToTheServer:', error)
    return { success: false, msg: error.message }
  }
}
