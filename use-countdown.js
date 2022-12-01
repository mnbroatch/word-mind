import { useEffect } from 'react'
import useStopwatch from './use-stopwatch.js'
import usePrevious from './use-previous.js'

export default function useCountdown ({ duration, onCountdownEnd }) {
  const { elapsed, pause, start } = useStopwatch({ startActive: true })
  const remaining = duration - elapsed
  const prevRemaining = usePrevious(remaining)

  useEffect(() => {
    if (remaining <= 0 && prevRemaining > 0) {
      pause()
      if (onCountdownEnd) onCountdownEnd()
    }
  }, [elapsed, duration, onCountdownEnd])

  return {
    start,
    pause,
    remaining: remaining < 0
      ? 0
      : remaining
  }
}
