import defaultItems from './default-items'

export default function itemsReducer (prev, { type, itemId, option }) {
  if (type === 'USE') {
    //
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
