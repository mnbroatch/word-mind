import React, { useReducer, useState, useEffect, useMemo } from 'react'

import merge from 'lodash/merge.js'
import cloneDeep from 'lodash/cloneDeep'
import currentGuessReducer from './current-guess-reducer.js'
import allWords from './all-words.json'
import gameWords from './game-words.json'
import curseWords from './curse-words.json'
import Rules from './rules.js'
import GameEnd from './game-end.js'
import Modal from './modal.js'
import Board from './board.js'
import KeyboardLetter from './keyboard-letter.js'
import optionsReducer from './options-reducer.js'
import calculatePointsEarned from './calculate-points-earned.js'
import useCountdown from './use-countdown'
import defaultOptions from './default-options.js'
import getLetterStates from './get-letter-states'

// present, absent, correct
function isGuessStrictlyValid (guess, previousGuesses, answers) {
  const unsolvedAnswers = answers.filter(answer => !previousGuesses.includes(answer))
  return unsolvedAnswers.some((answer) => {
    if (guess.length !== answer.length) return false

    const possibilityRules = {
      letterCounts: {},
      slots: Array.from({ length: answer.length }).map(() => ({
        correct: null,
        incorrect: new Set()
      }))
    }

    previousGuesses.forEach((prevGuess) => {
      const letterStates = getLetterStates(answer, prevGuess)
      letterStates.forEach((letterState, i) => {
        const letter = prevGuess[i]
        if (letterState === 'correct') {
          possibilityRules.slots[i].correct = letter
        } else {
          possibilityRules.slots[i].incorrect.add(letter)
        }
      })

      const uniqueLetters = Array.from(new Set(prevGuess.split('')))

      uniqueLetters.forEach((letter) => {
        const numOccurrances = prevGuess.split('').filter(l => l === letter).length
        const numPresentOccurrances = prevGuess.split('').filter((l, i) => l === letter && letterStates[i] !== 'absent').length

        if (!possibilityRules.letterCounts[letter]) {
          possibilityRules.letterCounts[letter] = {
            min: 0,
            max: null
          }
        }

        if (numOccurrances > numPresentOccurrances) {
          possibilityRules.letterCounts[letter].min = numPresentOccurrances
          possibilityRules.letterCounts[letter].max = numPresentOccurrances
        } else {
          possibilityRules.letterCounts[letter].min = Math.max(numPresentOccurrances, possibilityRules.letterCounts[letter].min)
        }
      })
    })

    const letterCountsArePossible = Object.entries(possibilityRules.letterCounts).every(([letter, { min, max }]) => {
      const numOccurrances = guess.split('').filter(l => l === letter).length
      return numOccurrances >= min
        && (max === null || numOccurrances <= max)
    })

    const letterPositionsArePossible = possibilityRules.slots.every(({ correct, incorrect }, index) => {
      const letter = guess[index]
      return correct
        ? letter === correct
        : !incorrect.has(letter)
    })

    return letterCountsArePossible && letterPositionsArePossible
  })
}

// TODO: qwerty
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

function getAnswers (options) {
  const wordLength = options.wordLength.value
  const boardsCount = options.boardsCount.value
  const answers = gameWords.filter(word => word.length === +wordLength && !curseWords.includes(word))
    .sort(() => Math.random() - 0.5).slice(0, boardsCount)
  return options.reverse.value ? answers.map(answer => answer.split('').reverse().join('')) : answers
}

const savedOptions = JSON.parse(localStorage.getItem('word-mind_options'))
if (savedOptions) {
  Object.values(savedOptions).forEach(option => {
    if (option.value === INFINITY_REPLACEMENT) {
      option.value = Infinity
    }

    option.unlockedValues.forEach((value, i) => {
      if (value === INFINITY_REPLACEMENT) {
        option.unlockedValues[i] = Infinity
      }
    })
  })
}

const initialOptions = merge({}, defaultOptions, savedOptions)
Object.keys(initialOptions).forEach((key) => {
  if (!defaultOptions[key]) {
    delete initialOptions[key]
  }
})

let initialPoints = 0
const savedPoints = localStorage.getItem('word-mind_points')
if (savedPoints) {
  initialPoints = JSON.parse(savedPoints)
}

