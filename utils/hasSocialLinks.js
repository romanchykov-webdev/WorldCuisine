export function hasSocialLinks(links) {
  if (!links || typeof links !== 'object') return false
  const keys = ['facebook', 'tiktok', 'instagram', 'youtube', 'twitter', 'x']
  return keys.some((k) => {
    const v = links[k]
    if (v == null) return false
    if (typeof v === 'string') return v.trim().length > 0
    // на случай, если придёт объект/массив
    return Boolean(v)
  })
}
