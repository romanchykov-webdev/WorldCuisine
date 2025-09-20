import { supabase } from '../../lib/supabase'
import { uploadImageSupabase } from './uploadImageSupabase'
import { basePathForRecipe } from '../../helpers/pathFileHelpers'
import { normalizeToStoragePath } from '../../utils/storage'

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
