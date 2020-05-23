/**
 * Return copy of vector
 * @param {Array<Number>} v
 * @returns {Array<Number>}
 */
const copy = v => [...v]

/**
 * Scales
 * @param {Number} alpha
 * @param {Array<Number>} v
 * @return {*}
 */
const scal = (alpha, v) => v.map(el => alpha * el)

/**
 * axpy
 * @param {Number} alpha
 * @param {Array<Number>} x
 * @param {Array<Number>} y
 */
const axpy = (alpha, x, y) => {
  if (x.length !== y.length) throw Error()
  return x.map((x, i) => alpha * x + y[i])
}

/**
 * Dot
 * @param {Array<Number>} x
 * @param {Array<Number>} y
 * @return {Number}
 */
const dot = (x, y) => {
  if (x.length !== y.length) throw Error()
  return x.map((x, i) => x * y[i]).reduce((x, y) => x + y, 0)
}

/**
 * Length of vector
 * @param {Array<Number>} v
 * @return {Number}
 */
const norm2 = v => Math.sqrt(v.reduce((acc, v) => acc + v ** 2, 0))

module.exports = { copy, scal, axpy, dot, norm2 }
