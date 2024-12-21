import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';

// Импорт файлов переводов
import en from './en.json';
import ru from './ru.json';
import es from './es.json';
import it from './it.json';
import ua from './ua.json';

// Определите переводы для каждого языка
const translations = {
    en,
    ru,
    es,
    it,
    ua,
};

// Инициализируйте i18n
const i18n = new I18n(translations);

// Установите язык устройства как текущий язык приложения
// i18n.locale = getLocales()[0].languageCode || 'en';
i18n.locale = 'en';

// Включите fallback для пропущенных ключей
i18n.enableFallback = true;

export default i18n;
