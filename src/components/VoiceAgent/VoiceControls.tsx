import React from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Trash2, Wifi, WifiOff } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { cn } from '../../lib/utils'

export const VoiceControls: React.FC = () => {
  const {
    isCallActive,
    isMuted,
    setMuted,
    startCall,
    endCall,
    clearConversation,
    networkStatus,
    speakerEnabled,
    setSpeakerEnabled,
    addToast
  } = useCall()

  const handleSpeakerToggle = () => {
    const nextState = !speakerEnabled
    setSpeakerEnabled(nextState)
    addToast(
      nextState ? 'Speaker Enabled' : 'Speaker Disabled',
      nextState ? 'Audio output is routed to active speakers.' : 'Audio output is muted.',
      'info'
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Network / Audio State Header */}
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-zinc-500 bg-gray-50/50 dark:bg-zinc-950/20 py-2 px-3 rounded-lg border border-gray-150/40 dark:border-zinc-800/40">
        <div className="flex items-center gap-1.5">
          {networkStatus === 'stable' ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-500">Connection: Stable</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-rose-500 animate-bounce" />
              <span className="text-rose-600 dark:text-rose-500">No Connection</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span>Mic: {isMuted ? 'Muted' : 'On'}</span>
          <span>•</span>
          <span>Audio Out: {speakerEnabled ? 'On' : 'Muted'}</span>
        </div>
      </div>

      {/* Button controls grid */}
      <div className="flex flex-col gap-3">
        {/* Start / Stop Voice Call */}
        {!isCallActive ? (
          <button
            onClick={startCall}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-650 hover:to-blue-650 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/15 text-sm cursor-pointer"
          >
            <Phone className="h-4.5 w-4.5" />
            Start Conversation
          </button>
        ) : (
          <button
            onClick={endCall}
            className="w-full py-3 px-4 rounded-xl font-bold text-white bg-rose-500 hover:bg-rose-650 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/15 text-sm cursor-pointer"
          >
            <PhoneOff className="h-4.5 w-4.5 animate-pulse" />
            End Call
          </button>
        )}

        {/* Sub Mute & Volume Toggles */}
        {isCallActive && (
          <div className="grid grid-cols-2 gap-3">
            {/* Mute toggle button */}
            <button
              onClick={() => setMuted(!isMuted)}
              className={cn(
                "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                isMuted
                  ? "bg-rose-50 border-rose-200 text-rose-650 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              )}
            >
              {isMuted ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Mute Mic
                </>
              )}
            </button>

            {/* Toggle speaker volume */}
            <button
              onClick={handleSpeakerToggle}
              className={cn(
                "py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
                !speakerEnabled
                  ? "bg-rose-50 border-rose-200 text-rose-650 dark:bg-rose-950/20 dark:border-rose-900/50 dark:text-rose-400"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              )}
            >
              {!speakerEnabled ? (
                <>
                  <VolumeX className="h-4 w-4" />
                  Enable Sound
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  Mute Audio
                </>
              )}
            </button>
          </div>
        )}

        {/* Clear transcript button */}
        <button
          onClick={clearConversation}
          className="w-full py-2 px-3 rounded-xl border border-gray-200/80 bg-white hover:bg-gray-50/50 text-gray-500 hover:text-gray-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200 transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear Conversation
        </button>
      </div>
    </div>
  )
}
