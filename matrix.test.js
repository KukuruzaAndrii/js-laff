const { test, expect } = require('@jest/globals')

const { M, V, xyToi, hasSameRowsCount, hasSameColsCount, hasSameSize, generate } = require('./matrix')
test('Vector', () => {
  expect(V([])).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(V([1])).toEqual({ elements: [1], rows: 1, cols: 1 })
  expect(V([1, 2])).toEqual({ elements: [1, 2], rows: 2, cols: 1 })
  expect(V([1, 2, 3])).toEqual({ elements: [1, 2, 3], rows: 3, cols: 1 })
})

test('matrix', () => {
  expect(M([])).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 0)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 0, 0)).toEqual({ elements: [], rows: 0, cols: 0 })
  // expect(M([], 1)).toEqual({ elements: [], rows: 1, cols: 0 })
  // expect(M([], 1, 0)).toEqual({ elements: [], rows: 1, cols: 0 })
  // expect(M([], 2)).toEqual({ elements: [], rows: 2, cols: 0 })
  expect(M([], 1)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 1, 0)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 2)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 2, 0)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 0, 1)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(M([], 0, 2)).toEqual({ elements: [], rows: 0, cols: 0 })
  // expect(M([], 2, 0)).toEqual({ elements: [], rows: 2, cols: 0 })
  // expect(M([], 0, 1)).toEqual({ elements: [], rows: 0, cols: 1 })
  // expect(M([], 0, 2)).toEqual({ elements: [], rows: 0, cols: 2 })

  // expect(() => M([], 1, 1)).toThrow()

  expect(M([1])).toEqual({ elements: [1], rows: 1, cols: 1 })
  expect(M([1], 1)).toEqual({ elements: [1], rows: 1, cols: 1 })
  expect(M([1], 1, 1)).toEqual({ elements: [1], rows: 1, cols: 1 })
  expect(() => M([1], 0)).toThrow()
  expect(() => M([1], 1, 0)).toThrow()
  expect(M([1])).toEqual({ elements: [1], rows: 1, cols: 1 })

  expect(M([1, 2])).toEqual({ elements: [1, 2], rows: 2, cols: 1 })
  expect(M([1, 2], 2)).toEqual({ elements: [1, 2], rows: 2, cols: 1 })
  expect(M([1, 2], 2, 1)).toEqual({ elements: [1, 2], rows: 2, cols: 1 })
  expect(M([1, 2], 1)).toEqual({ elements: [1, 2], rows: 1, cols: 2 })
  expect(M([1, 2], 1, 2)).toEqual({ elements: [1, 2], rows: 1, cols: 2 })
  expect(() => M([1, 2], 0)).toThrow()
  expect(() => M([1, 2], 1, 0)).toThrow()
  expect(() => M([1, 2], 1, 1)).toThrow()
  expect(() => M([1, 2], 1, 1)).toThrow()
  expect(() => M([1, 2], 2, 2)).toThrow()
  expect(() => M([1, 2], 3, 1)).toThrow()
  expect(() => M([1, 2], 1, 3)).toThrow()
  expect(M([1, 2, 3, 4, 5])).toEqual({ elements: [1, 2, 3, 4, 5], rows: 5, cols: 1 })
  expect(M([1, 2, 3, 4, 5], 5)).toEqual({ elements: [1, 2, 3, 4, 5], rows: 5, cols: 1 })
  expect(M([1, 2, 3, 4, 5], 1)).toEqual({ elements: [1, 2, 3, 4, 5], rows: 1, cols: 5 })
  expect(() => M([1, 2, 3, 4, 5], 2)).toThrow()
  expect(() => M([1, 2, 3, 4, 5], 3)).toThrow()
  expect(() => M([1, 2, 3, 4, 5], 4)).toThrow()
})

/*
0 3 6
1 4 7
2 5 8
*/
test('xyToi', () => {
  expect(xyToi(0, 0, 1)).toBe(0)
  expect(xyToi(0, 1, 1)).toBe(1)
  expect(xyToi(0, 2, 1)).toBe(2)
  expect(xyToi(0, 30, 1)).toBe(30)
  expect(xyToi(0, 0, 3)).toBe(0)
  expect(xyToi(1, 0, 3)).toBe(1)
  expect(xyToi(2, 0, 3)).toBe(2)
  expect(xyToi(0, 1, 3)).toBe(3)
  expect(xyToi(1, 1, 3)).toBe(4)
  expect(xyToi(2, 1, 3)).toBe(5)
  expect(xyToi(0, 2, 3)).toBe(6)
  expect(xyToi(1, 2, 3)).toBe(7)
  expect(xyToi(2, 2, 3)).toBe(8)
})

test('hasSameRowsCount', () => {
  expect(() => hasSameRowsCount(M([]))).not.toThrow()
  expect(() => hasSameRowsCount(M([1]))).not.toThrow()
  expect(() => hasSameRowsCount(M([]), M([]))).not.toThrow()
  expect(() => hasSameRowsCount(M([], 1), M([], 2))).not.toThrow()
  expect(() => hasSameRowsCount(M([], 1), M([1, 2], 2))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 1), M([], 2))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 1), M([3, 4], 1))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4], 2))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4, 5, 6], 2))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 1), M([3, 4, 5, 6], 2))).toThrow('different rows count')
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4, 5, 6], 1))).toThrow('different rows count')
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4], 1))).toThrow('different rows count')
  expect(() => hasSameRowsCount(M([]), M([]), M([]))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4, 5, 6], 2), M([7, 8]))).not.toThrow()
  expect(() => hasSameRowsCount(M([1, 2], 1), M([3, 4, 5, 6], 2), M([7, 8]))).toThrow('different rows count')
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4, 5, 6], 1), M([7, 8]))).toThrow('different rows count')
  expect(() => hasSameRowsCount(M([1, 2], 2), M([3, 4, 5, 6], 2), M([7, 8], 1))).toThrow('different rows count')
})

