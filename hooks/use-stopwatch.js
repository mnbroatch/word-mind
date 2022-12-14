import { useRef, useEffect } from 'react'
import useRerender from './use-rerender.js'
import useInterval from './use-interval.js'

export default function useStopwatch ({ refreshRate = 1000 } = {}) {
  const isPaused = refreshRate === null
  const startTimeRef = useRef(Date.now())
  const pauseTimeRef = useRef(Date.now())
  const rerender = useRerender()
  useInterval(rerender, refreshRate)

  const reset = () => {
    startTimeRef.current = Date.now()
    pauseTimeRef.current = Date.now()
    rerender()
  }

  useEffect(() => {
    if (!isPaused) {
      startTimeRef.current -= Date.now() - pauseTimeRef.current
    }
    pauseTimeRef.current = Date.now()
  }, [isPaused])

  const pauseDuration = isPaused
    ? Date.now() - pauseTimeRef.current
    : 0

  return {
    reset,
    elapsed: Date.now() - startTimeRef.current - pauseDuration
  }
}
