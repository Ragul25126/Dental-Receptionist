import React from 'react'
import { useCall } from '../../context/CallContext'
import { cn } from '../../lib/utils'

export const Waveform: React.FC = () => {
  const { liveAudioLevel, agentState, isCallActive } = useCall()

  const barCount = 18
  const bars = Array.from({ length: barCount }, (_, i) => i)

  // Determine baseline height based on status
  const isActive = isCallActive && (agentState === 'speaking' || agentState === 'listening' || agentState === 'connected')

  return (
    <div className="w-full h-16 flex items-center justify-center gap-1.5 bg-gray-50/50 dark:bg-zinc-950/40 rounded-xl px-4 border border-gray-150/40 dark:border-zinc-800/40">
      {isActive ? (
        bars.map((idx) => {
          // Calculate volume scale
          // Multiply volume by custom weights per bar for varying heights
          const factor = Math.sin((idx / barCount) * Math.PI) // bell curve shape
          const randomJitter = 0.8 + Math.random() * 0.4
          
          // Compute scale percent
          let heightPercent = 15 // flat baseline
          if (liveAudioLevel > 0) {
            heightPercent = Math.min(
              100,
              15 + liveAudioLevel * 140 * factor * randomJitter
            )
          } else {
            // Idle breathing animation
            const breathingFactor = 10 + Math.sin(Date.now() / 200 + idx) * 5
            heightPercent = breathingFactor
          }

          return (
            <div
              key={idx}
              className={cn(
                "w-1 rounded-full origin-center transition-all duration-150 ease-out bg-gradient-to-t",
                agentState === 'speaking' && "from-teal-600 to-teal-400 dark:from-teal-500 dark:to-teal-350",
                agentState === 'listening' && "from-blue-600 to-blue-400 dark:from-blue-500 dark:to-blue-350",
                agentState === 'connected' && "from-gray-400 to-gray-300 dark:from-zinc-700 dark:to-zinc-650"
              )}
              style={{
                height: `${heightPercent}%`,
              }}
            />
          )
        })
      ) : (
        <span className="text-[11px] text-gray-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
          {agentState === 'error' ? 'Connection Error' : 'Ready to Connect'}
        </span>
      )}
    </div>
  )
}
