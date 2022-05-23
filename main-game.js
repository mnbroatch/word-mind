import React, { useState, useReducer, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import allWords from './all-words.json'
import gameWords from './game-words.json'
import curseWords from './curse-words.json'
import Board from './board.js'
import KeyboardLetter from './keyboard-letter.js'
import currentGuessReducer from './current-guess-reducer.js'

// TODO: qwerty
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

function getAnswers (options) {
  const wordLength = options.wordLength.value
  const boardsCount = options.boardsCount.value
  const answers = gameWords.filter(word => word.length === +wordLength && !curseWords.includes(word))
    .sort(() => Math.random() - 0.5).slice(0, boardsCount)
  return options.reverse.value ? answers.map(answer => answer.split('').reverse().join('')) : answers
}

export default function MainGame ({ options, handleGameEnd }) {
  const [answers, setAnswers] = useState(getAnswers(options))
  const [guesses, setGuesses] = useState([])
  const [currentGuess, currentGuessDispatch] = useReducer(currentGuessReducer, '')

  const handleAddLetter = (letter) => {
    if (
      alphabet.includes(letter.toLowerCase())
      && currentGuess.length < options.wordLength.value
    ) {
      currentGuessDispatch({ type: 'add_letter', letter })
    }
  }

  const handleSubmit = () => {
    if (
      !guesses.includes(currentGuess)
        && currentGuess.length === options.wordLength.value
        && allWords.includes(
          options.reverse.value
            ? currentGuess.split('').reverse().join('')
            : currentGuess
        )
    ) {
      setGuesses([...guesses, currentGuess])
      currentGuessDispatch({ type: 'clear' })
    }
  }

  useEffect(() => {
    const addKey = (e) => {
      // mouseless users don't need onscreen keyboard
      if (
        (e.keyCode === 13 || e.keyCode === 32)
        && [...document.activeElement.classList].includes('keyboard-letter')
      ) {
        e.preventDefault()
      }

      if (e.keyCode === 8) {
        currentGuessDispatch({ type: 'rub' })
      } else if (e.keyCode === 13) {
        handleSubmit()
      } else {
        handleAddLetter(String.fromCharCode(e.keyCode))
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [handleSubmit, handleAddLetter])

  useEffect(() => {
    if (
      answers.length
      && (
        answers.every(answer => guesses.includes(answer))
        || guesses.length >= options.maxGuesses.value
      )
    ) {
      handleGameEnd({ answers, guesses })
    }
  }, [guesses])

  // Update game when rules change, but don't
  // clobber initial set of answers on first mount.
  // Maybe not necessary if rules can't change mid-game
  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) {
      setAnswers(getAnswers(options))
    } else {
      didMount.current = true
    }
  }, [options])

  return (
    <div>
      <div style={{ color: 'white' }}>
        {answers}
      </div>
      <div className='boards'>
        {answers.map(answer => (
          <Board
            answer={answer}
            guesses={guesses}
            currentGuess={currentGuess}
            key={answer}
          />
        ))}
      </div>
      <div className='keyboard'>
        {alphabet.map(letter => (
          <KeyboardLetter
            letter={letter}
            answers={answers}
            guesses={guesses}
            handleLetterInput={() => { handleAddLetter(letter) }}
            key={letter}
          />
        ))}
      </div>
      <button onClick={() => { currentGuessDispatch({ type: 'rub' }) }}>
        RUB
      </button>
      <button onClick={handleSubmit}>
        GUESS
      </button>
    </div>
  )
}

MainGame.propTypes = {
  options: PropTypes.object,
  handleGameEnd: PropTypes.func
}
