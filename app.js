import React, { useReducer, useState, useEffect, useMemo } from 'react'
import { loadState, saveState } from './local-storage-wrapper'
import useCountdown from './hooks/use-countdown'
import currentGuessReducer from './current-guess-reducer'
import skillsReducer from './skills-reducer'
import itemsReducer from './items-reducer'

import Shop from './components/shop'
import Results from './components/results'
import Skills from './components/skills'
import Hub from './components/hub'
import Modal from './components/modal'
import Board from './components/board'
import KeyboardLetter from './components/keyboard-letter'
import MoneyDisplay from './components/money-display'
import XpDisplay from './components/xp-display'

import calculateXpEarned from './utils/calculate-xp-earned'
import calculateXpCost from './utils/calculate-xp-cost'
import isGuessStrictlyValid from './utils/is-guess-strictly-valid'

import allWords from './data/all-words.json'
import gameWords from './data/game-words.json'
import curseWords from './data/curse-words.json'

const { initialSkills, initialItems, initialXp, initialMoney } = loadState()

const alphabet = 'qwertyuiopasdfghjklzxcvbnm'.split('')

const alphabetRows = [
  alphabet.slice(0, 10),
  alphabet.slice(10, 19),
  alphabet.slice(19)
]

function getAnswers (skills, items) {
  const wordLength = skills.wordLength.value
  const boardsCount = skills.boardsCount.value
  const answers = gameWords.filter(word => word.length === +wordLength && !curseWords.includes(word))
    .sort(() => Math.random() - 0.5).slice(0, boardsCount)
  return isItemActive(items.reverse) ? answers.map(answer => answer.split('').reverse().join('')) : answers
}

function isItemActive (item) {
  return item.activeUntil > Date.now()
}

export default function App () {
  const [skills, skillsDispatch] = useReducer(skillsReducer, initialSkills)
  const [items, itemsDispatch] = useReducer(itemsReducer, initialItems)
  const [uiState, setUiState] = useState('game')
  const [lastXpEarned, setLastXpEarned] = useState(0)
  const [wonLastGame, setWonLastGame] = useState(false)
  const [xp, setXp] = useState(initialXp)
  const [money, setMoney] = useState(initialMoney)
  const [answers, setAnswers] = useState(getAnswers(skills, items))
  const [guesses, setGuesses] = useState([])
  const [currentGuess, currentGuessDispatch] = useReducer(currentGuessReducer, '')

  const handleGuess = () => {
    if (
      !guesses.includes(currentGuess)
        && currentGuess.length === skills.wordLength.value
        && allWords.includes(
          isItemActive(items.reverse)
            ? currentGuess.split('').reverse().join('')
            : currentGuess
        )
        && (!isItemActive(items.strictMode) || isGuessStrictlyValid(currentGuess, guesses, answers))
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
      ? calculateXpEarned(skills)
      : 0
    setUiState('results')
    setXp(xp + xpEarned)
    setLastXpEarned(xpEarned)
    setWonLastGame(endState.won)
    setGuesses([])
    setAnswers(getAnswers(skills, items))
    skillsDispatch({
      type: 'GAIN_MASTERY',
      skills
    })
  }

  const handleAdd100Xp = (endState) => {
    const xpEarned = 100
    setXp(xp + xpEarned)
  }

  const handleAdd100Money = (endState) => {
    const moneyEarned = 100
    setMoney(money + moneyEarned)
  }

  const handleAddLetter = (letter) => {
    if (
      alphabet.includes(letter.toLowerCase())
      && currentGuess.length < skills.wordLength.value
    ) {
      currentGuessDispatch({ type: 'add_letter', letter })
    }
  }

  const handleGameStart = () => {
    resetGameTime()
    resetRoundTime()
    setGuesses([])
    setUiState('game')
    setAnswers(getAnswers(skills, items))
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
    const lost = guesses.length >= skills.maxGuesses.value
    if (won || lost) {
      handleGameEnd({ answers, guesses, won })
    }
  }, [guesses, answers, skills, handleGameEnd])

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
    const optionCost = 10
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

  const handleBuyItem = (itemId, value) => {
    if (money >= items[itemId].cost) {
      itemsDispatch({
        type: 'BUY',
        itemId
      })
      setMoney(money - items[itemId].cost)
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
    saveState({ skills, xp, money })
  }, [skills, xp, money])

  const handleClearAll = () => {
    localStorage.clear()
    skillsDispatch({ type: 'LOAD_INITIAL' })
    setUiState('game')
    setXp(0)
    setGuesses([])
    currentGuessDispatch({ type: 'clear' })
  }

  const handleUnlockAll = () => {
    skillsDispatch({ type: 'UNLOCK_ALL' })
  }

  const possibleWords = useMemo(() => {
    return isItemActive(items.showPossibleWords)
      ? gameWords.filter(word => isGuessStrictlyValid(word, guesses, answers))
      : []
  }, [guesses, answers, skills])

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
        {skills.gameTimeLimit.value !== Infinity && <div className='game-time-remaining'>
          Game Time Remaining: {secondsRemainingInGame}
        </div>}
        {skills.roundTimeLimit.value !== Infinity && <div className='round-time-remaining'>
          Round Time Remaining: {secondsRemainingInRound}
        </div>}
        <div className='main-game'>
          {isItemActive(items.revealAnswers) && (
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
            <button onClick={handleClearAll}>
              Clear all
            </button>
            <button onClick={handleAdd100Xp}>
              Add 100 XP
            </button>
            <button onClick={handleAdd100Money}>
              Add 100 Money
            </button>
            <button onClick={handleUnlockAll}>
              Unlock All Skills
            </button>
          </Modal>
          <Modal
            open={uiState === 'hub'}
            handleClose={handleGameStart}
          >
            <Hub
              handleGoToSkills={() => {
                setUiState('skills')
              }}
              handleGoToShop={() => {
                setUiState('shop')
              }}
              handleGoToGame={() => {
                setUiState('game')
              }}
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
            />
          </Modal>
          <Modal open={uiState === 'results'}>
            <Results
              xp={xp}
              lastXpEarned={lastXpEarned}
              handleClose={() => {
                setUiState('hub')
              }}
              wonLastGame={wonLastGame}
            />
          </Modal>
          <Modal open={uiState === 'shop'}>
            <Shop
              items={items}
              money={money}
              handleBuyItem={handleBuyItem}
              handleClose={() => {
                setUiState('hub')
              }}
              wonLastGame={wonLastGame}
            />
          </Modal>
        </div>
      </div>
    </div>
  )
}
