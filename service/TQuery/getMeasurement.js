import { supabase } from '../../lib/supabase'

/**
 *
 * @returns {Promise<*|{}>}
 */
export async function getMeasurementTQ() {
  //
  let { data, error } = await supabase.from('measurement').select('lang').single() //.maybeSingle()

  if (error) {
    throw new Error(`getMeasurementTQ: ${error.message}`)
  }

  return data?.lang ?? {}
}
