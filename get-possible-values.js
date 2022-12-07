import chunk from 'lodash/chunk'

export default function getPossibleValues ({ type, step = 1, max, min, unlockedValues }) {
  const possibleValues = type === 'numeric'
    ? chunk(Array.from(new Array(max - min + 1)), step).map((_, i) => (i + 1) * step)
    : [false, true]

  if (unlockedValues.includes(Infinity)) {
    possibleValues.unshift(Infinity)
  }

  return possibleValues
}
