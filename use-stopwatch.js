import { useState, useEffect } from 'react'
import useRerender from './use-rerender.js'
import useInterval from './use-interval.js'

export default function useStopwatch ({ refreshRate = 1000 } = {}) {
  const now = Date.now()
  const isPaused = refreshRate === null
  const [startTime, setStartTime] = useState(now)
  const [pauseDuration, setPauseDuration] = useState(0)
  const [pauseTime, setPauseTime] = useState(now)
  const rerender = useRerender()
  useInterval(rerender, refreshRate)

  const reset = () => {
    setStartTime(now)
    setPauseDuration(0)
  }

  useEffect(() => {
    setPauseTime(Date.now())
    if (!isPaused) {
      setPauseDuration(pauseDuration => pauseDuration + (Date.now() - pauseTime))
    }
  }, [refreshRate])

  const _pauseDuration = isPaused ? pauseDuration + Date.now() - pauseTime : pauseDuration

  return {
    reset,
    elapsed: now - startTime - _pauseDuration
  }
}
