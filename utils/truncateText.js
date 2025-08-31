export function truncateText(text, maxLength = 0, addEllipsis = false) {
  // Приводим к строке и страхуемся от null/undefined/чисел/объектов
  const s = text == null ? '' : String(text)

  // если maxLength невалидный — просто вернём строку как есть
  if (!Number.isFinite(maxLength) || maxLength <= 0) return s

  if (s.length <= maxLength) return s
  return s.slice(0, maxLength) + (addEllipsis ? '…' : '')
}
