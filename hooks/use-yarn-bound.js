import { useRef } from 'react'
import YarnBound from 'yarn-bound'
import story from '../story.js'

export default function useYarnBound (
  uiState,
  setUiState,
  handleGameStart
) {
  const runnerRef = useRef()
  const uiStateRef = useRef(uiState)
  uiStateRef.current = uiState
  if (!runnerRef.current) {
    runnerRef.current = new YarnBound({
      dialogue: story,
      startAt: 'hub',
      handleCommand: function ({ command }) {
        const match = command.match(/^setUiState (.+)/)
        if (uiStateRef.current !== match[1]) {
          switch (match[1]) {
            case 'hub':
              setUiState('hub')
              break
            case 'game':
              handleGameStart()
              break
          }
        }
      }
    })
  }
  return runnerRef.current
}
