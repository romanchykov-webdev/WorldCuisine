export function truncateText(text, maxLength, addEllipsis = false) {
  if (text.length <= maxLength) return text
  return addEllipsis ? text.slice(0, maxLength) + '…' : text.slice(0, maxLength)
}
