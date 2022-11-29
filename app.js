import React, { useReducer, useState, useEffect, useRef } from 'react'
import MainGame from './main-game.js'
import Rules from './rules.js'
import GameEnd from './game-end.js'
import Modal from './modal.js'
import defaultOptions from './default-options.js'
import optionsReducer from './options-reducer.js'
import calculatePointsEarned from './calculate-points-earned.js'

export default function App () {
  const [options, optionsDispatch] = useReducer(optionsReducer, defaultOptions)
  const [uiState, setUiState] = useState('game')
  const [gameId, setGameId] = useState(Date.now() + Math.random())
  const [lastPointsEarned, setLastPointsEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [points, setPoints] = useState(0)
  const mainGameRef = useRef()

  const handleGameEnd = (endState) => {
    setUiState('game_end')
    setGameId(Date.now() + Math.random())

    const pointsEarned = calculatePointsEarned(options, endState)
    setPoints(points + pointsEarned)
    setLastPointsEarned(pointsEarned)
    setWonLastGame(endState.won)
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
    const savedOptions = localStorage.getItem('word-mind_options')
    const savedPoints = localStorage.getItem('word-mind_points')
    if (savedOptions && savedPoints !== null) {
      optionsDispatch({ type: 'LOAD_INITIAL', savedOptions: JSON.parse(savedOptions) })
      setPoints(JSON.parse(savedPoints))
    }
  }, [])

  useEffect(() => {
    const optionsEntriesToSave = Object.entries(options).map(([key, { unlockedValues, value }]) => [key, { unlockedValues, value }])
    localStorage.setItem('word-mind_options', JSON.stringify(Object.fromEntries(optionsEntriesToSave)))
    localStorage.setItem('word-mind_points', JSON.stringify(points))
  }, [options, points])

  const handleClearAll = () => {
    localStorage.removeItem('word-mind_options')
    localStorage.removeItem('word-mind_points')
    optionsDispatch({ type: 'LOAD_INITIAL', savedOptions: defaultOptions })
    setUiState('game')
    setPoints(100)
    mainGameRef.current.clear()
  }

  return (
    <div className='root'>
      <button onClick={() => { setUiState(uiState === 'rules' ? 'game' : 'rules') }}>
        Rules
      </button>
      <button onClick={handleClearAll}>
        Give 100 pts
      </button>
      <div className='points'>
        {points} Points
      </div>
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
