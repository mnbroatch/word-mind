import { useState, useEffect } from 'react'
import useRerender from './use-rerender.js'
import useInterval from './use-interval.js'

export default function useStopwatch ({ refreshRate = 1000 } = {}) {
  const now = Date.now()
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
    if (refreshRate !== null) {
      setPauseDuration(pauseDuration => pauseDuration + (Date.now() - pauseTime))
    }
    setPauseTime(Date.now())
  }, [refreshRate])

  return {
    reset,
    elapsed: now - startTime - pauseDuration
  }
}
