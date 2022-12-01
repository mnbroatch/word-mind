import { useState } from 'react'
import useRerender from './use-rerender.js'
import useInterval from './use-interval.js'

export default function useStopwatch ({ refreshRate = 1000, startActive = false }) {
  const now = Date.now()
  const [isActive, setIsActive] = useState(startActive)
  const [startTime, setStartTime] = useState(now)
  const [pauseTime, setPauseTime] = useState(now)

  const rerender = useRerender()
  useInterval(rerender, isActive ? refreshRate : null)

  const start = () => {
    setIsActive(true)
  }

  const pause = () => {
    setIsActive(false)
    setPauseTime(Date.now())
  }

  const reset = () => {
    setIsActive(false)
    setStartTime(now)
  }

  const pausedDuration = isActive ? 0 : now - pauseTime
  return {
    start,
    pause,
    reset,
    elapsed: now - startTime - pausedDuration
  }
}
