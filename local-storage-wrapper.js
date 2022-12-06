import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge.js'
import defaultOptions from './default-options.js'

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

function loadState () {
  const savedOptions = JSON.parse(localStorage.getItem('word-mind_options'))
  if (savedOptions) {
    Object.values(savedOptions).forEach(option => {
      if (option.value === INFINITY_REPLACEMENT) {
        option.value = Infinity
      }

      option.unlockedValues.forEach((value, i) => {
        if (value === INFINITY_REPLACEMENT) {
          option.unlockedValues[i] = Infinity
        }
      })
    })
  }

  const initialOptions = merge({}, defaultOptions, savedOptions)
  Object.keys(initialOptions).forEach((key) => {
    if (!defaultOptions[key]) {
      delete initialOptions[key]
    }
  })

  let initialPoints = 0
  const savedPoints = localStorage.getItem('word-mind_points')
  if (savedPoints) {
    initialPoints = JSON.parse(savedPoints)
  }

  return { initialOptions, initialPoints }
}

function saveState (options, points) {
  const optionsClone = cloneDeep(options)
  if (optionsClone) {
    Object.values(optionsClone).forEach(option => {
      if (option.value === Infinity) {
        option.value = INFINITY_REPLACEMENT
      }

      option.unlockedValues.forEach((value, i) => {
        if (value === Infinity) {
          option.unlockedValues[i] = INFINITY_REPLACEMENT
        }
      })
    })
  }

  const optionsEntriesToSave = Object.entries(optionsClone).map(([key, { unlockedValues, value }]) => [key, { unlockedValues, value }])

  localStorage.setItem('word-mind_options', JSON.stringify(Object.fromEntries(optionsEntriesToSave)))
  localStorage.setItem('word-mind_points', JSON.stringify(points))
}

export { loadState, saveState }
