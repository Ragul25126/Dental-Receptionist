import React from 'react'
import { Brain, Star, CheckCircle, AlertTriangle, Timer } from 'lucide-react'
import { useCall } from '../context/CallContext'

export const AiInsights: React.FC = () => {
  const { insights } = useCall()

  // Helper component to render an animated circular progress ring
  const CircularProgress = ({ 
    value, 
    max = 100, 
    strokeWidth = 4.5, 
    size = 46, 
    color = 'stroke-blue-500' 
  }: { 
    value: number
    max?: number
    strokeWidth?: number
    size?: number
    color?: string 
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference

    return (
      <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            className="stroke-gray-150 dark:stroke-zinc-850"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Foreground progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${color}`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <span className="absolute text-[9px] font-black text-[var(--text-primary)] font-mono">
          {value}{max === 100 ? '%' : 's'}
        </span>
      </div>
    )
  }

  const metrics = [
    {
      title: 'Booking Accuracy',
      description: 'Correct details vs. total captures',
      icon: CheckCircle,
      score: insights.bookingAccuracy,
      max: 100,
      color: 'stroke-blue-500',
      textColor: 'text-blue-500',
      glowColor: 'hover:shadow-blue-500/5'
    },
    {
      title: 'Response Time',
      description: 'Average AI response latency',
      icon: Timer,
      score: insights.avgResponseTime,
      max: 3.0,
      color: 'stroke-teal-500',
      textColor: 'text-teal-500',
      glowColor: 'hover:shadow-teal-500/5'
    },
    {
      title: 'Conversation Quality',
      description: 'Patient satisfaction analysis',
      icon: Star,
      score: insights.conversationQuality,
      max: 100,
      color: 'stroke-indigo-500',
      textColor: 'text-indigo-500',
      glowColor: 'hover:shadow-indigo-500/5'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Header section attached seamlessly */}
      <div className="flex items-center gap-2 pb-2.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <Brain className="h-4 w-4 text-blue-500" />
        <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider">
          AI Insights & Analytics
        </span>
      </div>
      
      {/* Stack of metrics suited for a narrow sidebar */}
      <div className="flex flex-col gap-3">
        {metrics.map((m, idx) => {
          const Icon = m.icon
          return (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-3.5 rounded-xl border hover:bg-[var(--hover-color)] transition-all duration-200 shadow-sm ${m.glowColor}`}
              style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${m.textColor}`} />
                  <h4 className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-wider">
                    {m.title}
                  </h4>
                </div>
                <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  {m.description}
                </p>
              </div>
              <CircularProgress 
                value={m.score} 
                max={m.max} 
                color={m.color} 
                size={46}
                strokeWidth={4.5}
              />
            </div>
          )
        })}
      </div>

      {/* Dynamic Booking success metrics footer */}
      <div className="grid grid-cols-2 gap-3.5 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
        <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-center justify-between hover:bg-emerald-500/15 transition-all duration-200">
          <div>
            <span className="text-[9px] uppercase font-extrabold text-emerald-600 dark:text-emerald-400 tracking-wider">
              Success
            </span>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 mt-0.5 font-mono">
              {insights.successfulBookings}
            </p>
          </div>
          <div className="h-7 w-7 rounded-full bg-emerald-100/50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner shrink-0">
            <CheckCircle className="h-4 w-4" />
          </div>
        </div>

        <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-center justify-between hover:bg-rose-500/15 transition-all duration-200">
          <div>
            <span className="text-[9px] uppercase font-extrabold text-rose-600 dark:text-rose-455 tracking-wider">
              Failed
            </span>
            <p className="text-lg font-black text-rose-700 dark:text-rose-400 mt-0.5 font-mono">
              {insights.failedBookings}
            </p>
          </div>
          <div className="h-7 w-7 rounded-full bg-rose-100/50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner shrink-0">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
