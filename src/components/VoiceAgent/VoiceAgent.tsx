import React from 'react'
import { Sparkles, Mic, MicOff, Calendar } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { Card, CardContent } from '../ui/card'
import { AgentStatus } from './AgentStatus'
import { CallTimer } from './CallTimer'
import { Waveform } from './Waveform'
import { VoiceControls } from './VoiceControls'
import { cn } from '../../lib/utils'
import { AiInsights } from '../AiInsights'
import { TranscriptPanel } from './TranscriptPanel'

export const VoiceAgent: React.FC = () => {
  const {
    isCallActive,
    isMuted,
    agentState
  } = useCall()

  // SVG gradient bars count for initial speaker avatar animation
  const bars = Array.from({ length: 5 }, (_, i) => i)

  return (
    <Card 
      className="overflow-hidden border custom-shadow transition-all duration-300 rounded-2xl"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <CardContent className="p-0 flex flex-col">
        {/* Top: 10. AI Assistant Card visually centerpiece */}
        <div className="p-6 md:p-8 flex flex-col items-center relative">
          
          {/* Header Row: Connection Badges & Call Timer */}
          <div className="w-full flex items-center justify-between mb-8 text-[10px] font-bold tracking-wider uppercase text-[var(--text-secondary)]">
            {/* Status & Online Badge */}
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Online Assistant</span>
            </div>

            {/* Call Duration/Timer */}
            {isCallActive ? (
              <CallTimer />
            ) : (
              <span className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-page)] font-mono text-[var(--text-secondary)]">
                Idle
              </span>
            )}
          </div>

          {/* Sarah Avatar center element */}
          <div className="relative mb-6">
            {/* Multi-layered speaking/glowing waves */}
            {isCallActive && agentState === 'speaking' && (
              <>
                <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-ping opacity-30" />
                <div className="absolute -inset-2 rounded-full bg-blue-500/15 animate-pulse opacity-40" />
              </>
            )}
            {isCallActive && agentState === 'listening' && (
              <div className="absolute -inset-2 rounded-full bg-teal-500/10 animate-pulse opacity-30" />
            )}

            {/* Core Circular Avatar */}
            <div 
              className={cn(
                "relative h-32 w-32 rounded-full border-4 shadow-lg flex flex-col items-center justify-center overflow-hidden transition-all duration-300",
                isCallActive && agentState === 'speaking' 
                  ? "border-blue-500 scale-[1.03]" 
                  : isCallActive && agentState === 'listening'
                  ? "border-teal-500"
                  : "border-[var(--border-color)]"
              )}
              style={{ 
                background: 'linear-gradient(135deg, #3B82F6 0%, #14B8A6 100%)' 
              }}
            >
              {/* Initials */}
              <span className="text-3xl font-black text-white tracking-widest font-sans select-none">
                SR
              </span>
              
              <span className="text-[9px] font-black tracking-widest text-white/70 uppercase select-none mt-0.5">
                Sarah
              </span>
              
              {/* Floating interactive audio feedback bars inside avatar */}
              {isCallActive && agentState === 'speaking' && (
                <div className="absolute inset-x-0 bottom-0 bg-blue-900/20 backdrop-blur-xs flex items-end justify-center pb-3 gap-0.5 h-10">
                  {bars.map((b) => (
                    <div
                      key={b}
                      className="w-1 bg-white rounded-full origin-bottom animate-waveform"
                      style={{
                        height: `${30 + Math.random() * 50}%`,
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
                  "absolute -bottom-1 -right-1 h-9 w-9 rounded-full flex items-center justify-center border-2 border-[var(--bg-card)] shadow-md text-white transition-all duration-300",
                  isMuted
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </div>
            )}
          </div>

          {/* Agent Title Details */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-1.5 justify-center">
              Sarah
              <Sparkles className="h-4 w-4 text-blue-500 fill-blue-500" />
            </h2>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-0.5">
              Teal Dental Specialist Voice Agent
            </p>
          </div>

          {/* Animated Volume Waveform visualizer */}
          <div className="w-full mb-6">
            <Waveform />
          </div>

          {/* Call Status Badge Readouts */}
          <div className="w-full grid grid-cols-2 gap-2.5 mb-6 text-[9px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
            {/* System Status readout */}
            <div className="flex items-center gap-2 p-2 rounded-xl border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-page)' }}>
              <AgentStatus />
            </div>

            {/* Calendar/Tool Sync status */}
            <div className="flex items-center gap-1.5 p-2 rounded-xl border" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-page)' }}>
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span className="truncate">Calendar Connected</span>
            </div>
          </div>

          {/* Dial, Hangup, Speaker control triggers */}
          <VoiceControls />
        </div>

        {/* Separator / Attachment Line */}
        <div className="border-t" style={{ borderColor: 'var(--border-color)' }} />

        {/* Embedded lower visual workspace: 1. Visual Connection */}
        <div className="p-5 rounded-b-2xl" style={{ backgroundColor: 'var(--bg-page)' }}>
          {isCallActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="text-[var(--text-primary)]">Sarah Voice Assistant Live Dialog</span>
                <span className="text-red-500 font-extrabold animate-pulse">● Live</span>
              </div>
              <TranscriptPanel />
            </div>
          ) : (
            <AiInsights />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default VoiceAgent
