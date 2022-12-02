import React, { useReducer, useState, useEffect, useRef } from 'react'
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
import defaultOptions from './default-options.js'
import optionsReducer from './options-reducer.js'
import calculatePointsEarned from './calculate-points-earned.js'
import useCountdown from './use-countdown'

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

export default function App () {
  const [options, optionsDispatch] = useReducer(optionsReducer, defaultOptions)
  const [uiState, setUiState] = useState('game')
  const [gameId, setGameId] = useState(Date.now() + Math.random())
  const [lastPointsEarned, setLastPointsEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [points, setPoints] = useState(0)
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
    setGameId(Date.now() + Math.random())
    setPoints(points + pointsEarned)
    setLastPointsEarned(pointsEarned)
    setWonLastGame(endState.won)
    resetGameTime()
    resetRoundTime()
  }

  const handleAddLetter = (letter) => {
    if (
      alphabet.includes(letter.toLowerCase())
      && currentGuess.length < options.wordLength.value
    ) {
      currentGuessDispatch({ type: 'add_letter', letter })
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

  const { remaining: gameTimeRemaining, reset: resetGameTime } = useCountdown({
    duration: options.gameTimeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      handleGameEnd({ won: false })
    }
  })

  const { remaining: roundTimeRemaining, reset: resetRoundTime } = useCountdown({
    duration: options.gameTimeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      setGuesses([...guesses, currentGuess])
      currentGuessDispatch({ type: 'clear' })
      resetRoundTime()
    }
  })

  const secondsRemainingInGame = Math.floor(gameTimeRemaining / 1000)
  const secondsRemainingInRound = Math.floor(roundTimeRemaining / 1000)

  const handleClose = () => { setUiState('game') }

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
      setPoints(points - 1)
    }
  }

  useEffect(() => {
    const addKey = (e) => {
      if (e.keyCode === 27) {
        handleClose(String.fromCharCode(e.keyCode))
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [])

  useEffect(() => {
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

    const savedPoints = localStorage.getItem('word-mind_points')
    if (savedOptions) {
      optionsDispatch({ type: 'LOAD_INITIAL', savedOptions })
    }
    if (savedPoints !== null) {
      setPoints(JSON.parse(savedPoints))
    }
  }, [])

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
      {options.gameTimeLimit.value !== Infinity && <div className='time-remaining'>
        Game Time Remaining: {secondsRemainingInGame}
      </div>}
      {options.gameTimeLimit.value !== Infinity && <div className='time-remaining'>
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
      <div className='modals'>
        <a
          className={[
            'modals__background',
            uiState !== 'game' && 'modals__background--active'
          ].filter(Boolean).join(' ')}
          onClick={handleClose}
        >
        </a>
        <Modal
          open={uiState === 'rules'}
          handleClose={handleClose}
        >
          <Rules
            options={options}
          />
        </Modal>
        <Modal
          open={uiState === 'game_end'}
          handleClose={handleClose}
        >
          <GameEnd
            options={options}
            points={points}
            lastPointsEarned={lastPointsEarned}
            handleClose={handleClose}
            handleSetOption={handleSetOption}
            handleUnlockOption={handleUnlockOption}
            wonLastGame={wonLastGame}
          />
        </Modal>
      </div>
    </div>
  )
}
