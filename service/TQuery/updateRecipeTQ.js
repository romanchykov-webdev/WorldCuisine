import { supabase } from '../../lib/supabase'
import { uploadImageTQ } from './uploadImageTQ'
import { uploadImageSupabase } from './uploadImageSupabase'
import { basePathForRecipe } from '../../helpers/pathFileHelpers'
import { normalizeToStoragePath } from '../../utils/storage'

// export async function updateRecipeTQ(
//   totalRecipe,
//   { signal, uploadFile = uploadImageTQ, deleteFile, concurrency = 4 } = {},
// ) {
//   const checkAbort = () => {
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
//   }
//
//   const deepClone = (v) => {
//     try {
//       return typeof structuredClone === 'function'
//         ? structuredClone(v)
//         : JSON.parse(JSON.stringify(v))
//     } catch {
//       return JSON.parse(JSON.stringify(v))
//     }
//   }
//
//   const slugify = (s) =>
//     String(s || '')
//       .normalize('NFKD')
//       .replace(/[^\w\s-]/g, '')
//       .trim()
//       .replace(/\s+/g, '_')
//
//   const getExt = (pathOrUri, fallback = 'jpg') => {
//     if (!pathOrUri) return fallback
//     const clean = String(pathOrUri).split('?')[0].split('#')[0]
//     const dot = clean.lastIndexOf('.')
//     if (dot === -1) return fallback
//     return clean.slice(dot + 1).toLowerCase() || fallback
//   }
//
//   // базовый путь (сохраняем прежний id, чтобы не плодить новые папки)
//   const pathBase = (recipe) => {
//     const catSlug = slugify(recipe.category) || 'uncategorized'
//     const pt = recipe.point || ''
//     const pointSlug =
//       slugify(
//         pt && recipe.category && pt.startsWith(recipe.category)
//           ? pt.replace(recipe.category, '').trim()
//           : pt,
//       ) || 'default'
//     const userPart = recipe.published_id ? `${recipe.published_id}/` : ''
//     const uniqueId = recipe.id || Date.now().toString(36) // при апдейте id должен быть!
//     return `recipes_images/${userPart}${catSlug}/${pointSlug}/${uniqueId}`
//   }
//
//   const runInBatches = async (tasks, size = 4) => {
//     const res = []
//     for (let i = 0; i < tasks.length; i += size) {
//       checkAbort()
//       const chunk = tasks.slice(i, i + size).map((fn) => fn())
//       const part = await Promise.all(chunk)
//       res.push(...part)
//     }
//     return res
//   }
//
//   try {
//     checkAbort()
//     const recipeData = deepClone(totalRecipe)
//
//     if (!recipeData?.id) {
//       throw new Error('Missing recipe id for update')
//     }
//
//     const baseImagePath = pathBase(recipeData)
//
//     // 1) header image: если локальный file:// → загрузим
//     if (
//       recipeData.image_header &&
//       typeof recipeData.image_header === 'string' &&
//       recipeData.image_header.startsWith('file://')
//     ) {
//       const ext = getExt(recipeData.image_header, 'jpg')
//       const headerPath = `${baseImagePath}/header.${ext}`
//       const imageRes = await uploadFile(headerPath, recipeData.image_header, null, {
//         signal,
//         deleteFile,
//       })
//       if (!imageRes?.success)
//         throw new Error(imageRes?.msg || 'Failed to upload header image')
//       recipeData.image_header = imageRes.data
//     }
//
//     // 2) собрать локальные картинки из instructions
//     const imageMap = new Map() // localUri -> uploadedUrl | null
//     if (Array.isArray(recipeData.instructions)) {
//       for (const step of recipeData.instructions) {
//         if (!Array.isArray(step?.images)) continue
//         for (const img of step.images) {
//           if (typeof img !== 'string') continue
//           if (img.startsWith('file://')) {
//             if (!imageMap.has(img)) imageMap.set(img, null)
//           } else {
//             if (!imageMap.has(img)) imageMap.set(img, img) // уже URL
//           }
//         }
//       }
//     }
//
//     // 3) аплоад батчами
//     let imageIndex = 1
//     const tasks = []
//     for (const [localUri, uploaded] of imageMap.entries()) {
//       if (uploaded === null) {
//         const ext = getExt(localUri, 'jpg')
//         const path = `${baseImagePath}/${imageIndex++}.${ext}`
//         tasks.push(async () => {
//           checkAbort()
//           const res = await uploadFile(path, localUri, null, { signal, deleteFile })
//           if (!res?.success) throw new Error(res?.msg || `Failed to upload ${localUri}`)
//           imageMap.set(localUri, res.data)
//           return res.data
//         })
//       }
//     }
//     if (tasks.length) await runInBatches(tasks, Math.max(1, Math.min(8, concurrency)))
//
//     // 4) заменить file:// на URL
//     if (Array.isArray(recipeData.instructions)) {
//       recipeData.instructions = recipeData.instructions.map((step) => {
//         if (!Array.isArray(step?.images)) return step
//         const images = step.images
//           .map((img) =>
//             typeof img === 'string'
//               ? img.startsWith('file://')
//                 ? imageMap.get(img) || null
//                 : img
//               : null,
//           )
//           .filter(Boolean)
//         return { ...step, images }
//       })
//     }
//
//     // 5) финальный объект для апдейта (без id)
//     const recipeToUpdate = {
//       category: recipeData.category ?? null,
//       category_id: recipeData.category_id ?? null,
//       image_header: recipeData.image_header ?? null,
//       area: recipeData.area ?? {},
//       title: recipeData.title ?? {},
//       rating: Number(recipeData.rating || 0),
//       likes: Number(recipeData.likes || 0),
//       comments: Number(recipeData.comments || 0),
//       recipe_metrics: recipeData.recipe_metrics ?? {
//         time: 0,
//         serv: 0,
//         cal: 0,
//         level: 'easy',
//       },
//       ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients : [],
//       instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions : [],
//       video: recipeData.video ?? null,
//       social_links: recipeData.social_links ?? {
//         facebook: null,
//         instagram: null,
//         tiktok: null,
//       },
//       source_reference: recipeData.source_reference ?? null,
//       tags: Array.isArray(recipeData.tags) ? recipeData.tags : [],
//       published_id: recipeData.published_id ?? null,
//       published_user: recipeData.published_user ?? null,
//       point: recipeData.point ?? null,
//       link_copyright: recipeData.link_copyright ?? null,
//       map_coordinates: recipeData.map_coordinates ?? null,
//       // если у тебя есть updated_at в БД — можно проставить тут new Date().toISOString()
//     }
//
//     checkAbort()
//
//     // 6) UPDATE по id
//     const { data, error } = await supabase
//       .from('all_recipes_description')
//       .update(recipeToUpdate)
//       .eq('id', recipeData.id)
//       .select()
//       .single()
//
//     if (error) throw new Error(error.message || 'Supabase update error')
//     return data
//   } catch (err) {
//     throw err
//   }
// }
export async function updateRecipeTQ(
  totalRecipe,
  { signal, uploadFile = uploadImageSupabase, concurrency = 4 } = {},
) {
  const checkAbort = () => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  }
  const deep = (v) => JSON.parse(JSON.stringify(v))

  try {
    checkAbort()
    const recipe = deep(totalRecipe)
    if (!recipe?.id) throw new Error('Missing recipe id for update')

    const base = basePathForRecipe(recipe)

    // HEADER
    if (
      typeof recipe.image_header === 'string' &&
      recipe.image_header.startsWith('file://')
    ) {
      const ext = recipe.image_header.split('.').pop()?.toLowerCase() || 'jpg'
      const headerPath = `${base}/header.${ext}`
      const up = await uploadFile(headerPath, recipe.image_header, {
        signal,
        upsert: true,
      })
      if (!up?.success) throw new Error(up?.msg || 'Header upload failed')
      recipe.image_header = up.path
    } else if (typeof recipe.image_header === 'string') {
      recipe.image_header = normalizeToStoragePath(recipe.image_header)
    } else {
      recipe.image_header = null
    }

    // INSTRUCTIONS
    let idx = 1
    if (Array.isArray(recipe.instructions)) {
      recipe.instructions = await Promise.all(
        recipe.instructions.map(async (step) => {
          if (!Array.isArray(step?.images)) return step
          const out = []
          for (const img of step.images) {
            if (typeof img !== 'string') continue
            if (img.startsWith('file://')) {
              const ext = img.split('.').pop()?.toLowerCase() || 'jpg'
              const path = `${base}/${idx++}.${ext}`
              const up = await uploadFile(path, img, { signal, upsert: true })
              if (up?.success) out.push(up.path)
            } else {
              out.push(normalizeToStoragePath(img) || img)
            }
          }
          return { ...step, images: out }
        }),
      )
    }

    const payload = {
      category: recipe.category ?? null,
      category_id: recipe.category_id ?? null,
      image_header: recipe.image_header ?? null,
      area: recipe.area ?? {},
      title: recipe.title ?? {},
      rating: Number(recipe.rating || 0),
      likes: Number(recipe.likes || 0),
      comments: Number(recipe.comments || 0),
      recipe_metrics: recipe.recipe_metrics ?? {
        time: 0,
        serv: 0,
        cal: 0,
        level: 'easy',
      },
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      video: recipe.video ?? null,
      social_links: recipe.social_links ?? {
        facebook: null,
        instagram: null,
        tiktok: null,
      },
      source_reference: recipe.source_reference ?? null,
      tags: Array.isArray(recipe.tags) ? recipe.tags : [],
      published_id: recipe.published_id ?? null,
      published_user: recipe.published_user ?? null,
      point: recipe.point ?? null,
      link_copyright: recipe.link_copyright ?? null,
      map_coordinates: recipe.map_coordinates ?? null,
    }

    const { data, error } = await supabase
      .from('all_recipes_description')
      .update(payload)
      .eq('id', recipe.id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  } catch (e) {
    throw e
  }
}
