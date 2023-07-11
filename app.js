import React, { useState, useEffect, useRef } from 'react'
import useRerender from './hooks/use-rerender.js'
import useInterval from './hooks/use-interval.js'
import useYarnBound from './hooks/use-yarn-bound'
import useGameState from './use-game-state'
import useEnemies from './hooks/use-enemies'

import InventoryItem from './components/inventory-item'
import Shop from './components/shop'
import Results from './components/results'
import Hub from './components/hub'
import Modal from './components/modal'
import Enemy from './components/enemy'
import PreGame from './components/pre-game'
import Controls from './components/controls'
import XpDisplay from './components/xp-display'
import HpDisplay from './components/hp-display'
import MoneyDisplay from './components/money-display'

import defaultItems from './default-items.js'

export default function App () {
  const rerender = useRerender()
  useInterval(rerender, 1000)

  const {
    xp,
    money,
    items,
    setXp,
    itemsDispatch,
    setMoney
  } = useGameState()
  const maxHp = 30
  const [uiState, setUiState] = useState('hub')
  const [wonLastGame, setWonLastGame] = useState(false)
  const [guesses, setGuesses] = useState([])
  const enemiesRef = useRef()
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(0)
  const [hp, setHp] = useState(maxHp)
  const handleGameStart = () => {
    setGuesses([])
    setHp(maxHp)
  }

  const runner = useYarnBound(
    uiState,
    setUiState,
    handleGameStart
  )

  const hurtPlayer = (damage) => {
    if (uiState === 'game') {
      setHp(prev => prev - damage)
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

  const goToHub = () => {
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
    const xpEarned = didWin ? 10 : 0
    const moneyEarned = didWin ? 0 : 20
    runner.runner.variables.set('wonLastGame', didWin)
    runner.advance()
    setWonLastGame(didWin)
    setXp(xp + xpEarned)
    setMoney(money + moneyEarned)
    setHp(maxHp)
    setGuesses([])
  }

  const handleBuyItem = (itemId) => {
    if (money >= items[itemId].cost) {
      itemsDispatch({
        type: 'BUY',
        itemId
      })
      setMoney(money - items[itemId].cost)
    }
  }

  const handleUseItem = (itemId) => {
    let canUse = false
    if (items[itemId].ownedCount > 0) {
      switch (itemId) {
        case 'potion': {
          if (hp < maxHp) {
            canUse = true
            setHp(Math.min(Math.round(hp + (maxHp / 2)), maxHp))
          }
          break
        }
        case 'bigPotion': {
          if (hp < maxHp) {
            canUse = true
            setHp(Math.min(hp + maxHp, maxHp))
          }
          break
        }
        case 'veryBigPotion': {
          canUse = true
          setHp(hp + maxHp)
          break
        }
      }
    }

    if (canUse) {
      if (uiState === 'game') {
        itemsDispatch({
          type: 'USE',
          itemId
        })
      }
    }
  }

  useEffect(() => {
    const addKey = (e) => {
      if (e.keyCode === 27 && uiState !== 'game') {
        goToHub()
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [uiState])

  console.log(enemies.map(e => e.answer))

  const inventoryItems = Object.entries(items).filter(([key, value]) => key in defaultItems && value.ownedCount > 0)

  return (
    <div className='root'>
      { typeof new URL(window.location.href).searchParams.get('showAnswers') === 'string' && enemies}
      <div className='top-bar'>
        <XpDisplay amount={xp} />
        <HpDisplay amount={hp} max={maxHp} />
        <MoneyDisplay amount={money} />
      </div>
      {uiState === 'game' && inventoryItems.length > 0 && (
        <div className="inventory">
          {inventoryItems.map(([id, { name, description, ownedCount }]) => <InventoryItem
            key={id}
            handleUseItem={() => handleUseItem(id)}
            name={name}
            description={description}
            ownedCount={ownedCount}
          />)}
        </div>
      )}
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
              goToGame={() => {
                runner.advance() // runner is "paused" on hub
              }}
              goToShop={() => {
                setUiState('shop')
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
              handleClose={goToHub}
              runner={runner}
            />
          </Modal>
          <Modal open={uiState === 'shop'}>
            <Shop
              items={items}
              handleBuyItem={handleBuyItem}
              handleClose={goToHub}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
