export default function calculatePointsEarned (options) {
  const basePoints = 1
  return Object.values(options).reduce((acc, { name, multiplierCurve, value }) => {
    return acc + basePoints * multiplierCurve(value, options) - 1
  }, basePoints)
}
