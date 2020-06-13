const { copy, scal, axpy, dot, norm2 } = require('./index.js')

/**
 * Vector
 * @type Vector
 */
class Vector {
  constructor (elements = []) {
    /**
     * Elements of vector
     * @type {Array<Number>}
     */
    this.elements = elements
  }

  /**
   * Size of vector
   * @returns {number}
   */
  size () {
    return this.elements.length
  }

  /**
   * Copy given same length vector in current
   * @param {Vector} vector
   * @return {Vector}
   */
  copy (vector) {
    if (vector.size() !== this.size()) {
      throw Error(VectorsMustBeSameLengthError(this, vector))
    }
    this.elements = copy(vector.elements)
    return this
  }

  /**
   * Scales current vector by scalar alpha
   * @param {Number} alpha
   * @return {Vector}
   */
  scal (alpha) {
    this.elements = scal(alpha, this.elements)
    return this
  }

  /**
   * Scales current vector by scalar alpha and add vector y to it.
   * @param {Number} alpha
   * @param {Vector} y
   * @return {Vector}
   */
  axpy (alpha, y) {
    if (y.size() !== this.size()) {
      throw Error(VectorsMustBeSameLengthError(this, y))
    }
    this.elements = axpy(alpha, this.elements, y.elements)
    return this
  }

  /**
   * Dot product of current vector and vector y
   * @param {Vector} y
   * @return {Number}
   */
  dot (y) {
    if (y.size() !== this.size()) {
      throw Error(VectorsMustBeSameLengthError(this, y))
    }
    return dot(this.elements, y.elements)
  }

  /**
   * Length of current vector
   * @return {Number}
   */
  norm2 () {
    return norm2(this.elements)
  }
}

/**
 *
 * @param {Vector} v1
 * @param {Vector} v2
 * @returns {string}
 */
const VectorsMustBeSameLengthError = (v1, v2) => `Vectors ${v1.elements} and ${v2.elements} must be the same length`

module.exports = Vector
