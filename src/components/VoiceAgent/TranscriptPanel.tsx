import React, { useEffect, useRef } from 'react'
import { MessageSquare, Sparkles, User } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { cn } from '../../lib/utils'

export const TranscriptPanel: React.FC = () => {
  const { messages, isCallActive, agentState } = useCall()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }, [messages, agentState])

  return (
    <div 
      ref={scrollRef} 
      className="max-h-[300px] min-h-[160px] overflow-y-auto p-1 space-y-4 flex flex-col scroll-smooth"
    >
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
          <div className="h-10 w-10 rounded-xl bg-[var(--hover-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-3 shadow-inner">
            <MessageSquare className="h-4 w-4" />
          </div>
          <h4 className="text-xs font-bold text-[var(--text-primary)]">
            Ready for Conversation
          </h4>
          <p className="text-[10px] text-[var(--text-secondary)] max-w-[180px] mt-1 font-semibold leading-relaxed">
            Sarah is listening. Speak to start the receptionist sync.
          </p>
        </div>
      ) : (
        messages.map((msg) => {
          const isAI = msg.sender === 'ai'
          const isSystem = msg.message.startsWith('[Tool')

          if (isSystem) {
            const isSuccess = msg.message.includes('Success')
            return (
              <div 
                key={msg.id} 
                className={cn(
                  "w-fit max-w-[90%] mx-auto my-1.5 px-3 py-1.5 rounded-lg border text-[9px] font-black text-center flex items-center justify-center gap-2 animate-scaleUp",
                  isSuccess 
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" 
                    : "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                )}
              >
                <span className={cn(
                  "h-1 w-1 rounded-full shrink-0",
                  isSuccess ? "bg-emerald-500" : "bg-blue-500 animate-pulse"
                )} />
                <span>
                  {msg.message.replace('[', '').replace(']', '')}
                </span>
              </div>
            )
          }
          
          return (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2.5 max-w-[90%] animate-fadeIn",
                isAI ? "mr-auto flex-row" : "ml-auto flex-row-reverse"
              )}
              style={{
                animationDuration: '0.2s'
              }}
            >
              {/* Bubble Avatar */}
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center border shrink-0 text-white shadow-sm font-bold text-xs select-none",
                  isAI 
                    ? "bg-gradient-to-tr from-blue-500 to-teal-400 border-blue-400/20" 
                    : "bg-gradient-to-tr from-slate-700 to-slate-550 border-slate-500/20"
                )}
              >
                {isAI ? (
                  <Sparkles className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
              </div>

              {/* Message Bubble wrapper */}
              <div className="flex flex-col min-w-0">
                {/* Bubble Body */}
                <div
                  className={cn(
                    "p-3 rounded-xl text-[12px] leading-relaxed shadow-sm font-semibold border transition-all select-text",
                    isAI
                      ? "bg-[var(--hover-color)] border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-none"
                      : "bg-blue-500 text-white border-blue-600/15 rounded-tr-none"
                  )}
                >
                  {msg.message}
                  {msg.isPartial && (
                    <span className="inline-block w-1 h-3 ml-1 bg-current opacity-70 animate-pulse align-middle" />
                  )}
                </div>

                {/* Timestamp */}
                <span className={cn(
                  "text-[8px] font-bold text-[var(--text-secondary)] mt-1 font-mono",
                  isAI ? "text-left" : "text-right"
                )}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          )
        })
      )}

      {/* Live Speaking / Listening states animations */}
      {isCallActive && agentState === 'listening' && (
        <div className="flex gap-2.5 max-w-[90%] ml-auto flex-row-reverse items-end animate-pulse">
          <div className="h-7 w-7 rounded-full bg-blue-550/10 border border-blue-500/20 flex items-center justify-center shrink-0 text-blue-500 shadow-sm">
            <User className="h-3 w-3" />
          </div>
          <div className="flex flex-col items-end">
            <div className="bg-blue-500/10 border border-blue-500/25 p-2 rounded-xl rounded-tr-none flex gap-1 items-center">
              <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1 w-1 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-1">
              Patient speaking...
            </span>
          </div>
        </div>
      )}

      {isCallActive && agentState === 'speaking' && (
        <div className="flex gap-2.5 max-w-[90%] mr-auto flex-row items-end animate-pulse">
          <div className="h-7 w-7 rounded-full bg-teal-550/10 border border-teal-500/20 flex items-center justify-center shrink-0 text-teal-550 shadow-sm">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="flex flex-col items-start">
            <div className="bg-[var(--hover-color)] border border-[var(--border-color)] p-2 rounded-xl rounded-tl-none flex gap-1 items-center">
              <span className="h-1 w-1 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="h-1 w-1 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="h-1 w-1 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-1">
              Sarah speaking...
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TranscriptPanel
