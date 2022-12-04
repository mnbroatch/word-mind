import React from 'react'
import PropTypes from 'prop-types'
import getLetterStates from './get-letter-states'

export default function Guess ({ answer, guess, noColor }) {
  const letterStates = getLetterStates(answer, guess)
  return (
    <div className='guess'>
      {answer && Array.from(answer).map((letter, i) => (
        <div
          className={[
            'guess__letter',
            !noColor && `guess__letter--${letterStates[i]}`
          ].filter(Boolean).join(' ')}
          key={i}
        >
          { (guess && guess[i]) || '' }
        </div>
      ))}
    </div>
  )
}

Guess.propTypes = {
  answer: PropTypes.string,
  noColor: PropTypes.bool,
  guess: PropTypes.string
}
