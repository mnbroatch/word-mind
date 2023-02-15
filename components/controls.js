import React, { useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import Guess from './guess.js'
import KeyboardLetter from './keyboard-letter'
import currentGuessReducer from '../current-guess-reducer'

const alphabet = 'qwertyuiopasdfghjklzxcvbnm'.split('')

const alphabetRows = [
  alphabet.slice(0, 10),
  alphabet.slice(10, 19),
  alphabet.slice(19)
]

export default function Controls ({
  submitGuess,
  wordLength,
  guesses,
  answers
}) {
  const [currentGuess, currentGuessDispatch] = useReducer(currentGuessReducer, '')

  useEffect(() => {
    currentGuessDispatch({ type: 'clear' })
  }, [answers.join()])

  const handleAddLetter = (letter) => {
    if (
      alphabet.includes(letter.toLowerCase())
      && currentGuess.length < wordLength
    ) {
      currentGuessDispatch({ type: 'add_letter', letter })
    }
  }

  const handleGuess = () => {
    const isValidGuess = submitGuess(currentGuess)
    if (isValidGuess) {
      currentGuessDispatch({ type: 'clear' })
    }
  }

  useEffect(() => {
    const addKey = (e) => {
      if (e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault()
      }

      if (e.keyCode === 8) {
        currentGuessDispatch({ type: 'rub' })
      } else if (e.keyCode === 13) {
        handleGuess()
      } else {
        handleAddLetter(String.fromCharCode(e.keyCode))
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [handleGuess, handleAddLetter])

  return (
    <div className='controls'>
      <Guess
        answer={answers[0]}
        guess={currentGuess}
        noColor={true}
      />
      <div className='keyboard'>
        {alphabetRows.map(row => (
          <div className="keyboard-row" key={row[0]}>
            {row.map(letter => (
              <KeyboardLetter
                letter={letter}
                answers={answers}
                guesses={guesses}
                handleLetterInput={() => { handleAddLetter(letter) }}
                key={letter}
              />
            ))}
            {row[0] === 'z' && (
              <button
                className="button keyboard-button delete-button"
                onClick={() => { currentGuessDispatch({ type: 'rub' }) }}
              >
                <span className="delete-button__label">DEL</span>
              </button>
            )}
          </div>
        ))}
        <button className="button keyboard-button guess-button" onClick={handleGuess}>
          GUESS
        </button>
      </div>
    </div>
  )
}

Controls.propTypes = {
  submitGuess: PropTypes.func,
  wordLength: PropTypes.number,
  answers: PropTypes.arrayOf(PropTypes.string),
  guesses: PropTypes.arrayOf(PropTypes.string)
}
