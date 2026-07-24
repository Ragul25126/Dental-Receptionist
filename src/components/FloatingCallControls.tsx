import React from 'react'
import { Phone, PhoneOff, RefreshCw, Settings, History } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { cn } from '../lib/utils'

interface FloatingCallControlsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const FloatingCallControls: React.FC<FloatingCallControlsProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { isCallActive, startCall, endCall, addToast } = useCall()

  const handleReconnect = () => {
    addToast('Reconnecting Agent', 'Re-initializing speech synthesizer and connection sockets...', 'info')
    if (isCallActive) {
      endCall()
      setTimeout(() => {
        startCall()
      }, 1000)
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-lg animate-slideUp">
      <div className="glass shadow-2xl rounded-2xl border border-gray-200/80 dark:border-zinc-800/85 p-3 flex items-center justify-between gap-4 bg-white/80 dark:bg-zinc-900/80">
        
        {/* Connection status snippet */}
        <div className="pl-3 flex flex-col shrink-0">
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-2 w-2 rounded-full",
              isCallActive ? "bg-teal-500 animate-pulse" : "bg-gray-400"
            )} />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
              {isCallActive ? "Live Call" : "Sarah Agent"}
            </span>
          </div>
          <span className="text-[9px] font-medium text-gray-450 dark:text-zinc-500 mt-0.5 truncate max-w-[90px]">
            {isCallActive ? "Synthesizing" : "Connected"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Start/Stop Agent Toggle */}
          {!isCallActive ? (
            <button
              onClick={startCall}
              className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-all flex items-center gap-1.5 shadow-md shadow-teal-500/10 cursor-pointer"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Start</span>
            </button>
          ) : (
            <button
              onClick={endCall}
              className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 transition-all flex items-center gap-1.5 shadow-md shadow-rose-500/10 cursor-pointer animate-pulse"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              <span>Hangup</span>
            </button>
          )}

          {/* Reconnect */}
          <button
            onClick={handleReconnect}
            title="Reconnect Vapi Agent"
            className="p-2.5 rounded-xl border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-850 text-gray-600 dark:text-zinc-400 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Shortcut: Call History Tab */}
          <button
            onClick={() => setActiveTab('history')}
            title="View Call History"
            className={cn(
              "p-2.5 rounded-xl border transition-all shadow-sm cursor-pointer",
              activeTab === 'history' 
                ? "bg-teal-500 text-white border-teal-500" 
                : "border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-850 text-gray-600 dark:text-zinc-400"
            )}
          >
            <History className="h-4 w-4" />
          </button>

          {/* Shortcut: Settings Tab */}
          <button
            onClick={() => setActiveTab('settings')}
            title="Open Settings"
            className={cn(
              "p-2.5 rounded-xl border transition-all shadow-sm cursor-pointer",
              activeTab === 'settings' 
                ? "bg-teal-500 text-white border-teal-500" 
                : "border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-850 text-gray-600 dark:text-zinc-400"
            )}
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  )
}
