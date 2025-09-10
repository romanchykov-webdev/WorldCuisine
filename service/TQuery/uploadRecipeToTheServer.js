import { supabase } from '../../lib/supabase'
import { uploadImageTQ } from './uploadImageTQ'
import { uploadImageSupabase } from './uploadImageSupabase'
import { basePathForRecipe } from '../../helpers/pathFileHelpers'
import { normalizeToStoragePath } from '../../utils/storage'

/**
 * Загрузка рецепта на сервер (совместимо с TanStack Query).
 * Кидает исключение при ошибке, чтобы onError в useMutation сработал.
 *
 * @param {object} totalRecipe
 * @param {{
 *   signal?: AbortSignal,
 *   uploadFile?: (filePath:string, fileUri:string, oldFilePath?:string, opts?:{signal?:AbortSignal, deleteFile?:Function}) => Promise<{success:boolean,data?:string,msg?:string}>,
 *   deleteFile?: (path:string)=>Promise<{success:boolean,msg?:string}>,
 *   concurrency?: number
 * }} options
 * @returns {Promise<object>} вставленная строка из БД
 */
// export async function uploadRecipeToTheServerTQ(
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
//   // безопасно достаем расширение, без query/hash
//   const getExt = (pathOrUri, fallback = 'jpg') => {
//     if (!pathOrUri) return fallback
//     const clean = String(pathOrUri).split('?')[0].split('#')[0]
//     const dot = clean.lastIndexOf('.')
//     if (dot === -1) return fallback
//     return clean.slice(dot + 1).toLowerCase() || fallback
//   }
//
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
//     const uniqueId = recipe.id || Date.now().toString(36)
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
//     const baseImagePath = pathBase(recipeData)
//
//     // 1) header image (если локальный файл)
//     if (
//       recipeData.image_header &&
//       typeof recipeData.image_header === 'string' &&
//       recipeData.image_header.startsWith('file://')
//     ) {
//       checkAbort()
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
//     // 3) параллельная загрузка (ограниченный пул)
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
//     if (tasks.length) {
//       await runInBatches(tasks, Math.max(1, Math.min(8, concurrency)))
//     }
//
//     // 4) заменить file:// на URL в instructions
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
//     // 5) финальный объект
//     const recipeToInsert = {
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
//     }
//
//     checkAbort()
//
//     // 6) вставка в supabase
//     const { data, error } = await supabase
//       .from('all_recipes_description')
//       .insert([recipeToInsert])
//       .select()
//       .single()
//
//     if (error) throw new Error(error.message || 'Supabase insert error')
//     return data
//   } catch (err) {
//     throw err
//   }
// }

// export async function uploadRecipeToTheServerTQ(
//   totalRecipe,
//   { signal, uploadFile = uploadImageSupabase, concurrency = 4 } = {},
// ) {
//   const checkAbort = () => {
//     if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
//   }
//   const deep = (v) => JSON.parse(JSON.stringify(v))
//
//   try {
//     checkAbort()
//     const recipe = deep(totalRecipe)
//     const base = basePathForRecipe(recipe)
//
//     // HEADER: если локальный file:// → грузим в `${base}/header.ext`
//     if (
//       typeof recipe.image_header === 'string' &&
//       recipe.image_header.startsWith('file://')
//     ) {
//       const ext = recipe.image_header.split('.').pop()?.toLowerCase() || 'jpg'
//       const headerPath = `${base}/header.${ext}`
//       const up = await uploadFile(headerPath, recipe.image_header, {
//         signal,
//         upsert: true,
//       })
//       if (!up?.success) throw new Error(up?.msg || 'Header upload failed')
//       recipe.image_header = up.path // Сохраняем ОТНОСИТЕЛЬНЫЙ путь
//     } else if (typeof recipe.image_header === 'string') {
//       // нормализуем если вдруг полный URL
//       recipe.image_header = normalizeToStoragePath(recipe.image_header)
//     } else {
//       recipe.image_header = null
//     }
//
//     // INSTRUCTIONS images: заменяем все file:// на загруженные path
//     let idx = 1
//     if (Array.isArray(recipe.instructions)) {
//       recipe.instructions = await Promise.all(
//         recipe.instructions.map(async (step) => {
//           if (!Array.isArray(step?.images)) return step
//           const out = []
//           for (const img of step.images) {
//             if (typeof img !== 'string') continue
//             if (img.startsWith('file://')) {
//               const ext = img.split('.').pop()?.toLowerCase() || 'jpg'
//               const path = `${base}/${idx++}.${ext}`
//               const up = await uploadFile(path, img, { signal, upsert: true })
//               if (up?.success) out.push(up.path)
//             } else {
//               // уже хранится как URL/путь
//               out.push(normalizeToStoragePath(img) || img)
//             }
//           }
//           return { ...step, images: out }
//         }),
//       )
//     }
//
//     // payload в БД (храним пути!)
//     const payload = {
//       category: recipe.category ?? null,
//       category_id: recipe.category_id ?? null,
//       image_header: recipe.image_header ?? null,
//       area: recipe.area ?? {},
//       title: recipe.title ?? {},
//       rating: Number(recipe.rating || 0),
//       likes: Number(recipe.likes || 0),
//       comments: Number(recipe.comments || 0),
//       recipe_metrics: recipe.recipe_metrics ?? {
//         time: 0,
//         serv: 0,
//         cal: 0,
//         level: 'easy',
//       },
//       ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
//       instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
//       video: recipe.video ?? null,
//       social_links: recipe.social_links ?? {
//         facebook: null,
//         instagram: null,
//         tiktok: null,
//       },
//       source_reference: recipe.source_reference ?? null,
//       tags: Array.isArray(recipe.tags) ? recipe.tags : [],
//       published_id: recipe.published_id ?? null,
//       published_user: recipe.published_user ?? null,
//       point: recipe.point ?? null,
//       link_copyright: recipe.link_copyright ?? null,
//       map_coordinates: recipe.map_coordinates ?? null,
//     }
//
//     const { data, error } = await supabase
//       .from('all_recipes_description')
//       .insert([payload])
//       .select()
//       .single()
//
//     if (error) throw new Error(error.message)
//     return data
//   } catch (e) {
//     throw e
//   }
// }

