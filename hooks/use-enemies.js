import { useRef } from 'react'
import allWords from '../data/all-words.json'
import gameWords from '../data/game-words.json'
import curseWords from '../data/curse-words.json'
import enemyDict from '../data/enemyDict.json'
import isGuessStrictlyValid from '../utils/is-guess-strictly-valid'

export default function useEnemies (enemyTypes, guesses) {
  const enemyTypesRef = useRef(enemyTypes)
  const answersRef = useRef()
  const enemyConfigs = enemyTypes.split(' ').map(type => enemyDict[type])
  const getAnswers = () => {
    return enemyConfigs.map((config, i) => {
      const possibleWords = config.useFullDictionary
        ? allWords
        : gameWords
      const potentialWords = possibleWords
        .filter(word => word.length === +config.wordLength
          && !curseWords.includes(word)
        )
      return potentialWords[Math.round(Math.random() * potentialWords.length)]
    })
  }

  if (!answersRef.current) answersRef.current = getAnswers()
  if (enemyTypesRef.current !== enemyTypes) {
    enemyTypesRef.current = enemyTypes
    answersRef.current = getAnswers()
  }

  return answersRef.current.map((answer, i) => {
    const config = enemyConfigs[i]
    const _guesses = guesses[i] || []
    const isGuessValid = (guess) => {
      return !_guesses.includes(guess)
        && guess.length === config.wordLength
        && allWords.includes(guess)
        && (!config.strictMode || isGuessStrictlyValid(guess, guesses, [answer]))
    }

    return {
      answer,
      config,
      isGuessValid,
      guesses: _guesses,
      dead: _guesses.includes(answer),
      index: i
    }
  })
}
