import { act, renderHook } from '@testing-library/react'
import { onSnapshot } from 'firebase/firestore'
import useLiveQuery from './useLiveQuery'

jest.mock('firebase/firestore', () => ({
  query: (base, lim) => ({ base, limit: lim.n }),
  limit: (n) => ({ n }),
  onSnapshot: jest.fn(),
}))

// minimal stand-in for a Firestore QuerySnapshot
const snapshot = (docs, { changed = docs.map((d) => d.id), fromCache = false } = {}) => ({
  docs: docs.map((d) => ({ id: d.id, data: () => ({ ...d }) })),
  size: docs.length,
  metadata: { fromCache },
  docChanges: () => changed.map((id) => ({ doc: { id } })),
})

const docs = (n) => Array.from({ length: n }, (_, i) => ({ id: `d${i}`, n: i }))

let listeners
beforeEach(() => {
  listeners = []
  onSnapshot.mockReset()
  onSnapshot.mockImplementation((q, next) => {
    const entry = { q, next, active: true }
    listeners.push(entry)
    return () => {
      entry.active = false
    }
  })
})
const latest = () => listeners[listeners.length - 1]
const buildQuery = () => 'base'

test('loads the first page and reports more pages', () => {
  const { result } = renderHook(() => useLiveQuery('posts', buildQuery, 2))
  expect(result.current.initialLoading).toBe(true)
  expect(latest().q.limit).toBe(2)

  act(() => latest().next(snapshot(docs(2))))
  expect(result.current.initialLoading).toBe(false)
  expect(result.current.loading).toBe(false)
  expect(result.current.items.map((d) => d.id)).toEqual(['d0', 'd1'])
  expect(result.current.hasMore).toBe(true)
})

test('loadMore swaps to a single larger listener and keeps items meanwhile', () => {
  const { result } = renderHook(() => useLiveQuery('posts', buildQuery, 2))
  act(() => latest().next(snapshot(docs(2))))
  act(() => result.current.loadMore())

  expect(listeners).toHaveLength(2)
  expect(listeners[0].active).toBe(false)
  expect(latest().q.limit).toBe(4)
  expect(result.current.loading).toBe(true)
  expect(result.current.items).toHaveLength(2)

  act(() => latest().next(snapshot(docs(3))))
  expect(result.current.loading).toBe(false)
  expect(result.current.items).toHaveLength(3)
  expect(result.current.hasMore).toBe(false)
})

test('unchanged documents keep their object identity', () => {
  const { result } = renderHook(() => useLiveQuery('posts', buildQuery, 5))
  act(() => latest().next(snapshot(docs(3))))
  const [first, second] = result.current.items

  act(() => latest().next(snapshot(docs(3), { changed: ['d1'] })))
  expect(result.current.items[0]).toBe(first)
  expect(result.current.items[1]).not.toBe(second)
})

test('a partial cache snapshot does not settle the page', () => {
  const { result } = renderHook(() => useLiveQuery('posts', buildQuery, 2))
  act(() => latest().next(snapshot(docs(2))))
  act(() => result.current.loadMore())
  act(() => latest().next(snapshot(docs(2), { fromCache: true })))

  expect(result.current.loading).toBe(true)
  expect(result.current.hasMore).toBe(true)

  act(() => latest().next(snapshot(docs(4))))
  expect(result.current.loading).toBe(false)
  expect(result.current.items).toHaveLength(4)
})

test('changing the key resets the window and hides stale items', () => {
  const { result, rerender } = renderHook(
    ({ key }) => useLiveQuery(key, buildQuery, 2),
    { initialProps: { key: 'chat-a' } }
  )
  act(() => latest().next(snapshot(docs(2))))
  act(() => result.current.loadMore())

  rerender({ key: 'chat-b' })
  expect(result.current.items).toEqual([])
  expect(result.current.initialLoading).toBe(true)
  expect(latest().q.limit).toBe(2)
})

test('a falsy key disables the query', () => {
  const { result } = renderHook(() => useLiveQuery(null, buildQuery, 2))
  expect(onSnapshot).not.toHaveBeenCalled()
  expect(result.current.loading).toBe(false)
  expect(result.current.items).toEqual([])
})
