import React, { useReducer, useState, useEffect } from 'react'
import MainGame from './main-game.js'
import Options from './options.js'
import GameEnd from './game-end.js'
import defaultOptions from './default-options.js'
import optionsReducer from './options-reducer.js'
import calculatePointsEarned from './calculate-points-earned.js'

export default function App () {
  const [options, optionsDispatch] = useReducer(optionsReducer, defaultOptions)
  const [uiState, setUiState] = useState('game')
  const [gameId, setGameId] = useState(Date.now() + Math.random())
  const [lastPointsEarned, setLastPointsEarned] = useState(0)
  const [points, setPoints] = useState(0)

  const handleGameEnd = (endState) => {
    setUiState('game_end')
    setGameId(Date.now() + Math.random())

    const pointsEarned = calculatePointsEarned(options, endState)
    setPoints(points + pointsEarned)
    setLastPointsEarned(pointsEarned)
  }

  const handleClose = () => { setUiState('game') }

  const handleSetOption = (optionName, value) => {
    if (options[optionName].unlocked) {
      optionsDispatch({
        type: 'SET_OPTION',
        optionName,
        value
      })
    }
  }

  const handleUnlockOption = (optionName) => {
    const cost = options[optionName].cost
    if (!options[optionName].unlocked && points >= cost) {
      optionsDispatch({
        type: 'UNLOCK_OPTION',
        optionName,
        unlocked: true
      })
      setPoints(points - cost)
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
    const optionsEntriesToSave = Object.entries(options).map(([key, { unlocked, value }]) => [key, { unlocked, value }])
    localStorage.setItem('word-mind_options', JSON.stringify(Object.fromEntries(optionsEntriesToSave)))
    localStorage.setItem('word-mind_points', JSON.stringify(points))
  }, [options, points])

  // localStorage.removeItem('word-mind_options')
  // localStorage.removeItem('word-mind_points')

  return (
    <div className='root'>
      <button onClick={() => setUiState(uiState === 'options' ? 'game' : 'options')}>
        Options
      </button>
      <div className='points'>
        {points} Points
      </div>
      <div className='screens'>
        <div className='screens--inner'>
          <MainGame
            key={gameId}
            options={options}
            handleGameEnd={handleGameEnd}
          />
          <div className={[
            'screen',
            uiState === 'options' && 'screen--open'
          ].filter(Boolean).join(' ')}>
            <Options
              options={options}
              handleClose={handleClose}
            />
          </div>
          <div className={[
            'screen',
            uiState === 'game_end' && 'screen--open'
          ].filter(Boolean).join(' ')}>
            <GameEnd
              options={options}
              points={points}
              lastPointsEarned={lastPointsEarned}
              handleClose={handleClose}
              handleSetOption={handleSetOption}
              handleUnlockOption={handleUnlockOption}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
