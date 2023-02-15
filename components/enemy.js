import React from 'react'
import PropTypes from 'prop-types'
import Guess from './guess.js'

export default function Enemy ({ guesses, answer, dead }) {
  return (
    <div
      className={[
        'enemy',
        'enemy--monster',
        dead && 'enemy--dead'
      ].filter(Boolean).join(' ')}
    >
      <div className='guesses'>
        {guesses.length
          ? guesses.map((guess, i) => (
            <Guess
              answer={answer}
              guess={guess}
              key={i}
            />
          ))
          : <Guess
              answer={answer}
              guess={answer.replace(/./g, ' ')}
            />
        }
      </div>
    </div>
  )
}

Enemy.propTypes = {
  answer: PropTypes.string,
  guesses: PropTypes.arrayOf(PropTypes.string),
  dead: PropTypes.boolean
}
