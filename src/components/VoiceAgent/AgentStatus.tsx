import React from 'react'
import { useCall } from '../../context/CallContext'
import { cn } from '../../lib/utils'

export const AgentStatus: React.FC = () => {
  const { agentState } = useCall()

  const statusConfig = {
    offline: { label: 'Offline', color: 'bg-gray-400', text: 'text-gray-500 dark:text-zinc-500' },
    connecting: { label: 'Connecting...', color: 'bg-blue-500 animate-pulse', text: 'text-blue-500' },
    connected: { label: 'Connected', color: 'bg-teal-500', text: 'text-teal-500' },
    listening: { label: 'Listening', color: 'bg-teal-400 animate-ping', text: 'text-teal-500 dark:text-teal-400' },
    speaking: { label: 'Speaking', color: 'bg-emerald-500 animate-pulse', text: 'text-emerald-500 dark:text-emerald-400' },
    processing: { label: 'Processing...', color: 'bg-purple-500 animate-bounce', text: 'text-purple-500' },
    'call-ended': { label: 'Call Ended', color: 'bg-rose-500', text: 'text-rose-500' },
    error: { label: 'Error', color: 'bg-rose-600 animate-bounce', text: 'text-rose-600' }
  }

  const current = statusConfig[agentState] || statusConfig.offline

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5 rounded-full shrink-0">
        <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", current.color)} />
        <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", current.color.split(' ')[0])} />
      </span>
      <span className={cn("text-xs font-bold uppercase tracking-wider", current.text)}>
        {current.label}
      </span>
    </div>
  )
}
