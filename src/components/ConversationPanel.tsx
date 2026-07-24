import React, { useEffect, useRef } from 'react'
import { MessageSquare, Sparkles, User } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'

export const ConversationPanel: React.FC = () => {
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
    <Card className="flex flex-col h-[460px] border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60 overflow-hidden">
      <CardHeader className="border-b border-gray-100 dark:border-zinc-800/60 pb-3 p-5 shrink-0">
        <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-teal-500" />
            <span>Live Conversation</span>
          </div>
          {isCallActive && (
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              Live Streaming
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/20 dark:bg-zinc-950/10"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 mb-3 border border-gray-200/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
              No Active Conversation
            </h4>
            <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-[220px] mt-1">
              Start a call from the AI Voice Panel to see the transcription transcript live.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAI = msg.sender === 'ai'
            
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 max-w-[85%] animate-fadeIn",
                  isAI ? "mr-auto flex-row" : "ml-auto flex-row-reverse"
                )}
                style={{
                  animationDuration: '0.3s'
                }}
              >
                {/* Bubble avatar */}
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center border shrink-0 text-white shadow-sm",
                    isAI 
                      ? "bg-gradient-to-tr from-teal-500 to-teal-400 border-teal-200 dark:border-teal-800" 
                      : "bg-gradient-to-tr from-blue-500 to-blue-400 border-blue-200 dark:border-blue-800"
                  )}
                >
                  {isAI ? (
                    <Sparkles className="h-3.5 w-3.5" />
                  ) : (
                    <User className="h-3.5 w-3.5" />
                  )}
                </div>

                {/* Message Bubble wrapper */}
                <div className="flex flex-col">
                  {/* Sender Name */}
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400 dark:text-zinc-500",
                    isAI ? "text-left" : "text-right"
                  )}>
                    {isAI ? 'Sarah (AI)' : 'Patient'}
                  </span>
                  
                  {/* Bubble body */}
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm font-medium",
                      isAI
                        ? "bg-white border border-gray-200/50 text-gray-800 dark:bg-zinc-800 dark:border-zinc-700/60 dark:text-zinc-150 rounded-tl-none"
                        : "bg-teal-500 text-white rounded-tr-none"
                    )}
                  >
                    {msg.message}
                  </div>

                  {/* Timestamp */}
                  <span className={cn(
                    "text-[9px] font-medium text-gray-400 dark:text-zinc-500 mt-1 font-mono",
                    isAI ? "text-left" : "text-right"
                  )}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            )
          })
        )}

        {/* Live Typing / Listening indicator */}
        {isCallActive && agentState === 'listening' && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-end animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center shrink-0 text-white shadow-sm">
              <User className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-400 dark:text-zinc-500">
                Patient is speaking...
              </span>
              <div className="bg-gray-100 border border-gray-200/50 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center dark:bg-zinc-800 dark:border-zinc-750">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
