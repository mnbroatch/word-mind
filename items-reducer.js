import defaultItems from './default-items'

export default function itemsReducer (prev, { type, itemId }) {
  if (type === 'USE') {
    if (prev[itemId].ownedCount > 0) {
      return {
        ...prev,
        [itemId]: {
          ...prev[itemId],
          ownedCount: prev[itemId].ownedCount - 1,
          activeUntil: Date.now() < prev[itemId].activeUntil
            ? prev[itemId].activeUntil - Date.now() + prev[itemId].duration
            : Date.now() + prev[itemId].duration
        }
      }
    } else {
      return prev
    }
  } else if (type === 'BUY') {
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
