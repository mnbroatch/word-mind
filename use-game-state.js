import { useState, useReducer, useEffect } from 'react'
import skillsReducer from './skills-reducer'
import itemsReducer from './items-reducer'
import equipmentReducer from './equipment-reducer'
import { loadState, saveState } from './local-storage-wrapper'

const seedLength = 1

const { initialSkills, initialItems, initialEquipment, initialXp, initialMoney, initialCompletedLevelIds } = loadState()

const getSeed = () => {
  let seed = ''
  for (let i = 0, len = seedLength; i < len; i++) {
    seed += Math.random().toString().slice(2)
  }
  return seed
}

export default function useGameState () {
  const [seed, setSeed] = useState(getSeed)
  const [skills, skillsDispatch] = useReducer(skillsReducer, initialSkills)
  const [items, itemsDispatch] = useReducer(itemsReducer, initialItems)
  const [equipment, equipmentDispatch] = useReducer(equipmentReducer, initialEquipment)
  const [xp, setXp] = useState(initialXp)
  const [money, setMoney] = useState(initialMoney)
  const [completedLevelIds, setCompletedLevelIds] = useState(initialCompletedLevelIds)
  const addCompletedLevelId = (levelId) => { setCompletedLevelIds(prev => [...new Set([...prev, levelId])]) }

  const skillsToUse = Object.entries(skills).reduce((acc, [key, skill], i) => {
    return {
      ...acc,
      [key]: {
        ...skill,
        value: skill.value === 'random' ? skill.options[seed[i] % skill.options.length].value : skill.value
      }
    }
  }, {})

  useEffect(() => {
    saveState({ skills: skillsToUse, xp, money, items, equipment })
  }, [skillsToUse, xp, money, items, equipment])

  const randomizeRandomSkills = () => { setSeed(getSeed()) }

  return {
    skills: skillsToUse,
    items,
    equipment,
    xp,
    money,
    completedLevelIds,
    skillsDispatch,
    itemsDispatch,
    equipmentDispatch,
    setXp,
    setMoney,
    addCompletedLevelId,
    randomizeRandomSkills,
  }
}
