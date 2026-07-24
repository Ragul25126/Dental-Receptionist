import React from 'react'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { cn } from '../lib/utils'

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useCall()

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3.5 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={cn(
              "p-4 rounded-xl border bg-white/95 dark:bg-zinc-900/95 glass shadow-2xl pointer-events-auto flex gap-3.5 items-start justify-between translate-x-0 transition-transform duration-300 w-full animate-slideInRight",
              toast.type === 'success' && "border-emerald-100 dark:border-emerald-900/40",
              toast.type === 'warning' && "border-amber-100 dark:border-amber-900/40",
              toast.type === 'error' && "border-rose-100 dark:border-rose-900/40",
              toast.type === 'info' && "border-gray-150 dark:border-zinc-800"
            )}
          >
            {/* Toast Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              {toast.type === 'error' && (
                <AlertCircle className="h-5 w-5 text-rose-500" />
              )}
              {toast.type === 'info' && (
                <Info className="h-5 w-5 text-teal-500" />
              )}
            </div>

            {/* Toast Message */}
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-extrabold text-gray-900 dark:text-zinc-55">
                {toast.title}
              </h4>
              <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-semibold mt-0.5 leading-snug">
                {toast.description}
              </p>
            </div>

            {/* Dismiss Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-400 transition-colors shrink-0"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
