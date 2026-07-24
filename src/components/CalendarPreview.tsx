import React from 'react'
import { Calendar, AlertTriangle, RefreshCw } from 'lucide-react'
import { useCall } from '../context/CallContext'
import { Card, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'

export const CalendarPreview: React.FC = () => {
  const { isCalendarConnected, connectCalendar, disconnectCalendar, appointment, calendarAppointments } = useCall()

  // Weekly days starting from Monday
  const days = [
    { name: 'Mon', date: 'Jul 20' },
    { name: 'Tue', date: 'Jul 21' },
    { name: 'Wed', date: 'Jul 22', isToday: true },
    { name: 'Thu', date: 'Jul 23' },
    { name: 'Fri', date: 'Jul 24' },
    { name: 'Sat', date: 'Jul 25' },
    { name: 'Sun', date: 'Jul 26' }
  ]

  // Time slots for visual display
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']

  // Dynamic booking mapping:
  const liveBooking = appointment.status === 'Confirmed' ? {
    day: 'Fri', // John's appointment day in the live script
    time: '10:00 AM',
    patient: appointment.patientName,
    doctor: appointment.doctor.includes('Smith') ? 'Dr. Sarah Smith' : 'Dr. Marcus Davies',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300 animate-scaleUp dark:bg-emerald-950/50 dark:text-emerald-350 dark:border-emerald-900/80'
  } : null

  const allAppointments = liveBooking 
    ? [...calendarAppointments.filter(a => !(a.day === liveBooking.day && a.time === liveBooking.time)), liveBooking] 
    : calendarAppointments

  return (
    <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60 flex flex-col justify-between h-[460px]">
      <div>
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800/60 pb-3 p-5 flex flex-row items-center justify-between shrink-0">
          <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-teal-500" />
            <span>Clinic Schedule</span>
          </CardTitle>

          {/* Sync Button & State Toggle */}
          <div className="flex items-center gap-2">
            {isCalendarConnected ? (
              <button 
                onClick={disconnectCalendar}
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-150 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                🟢 Calendar Connected
              </button>
            ) : (
              <button 
                onClick={connectCalendar}
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/30 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-amber-150 transition-colors"
              >
                <AlertTriangle className="h-3 w-3" />
                Offline (Click to Connect)
              </button>
            )}
          </div>
        </CardHeader>

        {/* Weekly Header row */}
        <div className="grid grid-cols-8 border-b border-gray-100 dark:border-zinc-800/60 bg-gray-50/50 dark:bg-zinc-950/10 text-center py-2">
          {/* Time column spacer */}
          <div className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase">
            Time
          </div>
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex flex-col items-center justify-center rounded-lg py-0.5",
                day.isToday && "bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400 font-bold"
              )}
            >
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400">
                {day.name}
              </span>
              <span className="text-[9px] font-medium text-gray-400 dark:text-zinc-500">
                {day.date}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable calendar grid body */}
        <div className="overflow-y-auto h-[290px] relative">
          {timeSlots.map((time, slotIdx) => (
            <div 
              key={slotIdx} 
              className="grid grid-cols-8 border-b border-gray-100/60 dark:border-zinc-800/40 min-h-[50px] relative items-center"
            >
              {/* Time slot column */}
              <div className="text-[9px] font-bold text-gray-400 dark:text-zinc-500 font-mono text-center pr-1 border-r border-gray-100 dark:border-zinc-850 h-full flex items-center justify-center bg-gray-50/30 dark:bg-zinc-950/5">
                {time.split(' ')[0]}
                <span className="text-[7px] block font-sans font-medium text-gray-450 ml-0.5">
                  {time.split(' ')[1]}
                </span>
              </div>

              {/* Day cells (representing slots) */}
              {days.map((day, dayIdx) => {
                // Check if there is an appointment scheduled for this day and time
                const activeAppt = allAppointments.find(
                  (a) => a.day === day.name && a.time === time
                )

                return (
                  <div 
                    key={dayIdx} 
                    className="h-full border-r border-gray-100/40 dark:border-zinc-850/30 relative flex items-center justify-center p-1"
                  >
                    {activeAppt && (
                      <div 
                        className={cn(
                          "w-full h-full rounded-lg border text-[9px] leading-tight font-bold p-1 flex flex-col justify-center overflow-hidden shadow-sm hover:scale-[1.02] transition-transform duration-200 cursor-pointer",
                          activeAppt.color
                        )}
                      >
                        <span className="truncate">{activeAppt.patient}</span>
                        <span className="text-[7px] font-medium opacity-85 truncate mt-0.5">
                          {activeAppt.doctor}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Connection guidelines footer */}
      <div className="p-3 border-t border-gray-100 dark:border-zinc-800/60 bg-gray-50/30 dark:bg-zinc-950/20 text-center flex items-center justify-between shrink-0">
        <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-semibold flex items-center gap-1">
          <RefreshCw className="h-3 w-3 animate-spin-slow text-gray-400" />
          Last synced: Just now
        </span>
        <button 
          onClick={() => connectCalendar()}
          className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
        >
          Calendar Settings
        </button>
      </div>
    </Card>
  )
}
