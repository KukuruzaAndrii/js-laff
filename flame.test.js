const { test, expect } = require('@jest/globals')

const { part2x1, repart2x1to3x1, cont3x1to2x1 } = require('./flame.js')

const empty = []
const a = [1, 2, 3, 4, 5]

test('part2x1', () => {
  expect(() => part2x1(empty, 0, 'wrongSide')).toThrow()
  expect(part2x1(empty, 0)).toEqual([[], []])
  expect(part2x1(empty, 1)).toEqual([[], []])
  expect(part2x1([1], 1)).toEqual([[1], []])
  expect(part2x1(a, 0)).toEqual([[], a])
  expect(part2x1(a, 1)).toEqual([[1], [2, 3, 4, 5]])
  expect(part2x1(a, 4)).toEqual([[1, 2, 3, 4], [5]])
  expect(part2x1(a, 5)).toEqual([[1, 2, 3, 4, 5], []])
  expect(part2x1(a, 6)).toEqual([[1, 2, 3, 4, 5], []])
  expect(part2x1(empty, 0, 'right')).toEqual([[], []])
  expect(part2x1(empty, 1, 'right')).toEqual([[], []])
  expect(part2x1([1], 1, 'right')).toEqual([[], [1]])
  expect(part2x1(a, 0, 'right')).toEqual([a, []])
  expect(part2x1(a, 1, 'right')).toEqual([[1, 2, 3, 4], [5]])
  expect(part2x1(a, 4, 'right')).toEqual([[1], [2, 3, 4, 5]])
  expect(part2x1(a, 5, 'right')).toEqual([[], [1, 2, 3, 4, 5]])
  expect(part2x1(a, 6, 'right')).toEqual([[], [1, 2, 3, 4, 5]])
})

test('repart2x1to3x1', () => {
  expect(() => repart2x1to3x1([], [], 0, 'wrongSide')).toThrow()
  expect(repart2x1to3x1([], [], 0)).toEqual([[], [], []])
  expect(repart2x1to3x1([], [], 0, 'right')).toEqual([[], [], []])
  expect(repart2x1to3x1([1], [], 1)).toEqual([[], [1], []])
  expect(repart2x1to3x1([1], [], 1, 'right')).toEqual([[1], [], []])
  expect(repart2x1to3x1([1, 2], [], 1)).toEqual([[1], [2], []])
  expect(repart2x1to3x1([1, 2], [1], 1)).toEqual([[1], [2], [1]])
  expect(repart2x1to3x1([1, 2], [1], 1, 'right')).toEqual([[1, 2], [1], []])
  expect(repart2x1to3x1([1, 2], [3, 4], 1)).toEqual([[1], [2], [3, 4]])
  expect(repart2x1to3x1([1, 2], [3, 4], 1, 'right')).toEqual([[1, 2], [3], [4]])
  expect(repart2x1to3x1([1, 2, 3, 4], [5, 6], 3)).toEqual([[1], [2, 3, 4], [5, 6]])
  expect(repart2x1to3x1([1, 2, 3, 4], [5, 6], 3, 'right')).toEqual([[1, 2, 3, 4], [5, 6], []])
})

test('cont3x1to2x1', () => {
  expect(() => cont3x1to2x1([], [], [], 'wrongSide')).toThrow()
  expect(cont3x1to2x1([], [], [])).toEqual([[], []])
  expect(cont3x1to2x1([], [], [], 'right')).toEqual([[], []])
  expect(cont3x1to2x1([1], [], [2])).toEqual([[1], [2]])
  expect(cont3x1to2x1([1], [], [2], 'right')).toEqual([[1], [2]])
  expect(cont3x1to2x1([1, 2], [3], [4, 5])).toEqual([[1, 2, 3], [4, 5]])
  expect(cont3x1to2x1([1, 2], [3], [4, 5], 'right')).toEqual([[1, 2], [3, 4, 5]])
  expect(cont3x1to2x1([1, 2], [3, 4], [5, 6])).toEqual([[1, 2, 3, 4], [5, 6]])
  expect(cont3x1to2x1([1, 2], [3, 4], [5, 6], 'right')).toEqual([[1, 2], [3, 4, 5, 6]])
})
