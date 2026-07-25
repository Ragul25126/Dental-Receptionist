import React from 'react'
import { Phone, Calendar, PhoneOff, Cpu, Clock, CheckCircle2, TrendingUp, TrendingDown } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/utils'

export const StatsGrid: React.FC = () => {
  const { stats, agentState, isCallActive } = useCall()

  const cardData = [
    {
      title: 'Total Calls Today',
      value: stats.totalCalls,
      change: '+12% vs yesterday',
      trend: 'up',
      icon: Phone,
      accentColor: 'bg-blue-500',
      iconColor: 'text-blue-500 bg-blue-500/10'
    },
    {
      title: 'Appointments Booked',
      value: stats.appointmentsBooked,
      change: '+8% vs yesterday',
      trend: 'up',
      icon: Calendar,
      accentColor: 'bg-emerald-500',
      iconColor: 'text-emerald-500 bg-emerald-500/10'
    },
    {
      title: 'Missed Calls',
      value: stats.missedCalls,
      change: '-25% vs yesterday',
      trend: 'down',
      icon: PhoneOff,
      accentColor: 'bg-rose-500',
      iconColor: 'text-rose-500 bg-rose-500/10'
    },
    {
      title: 'Active Voice Agent',
      value: isCallActive ? 'On Call' : agentState === 'offline' ? 'Idle' : 'Active',
      change: 'Sarah AI Assistant',
      trend: 'neutral',
      icon: Cpu,
      accentColor: 'bg-teal-500',
      iconColor: isCallActive ? 'text-emerald-500 bg-emerald-500/15 animate-pulse' : 'text-teal-500 bg-teal-500/10'
    },
    {
      title: 'Average Call Duration',
      value: stats.avgDuration,
      change: '+15s vs last week',
      trend: 'up',
      icon: Clock,
      accentColor: 'bg-indigo-500',
      iconColor: 'text-indigo-500 bg-indigo-500/10'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+2.4% vs last week',
      trend: 'up',
      icon: CheckCircle2,
      accentColor: 'bg-teal-500',
      iconColor: 'text-teal-500 bg-teal-500/10'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {cardData.map((card, idx) => {
        const Icon = card.icon
        const isTrendUp = card.trend === 'up'
        const isTrendDown = card.trend === 'down'

        return (
          <Card 
            key={idx} 
            className="relative overflow-hidden group hover:shadow-md hover:-translate-y-0.5 border transition-all duration-250 select-none"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            {/* Top accent bar indicator */}
            <div className={cn("absolute top-0 left-0 right-0 h-1", card.accentColor)} />

            <CardContent className="p-6 flex flex-col justify-between h-full">
              {/* Card Header Row */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0 shadow-inner", card.iconColor)}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              {/* Card Value */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-mono">
                  {card.value}
                </span>
              </div>

              {/* Card Trend Footer */}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase">
                {isTrendUp && (
                  <span className="flex items-center gap-0.5 text-emerald-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{card.change.split(' ')[0]}</span>
                  </span>
                )}
                {isTrendDown && (
                  <span className="flex items-center gap-0.5 text-rose-500">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span>{card.change.split(' ')[0]}</span>
                  </span>
                )}
                <span className="text-[var(--text-secondary)]">
                  {card.trend === 'neutral' ? card.change : card.change.substring(card.change.indexOf(' ') + 1)}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
