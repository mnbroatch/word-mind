import { useState, useReducer, useEffect } from 'react'
import skillsReducer from './skills-reducer'
import itemsReducer from './items-reducer'
import equipmentReducer from './equipment-reducer'
import { loadState, saveState } from './local-storage-wrapper'

const seedLength = 1

const { initialSkills, initialItems, initialEquipment, initialXp, initialMoney } = loadState()

const getSeed = () => {
  let seed = ''
  for (let i = 0, len = seedLength; i < len; i++) {
    seed += Math.random().toString().slice(1)
  }
  return seed
}

export default function useGameState () {
  const [seed, setSeed] = useState(getSeed)
  const [skills, skillsDispatch] = useReducer(skillsReducer, initialSkills)
  const [items, itemsDispatch] = useReducer(itemsReducer, initialItems)
  const [equipment] = useReducer(equipmentReducer, initialEquipment)
  const [xp, setXp] = useState(initialXp)
  const [money, setMoney] = useState(initialMoney)

  const skillsToUse = Object.entries(skills).reduce((acc, [key, skill], i) => {
    return {
      ...acc,
      [key]: {
        ...skill,
        value: skill.value === 'random' ? skill.options[seed[i] % skill.options.length].value : skill.value,
        random: skill.value === 'random'
      }
    }
  }, {})

  useEffect(() => {
    saveState({ skills: skillsToUse, xp, money, items, equipment })
  }, [skills, xp, money, items, equipment])

  const randomizeRandomSkills = () => { setSeed(getSeed()) }

  return {
    skills: skillsToUse,
    items,
    equipment,
    xp,
    money,
    skillsDispatch,
    itemsDispatch,
    setXp,
    setMoney,
    randomizeRandomSkills
  }
}
