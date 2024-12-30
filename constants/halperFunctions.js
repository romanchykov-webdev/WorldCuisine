// Функция для форматирования чисел  1299 in 1.2K
export const myFormatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; // Убирает ".0" для целых чисел
    }
    return num.toString(); // Возвращает число как строку, если меньше 1000
};

// Функция для форматирования date
export const formatDateTime = (isoDateString) => {
    const date = new Date(isoDateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы в JS начинаются с 0
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
};