export default function App () {
  const [options, optionsDispatch] = useReducer(optionsReducer, initialOptions)
  const [uiState, setUiState] = useState('game')
  const [lastPointsEarned, setLastPointsEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [points, setPoints] = useState(initialPoints)
  const [answers, setAnswers] = useState(getAnswers(options))
  const [guesses, setGuesses] = useState([])
  const [currentGuess, currentGuessDispatch] = useReducer(currentGuessReducer, '')

  const handleGuess = () => {
    if (
      !guesses.includes(currentGuess)
        && currentGuess.length === options.wordLength.value
        && allWords.includes(
          options.reverse.value
            ? currentGuess.split('').reverse().join('')
            : currentGuess
        )
        && (!options.strictMode.value || isGuessStrictlyValid(currentGuess, guesses, answers))
    ) {
      setGuesses([...guesses, currentGuess])
      currentGuessDispatch({ type: 'clear' })
      resetRoundTime()
    }
  }

  const handleGameEnd = (endState) => {
    const pointsEarned = endState.won
      ? calculatePointsEarned(options)
      : 0
    setUiState('game_end')
    setPoints(points + pointsEarned)
    setLastPointsEarned(pointsEarned)
    setWonLastGame(endState.won)
    setGuesses([])
    setAnswers(getAnswers(options))
  }

  const handleAddLetter = (letter) => {
    if (
      alphabet.includes(letter.toLowerCase())
      && currentGuess.length < options.wordLength.value
    ) {
      currentGuessDispatch({ type: 'add_letter', letter })
    }
  }

  const handleGameStart = () => {
    resetGameTime()
    resetRoundTime()
    setGuesses([])
    setUiState('game')
    setAnswers(getAnswers(options))
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
        handleGuess()
      } else {
        handleAddLetter(String.fromCharCode(e.keyCode))
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [handleGuess, handleAddLetter])

  useEffect(() => {
    const won = answers.length && answers.every(answer => guesses.includes(answer))
    const lost = guesses.length >= options.maxGuesses.value
    if (won || lost) {
      handleGameEnd({ answers, guesses, won })
    }
  }, [guesses, answers, options, handleGameEnd])

  const { remaining: gameTimeRemaining, reset: resetGameTime } = useCountdown({
    duration: options.gameTimeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      handleGameEnd({ won: false })
    }
  })

  const { remaining: roundTimeRemaining, reset: resetRoundTime } = useCountdown({
    duration: options.roundTimeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      setGuesses([...guesses, ''])
      currentGuessDispatch({ type: 'clear' })
      resetRoundTime()
    }
  })

  const secondsRemainingInGame = Math.round(gameTimeRemaining / 1000)
  const secondsRemainingInRound = Math.round(roundTimeRemaining / 1000)

  const handleSetOption = (optionId, value) => {
    optionsDispatch({
      type: 'SET_OPTION',
      optionId,
      value
    })
  }

  const handleUnlockOption = (optionId, value) => {
    if (points >= 1) {
      optionsDispatch({
        type: 'UNLOCK_OPTION',
        optionId,
        value
      })
      handleSetOption(optionId, value)
      setPoints(points - 1)
    }
  }

  useEffect(() => {
    const addKey = (e) => {
      if (e.keyCode === 27 && uiState !== 'game') {
        handleGameStart()
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [uiState])

  useEffect(() => {
    const optionsClone = cloneDeep(options)
    if (optionsClone) {
      Object.values(optionsClone).forEach(option => {
        if (option.value === Infinity) {
          option.value = INFINITY_REPLACEMENT
        }

        option.unlockedValues.forEach((value, i) => {
          if (value === Infinity) {
            option.unlockedValues[i] = INFINITY_REPLACEMENT
          }
        })
      })
    }

    const optionsEntriesToSave = Object.entries(optionsClone).map(([key, { unlockedValues, value }]) => [key, { unlockedValues, value }])

    localStorage.setItem('word-mind_options', JSON.stringify(Object.fromEntries(optionsEntriesToSave)))
    localStorage.setItem('word-mind_points', JSON.stringify(points))
  }, [options, points])

  const handleClearAll = () => {
    localStorage.clear()
    optionsDispatch({ type: 'LOAD_INITIAL' })
    setUiState('game')
    setPoints(0)
    setGuesses([])
    currentGuessDispatch({ type: 'clear' })
  }

  const possibleWords = useMemo(() => {
    return gameWords.filter(word => isGuessStrictlyValid(word, guesses, answers))
  }, [guesses, answers])

  return (
    <div className='root'>
      <button onClick={() => setPoints(points => points + 100)}>
        Debug: Free 100 pts
      </button>
      <button onClick={handleClearAll}>
        Debug: Clear all
      </button>
      <div className='points'>
        {points} Points
      </div>
      {options.gameTimeLimit.value !== Infinity && <div className='game-time-remaining'>
        Game Time Remaining: {secondsRemainingInGame}
      </div>}
      {options.roundTimeLimit.value !== Infinity && <div className='round-time-remaining'>
        Round Time Remaining: {secondsRemainingInRound}
      </div>}
      <div className='main-game'>
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
          DEL
        </button>
        <button onClick={handleGuess}>
          GUESS
        </button>
      </div>
      {options.showPossibleWords.value && (
        <div>
          Possible words:
          <div>
            { possibleWords.join(' ') }
          </div>
        </div>
      )}
      <div className='modals'>
        <a
          className={[
            'modals__background',
            uiState !== 'game' && 'modals__background--active'
          ].filter(Boolean).join(' ')}
          onClick={handleGameStart}
        >
        </a>
        <Modal
          open={uiState === 'rules'}
          handleClose={handleGameStart}
        >
          <Rules
            options={options}
          />
        </Modal>
        <Modal
          open={uiState === 'game_end'}
          handleClose={() => {
            if (uiState === 'game_end') {
              handleGameStart()
            }
          }}
        >
          <GameEnd
            options={options}
            points={points}
            lastPointsEarned={lastPointsEarned}
            handleSetOption={handleSetOption}
            handleUnlockOption={handleUnlockOption}
            wonLastGame={wonLastGame}
          />
        </Modal>
      </div>
    </div>
  )
}
