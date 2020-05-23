const { part2x1, repart2x1to3x1, cont3x1to2x1 } = require('./flame.js')

/**
 * Return copy of vector
 * @param {Array<Number>} v
 * @return {Array<Number>}
 */
const copy = v => [...v]

/**
 * Scales
 * @param {Number} alpha
 * @param {Array<Number>} v
 * @return {Array<Number>}
 */
const scal = (alpha, v) => v.map(el => alpha * el)

/**
 * axpy
 * @param {Number} alpha
 * @param {Array<Number>} x
 * @param {Array<Number>} y
 * @return {Array<Number>}
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
const norm2 = v => Math.hypot(...v)

/**
 * Dot using flame
 * @param {Array<Number>} x
 * @param {Array<Number>} y
 * @return {Number}
 */
const dotFlame = (x, y) => {
  if (x.length !== y.length) throw Error()

  const [xl, xr] = part2x1(x, 0)
  const [yl, yr] = part2x1(y, 0)

  const rec = (xl, xr, yl, yr, acc) => {
    if (xr.length === 0) return acc
    const [x0, alpha, x2] = repart2x1to3x1(xl, xr, 1, 'right')
    const [y0, beta, y2] = repart2x1to3x1(yl, yr, 1, 'right')
    const [newXl, newXr] = cont3x1to2x1(x0, alpha, x2)
    const [newYl, newYr] = cont3x1to2x1(y0, beta, y2)
    return rec(newXl, newXr, newYl, newYr, acc + alpha[0] * beta[0])
  }
  return rec(xl, xr, yl, yr, 0)
}

/**
 * Axpy using flame
 * @param {Number} alpha
 * @param {Array<Number>} x
 * @param {Array<Number>} y
 * @return {Number}
 */
const axpyFlame = (alpha, x, y) => {
  if (x.length !== y.length) throw Error()

  const [xl, xr] = part2x1(x, 0)
  const [yl, yr] = part2x1(y, 0)

  const rec = (xl, xr, yl, yr, acc) => {
    if (xr.length === 0) return acc
    const [x0, theta, x2] = repart2x1to3x1(xl, xr, 1, 'right')
    const [y0, beta, y2] = repart2x1to3x1(yl, yr, 1, 'right')
    const [newXl, newXr] = cont3x1to2x1(x0, theta, x2)
    const [newYl, newYr] = cont3x1to2x1(y0, beta, y2)
    return rec(newXl, newXr, newYl, newYr, [...acc, alpha * theta[0] + beta[0]])
  }
  return rec(xl, xr, yl, yr, [])
}

module.exports = { copy, scal, axpy, dot, norm2, dotFlame, axpyFlame }
