import React, { useState, useEffect, useMemo, useRef } from 'react'
import YarnBound from 'yarn-bound'
import useCountdown from './hooks/use-countdown'
import usePrevious from './hooks/use-previous'
import useGameState from './use-game-state'

import Shop from './components/shop'
import Equipment from './components/equipment'
import Results from './components/results'
import Skills from './components/skills'
import Hub from './components/hub'
import Modal from './components/modal'
import Board from './components/board'
import PreGame from './components/pre-game'
import Controls from './components/controls'
import MoneyDisplay from './components/money-display'
import XpDisplay from './components/xp-display'

import calculateXpEarned from './utils/calculate-xp-earned'
import calculateXpCost from './utils/calculate-xp-cost'
import isGuessStrictlyValid from './utils/is-guess-strictly-valid'

import allWords from './data/all-words.json'
import gameWords from './data/game-words.json'
import curseWords from './data/curse-words.json'

import story from './story.js'

const OPTION_COST = 2

function isItemActive (item) {
  return item.activeUntil > Date.now()
}

function getAnswers (skills, items, equipment) {
  const wordLength = skills.wordLength.value
  const boardsCount = skills.boardsCount.value
  const possibleWords = equipment.useFullDictionary.active ? allWords : gameWords

  const answers = possibleWords.filter(word => word.length === +wordLength && !curseWords.includes(word))
    .sort(() => Math.random() - 0.5).slice(0, boardsCount)
  return isItemActive(items.reverse) ? answers.map(answer => answer.split('').reverse().join('')) : answers
}

