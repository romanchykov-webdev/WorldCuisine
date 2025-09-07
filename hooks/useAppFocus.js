import { useEffect } from 'react'
import { AppState } from 'react-native'
import { focusManager } from '@tanstack/react-query'

export function useAppFocus() {
  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      focusManager.setFocused(status === 'active')
    })
    return () => sub.remove()
  }, [])
}
