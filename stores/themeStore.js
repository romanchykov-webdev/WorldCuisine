import { create } from 'zustand'
import { Appearance } from 'react-native'
import { getTheme } from '../constants/themes'

const getSystemTheme = () => Appearance.getColorScheme() || 'light'

export const useThemeStore = create((set, get) => ({
  // ИНИЦИАЛИЗИРУЕМСЯ от системы, а не 'light'
  currentTheme: getSystemTheme(), // 'light' | 'dark'
  preferredTheme: 'auto', // 'light' | 'dark' | 'auto'

  setPreferredTheme: (pref) => {
    set({ preferredTheme: pref })
    // сразу применяем
    const next = pref === 'auto' ? getSystemTheme() : pref
    set({ currentTheme: next })
  },

  applyTheme: () => {
    const pref = get().preferredTheme
    const next = pref === 'auto' ? getSystemTheme() : pref
    set({ currentTheme: next })
  },

  // Подписка на изменение системной темы (когда включён auto)
  subscribeToSystemTheme: () => {
    const listener = Appearance.addChangeListener(() => {
      const pref = get().preferredTheme
      if (pref === 'auto') {
        const next = getSystemTheme()
        set({ currentTheme: next })
      }
    })
    // вернуть функция для отписки
    return () => listener.remove()
  },
}))

// Хук-палитра
export const useThemeColors = () => {
  const mode = useThemeStore((s) => s.currentTheme)
  return getTheme(mode)
}
