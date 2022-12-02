import { useEffect } from 'react'
import useStopwatch from './use-stopwatch.js'
import usePrevious from './use-previous.js'

export default function useCountdown ({ refreshRate, duration, onCountdownEnd }) {
  const { elapsed, reset } = useStopwatch({ refreshRate })
  const remaining = duration - elapsed
  const prevRemaining = usePrevious(remaining)

  const justFinished = remaining <= 0 && prevRemaining > 0
  useEffect(() => {
    if (justFinished) {
      if (onCountdownEnd) {
        onCountdownEnd()
      }
    }
  }, [justFinished])

  return {
    reset,
    remaining: remaining < 0
      ? 0
      : remaining
  }
}
