export function isEqualMetrics(a, b) {
  if (!a && !b) return true
  if (!a || !b) return false
  return (
    Number(a.time) === Number(b.time) &&
    Number(a.serv) === Number(b.serv) &&
    Number(a.cal) === Number(b.cal) &&
    String(a.level || '').toLowerCase() === String(b.level || '').toLowerCase()
  )
}
