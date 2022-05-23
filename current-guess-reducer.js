export default function (prevState, action) {
  if (action.type === 'rub') {
    return prevState.slice(0, -1)
  } else if (action.type === 'add_letter') {
    return prevState + action.letter.toLowerCase()
  } else if (action.type === 'clear') {
    return ''
  }
}
