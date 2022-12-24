import React, { useState, useEffect, useMemo } from 'react'
import debounce from 'lodash/debounce'
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
import Controls from './components/controls'
import MoneyDisplay from './components/money-display'
import XpDisplay from './components/xp-display'

import calculateXpEarned from './utils/calculate-xp-earned'
import calculateXpCost from './utils/calculate-xp-cost'
import isGuessStrictlyValid from './utils/is-guess-strictly-valid'

import allWords from './data/all-words.json'
import gameWords from './data/game-words.json'
import curseWords from './data/curse-words.json'

const OPTION_COST = 2

let x = 'x'

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
    randomizeRandomSkills
  } = useGameState()
  const [uiState, setUiState] = useState('game')
  const [lastXpEarned, setLastXpEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [answers, setAnswers] = useState(getAnswers(skills, items, equipment))
  const [shotIsCalled, setShotIsCalled] = useState(false)
  // const [guesses, setGuesses] = useState([
  //   'THERE',
  //   'HEART',
  //   'TONER',
  //   'THORN',
  //   'BOATS',
  //   'LOSER',
  //   'FAILS',
  //   'FLAIR',
  //   'CHAIR',
  //   'APPLE',
  //   'WINDY',
  //   'DENSE',
  //   'BOOTS',
  //   'STOOP',
  //   'HONOR',
  //   'DREAM',
  //   'CHUNK',
  //   'HELLO',
  //   'BLEND',
  //   'GLOWS',
  //   'SLOWS',
  //   'DOGGY'
  // ])
  const [guesses, setGuesses] = useState([])
  const previousGuesses = usePrevious(guesses)

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
      setGuesses([...guesses, guess])
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
    setUiState('results')
    setXp(xp + xpEarned)
    setMoney(money + moneyEarned)
    setLastXpEarned(xpEarned)
    setWonLastGame(endState.won)
    setGuesses([])
    skillsDispatch({
      type: 'GAIN_MASTERY',
      skills
    })
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
    const resizeHandler = debounce(() => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
      x = 'blah: ' + window.innerHeight + ' | ' + roundTimeRemaining
    }, 100)
    window.addEventListener('resize', resizeHandler)
    resizeHandler()
    return () => { window.removeEventListener('resize', resizeHandler) }
  }, [roundTimeRemaining])

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
      <div className='top-bar'>
        <XpDisplay amount={xp} />
        <MoneyDisplay amount={money} />
      </div>
      <div>
        x: {x}
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
          <div className='boards'>
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
            onClick={handleGameStart}
          >
          </a>
          <Modal
            open={uiState === 'cheats'}
            handleClose={() => { setUiState('game') }}
          >
            <div>DEBUG:</div>
            <button onClick={handleAddOneXp}>
              Add 1 XP
            </button>
            <button onClick={handleAddOneMoney}>
              Add $1
            </button>
          </Modal>
          <Modal
            open={uiState === 'hub'}
            handleClose={handleGameStart}
          >
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
                handleGameStart()
              }}
            />
          </Modal>
          <Modal open={uiState === 'results'}>
            <Results
              xp={xp}
              answers={answers}
              lastXpEarned={lastXpEarned}
              handleClose={() => {
                setUiState('hub')
              }}
              wonLastGame={wonLastGame}
            />
          </Modal>
          <Modal
            open={uiState === 'skills'}
            handleClose={handleGameStart}
          >
            <Skills
              skills={skills}
              xp={xp}
              handleUnlockSkill={handleUnlockSkill}
              handleUnlockOption={handleUnlockOption}
              handleSetOption={handleSetOption}
              handleClose={() => {
                setUiState('hub')
              }}
              optionCost={OPTION_COST}
            />
          </Modal>
          <Modal open={uiState === 'shop'}>
            <Shop
              items={items}
              handleBuyItem={handleBuyItem}
              handleClose={() => {
                setUiState('hub')
              }}
            />
          </Modal>
          <Modal open={uiState === 'equipment'}>
            <Equipment
              equipment={equipment}
              money={money}
              handleBuyEquipment={handleBuyEquipment}
              handleClose={() => {
                setUiState('hub')
              }}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
