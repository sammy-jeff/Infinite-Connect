// Lightweight replacement for moment's fromNow(): renders compact labels like
// "now", "5m", "3h", "2d", "4w" without shipping the ~70kb moment bundle.
const UNITS = [
  ['y', 31536000],
  ['mo', 2592000],
  ['w', 604800],
  ['d', 86400],
  ['h', 3600],
  ['m', 60],
]

export function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  return null
}

export function timeAgo(value) {
  const date = toDate(value)
  if (!date) return ''
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000)
  if (seconds < 45) return 'now'
  for (const [label, size] of UNITS) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label}`
  }
  return '1m'
}

export function fullDate(value, options) {
  const date = toDate(value)
  return date ? date.toLocaleString(undefined, options) : ''
}
