import React from 'react'
import { Brain, Star, CheckCircle, AlertTriangle, Timer } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

export const AiInsights: React.FC = () => {
  const { insights } = useCall()

  // Helper component to render an animated circular progress ring
  const CircularProgress = ({ 
    value, 
    max = 100, 
    strokeWidth = 8, 
    size = 80, 
    color = 'stroke-teal-500' 
  }: { 
    value: number
    max?: number
    strokeWidth?: number
    size?: number
    color?: string 
  }) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDashoffset = circumference - (value / max) * circumference

    return (
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          {/* Background circle */}
          <circle
            className="stroke-gray-100 dark:stroke-zinc-800"
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
        <span className="absolute text-sm font-extrabold text-gray-900 dark:text-zinc-50 font-mono">
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
      color: 'stroke-teal-500',
      textColor: 'text-teal-600 dark:text-teal-400'
    },
    {
      title: 'Response Time',
      description: 'Average AI response latency',
      icon: Timer,
      score: insights.avgResponseTime,
      max: 3.0,
      color: 'stroke-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Conversation Quality',
      description: 'Patient satisfaction analysis',
      icon: Star,
      score: insights.conversationQuality,
      max: 100,
      color: 'stroke-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400'
    }
  ]

  return (
    <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800/60 p-5">
        <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
          <Brain className="h-4.5 w-4.5 text-teal-500" />
          <span>AI Insights & Analytics</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Row of circular progress charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon
            return (
              <div 
                key={idx} 
                className="flex items-center gap-4 bg-gray-50/40 dark:bg-zinc-950/10 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800/20 hover:shadow-sm transition-all duration-300"
              >
                <CircularProgress 
                  value={m.score} 
                  max={m.max} 
                  color={m.color} 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`h-4 w-4 ${m.textColor}`} />
                    <h4 className="text-xs font-extrabold text-gray-800 dark:text-zinc-200 uppercase tracking-wider truncate">
                      {m.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-gray-400 dark:text-zinc-500 mt-1 leading-snug">
                    {m.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dynamic Booking success metrics footer */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-800/60 pt-6">
          <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 tracking-wider">
                Successful Bookings
              </span>
              <p className="text-2xl font-black text-emerald-800 dark:text-emerald-400 mt-1 font-mono">
                {insights.successfulBookings}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner">
              <CheckCircle className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-rose-50/50 dark:bg-rose-950/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-450 tracking-wider">
                Failed Bookings
              </span>
              <p className="text-2xl font-black text-rose-800 dark:text-rose-450 mt-1 font-mono">
                {insights.failedBookings}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-inner">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
