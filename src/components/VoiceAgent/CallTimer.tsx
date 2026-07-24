import React from 'react'
import { useCall } from '../../context/CallContext'

export const CallTimer: React.FC = () => {
  const { callDuration, isCallActive } = useCall()

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (!isCallActive) return null

  return (
    <span className="text-xs font-mono font-extrabold text-gray-700 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-gray-200/40 dark:border-zinc-800/40 shadow-inner">
      {formatTime(callDuration)}
    </span>
  )
}
