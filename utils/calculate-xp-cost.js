export default function calculatePointsEarned (skills) {
  const unlockedSkillsCount = Object.values(skills).reduce((acc, skill) => acc + (skill.unlocked ? 1 : 0), 0)
  return 10 * (unlockedSkillsCount + 1)
}
