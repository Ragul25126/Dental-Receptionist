import React from 'react'
import { Sparkles, Mic, MicOff } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { Card, CardContent } from '../ui/card'
import { AgentStatus } from './AgentStatus'
import { CallTimer } from './CallTimer'
import { Waveform } from './Waveform'
import { VoiceControls } from './VoiceControls'
import { cn } from '../../lib/utils'

export const VoiceAgent: React.FC = () => {
  const {
    isCallActive,
    isMuted,
    agentState
  } = useCall()

  // SVG gradient bars count
  const bars = Array.from({ length: 5 }, (_, i) => i)

  return (
    <Card className="overflow-hidden border border-gray-200/80 bg-white/70 shadow-xl shadow-gray-100/40 dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none">
      <CardContent className="p-8 flex flex-col items-center">
        
        {/* Connection status header */}
        <div className="w-full flex items-center justify-between mb-8">
          <AgentStatus />
          <CallTimer />
        </div>

        {/* AI Agent Avatar */}
        <div className="relative mb-6">
          {/* Pulsing ring animation */}
          <div
            className={cn(
              "absolute -inset-1 rounded-full bg-gradient-to-r from-teal-400 to-blue-500 opacity-0 blur-sm transition-all duration-500",
              agentState === 'speaking' && "opacity-100 speaking-glow",
              agentState === 'listening' && "opacity-40"
            )}
          />
          <div className="relative h-28 w-28 rounded-full border-4 border-white dark:border-zinc-900 bg-gradient-to-tr from-teal-500 to-blue-500 shadow-lg flex items-center justify-center overflow-hidden">
            {/* Visual avatar initials */}
            <span className="text-3xl font-extrabold text-white tracking-wider">
              SA
            </span>
            
            {/* Interactive speech wave overlay */}
            {agentState === 'speaking' && (
              <div className="absolute inset-0 bg-teal-550/10 flex items-end justify-center pb-2.5 gap-0.5">
                {bars.map((b) => (
                  <div
                    key={b}
                    className="w-1 bg-white rounded-full origin-bottom animate-waveform"
                    style={{
                      height: `${25 + Math.random() * 40}%`,
                      animationDelay: `${b * 0.15}s`
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Glowing Microphone state indicator */}
          {isCallActive && (
            <div
              className={cn(
                "absolute -bottom-1 -right-1 h-8 w-8 rounded-full flex items-center justify-center border-2 border-white dark:border-zinc-900 shadow-md text-white transition-colors duration-300",
                isMuted
                  ? "bg-rose-500"
                  : agentState === 'speaking'
                  ? "bg-teal-500 animate-pulse"
                  : "bg-teal-500"
              )}
            >
              {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </div>
          )}
        </div>

        {/* Agent Details */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-1.5 justify-center">
            Sarah
            <Sparkles className="h-4.5 w-4.5 text-teal-500 fill-teal-500" />
          </h2>
          <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1">
            Dental Reception Specialist
          </p>
        </div>

        {/* Animated Volume Waveform visualizer */}
        <div className="w-full mb-6">
          <Waveform />
        </div>

        {/* Dial, Hangup, Speaker control triggers */}
        <VoiceControls />

      </CardContent>
    </Card>
  )
}
export default VoiceAgent
