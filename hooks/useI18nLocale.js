import { useEffect } from 'react'
import i18n from '../lang/i18n'
import { useLangStore } from '../stores/langStore'

export function useI18nLocale() {
  const lang = useLangStore((s) => s.lang)
  useEffect(() => {
    i18n.locale = lang
  }, [lang])
}
