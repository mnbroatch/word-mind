import React, { useReducer, useState, useEffect, useMemo } from 'react'
import currentGuessReducer from './current-guess-reducer.js'
import allWords from './all-words.json'
import gameWords from './game-words.json'
import curseWords from './curse-words.json'
import Rules from './rules.js'
import Shop from './shop.js'
import Results from './results.js'
import Modal from './modal.js'
import Board from './board.js'
import KeyboardLetter from './keyboard-letter.js'
import optionsReducer from './options-reducer.js'
import calculateXpEarned from './calculate-xp-earned.js'
import isGuessStrictlyValid from './is-guess-strictly-valid.js'
import useCountdown from './use-countdown'
import MoneyDisplay from './money-display'
import XpDisplay from './xp-display'
import { loadState, saveState } from './local-storage-wrapper'

const { initialOptions, initialXp, initialMoney } = loadState()

const alphabet = 'qwertyuiopasdfghjklzxcvbnm'.split('')

const alphabetRows = [
  alphabet.slice(0, 10),
  alphabet.slice(10, 19),
  alphabet.slice(19)
]

function getAnswers (options) {
  const wordLength = options.wordLength.value
  const boardsCount = options.boardsCount.value
  const answers = gameWords.filter(word => word.length === +wordLength && !curseWords.includes(word))
    .sort(() => Math.random() - 0.5).slice(0, boardsCount)

  return options.reverse.value ? answers.map(answer => answer.split('').reverse().join('')) : answers
}

export default function App () {
  const [options, optionsDispatch] = useReducer(optionsReducer, initialOptions)
  const [uiState, setUiState] = useState('game')
  const [lastXpEarned, setLastXpEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [xp, setXp] = useState(initialXp)
  const [money] = useState(initialMoney)
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
    } else if (currentGuess === 'uuddl') {
      setUiState('cheats')
    }
  }

  const handleGameEnd = (endState) => {
    const xpEarned = endState.won
      ? calculateXpEarned(options)
      : 0
    setUiState('results')
    setXp(xp + xpEarned)
    setLastXpEarned(xpEarned)
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
    if (xp >= 1) {
      optionsDispatch({
        type: 'UNLOCK_OPTION',
        optionId,
        value
      })
      handleSetOption(optionId, value)
      setXp(xp - 1)
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
    saveState({ options, xp, money })
  }, [options, xp, money])

  const handleClearAll = () => {
    localStorage.clear()
    optionsDispatch({ type: 'LOAD_INITIAL' })
    setUiState('game')
    setXp(0)
    setGuesses([])
    currentGuessDispatch({ type: 'clear' })
  }

  const handleUnlockAll = () => {
    optionsDispatch({ type: 'LOAD_FULLY_UNLOCKED' })
  }

  const possibleWords = useMemo(() => {
    return options.showPossibleWords.value
      ? gameWords.filter(word => isGuessStrictlyValid(word, guesses, answers))
      : []
  }, [guesses, answers, options])

  const sortedAnswers = [...answers].sort((a, b) => {
    if (guesses.includes(a) && !guesses.includes(b)) {
      return -1
    } else if (guesses.includes(b) && !guesses.includes(a)) {
      return 1
    } else {
      return (a).localeCompare(b)
    }
  })

  return (
    <div className='root'>
      <div className='top-bar'>
        <XpDisplay amount={xp} />
        <MoneyDisplay amount={money} />
      </div>
      <div className="main-content">
        {options.gameTimeLimit.value !== Infinity && <div className='game-time-remaining'>
          Game Time Remaining: {secondsRemainingInGame}
        </div>}
        {options.roundTimeLimit.value !== Infinity && <div className='round-time-remaining'>
          Round Time Remaining: {secondsRemainingInRound}
        </div>}
        <div className='main-game'>
          {options.revealAnswers.value && (
            <div className='revealed-answers'>
              {sortedAnswers.join(' ')}
            </div>
          )}
          <div className='boards'>
            {sortedAnswers.map(answer => (
              <Board
                answer={answer}
                guesses={guesses}
                currentGuess={currentGuess}
                key={answer}
              />
            ))}
          </div>
          <div className='keyboard'>
            {alphabetRows.map(row => (
              <div className="keyboard-row" key={row[0]}>
                {row.map(letter => (
                  <KeyboardLetter
                    letter={letter}
                    answers={sortedAnswers}
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
            open={uiState === 'cheats'}
            handleClose={() => { setUiState('game') }}
          >
            <div>DEBUG:</div>
            <button onClick={handleClearAll}>
              Clear all
            </button>
            <button onClick={handleUnlockAll}>
              Unlock All Options
            </button>
          </Modal>
          <Modal
            open={uiState === 'rules'}
            handleClose={handleGameStart}
          >
            <Rules
              options={options}
            />
          </Modal>
          <Modal
            open={uiState === 'rules'}
            handleClose={handleGameStart}
          >
            <Rules
              options={options}
            />
          </Modal>
          <Modal open={uiState === 'results'}>
            <Results
              options={options}
              xp={xp}
              lastXpEarned={lastXpEarned}
              handleSetOption={handleSetOption}
              handleUnlockOption={handleUnlockOption}
              handleClose={() => {
                setUiState('shop')
              }}
              wonLastGame={wonLastGame}
            />
          </Modal>
          <Modal
            open={uiState === 'shop'}
            handleClose={() => {
              if (uiState === 'shop') {
                handleGameStart()
              }
            }}
          >
            <Shop
              options={options}
              xp={xp}
              lastXpEarned={lastXpEarned}
              handleSetOption={handleSetOption}
              handleUnlockOption={handleUnlockOption}
              handleClose={() => {
                if (uiState === 'shop') {
                  handleGameStart()
                }
              }}
              wonLastGame={wonLastGame}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
