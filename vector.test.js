const { describe, test, expect, beforeEach } = require('@jest/globals')

const Vector = require('./vector.js')

let empty = new Vector()
let a = new Vector([1, 2, 3, 4, 5])
let b = new Vector([5, 6, 7, 8])
let c = new Vector([5, 6, 7, 8, 9])

beforeEach(() => {
  empty = new Vector()
  a = new Vector([1, 2, 3, 4, 5])
  b = new Vector([5, 6, 7, 8])
  c = new Vector([5, 6, 7, 8, 9])
})

test('size', () => {
  expect(empty.size()).toEqual(0)
  expect(a.size()).toEqual(5)
  expect(b.size()).toEqual(4)
})

test('copy', () => {
  expect(() => empty.copy(a)).toThrow()
  expect(() => a.copy(b)).toThrow()
  expect(a.copy(new Vector([1, 1, 1, 1, 1]))).toEqual(new Vector([1, 1, 1, 1, 1]))
  expect(a.copy(c)).toEqual(c)
})

test('scal', () => {
  expect(empty.scal(3)).toEqual(empty)
  expect(a.scal(1)).toEqual(a)
  expect(a.scal(2)).toEqual(new Vector([2, 4, 6, 8, 10]))
  expect(b.scal(2)).toEqual(new Vector([10, 12, 14, 16]))
})

test('axpy', () => {
  expect(() => empty.axpy(3, a)).toThrow()
  expect(() => a.axpy(3, b)).toThrow()
  expect(empty.axpy(3, empty)).toEqual(empty)
  expect(b.axpy(10, b)).toEqual(new Vector([55, 66, 77, 88]))
  expect(c.axpy(1, a)).toEqual(new Vector([6, 8, 10, 12, 14]))
})

test('dot', () => {
  expect(() => empty.dot(a)).toThrow()
  expect(() => a.dot(b)).toThrow()
  expect(empty.dot(empty)).toBe(0)
  expect(a.dot(c)).toBe(115)
})

test('norm2', () => {
  expect(empty.norm2()).toBe(0)
  expect(a.norm2()).toBeCloseTo(7.416198487, 9)
})
