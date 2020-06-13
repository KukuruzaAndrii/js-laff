const { M, V, hasSameRowsCount, hasSameColsCount } = require('./matrix')
const {
  leftToRight,
  rightToLeft,
  topToBottom,
  bottomToTop,
  topLeftToBottomRight,
  bottomRightToTopLeft,
  topRightToBottomLeft,
  bottomLeftToTopRight
} = require('./directions')

/**
 * Split matrix in two parts.
 *
 cols
 +--------+ r
 |        | o
 |        | w
 |        | s
 +--------+

 leftToRight   rightToLeft
 +---+----+    +---+----+
 |   |    |    |   |    |
 | 1 | 2  | or | 1 | 2  |
 |   |    |    |   |    |
 +--------+    +--------+
 +---+             +----+
 colCount        colCount

 * Third parameter shows leftToRight or rightToLeft part has colCount elements
 * @param {Array<Number>} elements
 * @param {Number} colCount
 * @param {String} direction
 * @param {Number} rows - rows colCount in matrix
 * @return {Array<Matrix>}
 */
const part1x2M = ({ elements, rows }, colCount, direction = leftToRight) => {
  const offset = colCount * rows
  switch (direction) {
    case leftToRight: {
      return [M(elements.slice(0, offset), rows), M(elements.slice(offset), rows)]
    }
    case rightToLeft: {
      const firstPartCount = Math.min(Math.max(elements.length - offset, 0), elements.length)
      return [M(elements.slice(0, firstPartCount), rows), M(elements.slice(firstPartCount), rows)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

/**
 * Split matrix in two parts.
 *
 cols
 +--------+ r
 |        | o
 |        | w
 |        | s
 |        |
 +--------+

 topToBottom              bottomToTop
 +--------+ +             +--------+
 |        | | rowCount    |        |
 +--------+ +             +--------+ +
 |        |               |        | | rowCount
 |        |               |        | |
 +--------+               +--------+ +

 * @param elements
 * @param rows
 * @param cols
 * @param rowCount
 * @param direction
 * @return {Array<Matrix>}
 */
const part2x1M = ({ elements, rows, cols }, rowCount, direction = topToBottom) => {
  switch (direction) {
    case topToBottom: {
      const T = []
      const B = []
      for (let i = 0; i < cols; i++) {
        const offset = rows * i
        T.push(...elements.slice(offset, offset + Math.min(Math.max(rowCount, 0), rows)))
        B.push(...elements.slice(offset + Math.min(Math.max(rowCount, 0), rows), offset + rows))
      }
      return [M(T, Math.min(Math.max(rowCount, 0), rows)), M(B, Math.min(Math.max(rows - rowCount, 0), rows))]
    }
    case bottomToTop: {
      const T = []
      const B = []
      for (let i = 0; i < cols; i++) {
        const offset = rows * i
        T.push(...elements.slice(offset, offset + rows - Math.min(Math.max(rowCount, 0), rows)))
        B.push(...elements.slice(offset + rows - Math.min(Math.max(rowCount, 0), rows), offset + rows))
      }
      return [M(T, Math.min(Math.max(rows - rowCount, 0), rows)), M(B, Math.min(Math.max(rowCount, 0), rows))]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

const part2x1V = ({ elements }, colCount, direction = leftToRight) => {
  switch (direction) {
    case leftToRight: {
      return [V(elements.slice(0, colCount)), V(elements.slice(colCount))]
    }
    case rightToLeft: {
      const firstPartCount = Math.min(Math.max(elements.length - colCount, 0), elements.length)
      return [V(elements.slice(0, firstPartCount)), V(elements.slice(firstPartCount))]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}
/**
 * Merge two matrices with same rows into one
 * @param {Matrix} L
 * @param {Matrix} R
 * @return {Matrix}
 */
const merge1x2 = (L, R) => {
  hasSameRowsCount(L, R)
  return M([...L.elements, ...R.elements], Math.max(L.rows, R.rows))
}

const merge2x1 = (T, B) => {
  hasSameColsCount(T, B)
  const res = []
  const cols = Math.max(T.cols, B.cols)
  for (let i = 0; i < cols; i++) {
    const offset1 = T.rows * i
    const offset2 = B.rows * i
    res.push(...T.elements.slice(offset1, offset1 + T.rows))
    res.push(...B.elements.slice(offset2, offset2 + B.rows))
  }
  return M(res, T.rows + B.rows)
}

const merge2x2 = (TL, TR, BL, BR) => merge1x2(merge2x1(TL, BL), merge2x1(TR, BR))

/**
 * Split matrix in four parts.
 * @param {Array<Number>} elements
 * @param {Number} rows - rows count in matrix
 * @param {Number} rowCount
 * @param {Number} colCount
 * @param {String} direction
 * @return {Array<Matrix>}
 *
 cols
 +---------+   +
 |TL1| TR2 |   | rowCount
 +---------+   +
 |   |     |
 |BL3| BR4 |  rows
 |   |     |
 +---+-----+
 +---+ colCount
 */
const part2x2 = ({ elements, rows, cols }, rowCount, colCount, direction = topLeftToBottomRight) => {
  const offset = rowCount * rows
  switch (direction) {
    case topLeftToBottomRight: {
      const [L, R] = part1x2M(M(elements, rows, cols), colCount)
      const [TL, BL] = part2x1M(L, rowCount)
      const [TR, BR] = part2x1M(R, rowCount)
      return [TL, TR, BL, BR]
    }
    /* case rightToLeft: {
      const firstPartCount = Math.min(Math.max(elements.length - offset, 0), elements.length)
      return [M(elements.slice(0, firstPartCount), rows), M(elements.slice(firstPartCount), rows)]
    } */
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

/**
 * Repartition a 1x2 partitioning into a 1x3 partitioning where new submatrix have newPartColsCount elements from leftToRight or rightToLeft direction
 * @param {Matrix} L
 * @param {Matrix} R
 * @param {Number} newPartColsCount
 * @param {String} direction
 * @return {Array<Matrix>}
 */
const repart1x2to1x3M = (L, R, newPartColsCount, direction = leftToRight) => {
  hasSameRowsCount(L, R)
  switch (direction) {
    case leftToRight: {
      return [...part1x2M(L, newPartColsCount, rightToLeft), R]
    }
    case rightToLeft: {
      return [L, ...part1x2M(R, newPartColsCount, leftToRight)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

/**
 * Repartition a 2x1 partitioning into a 3x1 partitioning where new submatrix have newPartRowsCount elements from leftToRight or rightToLeft direction
 * @param {Matrix} T
 * @param {Matrix} B
 * @param {Number} newPartRowsCount
 * @param {String} direction
 * @return {Array<Matrix>}
 */
const repart2x1to3x1M = (T, B, newPartRowsCount, direction = topToBottom) => {
  hasSameColsCount(T, B)
  switch (direction) {
    case topToBottom: {
      return [...part2x1M(T, newPartRowsCount, bottomToTop), B]
    }
    case bottomToTop: {
      return [T, ...part2x1M(B, newPartRowsCount, topToBottom)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

const repart2x2to3x3M = (TL, TR, BL, BR, newPartRows, newPartCols, direction = bottomRightToTopLeft) => {
  hasSameRowsCount(TL, TR)
  hasSameRowsCount(BL, BR)
  hasSameColsCount(TL, BL)
  hasSameColsCount(TR, BR)
  switch (direction) {
    case bottomRightToTopLeft: {
      const A00 = TL
      const [A01, A02] = part1x2M(TR, newPartCols)
      const [A10, A20] = part2x1M(BL, newPartRows)
      const [A11, A12, A21, A22] = part2x2(BR, newPartRows, newPartCols)
      return [
        A00, A01, A02,
        A10, A11, A12,
        A20, A21, A22
      ]
    }
  }
}

const repart2x1to3x1V = (leftPart, rightPart, newPartNumber, direction = leftToRight) => {
  // if (leftPart.rows !== rightPart.rows) {
  //   throw Error('Left and rightToLeft part must has same rows count')
  // }
  switch (direction) {
    case leftToRight: {
      return [...part2x1V(leftPart, newPartNumber, rightToLeft), rightPart]
    }
    case rightToLeft: {
      return [leftPart, ...part2x1V(rightPart, newPartNumber, leftToRight)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

/**
 * Merge C to leftToRight or rightToLeft direction
 * @param {Matrix} L
 * @param {Matrix} C
 * @param {Matrix} R
 * @param {String} direction
 * @return {Array<Matrix>}
 */
const cont1x3to1x2M = (L, C, R, direction = leftToRight) => {
  hasSameRowsCount(L, C, R)
  switch (direction) {
    case leftToRight: {
      return [merge1x2(L, C), R]
    }
    case rightToLeft: {
      return [L, merge1x2(C, R)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

/**
 * Merge C to leftToRight or rightToLeft direction
 * @param {Matrix} T
 * @param {Matrix} C
 * @param {Matrix} B
 * @param {String} direction
 * @return {Array<Matrix>}
 */
const cont3x1to2x1M = (T, C, B, direction = topToBottom) => {
  hasSameColsCount(T, C, B)
  switch (direction) {
    case topToBottom: {
      return [merge2x1(T, C), B]
    }
    case bottomToTop: {
      return [T, merge2x1(C, B)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

const cont3x3to2x2 = (
  A00, A01, A02,
  A10, A11, A12,
  A20, A21, A22,
  direction = topLeftToBottomRight
) => {
  hasSameRowsCount(A00, A01, A02)
  hasSameRowsCount(A10, A11, A12)
  hasSameRowsCount(A20, A21, A22)
  hasSameColsCount(A00, A10, A20)
  hasSameColsCount(A01, A11, A21)
  hasSameColsCount(A02, A12, A22)
  switch (direction) {
    case topLeftToBottomRight: {
      const TL = merge2x2(A00, A01, A10, A11)
      const TR = merge2x1(A02, A12)
      const BL = merge1x2(A20, A21)
      const BR = A22
      return [TL, TR, BL, BR]
    }
  }
}

const cont3x1to2x1V = (leftPart, centralPart, rightPart, direction = leftToRight) => {
  // if (leftPart.rows !== rightPart.rows || centralPart.rows !== rightPart.rows) {
  //   throw Error('Left, central and rightToLeft part must has same rows count')
  // }
  switch (direction) {
    case leftToRight: {
      return [V([...leftPart.elements, ...centralPart.elements], leftPart.rows), rightPart]
    }
    case rightToLeft: {
      return [leftPart, V([...centralPart.elements, ...rightPart.elements], centralPart.rows)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(direction))
  }
}

const SideMustBeLeftOrRight = side => `Side must be either left or right. Given: ${side}`

module.exports = {
  part1x2M,
  part2x1M,
  part2x2,
  merge1x2,
  merge2x1,
  merge2x2,
  repart1x2to1x3M,
  repart2x1to3x1M,
  repart2x2to3x3M,
  cont1x3to1x2M,
  cont3x1to2x1M,
  cont3x3to2x2,
  part2x1V,
  repart2x1to3x1V,
  cont3x1to2x1V
}
