// stores/langStore.js
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'

//языки  в /lang/*.json
const SUPPORTED = ['en', 'ru', 'it', 'ua', 'es']

// маппинг и нормализация кодов (например, uk -> ua)
function normalizeLang(code) {
  if (!code) return 'en'
  const c = code.toLowerCase()
  const map = { uk: 'ua', 'pt-br': 'pt', 'zh-hans': 'zh', 'zh-hant': 'zh' }
  const short = c.split('-')[0] // 'en-US' -> 'en'
  const candidate = map[c] || map[short] || short
  return SUPPORTED.includes(candidate) ? candidate : 'en'
}

export const getDeviceLang = () => {
  const locales = Localization.getLocales?.()
  const code = locales && locales.length ? locales[0].languageCode || locales[0].languageTag : 'en'
  const short = String(code).toLowerCase().split('-')[0]
  const map = { uk: 'ua' }
  const normalized = map[short] || short
  return ['en', 'ru', 'it', 'ua', 'es'].includes(normalized) ? normalized : 'en'
}

export const useLangStore = create(
  persist(
    (set, get) => ({
      // инициализируемся от языка устройства,
      lang: getDeviceLang(),
      setLang: (lang) => set({ lang: normalizeLang(lang) }),
    }),
    {
      name: 'lang-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
