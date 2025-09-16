import { useEffect } from 'react'
import { QueryClientProvider, focusManager } from '@tanstack/react-query'
import { AppState } from 'react-native'

export default function Providers({ client, children }) {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      focusManager.setFocused(state === 'active')
    })
    return () => {
      if (sub && typeof sub.remove === 'function') sub.remove()
    }
  }, [])

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
