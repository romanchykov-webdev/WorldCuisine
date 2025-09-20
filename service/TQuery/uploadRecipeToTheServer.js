import { supabase } from '../../lib/supabase'
import { uploadImageSupabase } from './uploadImageSupabase'
import { basePathForRecipe } from '../../helpers/pathFileHelpers'
import { normalizeToStoragePath } from '../../utils/storage'

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
