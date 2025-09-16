// utils/numberFormat.js

/**
 * Форматирует число в компактный вид:
 *  - 1299 -> "1.3K"
 *  - 1250000 -> "1.25M" (при decimals=2)
 *  - -1500 -> "-1.5K"
 *
 * @param {number|string} value
 * @param {{decimals?: number, smallWithSeparators?: boolean}} [opts]
 *  - decimals: количество знаков после запятой для компактной записи (по умолчанию 1)
 *  - smallWithSeparators: для чисел < 1000 добавлять разделители тысяч (по умолчанию false)
 */
let compactFmt
try {
  compactFmt = new Intl.NumberFormat(undefined, {
    notation: 'compact',
    maximumFractionDigits: 1,
  })
} catch {
  compactFmt = null
}

/**
 * 1299 -> "1.3K"
 * 1200000 -> "1.2M"
 */
// export function formatNumber(input) {
//   const n = typeof input === 'number' ? input : Number(input)
//   if (!Number.isFinite(n)) return '0'
//
//   if (compactFmt) return compactFmt.format(n)
//
//   if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
//   if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`
//   return String(n)
// }
export function formatNumber(value, opts = {}) {
  const { decimals = 1, smallWithSeparators = false } = opts

  // нормализация
  const n = Number(value)
  if (!Number.isFinite(n)) return '0'

  const sign = n < 0 ? '-' : ''
  let num = Math.abs(n)

  // суффиксы и пороги
  const units = ['', 'K', 'M', 'B', 'T']
  let unitIndex = 0

  while (num >= 1000 && unitIndex < units.length - 1) {
    num /= 1000
    unitIndex++
  }

  // форматирование числа с указанной точностью
  let str =
    unitIndex === 0
      ? String(Math.round(num)) // для < 1000 по умолчанию без дробной части
      : num.toFixed(decimals)

  // убираем лишние нули у дробной части (".0", ".00" и т.п.)
  if (str.includes('.')) {
    str = str.replace(/\.?0+$/, '') // "1.0" -> "1", "1.20" -> "1.2"
  }

  // для малых чисел можно включить разделители тысяч
  if (unitIndex === 0 && smallWithSeparators) {
    // простая вставка разделителей (пробелы) для целых
    str = Number(str).toLocaleString(undefined, { maximumFractionDigits: 0 })
  }

  return sign + str + units[unitIndex]
}
