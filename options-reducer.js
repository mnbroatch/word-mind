import merge from 'lodash/merge.js'
import defaultOptions from './default-options.js'

export default function optionsReducer (prev, { type, optionId, value, savedOptions = {} }) {
  if (type === 'SET_OPTION') {
    return {
      ...prev,
      [optionId]: { ...prev[optionId], value }
    }
  } else if (type === 'UNLOCK_OPTION') {
    return {
      ...prev,
      [optionId]: { ...prev[optionId], unlockedValues: Array.from(new Set([...prev[optionId].unlockedValues, value])) }
    }
  } else if (type === 'LOAD_INITIAL') {
    return merge({}, defaultOptions, savedOptions)
  } else {
    return prev
  }
}
