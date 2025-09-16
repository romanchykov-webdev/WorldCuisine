// import { QueryClient } from '@tanstack/react-query'
//
// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       // подойдёт для RN
//       staleTime: 30 * 1000,
//       gcTime: 5 * 60 * 1000,
//       retry: 1,
//       refetchOnWindowFocus: false,
//       refetchOnReconnect: true,
//     },
//     mutations: {
//       retry: 0,
//     },
//   },
// })
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 15_000,
      gcTime: 5 * 60_000,
    },
  },
})
