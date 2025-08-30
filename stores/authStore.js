import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      language: 'en',
      requiredFields: false,
      previewRecipeReady: false,

      setAuth: (user) => set({ user }),
      setUserData: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
      signOutLocal: () => set({ user: null }),

      setLanguage: (lang) => set({ language: lang }),
      setRequiredFields: (val) => set({ requiredFields: val }),
      setPreviewRecipeReady: (val) => set({ previewRecipeReady: val }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        user: s.user,
        language: s.language,
        requiredFields: s.requiredFields,
        previewRecipeReady: s.previewRecipeReady,
      }),
    },
  ),
)
