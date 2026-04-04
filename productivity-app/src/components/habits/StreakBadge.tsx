'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface Props {
  streak: number
}

export function StreakBadge({ streak }: Props) {
  const controls = useAnimation()
  const prevStreak = useRef(streak)

  useEffect(() => {
    if (streak > prevStreak.current) {
      controls.start({ scale: [1, 1.4, 1], transition: { duration: 0.4 } })
    }
    prevStreak.current = streak
  }, [streak, controls])

  if (streak === 0) return null

  return (
    <motion.div
      animate={controls}
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24' }}
    >
      🔥 {streak}
    </motion.div>
  )
}
