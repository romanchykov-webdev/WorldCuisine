import { supabase } from '../../lib/supabase'

/**
 *
 * @returns {Promise<GetResult<any, any, "measurement", R | unknown, "lang">[] extends infer ResultOne[] ? ResultOne : never>}
 */
export async function getMeasurementTQ() {
  //
  let { data, error } = await supabase.from('measurement').select('lang').maybeSingle()

  if (error) {
    throw new Error(`getMeasurementTQ: ${error.message}`)
  }

  return data?.lang ?? {}
}
