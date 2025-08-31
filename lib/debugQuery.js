import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useLogQueries(tag = 'RQ') {
  const qc = useQueryClient()
  useEffect(() => {
    const unsub = qc.getQueryCache().subscribe((event) => {
      console.log(`[${tag}]`, event?.type, event?.query?.queryKey, event)
    })
    return unsub
  }, [qc, tag])
}
// if (__DEV__) useLogQueries('home')