export async function uploadRecipeToTheServerTQ(
  totalRecipe,
  { signal, uploadFile = uploadImageSupabase } = {},
) {
  const checkAbort = () => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  }
  const deep = (v) => JSON.parse(JSON.stringify(v))

  try {
    checkAbort()
    const draft = deep(totalRecipe)

    // 1) Черновая вставка БЕЗ картинок — чтобы получить id
    const initialPayload = {
      category: draft.category ?? null,
      category_id: draft.category_id ?? null,
      image_header: null, // пока пусто
      area: draft.area ?? {},
      title: draft.title ?? {},
      rating: Number(draft.rating || 0),
      likes: Number(draft.likes || 0),
      comments: Number(draft.comments || 0),
      recipe_metrics: draft.recipe_metrics ?? { time: 0, serv: 0, cal: 0, level: 'easy' },
      ingredients: Array.isArray(draft.ingredients) ? draft.ingredients : [],
      instructions: Array.isArray(draft.instructions) ? draft.instructions : [],
      video: draft.video ?? null,
      social_links: draft.social_links ?? {
        facebook: null,
        instagram: null,
        tiktok: null,
      },
      source_reference: draft.source_reference ?? null,
      tags: Array.isArray(draft.tags) ? draft.tags : [],
      published_id: draft.published_id ?? null,
      published_user: draft.published_user ?? null,
      point: draft.point ?? null,
      link_copyright: draft.link_copyright ?? null,
      map_coordinates: draft.map_coordinates ?? null,
    }

    const { data: inserted, error: insErr } = await supabase
      .from('all_recipes_description')
      .insert([initialPayload])
      .select()
      .single()
    if (insErr) throw new Error(insErr.message)

    // 2) Теперь у нас есть real id → строим base со 100% правильным путём
    const recipeWithId = { ...draft, id: inserted.id }
    const base = basePathForRecipe(recipeWithId) // recipes_images/cat/sub/user/REAL_ID

    // 2.1) HEADER
    let headerPath = null
    if (
      typeof draft.image_header === 'string' &&
      draft.image_header.startsWith('file://')
    ) {
      const ext = draft.image_header.split('.').pop()?.toLowerCase() || 'jpg'
      const path = `${base}/header.${ext}`
      const up = await uploadFile(path, draft.image_header, { signal, upsert: true })
      if (!up?.success) throw new Error(up?.msg || 'Header upload failed')
      headerPath = up.path // относительный путь
    } else if (typeof draft.image_header === 'string') {
      headerPath = normalizeToStoragePath(draft.image_header)
    }

    // 2.2) INSTRUCTIONS
    let idx = 1
    let instructions = draft.instructions
    if (Array.isArray(draft.instructions)) {
      instructions = await Promise.all(
        draft.instructions.map(async (step) => {
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

    // 3) Финальный UPDATE той же записи с путями
    const finalPayload = {
      ...initialPayload,
      image_header: headerPath ?? null,
      instructions,
    }

    const { data: updated, error: updErr } = await supabase
      .from('all_recipes_description')
      .update(finalPayload)
      .eq('id', inserted.id)
      .select()
      .single()
    if (updErr) throw new Error(updErr.message)

    return updated
  } catch (e) {
    throw e
  }
}
