import defaultSkills from './default-skills'

export default function skillsReducer (prev, { type, skillId, option }) {
  if (type === 'SET') {
    return {
      ...prev,
      [skillId]: { ...prev[skillId], option }
    }
  } else if (type === 'UNLOCK') {
    return {
      ...prev,
      [skillId]: {
        ...prev[skillId],
        unlockedValues: Array.from(new Set([...prev[skillId].unlockedValues, option]))
      }
    }
  } else if (type === 'LOAD_INITIAL') {
    return defaultSkills
  } else if (type === 'UNLOCK_ALL') {
    return Object.entries(prev).reduce((acc, [key, skill]) => ({
      ...acc,
      [key]: skill
    }), {})
  } else {
    return prev
  }
}
