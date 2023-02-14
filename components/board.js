import React from 'react'
import PropTypes from 'prop-types'
import Guess from './guess.js'

export default function Board ({ guesses, answer }) {
  const solutionIndex = guesses.indexOf(answer)
  return (
    <div
      className={[
        'board',
        'board--monster',
        solutionIndex !== -1 && 'board--solved'
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

Board.propTypes = {
  answer: PropTypes.string,
  guesses: PropTypes.arrayOf(PropTypes.string)
}
