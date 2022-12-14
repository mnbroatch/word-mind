import { useState, useEffect } from 'react'
import usePrevious from './use-previous.js'
import useCountdown from './use-countdown.js'

export default function useRollingNumber (num, duration = 1000, refreshRate = 10) {
  const [startNum, setStartNum] = useState(null)
  const prevNum = usePrevious(num)
  const { remaining, reset } = useCountdown({
    refreshRate: startNum === null ? null : refreshRate,
    duration,
    onCountdownEnd: () => {
      setStartNum(null)
    }
  })

  useEffect(() => {
    reset()
    if (prevNum !== undefined) {
      setStartNum(prevNum)
    }
  }, [num])

  const percentDone = (duration - remaining) / duration

  return startNum
    ? startNum + (percentDone * (num - startNum))
    : num
}
