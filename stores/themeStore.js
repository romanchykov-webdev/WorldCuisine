import { create } from 'zustand'
import { Appearance } from 'react-native'

export const useThemeStore = create((set, get) => ({
  currentTheme: 'light', // реальная тема, применённая сейчас
  preferredTheme: 'auto', // выбор пользователя: 'light' | 'dark' | 'auto'
  setPreferredTheme: (pref) => set({ preferredTheme: pref }),
  applyTheme: () => {
    const pref = get().preferredTheme
    if (pref === 'auto') {
      const device = Appearance.getColorScheme() || 'light'
      set({ currentTheme: device })
    } else {
      set({ currentTheme: pref })
    }
  },
}))
