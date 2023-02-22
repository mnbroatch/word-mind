import defaultItems from './default-items'

export default function itemsReducer (prev, { type, itemId }) {
  if (type === 'USE') {
    if (prev[itemId].ownedCount > 0) {
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          ownedCount: prev[itemId].ownedCount - 1
        }
      }
    } else {
      return prev
    }
  } else if (type === 'BUY') {
    console.log('prev[itemId]', prev[itemId])
    return {
      ...prev,
      [itemId]: {
        ...prev[itemId],
        ownedCount: prev[itemId].ownedCount + 1
      }
    }
  } else if (type === 'LOAD_INITIAL') {
    return defaultItems
  } else {
    return prev
  }
}
