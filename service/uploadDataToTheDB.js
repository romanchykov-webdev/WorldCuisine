import { supabase } from '../lib/supabase'
import { deleteFile, uploadFile } from './imageServices'

/**
 * Загружает рецепт на сервер, включая изображения и данные
 * @param {object} totalRecipe - Объект с данными рецепта, включая категории, изображения, инструкции и т.д.
 * @returns {Promise<{success: boolean, data?: object, msg?: string}>} - Результат загрузки рецепта
 */
export async function uploadRecipeToTheServer(totalRecipe) {
  try {
    // console.log("uploadRecipeToTheServer", totalRecipe);

    // Глубокая копия объекта totalRecipe
    const recipeData = JSON.parse(JSON.stringify(totalRecipe))

    // Формируем subCategory, заменяем пробелы на подчеркивания
    const subCategory = recipeData.point.startsWith(recipeData.category)
      ? recipeData.point.replace(recipeData.category, '').trim().replaceAll(' ', '_')
      : recipeData.point.trim().replaceAll(' ', '_')

    // Очищаем category и subCategory от недопустимых символов для пути
    const cleanCategory = recipeData.category
      .replace(/[^\wа-яА-ЯёЁ -]/g, '')
      .trim()
      .replaceAll(' ', '_')
    const cleanSubCategory = subCategory.replace(/[^\wа-яА-ЯёЁ -]/g, '')

    // Формируем путь для изображения
    const date = new Date() // Текущая дата и время
    const year = date.getUTCFullYear()
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    // Формируем имя папки в формате YYYY_MM_DD_HH_MM_SS
    let folderName = `${year}_${month}_${day}_${hours}_${minutes}_${seconds}`

    // Добавляем user_id для уникальности, если он есть
    const userId = recipeData.published_id || ''
    if (userId) {
      folderName += `_${userId}`
    }

    const baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${folderName}`
    // const baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${recipeId}`;

    // 1. Загружаем image_header, если он есть и это локальный файл
    if (
      recipeData.image_header
      && typeof recipeData.image_header === 'string'
      && recipeData.image_header.startsWith('file://')
    ) {
      const headerExtension = recipeData.image_header.split('.').pop() || 'jpg'
      const headerPath = `${baseImagePath}/header.${headerExtension}`
      const imageRes = await uploadFile(headerPath, recipeData.image_header, true)
      if (imageRes.success) {
        recipeData.image_header = imageRes.data // Сохраняем только путь как строку
      }
      else {
        console.error('Failed to upload image_header:', imageRes.msg)
        recipeData.image_header = null
      }
    }

    // 2. Собираем все уникальные изображения из instructions
    const imageMap = new Map() // Map для хранения локальный URI → путь в хранилище
    if (recipeData.instructions && recipeData.instructions.lang) {
      for (const lang in recipeData.instructions.lang) {
        const langInstructions = recipeData.instructions.lang[lang]
        for (const step in langInstructions) {
          const stepData = langInstructions[step]
          if (stepData.images && Array.isArray(stepData.images)) {
            stepData.images.forEach((image, index) => {
              if (typeof image === 'string' && !image.startsWith('file://')) {
                // Если это уже строка и не локальный файл, оставляем как есть
                imageMap.set(image, image)
              }
              else if (typeof image === 'object' && image.uri && image.uri.startsWith('file://')) {
                // Если это объект с локальным URI
                if (!imageMap.has(image.uri)) {
                  imageMap.set(image.uri, null)
                }
              }
              else if (typeof image === 'string' && image.startsWith('file://')) {
                // Если это строка с локальным URI
                if (!imageMap.has(image)) {
                  imageMap.set(image, null)
                }
              }
            })
          }
        }
      }

      // 3. Загружаем уникальные локальные изображения
      const uploadPromises = []
      let imageIndex = 1 // Начинаем с 1 для именования файлов
      for (const [localUri] of imageMap) {
        if (localUri.startsWith('file://')) {
          const extension = localUri.split('.').pop() || 'jpg'
          const imagePath = `${baseImagePath}/${imageIndex++}.${extension}`
          uploadPromises.push(
            uploadFile(imagePath, localUri, true).then(res => ({
              localUri,
              uploadedPath: res.success ? res.data : null, // Сохраняем только путь
              error: res.success ? null : res.msg,
            })),
          )
        }
      }

      // Ждем завершения всех загрузок
      const uploadResults = await Promise.all(uploadPromises)
      uploadResults.forEach(({ localUri, uploadedPath, error }) => {
        if (error) {
          console.error(`Failed to upload image ${localUri}:`, error)
          imageMap.set(localUri, null)
        }
        else {
          imageMap.set(localUri, uploadedPath) // Сохраняем только строку с путем
        }
      })

      // 4. Обновляем все images в instructions, заменяя объекты на строки
      for (const lang in recipeData.instructions.lang) {
        const langInstructions = recipeData.instructions.lang[lang]
        for (const step in langInstructions) {
          const stepData = langInstructions[step]
          if (stepData.images && Array.isArray(stepData.images)) {
            stepData.images = stepData.images
              .map((image) => {
                if (typeof image === 'string' && !image.startsWith('file://')) {
                  // Если это уже путь (не локальный URI), оставляем как есть
                  return image
                }
                else if (typeof image === 'object' && image.uri && imageMap.has(image.uri)) {
                  // Если это объект, возвращаем только путь как строку
                  return imageMap.get(image.uri)
                }
                else if (typeof image === 'string' && imageMap.has(image)) {
                  // Если это строка с локальным URI, возвращаем путь
                  return imageMap.get(image)
                }
                return null // Если что-то пошло не так, возвращаем null
              })
              .filter(img => img !== null) // Убираем null значения
          }
        }
      }
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
    const { data, error } = await supabase.from('all_recipes_description').insert([recipeToInsert]).select()

    if (error) {
      console.error('Supabase insert error:', error)
      return { success: false, msg: error.message }
    }

    return { success: true, data: data[0] }
  }
  catch (error) {
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
    console.log('updateRecipeToTheServer: Received recipeId:', recipeId)
    console.log('updateRecipeToTheServer: Received updatedData:', JSON.stringify(updatedData, null, 2))

    // 1. Получаем текущие данные рецепта из базы
    const { data: existingRecipe, error: fetchError } = await supabase
      .from('all_recipes_description')
      .select('image_header, instructions, category, point, published_id')
      .eq('id', recipeId)
      .single()

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return { success: false, msg: fetchError.message }
    }

    if (!existingRecipe) {
      return { success: false, msg: 'Recipe not found' }
    }

    // 2. Глубокая копия объекта updatedData
    const recipeToUpdate = JSON.parse(JSON.stringify(updatedData))

    // 3. Формируем subCategory (для запасного пути, если image_header отсутствует)
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

    // 4. Извлекаем путь к существующей папке из image_header
    let baseImagePath
    if (existingRecipe.image_header) {
      // Пример: https://res.cloudinary.com/dq0ymjvhx/image/upload/v1745587283/ratatouille_images/recipes_images/Dessert/Cakes/15c5d29d-e68c-44b0-b876-6914f1f9a3ba/header.jpg
      const pathParts = existingRecipe.image_header.split('/image/upload/')[1].split('/')
      pathParts.shift() // Удаляем ratatouille_images
      pathParts.pop() // Удаляем имя файла (например, header.jpg)
      baseImagePath = pathParts.join('/') // Собираем путь: recipes_images/Dessert/Cakes/15c5d29d-e68c-44b0-b876-6914f1f9a3ba
    }
    else {
      // Если image_header отсутствует, формируем путь на основе recipeId
      baseImagePath = `recipes_images/${cleanCategory}/${cleanSubCategory}/${recipeId}`
    }

    console.log('updateRecipeToTheServer: Using baseImagePath:', baseImagePath)

    // 5. Обрабатываем image_header
    if ('image_header' in recipeToUpdate) {
      if (
        recipeToUpdate.image_header
        && typeof recipeToUpdate.image_header === 'string'
        && recipeToUpdate.image_header.startsWith('file://')
      ) {
        const headerExtension = recipeToUpdate.image_header.split('.').pop() || 'jpg'
        const newHeaderPath = `${baseImagePath}/header.${headerExtension}` // Перезаписываем header

        // Загружаем новое изображение
        const imageRes = await uploadFile(newHeaderPath, recipeToUpdate.image_header, true, existingRecipe.image_header)
        if (imageRes.success) {
          console.log('updateRecipeToTheServer: New image uploaded to:', imageRes.data)
          recipeToUpdate.image_header = imageRes.data
        }
        else {
          console.error('updateRecipeToTheServer: Failed to upload image_header:', imageRes.msg)
          return { success: false, msg: 'Failed to upload image_header' }
        }
      }
      else if (recipeToUpdate.image_header === null) {
        if (existingRecipe.image_header) {
          const deleteResult = await deleteFile(existingRecipe.image_header)
          if (!deleteResult.success) {
            console.error('updateRecipeToTheServer: Error deleting old image_header:', deleteResult.msg)
          }
          else {
            console.log('updateRecipeToTheServer: Old image_header deleted:', existingRecipe.image_header)
          }
        }
        recipeToUpdate.image_header = null
      }
    }

    // 6. Обрабатываем instructions
    if ('instructions' in recipeToUpdate && recipeToUpdate.instructions && recipeToUpdate.instructions.lang) {
      const imageMap = new Map()
      const oldImages = new Set()

      // Собираем старые изображения
      if (existingRecipe.instructions && existingRecipe.instructions.lang) {
        for (const lang in existingRecipe.instructions.lang) {
          const langInstructions = existingRecipe.instructions.lang[lang]
          for (const step in langInstructions) {
            const stepData = langInstructions[step]
            if (stepData.images && Array.isArray(stepData.images)) {
              stepData.images.forEach((image) => {
                if (typeof image === 'string' && !image.startsWith('file://')) {
                  oldImages.add(image)
                }
              })
            }
          }
        }
      }

      // Собираем новые изображения
      for (const lang in recipeToUpdate.instructions.lang) {
        const langInstructions = recipeToUpdate.instructions.lang[lang]
        for (const step in langInstructions) {
          const stepData = langInstructions[step]
          if (stepData.images && Array.isArray(stepData.images)) {
            stepData.images.forEach((image, index) => {
              if (typeof image === 'string' && !image.startsWith('file://')) {
                imageMap.set(image, image)
              }
              else if (typeof image === 'object' && image.uri && image.uri.startsWith('file://')) {
                if (!imageMap.has(image.uri)) {
                  imageMap.set(image.uri, null)
                }
              }
              else if (typeof image === 'string' && image.startsWith('file://')) {
                if (!imageMap.has(image)) {
                  imageMap.set(image, null)
                }
              }
            })
          }
        }
      }

      // Удаляем старые изображения
      const newImagePaths = new Set(imageMap.values())
      const imagesToDelete = Array.from(oldImages).filter(image => !newImagePaths.has(image))
      for (const image of imagesToDelete) {
        const deleteResult = await deleteFile(image)
        if (!deleteResult.success) {
          console.error('updateRecipeToTheServer: Error deleting old instruction image:', deleteResult.msg)
        }
        else {
          console.log('updateRecipeToTheServer: Old instruction image deleted:', image)
        }
      }

      // Загружаем новые изображения в ту же папку
      const uploadPromises = []
      let imageIndex = 1
      const existingImages = Array.from(oldImages).map((image) => {
        const fileName = image.split('/').pop().split('.')[0]
        if (fileName.match(/^\d+$/)) {
          return Number.parseInt(fileName, 10)
        }
        return 0
      })
      imageIndex = existingImages.length > 0 ? Math.max(...existingImages) + 1 : 1

      for (const [localUri] of imageMap) {
        if (localUri.startsWith('file://')) {
          const extension = localUri.split('.').pop() || 'jpg'
          const imagePath = `${baseImagePath}/${imageIndex++}.${extension}`
          uploadPromises.push(
            uploadFile(imagePath, localUri, true).then(res => ({
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
        }
        else {
          imageMap.set(localUri, uploadedPath)
        }
      })

      // Обновляем instructions
      for (const lang in recipeToUpdate.instructions.lang) {
        const langInstructions = recipeToUpdate.instructions.lang[lang]
        for (const step in langInstructions) {
          const stepData = langInstructions[step]
          if (stepData.images && Array.isArray(stepData.images)) {
            stepData.images = stepData.images
              .map((image) => {
                if (typeof image === 'string' && !image.startsWith('file://')) {
                  return image
                }
                else if (typeof image === 'object' && image.uri && imageMap.has(image.uri)) {
                  return imageMap.get(image.uri)
                }
                else if (typeof image === 'string' && imageMap.has(image)) {
                  return imageMap.get(image)
                }
                return null
              })
              .filter(img => img !== null)
          }
        }
      }
    }

    // 7. Удаляем поля, которые не должны обновляться
    delete recipeToUpdate.rating
    delete recipeToUpdate.likes
    delete recipeToUpdate.comments

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
  }
  catch (error) {
    console.error('Error in updateRecipeToTheServer:', error)
    return { success: false, msg: error.message }
  }
}
