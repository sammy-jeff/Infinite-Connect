import { timeAgo, toDate } from './timeAgo'

const ago = (seconds) => new Date(Date.now() - seconds * 1000)

test.each([
  [10, 'now'],
  [50, '1m'],
  [5 * 60, '5m'],
  [3 * 3600, '3h'],
  [2 * 86400, '2d'],
  [15 * 86400, '2w'],
  [70 * 86400, '2mo'],
  [800 * 86400, '2y'],
])('%is ago renders as %s', (seconds, label) => {
  expect(timeAgo(ago(seconds))).toBe(label)
})

test('accepts Firestore timestamps and ignores missing values', () => {
  const date = ago(7200)
  expect(timeAgo({ toDate: () => date })).toBe('2h')
  expect(timeAgo(undefined)).toBe('')
  expect(toDate(null)).toBeNull()
})
