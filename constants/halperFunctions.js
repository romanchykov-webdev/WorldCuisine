// Функция для форматирования чисел  1299 in 1.2K
export const myFormatNumber = (num) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'; // Убирает ".0" для целых чисел
    }
    return num.toString(); // Возвращает число как строку, если меньше 1000
};