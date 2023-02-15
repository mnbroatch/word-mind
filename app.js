import React, { useState, useEffect, useRef } from 'react'
import useRerender from './hooks/use-rerender.js'
import useInterval from './hooks/use-interval.js'
import useYarnBound from './hooks/use-yarn-bound'
import useGameState from './use-game-state'
import useEnemies from './hooks/use-enemies'

import Results from './components/results'
import Hub from './components/hub'
import Modal from './components/modal'
import Enemy from './components/enemy'
import PreGame from './components/pre-game'
import Controls from './components/controls'
import XpDisplay from './components/xp-display'
import HpDisplay from './components/hp-display'
import MoneyDisplay from './components/money-display'

export default function App () {
  const rerender = useRerender()
  useInterval(rerender, 1000)

  const {
    xp,
    money,
    setXp,
    setMoney
  } = useGameState()
  const maxHp = 15
  const [uiState, setUiState] = useState('hub')
  const [wonLastGame, setWonLastGame] = useState(false)
  const [guesses, setGuesses] = useState([])
  const enemiesRef = useRef()
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(0)
  const [hp, setHp] = useState(maxHp)
  const handleGameStart = () => {
    setGuesses([])
    setHp(maxHp)
    setUiState('game')
  }

  const runner = useYarnBound(
    uiState,
    setUiState,
    handleGameStart
  )

  const hurtPlayer = (damage) => {
    if (uiState === 'game') {
      console.log('hp1', hp)
      setHp(prev => prev - damage)
      console.log('hp2', hp)
      if (hp - damage <= 0) {
        handleGameEnd(false)
      }
    }
  }

  const enemies = useEnemies(
    runner.currentResult.metadata.enemies || 'monster',
    guesses,
    hurtPlayer
  )

  let selectedEnemy = enemies[selectedEnemyIndex]
  if (!selectedEnemy || selectedEnemy.dead) {
    const firstAliveEnemyIndex = enemies.findIndex(e => !e.dead)
    setSelectedEnemyIndex(firstAliveEnemyIndex)
    selectedEnemy = enemies[firstAliveEnemyIndex]
  }

  const handleGoToHub = () => {
    setUiState('hub')
    runner.jump('hub') // In case we back out of a level intro
  }

  const handleGuess = (guess) => {
    const isValidGuess = selectedEnemy.isGuessValid(guess)

    if (isValidGuess) {
      const boardWithLastVisibleBottom = [...enemiesRef.current.children].reverse().find((board) => {
        const topToBoardBottomDistance = board.offsetTop + board.scrollHeight
        const topToBottomVisibleDistance = enemiesRef.current.scrollTop + enemiesRef.current.offsetHeight
        return topToBoardBottomDistance >= enemiesRef.current.scrollTop
          && topToBoardBottomDistance <= topToBottomVisibleDistance
      })

      let topToFirstBoardBottomDistance
      if (boardWithLastVisibleBottom) {
        topToFirstBoardBottomDistance = boardWithLastVisibleBottom.offsetTop + boardWithLastVisibleBottom.scrollHeight
      }

      setGuesses((prevGuesses) => Object.assign(
        {},
        prevGuesses,
        {
          [selectedEnemyIndex]: [
            ...(prevGuesses[selectedEnemyIndex] || []),
            guess
          ]
        }
      ))

      if (boardWithLastVisibleBottom) {
        const newTopToFirstBoardBottomDistance = boardWithLastVisibleBottom.offsetTop + boardWithLastVisibleBottom.scrollHeight
        enemiesRef.current.scrollTop += newTopToFirstBoardBottomDistance - topToFirstBoardBottomDistance
      }

      if (enemies.every(({ guesses, answer }) => [...guesses, guess].includes(answer))) {
        handleGameEnd(true)
      }
    }

    return isValidGuess
  }

  function handleGameEnd (didWin) {
    const xpEarned = 10
    const moneyEarned = 10
    runner.runner.variables.set('wonLastGame', didWin)
    runner.advance()
    setWonLastGame(didWin)
    setXp(xp + xpEarned)
    setMoney(money + moneyEarned)
    setHp(maxHp)
    setGuesses([])
    runner.history = []
    setUiState('results')
  }

  useEffect(() => {
    const addKey = (e) => {
      if (e.keyCode === 27 && uiState !== 'game') {
        handleGoToHub()
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [uiState])

  console.log(enemies.map(e => e.answer))

  return (
    <div className='root'>
      { typeof new URL(window.location.href).searchParams.get('showAnswers') === 'string' && enemies}
      <div className='top-bar'>
        <XpDisplay amount={xp} />
        <HpDisplay amount={hp} max={maxHp} />
        <MoneyDisplay amount={money} />
      </div>
      <div className="main-content">
        <div className='main-game'>
          <div ref={enemiesRef} className='enemies'>
            {enemies.map(enemy => (
              <div
                key={enemy.index}
                onClick={() => { setSelectedEnemyIndex(enemy.index) }}
                className={[
                  'enemy-container',
                  selectedEnemyIndex === enemy.index && 'enemy-container--selected'
                ].filter(Boolean).join(' ')}
              >
                <Enemy {...enemy} />
              </div>
            ))}
          </div>
          <Controls
            submitGuess={handleGuess}
            wordLength={selectedEnemy.config.wordLength}
            answers={[selectedEnemy.answer]}
            guesses={selectedEnemy.guesses}
          />
        </div>
        <div className='modals'>
          <a
            className={[
              'modals__background',
              uiState !== 'game' && 'modals__background--active'
            ].filter(Boolean).join(' ')}
          >
          </a>
          <Modal open={uiState === 'hub'}>
            <Hub
              handleGoToGame={() => {
                runner.advance() // runner is "paused" on hub
                runner.history = []
                setUiState('pre-game')
              }}
            />
          </Modal>
          <Modal open={uiState === 'results'}>
            <Results
              xp={xp}
              answers={enemies.map((e) => e.answer)}
              wonLastGame={wonLastGame}
              runner={runner}
            />
          </Modal>
          <Modal open={uiState === 'pre-game'}>
            <PreGame
              startGame={handleGameStart}
              handleClose={handleGoToHub}
              runner={runner}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
