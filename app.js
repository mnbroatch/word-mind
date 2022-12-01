import React, { useReducer, useState, useEffect, useRef } from 'react'
import cloneDeep from 'lodash/cloneDeep'
import MainGame from './main-game.js'
import Rules from './rules.js'
import GameEnd from './game-end.js'
import Modal from './modal.js'
import defaultOptions from './default-options.js'
import optionsReducer from './options-reducer.js'
import calculatePointsEarned from './calculate-points-earned.js'
import useCountdown from './use-countdown'

const INFINITY_REPLACEMENT = '_MNB_Infinity876'

export default function App () {
  const [options, optionsDispatch] = useReducer(optionsReducer, defaultOptions)
  const [uiState, setUiState] = useState('game')
  const [gameId, setGameId] = useState(Date.now() + Math.random())
  const [lastPointsEarned, setLastPointsEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [points, setPoints] = useState(0)
  const mainGameRef = useRef()
  const { remaining: timeRemaining, reset: resetTime } = useCountdown({
    duration: options.timeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      handleGameEnd({ won: false })
    }
  })

  const secondsRemaining = Math.floor(timeRemaining / 1000)

  const handleGameEnd = (endState) => {
    setUiState('game_end')
    setGameId(Date.now() + Math.random())

    const pointsEarned = endState.won
      ? calculatePointsEarned(options)
      : 0
    setPoints(points + pointsEarned)
    setLastPointsEarned(pointsEarned)
    setWonLastGame(endState.won)
    resetTime()
  }

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
    mainGameRef.current.clear()
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
      {options.timeLimit.value !== Infinity && <div className='time-remaining'>
        Time Remaining: {secondsRemaining}
      </div>}
      <MainGame
        ref={mainGameRef}
        key={gameId}
        options={options}
        handleGameEnd={handleGameEnd}
      />
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
