import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

import en from './en/index.js'
import es from './es/index.js'
import it from './it/index.js'
import ru from './ru/index.js'
import ua from './ua/index.js'

const translations = { en, es, it, ru, ua, uk: ua }

const i18n = new I18n(translations)

const device = getLocales?.()[0]
const raw = (device?.languageTag || device?.languageCode || 'en').toLowerCase()
const base = raw.includes('-') ? raw.split('-')[0] : raw
const norm = base === 'ua' ? 'uk' : base

i18n.locale = translations[norm] ? norm : 'en'
i18n.defaultLocale = 'en'
i18n.enableFallback = true

export default i18n
