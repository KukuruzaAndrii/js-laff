const {
  part1x2M, part2x1M, part2x2,
  repart1x2to1x3M, repart2x1to3x1M, repart2x2to3x3M,
  cont1x3to1x2M, cont3x1to2x1M, cont3x3to2x2,
  cont3x1to2x1V, part2x1V, repart2x1to3x1V
} = require('./flame.js')
const {
  leftToRight,
  rightToLeft,
  bottomToTop,
  topLeftToBottomRight,
  bottomRightToTopLeft,
  topRightToBottomLeft,
  bottomLeftToTopRight
} = require('./directions')
const { hasSameRowsCount, generate, copy } = require('./matrix')
/**
 * Return copy of vector
 * @param {Array<Number>} v
 * @return {Array<Number>}
 */
// const copy = v => [...v]

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
 * @param {Matrix} x
 * @param {Matrix} y
 * @return {Number}
 */
const dotFlame = (x, y) => {
  if (x.rows * x.cols !== y.rows * y.cols) throw Error()

  const [xl, xr] = part2x1V(x, 0)
  const [yl, yr] = part2x1V(y, 0)

  const rec = (xl, xr, yl, yr, acc) => {
    if (xr.cols === 0) return acc
    const [x0, alpha, x2] = repart2x1to3x1V(xl, xr, 1, rightToLeft)
    const [y0, beta, y2] = repart2x1to3x1V(yl, yr, 1, rightToLeft)
    const [newXl, newXr] = cont3x1to2x1V(x0, alpha, x2)
    const [newYl, newYr] = cont3x1to2x1V(y0, beta, y2)
    return rec(newXl, newXr, newYl, newYr, acc + alpha.elements[0] * beta.elements[0])
  }
  return rec(xl, xr, yl, yr, 0)
}

/**
 * Axpy using flame
 * @param {Number} alpha
 * @param {Matrix} x
 * @param {Matrix} y
 * @return {Number}
 */
const axpyFlame = (alpha, x, y) => {
  if (x.rows * x.cols !== y.rows * y.cols) throw Error()

  const [xl, xr] = part2x1V(x, 0)
  const [yl, yr] = part2x1V(y, 0)

  const rec = (xl, xr, yl, yr, acc) => {
    if (xr.cols === 0) return acc
    const [x0, theta, x2] = repart2x1to3x1V(xl, xr, 1, rightToLeft)
    const [y0, beta, y2] = repart2x1to3x1V(yl, yr, 1, rightToLeft)
    const [newXl, newXr] = cont3x1to2x1V(x0, theta, x2)
    const [newYl, newYr] = cont3x1to2x1V(y0, beta, y2)
    return rec(newXl, newXr, newYl, newYr, [...acc, alpha * theta.elements[0] + beta.elements[0]])
  }
  return rec(xl, xr, yl, yr, [])
}

/**
 * Set entries of vector to zero
 * @param {Matrix} m matrix
 * @return {*}
 */
const vecToZero = m => {
  const [ml, mr] = part2x1V(m, 0)

  const rec = (ml, mr) => {
    if (mr.cols === 0) return ml
    const [A0, A1, A2] = repart2x1to3x1V(ml, mr, 1, rightToLeft)
    A1.elements = A1.elements.fill(0)
    const [newAl, newAr] = cont3x1to2x1V(A0, A1, A2)
    return rec(newAl, newAr)
  }
  return rec(ml, mr)
}

/**
 * Set entries of matrix to zero
 * @param m matrix
 * @return {*}
 */
const setToZero = m => {
  const [ml, mr] = part1x2M(m, 0)

  const rec = (ml, mr) => {
    if (mr.cols === 0) return ml
    const [A0, A1, A2] = repart1x2to1x3M(ml, mr, 1, rightToLeft)
    A1.elements.fill(0)
    const [newAl, newAr] = cont1x3to1x2M(A0, A1, A2)
    return rec(newAl, newAr)
  }
  return rec(ml, mr)
}

const setToIdentity = m => {
  // check square
  const [TL, TR, BL, BR] = part2x2(m, 0, 0)

  const rec = (TL, TR, BL, BR) => {
    if (TL.cols === m.cols) return TL
    const [
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    ] = repart2x2to3x3M(TL, TR, BL, BR, 1, 1, bottomRightToTopLeft)
    A01.elements.fill(0)
    A11.elements.fill(1)
    A21.elements.fill(0)
    const [nTL, nTR, nBL, nBR] = cont3x3to2x2(
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    )
    return rec(nTL, nTR, nBL, nBR)
  }
  return rec(TL, TR, BL, BR)
}

