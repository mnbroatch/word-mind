import { useEffect, useRef } from 'react'

export default function useInterval (callback, delay) {
  const savedCallbackRef = useRef()

  useEffect(() => {
    savedCallbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(savedCallbackRef.current, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