export default function App () {
  const {
    skills,
    items,
    equipment,
    xp,
    money,
    skillsDispatch,
    itemsDispatch,
    equipmentDispatch,
    setXp,
    setMoney,
    randomizeRandomSkills,
    completedLevelIds,
    addCompletedLevelId
  } = useGameState()
  const [uiState, _setUiState] = useState('hub')
  const [lastXpEarned, setLastXpEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [answers, setAnswers] = useState(getAnswers(skills, items, equipment))
  const [shotIsCalled, setShotIsCalled] = useState(false)
  const [guesses, setGuesses] = useState([])
  const previousGuesses = usePrevious(guesses)
  const boardsRef = useRef()

  const handleCommand = function ({ command }) {
    const match = command.match(/^setUiState (.+)/)
    setUiState(match[1])
  }

  // rework if performance issues arise
  const runner = useRef(new YarnBound({
    dialogue: story,
    startAt: 'level_1',
    handleCommand
  })).current

  const setUiState = (state) => {
    // In case we back out of a level intro
    if (state === 'hub') {
      runner.jump('hub')
    }
    runner.history = []
    _setUiState(state)
  }

  const handleGuess = (guess) => {
    const isValidGuess = !guesses.includes(guess)
      && guess.length === skills.wordLength.value
      && allWords.includes(
        isItemActive(items.reverse)
          ? guess.split('').reverse().join('')
          : guess
      )
      && (!equipment.strictMode.active || isGuessStrictlyValid(guess, guesses, answers))

    if (isValidGuess) {
      const boardWithLastVisibleBottom = [...boardsRef.current.children].reverse().find((board) => {
        const topToBoardBottomDistance = board.offsetTop + board.scrollHeight
        const topToBottomVisibleDistance = boardsRef.current.scrollTop + boardsRef.current.offsetHeight
        return topToBoardBottomDistance >= boardsRef.current.scrollTop
          && topToBoardBottomDistance <= topToBottomVisibleDistance
      })

      let topToFirstBoardBottomDistance
      if (boardWithLastVisibleBottom) {
        topToFirstBoardBottomDistance = boardWithLastVisibleBottom.offsetTop + boardWithLastVisibleBottom.scrollHeight
      }

      setGuesses([...guesses, guess])

      if (boardWithLastVisibleBottom) {
        const newTopToFirstBoardBottomDistance = boardWithLastVisibleBottom.offsetTop + boardWithLastVisibleBottom.scrollHeight
        boardsRef.current.scrollTop += newTopToFirstBoardBottomDistance - topToFirstBoardBottomDistance
      }

      resetRoundTime()
    } else if (guess === 'uuddl') {
      setUiState('cheats')
    } else if (guess === 'ldduu') {
      setUiState('hub')
    }

    return isValidGuess
  }

  const handleGameEnd = (endState) => {
    const callShotWagerResult = endState.won ? skills.callShot.value : 0 - skills.callShot.value
    const xpEarned = (
      endState.won
        ? calculateXpEarned(skills)
        : 0
    ) + callShotWagerResult
    const moneyEarned = 10
    runner.runner.variables.set('wonLastGame', endState.won)
    runner.advance()
    setWonLastGame(endState.won)
    setXp(xp + xpEarned)
    setMoney(money + moneyEarned)
    setLastXpEarned(xpEarned)
    setGuesses([])
    skillsDispatch({
      type: 'GAIN_MASTERY',
      skills
    })
    setUiState('results')
  }

  const handleAddOneXp = (endState) => {
    setXp(xp + 1)
  }

  const handleAddOneMoney = (endState) => {
    setMoney(money + 1)
  }

  const handleGameStart = () => {
    randomizeRandomSkills()
    resetGameTime()
    resetRoundTime()
    setGuesses([])
    setUiState('game')
    setAnswers(getAnswers(skills, items, equipment))
  }

  useEffect(() => {
    const didJustGuess = previousGuesses && previousGuesses.length === guesses.length - 1
    const guessedAnswersCount = answers.filter(answer => guesses.includes(answer)).length
    const previousGuessedAnswersCount = answers.filter(answer => previousGuesses && previousGuesses.includes(answer)).length
    const didJustGuessAnswer = guessedAnswersCount !== previousGuessedAnswersCount

    let status = 'playing'
    if (
      (shotIsCalled && didJustGuess && !didJustGuessAnswer)
      // || (didJustGuessAnswer && skills.callShot.value && !shotIsCalled)
      || (guesses.length >= skills.maxWrongGuesses.value + skills.boardsCount.value)
    ) {
      status = 'lost'
    } else if (answers.length === guessedAnswersCount) {
      status = 'won'
    }

    if (status !== 'playing') {
      handleGameEnd({ answers, guesses, won: status === 'won' })
    }
    if (didJustGuess) {
      setShotIsCalled(false)
    }
  }, [guesses, answers, skills, handleGameEnd, shotIsCalled])

  const { remaining: gameTimeRemaining, reset: resetGameTime } = useCountdown({
    duration: skills.gameTimeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      handleGameEnd({ won: false })
    }
  })

  const { remaining: roundTimeRemaining, reset: resetRoundTime } = useCountdown({
    duration: skills.roundTimeLimit.value * 1000,
    refreshRate: uiState === 'game' ? undefined : null,
    onCountdownEnd: () => {
      handleGameEnd({ won: false })
    }
  })

  const secondsRemainingInGame = Math.round(gameTimeRemaining / 1000)
  const secondsRemainingInRound = Math.round(roundTimeRemaining / 1000)

  const handleSetOption = (skillId, value) => {
    skillsDispatch({
      type: 'SET_OPTION',
      skillId,
      value
    })
  }

  const handleUnlockSkill = (skillId, value) => {
    const cost = calculateXpCost(skills)
    if (xp >= cost) {
      skillsDispatch({
        type: 'UNLOCK_SKILL',
        skillId,
        value
      })
      setXp(xp - cost)
    }
  }

  const handleUnlockOption = (skillId, value) => {
    const optionCost = OPTION_COST
    const skill = skills[skillId]
    const totalMastery = skill.options.reduce((acc, opt) => acc + opt.mastery, 0)
    const spentMastery = (skill.unlockedValues.length - 2) * optionCost
    const remainingMastery = totalMastery - spentMastery
    if (remainingMastery >= optionCost) {
      skillsDispatch({
        type: 'UNLOCK_OPTION',
        skillId,
        value
      })
    }
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

  const handleBuyEquipment = (equipmentId) => {
    if (!equipment[equipmentId].owned && money >= equipment[equipmentId].cost) {
      equipmentDispatch({
        type: 'UNLOCK',
        equipmentId
      })
      setMoney(money - equipment[equipmentId].cost)
    }
  }

  const handleUseItem = (itemId) => {
    itemsDispatch({
      type: 'USE',
      itemId
    })
  }

  const handleToggleEquipment = (equipmentId) => {
    equipmentDispatch({
      type: 'TOGGLE',
      equipmentId
    })
  }

  const handleClose = () => {
    if (uiState !== 'game') {
      setUiState('hub')
    }
  }

  useEffect(() => {
    const addKey = (e) => {
      if (e.keyCode === 27) {
        handleClose()
      }
    }
    document.addEventListener('keydown', addKey)
    return () => { document.removeEventListener('keydown', addKey) }
  }, [uiState])

  // const handleClearAll = () => {
  //   localStorage.clear()
  //   skillsDispatch({ type: 'LOAD_INITIAL' })
  //   setUiState('game')
  //   setXp(0)
  //   setGuesses([])
  // }
  //           <button onClick={handleClearAll}>
  //             Clear all
  //           </button>

  // const handleUnlockAll = () => {
  //   skillsDispatch({ type: 'UNLOCK_ALL' })
  // }
  //           <button onClick={handleUnlockAll}>
  //             Unlock All Skills
  //           </button>

  const possibleWords = useMemo(() => {
    return isItemActive(items.showPossibleWords)
      ? gameWords.filter(word => isGuessStrictlyValid(word, guesses, answers))
      : []
  }, [guesses, answers, skills])

  return (
    <div className='root'>
      { answers }
      <div className='top-bar'>
        <XpDisplay amount={xp} />
        <MoneyDisplay amount={money} />
      </div>
      <div className="main-content">
        {skills.gameTimeLimit.value !== Infinity && <div className='game-time-remaining'>
          Game Time Remaining: {secondsRemainingInGame}
        </div>}
        {skills.roundTimeLimit.value !== Infinity && <div className='round-time-remaining'>
          Round Time Remaining: {secondsRemainingInRound}
        </div>}
        {!!skills.callShot.value && (
          <button
            className={[
              'button',
              'call-shot-button',
              shotIsCalled && 'call-shot-button--active'
            ].filter(Boolean).join(' ')}
            onClick={() => { setShotIsCalled(prev => !prev) }}
          >
            Call Shot (Wager {skills.callShot.value} XP)
          </button>
        )}
        <div className='main-game'>
          {isItemActive(items.revealAnswers) && (
            <div className='revealed-answers'>
              {answers.join(' ')}
            </div>
          )}
          <div ref={boardsRef} className='boards'>
            {answers.map(answer => (
              <Board
                answer={answer}
                guesses={guesses}
                key={answer}
              />
            ))}
          </div>
          <Controls
            submitGuess={handleGuess}
            wordLength={skills.wordLength.value}
            answers={answers}
            guesses={guesses}
          />
        </div>
        {isItemActive(items.showPossibleWords) && (
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
          >
          </a>
          <Modal open={uiState === 'cheats'}>
            <div>DEBUG:</div>
            <button onClick={handleAddOneXp}>
              Add 1 XP
            </button>
            <button onClick={handleAddOneMoney}>
              Add $1
            </button>
          </Modal>
          <Modal open={uiState === 'hub'}>
            <Hub
              items={items}
              equipment={equipment}
              handleUseItem={handleUseItem}
              handleToggleEquipment={handleToggleEquipment}
              handleGoToSkills={() => {
                setUiState('skills')
              }}
              handleGoToShop={() => {
                setUiState('shop')
              }}
              handleGoToEquipment={() => {
                setUiState('equipment')
              }}
              handleGoToGame={() => {
                setUiState('pre-game')
              }}
            />
          </Modal>
          <Modal open={uiState === 'results'}>
            <Results
              xp={xp}
              answers={answers}
              lastXpEarned={lastXpEarned}
              handleClose={handleClose}
              wonLastGame={wonLastGame}
              runner={runner}
            />
          </Modal>
          <Modal open={uiState === 'skills'}>
            <Skills
              skills={skills}
              xp={xp}
              handleUnlockSkill={handleUnlockSkill}
              handleUnlockOption={handleUnlockOption}
              handleSetOption={handleSetOption}
              handleClose={handleClose}
              optionCost={OPTION_COST}
            />
          </Modal>
          <Modal open={uiState === 'shop'}>
            <Shop
              items={items}
              handleBuyItem={handleBuyItem}
              handleClose={handleClose}
            />
          </Modal>
          <Modal open={uiState === 'equipment'}>
            <Equipment
              equipment={equipment}
              money={money}
              handleBuyEquipment={handleBuyEquipment}
              handleClose={handleClose}
            />
          </Modal>
          <Modal open={uiState === 'pre-game'}>
            <PreGame
              startGame={handleGameStart}
              handleClose={handleClose}
              runner={runner}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