const setToDiagonal = (m, v) => {
  hasSameRowsCount(m, v)
  const [TL, TR, BL, BR] = part2x2(m, 0, 0)
  const [xl, xr] = part2x1V(v)
  const rec = (TL, TR, BL, BR, xl, xr) => {
    if (TL.cols === m.cols) return TL
    const [
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    ] = repart2x2to3x3M(TL, TR, BL, BR, 1, 1, bottomRightToTopLeft)
    const [x0, theta, x2] = repart2x1to3x1V(xl, xr, 1, rightToLeft)
    A01.elements.fill(0)
    A11.elements.fill(theta.elements[0])
    A21.elements.fill(0)
    const [nTL, nTR, nBL, nBR] = cont3x3to2x2(
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    )
    const [nxl, nxr] = cont3x1to2x1V(x0, theta, x2)
    return rec(nTL, nTR, nBL, nBR, nxl, nxr)
  }
  return rec(TL, TR, BL, BR, xl, xr)
}

const setToUpperTriangular = m => {
  // check square
  const [TL, TR, BL, BR] = part2x2(m, 0, 0)

  const rec = (TL, TR, BL, BR) => {
    if (TL.cols === m.cols) return TL
    const [
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    ] = repart2x2to3x3M(TL, TR, BL, BR, 1, 1, bottomRightToTopLeft)
    A10.elements.fill(0)
    const [nTL, nTR, nBL, nBR] = cont3x3to2x2(
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    )
    return rec(nTL, nTR, nBL, nBR)
  }
  return rec(TL, TR, BL, BR)
}

const transpose = m => {
  const mT = generate(m.cols, m.rows)
  const [ml, mr] = part1x2M(m, 0)
  const [mTt, mTb] = part2x1M(mT, 0)
  const rec = (ml, mr, mTt, mTb) => {
    if (mTb.rows === 0) return mTt
    const [A0, A1, A2] = repart1x2to1x3M(ml, mr, 1, rightToLeft)
    const [tA0, tA1, tA2] = repart2x1to3x1M(mTt, mTb, 1, bottomToTop)
    tA1.elements = [...A1.elements]
    const [newAl, newAr] = cont1x3to1x2M(A0, A1, A2)
    const [newTt, newTb] = cont3x1to2x1M(tA0, tA1, tA2)
    return rec(newAl, newAr, newTt, newTb)
  }
  return rec(ml, mr, mTt, mTb)
}

const symmetrizeFromLower = m => {
  // check square
  const [TL, TR, BL, BR] = part2x2(m, 0, 0)

  const rec = (TL, TR, BL, BR) => {
    if (TL.cols === m.cols) return TL
    const [
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    ] = repart2x2to3x3M(TL, TR, BL, BR, 1, 1, bottomRightToTopLeft)
    A01.elements = [...A10.elements]
    const [nTL, nTR, nBL, nBR] = cont3x3to2x2(
      A00, A01, A02,
      A10, A11, A12,
      A20, A21, A22
    )
    return rec(nTL, nTR, nBL, nBR)
  }
  return rec(TL, TR, BL, BR)
}

const scale = (m, alpha) => {
  const [ml, mr] = part1x2M(m, 0)

  const rec = (ml, mr) => {
    if (mr.cols === 0) return ml
    const [A0, A1, A2] = repart1x2to1x3M(ml, mr, 1, rightToLeft)
    A1.elements = scal(alpha, A1.elements)
    const [newAl, newAr] = cont1x3to1x2M(A0, A1, A2)
    return rec(newAl, newAr)
  }
  return rec(ml, mr)
}

const matrixVectorMult = (m, v) => {
  const res = generate(v.rows, v.cols)

  const [mT, mB] = part2x1M(m, 0)
  const [resT, resB] = part2x1M(res, 0)

  const rec = (mT, mB, resT, resB) => {
    if (mT.rows === m.rows) return resT
    const [AT, A1, AB] = repart2x1to3x1M(mT, mB, 1, bottomToTop)
    const [vT, v1, vB] = repart2x1to3x1M(resT, resB, 1, bottomToTop)
    v1.elements = [dot(A1.elements, v.elements)]
    const [newmT, newmB] = cont3x1to2x1M(AT, A1, AB)
    const [newresT, newresB] = cont3x1to2x1V(vT, v1, vB)
    return rec(newmT, newmB, newresT, newresB)
  }
  return rec(mT, mB, resT, resB)
}

module.exports = {
  copy,
  scal,
  axpy,
  dot,
  norm2,
  dotFlame,
  axpyFlame,
  vecToZero,
  setToZero,
  setToIdentity,
  setToDiagonal,
  setToUpperTriangular,
  transpose,
  symmetrizeFromLower,
  scale,
  matrixVectorMult
}
