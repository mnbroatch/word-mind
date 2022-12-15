export default function calculatePointsEarned (skills) {
  const numberOfUnlockedOptions = Object.values(skills).reduce((acc, skill) => acc + (!skill.unlocked ? 0 : skill.unlockedValues.length), 0)
  const basePoints = 1
  return Math.floor(basePoints * numberOfUnlockedOptions + 1)
}
