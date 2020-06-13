/**
 * @typedef Matrix
 * @type {Object}
 * @property {Array<Number>} elements
 * @property {Number} rows
 * @property {Number} cols
 */

/**
 * Create matrix
 * @param elements
 * @param rows
 * @param cols
 * @return {Matrix}
 */
const M = (elements, rows = elements.length, cols = elements.length === 0 ? 0 : elements.length / rows) => {
  if (rows < 0 || cols < 0) {
    throw Error('Wrong structure')
  }
  if (elements.length !== 0 && (elements.length % rows !== 0 || elements.length % cols !== 0)) {
    throw Error(MatrixMustBeRectangle({ elements, rows, cols }))
  }
  if (elements.length === 0) {
    rows = 0
    cols = 0
  }
  if (rows * cols !== elements.length) {
    throw Error('Wrong structure')
  }
  return {
    elements,
    rows,
    cols
  }
}

const V = el => M(el, el.length, el.length === 0 ? 0 : 1)

/**
 * generate matrix with given rows and cols
 * @param {Number} rows
 * @param {Number} cols
 * @return {Matrix}
 */
const generate = (rows, cols) => M(Array(rows * cols).fill(0), rows, cols)

/**
 * Return copy of matrix
 * @param {Matrix} m
 * @return {Matrix}
 */
const copy = m => M([...m.elements], m.rows, m.cols)
/**
 * Print matrix
 * @param {Matrix} m
 * @return {string}
 */
const toString = m => {
  let ms = ''
  for (let i = 0; i < m.rows; i++) {
    for (let j = 0; j < m.cols; j++) {
      ms += m.elements[xyToi(i, j, m.rows)] + ' '
    }
    ms += '\n'
  }
  return `${m.rows} X ${m.cols}\n${ms}`
}
const xyToi = (x, y, rows) => {
  if (x >= rows) throw Error()
  return rows === 0 ? 0 : x + y * rows
}
const hasSameRowsCount = (...matrices) => {
  for (let i = 0; i < matrices.length - 1; i++) {
    const m1 = matrices[i]
    const m2 = matrices[i + 1]
    if (m1.rows !== m2.rows && m1.elements.length !== 0 && m2.elements.length !== 0) {
      throw Error(`Matrices\n${toString(m1)}\n${toString(m2)}has different rows count`)
    }
  }
}

const hasSameColsCount = (...matrices) => {
  for (let i = 0; i < matrices.length - 1; i++) {
    const m1 = matrices[i]
    const m2 = matrices[i + 1]
    if (m1.cols !== m2.cols && m1.elements.length !== 0 && m2.elements.length !== 0) {
      throw Error(`Matrices\n${toString(m1)}\n${toString(m2)}has different cols count`)
    }
  }
}

const hasSameSize = (m1, m2) => hasSameRowsCount(m1, m2) && hasSameColsCount(m1, m2)
module.exports = { M, V, xyToi, hasSameRowsCount, hasSameColsCount, hasSameSize, generate, copy }

const MatrixMustBeRectangle = m => `Matrix\n${toString(m)}must be rectangle`
