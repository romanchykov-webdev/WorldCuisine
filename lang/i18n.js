import { getLocales } from 'expo-localization'
import { I18n } from 'i18n-js'

// Импорт файлов переводов
import en from './en.json'
import es from './es.json'
import it from './it.json'
import ru from './ru.json'
import ua from './ua.json'

// Определите переводы для каждого языка
const translations = {
  en,
  ru,
  es,
  it,
  ua,
  uk: ua,
}

// Инициализируйте i18n
const i18n = new I18n(translations)
// 2) Нормализуем локаль устройства
const device = getLocales?.()[0]
const raw = (device?.languageTag || device?.languageCode || 'en').toLowerCase()
// en-US -> en
const base = raw.includes('-') ? raw.split('-')[0] : raw

// 3) Маппинг нестандартных кодов (если вдруг где-то придёт "ua")
const norm = base === 'ua' ? 'uk' : base

// 4) Применяем
i18n.locale = translations[norm] ? norm : 'en'
i18n.defaultLocale = 'en'
i18n.enableFallback = true

export default i18n
//
// // Установите язык устройства как текущий язык приложения
// // i18n.locale = getLocales()[0].languageCode || 'en';
// // i18n.locale = 'en';
// //
// // // Включите fallback для пропущенных ключей
// // i18n.enableFallback = true;
//
// // Получаем язык устройства
// const deviceLocale = getLocales()[0]?.languageCode || 'en' // Используем fallback на 'en' если язык не определен
//
// // Устанавливаем язык устройства как текущий язык приложения
// i18n.locale = deviceLocale
//
// // // Выводим текущий язык в терминал
// // console.log('Device Language:', deviceLocale);
//
// // Включаем fallback для пропущенных ключей
// i18n.enableFallback = true
//
// export default i18n
