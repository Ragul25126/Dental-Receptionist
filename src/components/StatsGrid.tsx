import React from 'react'
import { Phone, Calendar, PhoneOff, Cpu, Clock, CheckCircle2 } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { Card, CardContent } from './ui/card'
import { cn } from '../lib/utils'

export const StatsGrid: React.FC = () => {
  const { stats, agentState, isCallActive } = useCall()

  const cardData = [
    {
      title: 'Total Calls Today',
      value: stats.totalCalls,
      change: '+12% from yesterday',
      trend: 'up',
      icon: Phone,
      colorClass: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30'
    },
    {
      title: 'Appointments Booked',
      value: stats.appointmentsBooked,
      change: '+8% from yesterday',
      trend: 'up',
      icon: Calendar,
      colorClass: 'text-teal-500 bg-teal-50 dark:bg-teal-950/30'
    },
    {
      title: 'Missed Calls',
      value: stats.missedCalls,
      change: '-25% from yesterday',
      trend: 'down',
      icon: PhoneOff,
      colorClass: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
    },
    {
      title: 'Active Voice Agent',
      value: isCallActive ? 'On Call' : agentState === 'offline' ? 'Idle' : 'Listening',
      change: 'Sarah (Dental Receptionist)',
      trend: 'neutral',
      icon: Cpu,
      colorClass: cn(
        'transition-colors duration-300',
        isCallActive 
          ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' 
          : 'text-teal-500 bg-teal-50 dark:bg-teal-950/30'
      )
    },
    {
      title: 'Average Call Duration',
      value: stats.avgDuration,
      change: '+15s from last week',
      trend: 'up',
      icon: Clock,
      colorClass: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      change: '+2.4% from last week',
      trend: 'up',
      icon: CheckCircle2,
      colorClass: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {cardData.map((card, idx) => {
        const Icon = card.icon
        return (
          <Card 
            key={idx} 
            className="hover:shadow-md transition-all duration-300 hover:translate-y-[-2px] border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <span className="text-2xl font-bold text-gray-900 dark:text-zinc-50 mt-2 font-sans tracking-tight">
                  {card.value}
                </span>
                <span className={cn(
                  "text-xs font-medium mt-1.5",
                  card.trend === 'up' && "text-emerald-600 dark:text-emerald-400",
                  card.trend === 'down' && "text-rose-600 dark:text-rose-400",
                  card.trend === 'neutral' && "text-gray-500 dark:text-zinc-400"
                )}>
                  {card.change}
                </span>
              </div>
              <div className={cn("p-3 rounded-xl flex items-center justify-center shadow-inner", card.colorClass)}>
                <Icon className="h-6 w-6 stroke-[2]" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
