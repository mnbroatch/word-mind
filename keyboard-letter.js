import React from 'react'
import PropTypes from 'prop-types'

export default function KeyboardLetter ({ letter, answers, guesses, handleLetterInput }) {
  const answersLetterStates = answers.map((answer) => {
    if (guesses.some(guess => {
      // indexes of letter in guess
      const indexes = guess.split('').reduce((acc, l, i) => l === letter
        ? [...acc, i]
        : acc
      , [])
      return indexes.some(i => answer[i] === letter)
    })) {
      return 'correct'
    } else if (answer.indexOf(letter) === -1) {
      return 'absent'
    } else {
      return 'present'
    }
  })

  const isUsed = guesses.some(guess => guess.includes(letter))
  const isComplete = answers.every((answer, i) => (
    (answersLetterStates[i] === 'absent' || guesses.includes(answer))
  ))

  return (
    <button
      className={[
        'keyboard-letter',
        isComplete && 'keyboard-letter--complete',
        !isUsed && 'keyboard-letter--untouched'
      ].filter(Boolean).join(' ')}
      tabIndex='-1'
      onClick={handleLetterInput}
    >
      <span className='keyboard-letter__letter'>
        { letter }
      </span>
      <span className='keyboard-letter__background'>
        {answersLetterStates.map((state, i) => (
          <div
            key={i}
            className={`keyboard-letter__background-section keyboard-letter__background-section--${state}`}
          ></div>
        ))}
      </span>
    </button>
  )
}

KeyboardLetter.propTypes = {
  letter: PropTypes.string,
  answers: PropTypes.arrayOf(PropTypes.string),
  guesses: PropTypes.arrayOf(PropTypes.string),
  handleLetterInput: PropTypes.func
}
