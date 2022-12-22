import defaultEquipment from './default-equipment'

export default function equipmentReducer (prev, { type, equipmentId }) {
  if (type === 'TOGGLE') {
    if (prev[equipmentId].owned) {
      return {
        ...prev,
        [equipmentId]: {
          ...prev[equipmentId],
          active: !prev[equipmentId].active
        }
      }
    } else {
      return prev
    }
  } else if (type === 'UNLOCK') {
    return {
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        owned: true
      }
    }
  } else if (type === 'LOAD_INITIAL') {
    return defaultEquipment
  } else {
    return prev
  }
}
