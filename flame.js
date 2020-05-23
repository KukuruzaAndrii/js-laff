/**
 * Split vector in two parts.
 * Third parameter shows left or right part has count elements
 * @param {Array<Number>} v
 * @param {Number} count
 * @param {String} side
 * @return {Array<Array<Number>>}
 */
const part2x1 = (v, count, side = 'left') => {
  switch (side) {
    case 'left': {
      return [v.slice(0, count), v.slice(count)]
    }
    case 'right': {
      const firstPartCount = Math.min(Math.max(v.length - count, 0), v.length)
      return [v.slice(0, firstPartCount), v.slice(firstPartCount)]
    }
    default:
      throw Error(SideMustBeLeftOrRight(side))
  }
}

/**
 * Repartition a 2x1 partitioning into a 3x1 partitioning where new submatrix have newPartNumber elements from left or right side
 * @param {Array<Number>} leftPart
 * @param {Array<Number>} rightPart
 * @param {Number} newPartNumber
 * @param {String} side
 * @return {Array<Array<Number>>}
 */
const repart2x1to3x1 = (leftPart, rightPart, newPartNumber, side = 'left') => {
  switch (side) {
    case 'left': {
      return [...part2x1(leftPart, newPartNumber, 'right'), rightPart]
    }
    case 'right': {
      return [leftPart, ...part2x1(rightPart, newPartNumber, 'left')]
    }
    default:
      throw Error(SideMustBeLeftOrRight(side))
  }
}

/**
 * Merge centralPart to left or right side
 * @param {Array<Number>} leftPart
 * @param {Array<Number>} centralPart
 * @param {Array<Number>} rightPart
 * @param {String} side
 * @return {Array<Array<Number>>}
 */
const cont3x1to2x1 = (leftPart, centralPart, rightPart, side = 'left') => {
  switch (side) {
    case 'left': {
      return [[...leftPart, ...centralPart], rightPart]
    }
    case 'right': {
      return [leftPart, [...centralPart, ...rightPart]]
    }
    default:
      throw Error(SideMustBeLeftOrRight(side))
  }
}

const SideMustBeLeftOrRight = side => `Side must be either left or right. Given: ${side}`

module.exports = { part2x1, repart2x1to3x1, cont3x1to2x1 }
