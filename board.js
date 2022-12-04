import React from 'react'
import PropTypes from 'prop-types'
import Guess from './guess.js'

export default function Board ({ guesses, answer, currentGuess }) {
  // todo: revisit why are we expecting number of guesses to be greater than 1?
  const solutionIndex = guesses.indexOf(answer)
  const guessesToShow = solutionIndex === -1
    ? guesses
    : guesses.slice(0, solutionIndex + 1)
  return (
    <div
      className={[
        'board',
        solutionIndex !== -1 && 'board--solved'
      ].filter(Boolean).join(' ')}
    >
      <div className='guesses'>
        {guessesToShow.map((guess, i) => (
          <Guess
            answer={answer}
            guess={guess}
            key={i}
          />
        ))}
        {solutionIndex === -1 && (
          <Guess
            answer={answer}
            guess={currentGuess}
            noColor={true}
          />
        )}
      </div>
    </div>
  )
}

Board.propTypes = {
  answer: PropTypes.string,
  guesses: PropTypes.arrayOf(PropTypes.string),
  currentGuess: PropTypes.string
}
