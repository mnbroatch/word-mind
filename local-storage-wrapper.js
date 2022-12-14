import cloneDeep from 'lodash/cloneDeep'
import defaultSkills from './default-skills'
import defaultItems from './default-items'

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

function loadState () {
  const state = localStorage.getItem('word-mind_state')
  const { skills, xp, money, items } = JSON.parse(state)

  let initialSkills = skills
  if (initialSkills) {
    Object.values(initialSkills).forEach(skill => {
      if (skill.value === INFINITY_REPLACEMENT) {
        skill.value = Infinity
      }

      skill.unlockedOptions.forEach((option, i) => {
        if (option === INFINITY_REPLACEMENT) {
          skill.unlockedOptions[i] = Infinity
        }
      })
    })
  } else {
    initialSkills = defaultSkills
  }

  const initialXp = xp ? JSON.parse(xp) : 0
  const initialMoney = money ? JSON.parse(money) : 0
  const initialItems = items ? JSON.parse(items) : defaultItems
  return { initialSkills, initialItems, initialXp, initialMoney }
}

function saveState ({ skills, xp, money }) {
  const skillsClone = cloneDeep(skills)
  if (skillsClone) {
    Object.values(skillsClone).forEach(skill => {
      if (skill.value === Infinity) {
        skill.value = INFINITY_REPLACEMENT
      }

      skill.unlockedValues.forEach((value, i) => {
        if (value === Infinity) {
          skill.unlockedValues[i] = INFINITY_REPLACEMENT
        }
      })
    })
  }

  const state = {
    skills,
    xp,
    money
  }
  localStorage.setItem('word-mind_state', JSON.stringify(state))
}

export { loadState, saveState }
