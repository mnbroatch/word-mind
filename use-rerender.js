import { useState } from 'react'

export default function useRerender () {
  const set = useState(true)[1]
  return () => { set(prev => !prev) }
}