test('hasSameColsCount', () => {
  expect(() => hasSameColsCount(M([]))).not.toThrow()
  expect(() => hasSameColsCount(M([]), M([]))).not.toThrow()
  expect(() => hasSameColsCount(M([], 1), M([], 2))).not.toThrow()
  expect(() => hasSameColsCount(M([], 1), M([1, 2], 2))).not.toThrow()
  expect(() => hasSameColsCount(M([1, 2], 1), M([], 2))).not.toThrow()
  expect(() => hasSameColsCount(M([1, 2], 1), M([3, 4], 1))).not.toThrow()
  expect(() => hasSameColsCount(M([1, 2], 2), M([3, 4], 2))).not.toThrow()
  expect(() => hasSameColsCount(M([1, 2], 1), M([3, 4, 5, 6], 2))).not.toThrow()
  expect(() => hasSameColsCount(M([1, 2], 1), M([3, 4, 5, 6], 2), M([7, 8, 9, 10, 11, 12], 3))).not.toThrow()
  expect(() => hasSameColsCount(M([1, 2], 2), M([3, 4, 5, 6], 1))).toThrow('different cols count')
  expect(() => hasSameColsCount(M([1, 2], 2), M([3, 4], 1))).toThrow('different cols count')
  expect(() => hasSameColsCount(M([1, 2], 2), M([3, 4, 5, 6], 2), M([7, 8, 9, 10, 11, 12], 3))).toThrow('different cols count')
  expect(() => hasSameColsCount(M([1, 2], 1), M([3, 4, 5, 6], 4), M([7, 8, 9, 10, 11, 12], 3))).toThrow('different cols count')
  expect(() => hasSameColsCount(M([1, 2], 1), M([3, 4, 5, 6], 2), M([7, 8, 9, 10, 11, 12], 2))).toThrow('different cols count')
})

test('hasSameSize', () => {
  expect(() => hasSameSize(M([]), M([]))).not.toThrow()
  expect(() => hasSameSize(M([], 1), M([], 2))).not.toThrow()
  expect(() => hasSameSize(M([], 1), M([1, 2], 2))).not.toThrow()
  expect(() => hasSameSize(M([1, 2], 1), M([3, 4], 1))).not.toThrow()
  expect(() => hasSameSize(M([1, 2], 2), M([3, 4], 2))).not.toThrow()
  expect(() => hasSameSize(M([1, 2, 3, 4], 2), M([3, 4, 5, 6], 2))).not.toThrow()
  expect(() => hasSameSize(M([1, 2], 1), M([3, 4, 5, 6], 2))).toThrow()
  expect(() => hasSameSize(M([1, 2], 2), M([3, 4, 5, 6], 1))).toThrow()
})

test('generate', () => {
  expect(generate(0, 0)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(generate(1, 0)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(generate(0, 1)).toEqual({ elements: [], rows: 0, cols: 0 })
  expect(generate(1, 1)).toEqual({ elements: [0], rows: 1, cols: 1 })
  expect(generate(2, 1)).toEqual({ elements: [0, 0], rows: 2, cols: 1 })
  expect(generate(1, 2)).toEqual({ elements: [0, 0], rows: 1, cols: 2 })
  expect(generate(2, 2)).toEqual({ elements: [0, 0, 0, 0], rows: 2, cols: 2 })
})

/*
expect(M([])).toEqual({ elements: [], rows: 0, cols: 0 })
expect(M([], 0)).toEqual({ elements: [], rows: 0, cols: 0 })
expect(M([], 0, 0)).toEqual({ elements: [], rows: 0, cols: 0 })
expect(() => M([], 1)).toThrow()
expect(() => M([], 0, 1)).toThrow()

expect(M([1])).toEqual({ elements: [1], rows: 1, cols: 1 })
expect(M([1], 1)).toEqual({ elements: [1], rows: 1, cols: 1 })
expect(M([1], 1, 1)).toEqual({ elements: [1], rows: 1, cols: 1 })
expect(() => M([1], 0)).toThrow()
expect(() => M([1], 1, 0)).toThrow()
expect(M([1])).toEqual({ elements: [1], rows: 1, cols: 1 })

expect(M([1, 2], 1)).toEqual({ elements: [1, 2], rows: 1, cols: 2 })
expect(M([1, 2], 1, 2)).toEqual({ elements: [1, 2], rows: 1, cols: 2 })
expect(() => M([1, 2], 0)).toThrow()
expect(() => M([1, 2], 1, 0)).toThrow()
expect(() => M([1, 2], 1, 1)).toThrow()
expect(M([1, 2, 3, 4, 5])).toEqual({ elements: [1, 2, 3, 4, 5], rows: 1, cols: 5 })
expect(M([1, 2, 3, 4, 5], 5)).toEqual({ elements: [1, 2, 3, 4, 5], rows: 5, cols: 1 })
expect(() => M([1, 2, 3, 4, 5], 2)).toThrow()
expect(() => M([1, 2, 3, 4, 5], 3)).toThrow()
expect(() => M([1, 2, 3, 4, 5], 4)).toThrow() */
