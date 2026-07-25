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
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30'
  } : null

  const allAppointments = liveBooking 
    ? [...calendarAppointments.filter(a => !(a.day === liveBooking.day && a.time === liveBooking.time)), liveBooking] 
    : calendarAppointments

  return (
    <Card 
      className="border custom-shadow flex flex-col justify-between h-[460px] rounded-2xl"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div>
        <CardHeader className="border-b pb-3 p-5 flex flex-row items-center justify-between shrink-0" style={{ borderColor: 'var(--border-color)' }}>
          <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
            <Calendar className="h-4.5 w-4.5 text-blue-500" />
            <span>Clinic Schedule</span>
          </CardTitle>

          {/* Sync Button & State Toggle */}
          <div className="flex items-center gap-2">
            {isCalendarConnected ? (
              <button 
                onClick={disconnectCalendar}
                className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-emerald-500/25 transition-colors cursor-pointer"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Sync Active</span>
              </button>
            ) : (
              <button 
                onClick={connectCalendar}
                className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-amber-500/25 transition-colors cursor-pointer"
              >
                <AlertTriangle className="h-3 w-3" />
                <span>Offline</span>
              </button>
            )}
          </div>
        </CardHeader>

        {/* Weekly Header row */}
        <div className="grid grid-cols-8 border-b text-center py-2 bg-[var(--bg-page)]" style={{ borderColor: 'var(--border-color)' }}>
          {/* Time column spacer */}
          <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase my-auto">
            Time
          </div>
          {days.map((day, idx) => (
            <div 
              key={idx} 
              className={cn(
                "flex flex-col items-center justify-center rounded-lg py-0.5 mx-0.5",
                day.isToday && "bg-blue-500/10 text-blue-500 font-bold"
              )}
            >
              <span className="text-[9px] uppercase font-bold text-[var(--text-primary)]">
                {day.name}
              </span>
              <span className="text-[8px] font-medium text-[var(--text-secondary)]">
                {day.date.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable calendar grid body */}
        <div className="overflow-y-auto h-[290px] relative">
          {timeSlots.map((time, slotIdx) => (
            <div 
              key={slotIdx} 
              className="grid grid-cols-8 border-b min-h-[50px] relative items-center"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {/* Time slot column */}
              <div 
                className="text-[9px] font-bold text-[var(--text-secondary)] font-mono text-center pr-1 border-r h-full flex flex-col justify-center items-center bg-[var(--bg-page)]"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <span>{time.split(' ')[0]}</span>
                <span className="text-[7px] font-sans font-medium opacity-80">
                  {time.split(' ')[1]}
                </span>
              </div>

              {/* Day cells (representing slots) */}
              {days.map((day, dayIdx) => {
                const activeAppt = allAppointments.find(
                  (a) => a.day === day.name && a.time === time
                )

                // Alternate styling for scheduled appointments or placeholder color configurations
                const apptColor = activeAppt?.color 
                  ? activeAppt.color
                  : 'bg-blue-500/5 text-blue-600 border-blue-500/20 dark:text-blue-400 dark:border-blue-500/30'

                return (
                  <div 
                    key={dayIdx} 
                    className="h-full border-r relative flex items-center justify-center p-1"
                    style={{ borderColor: 'var(--border-color)' }}
                  >
                    {activeAppt && (
                      <div 
                        className={cn(
                          "w-full h-full rounded-lg border text-[9px] leading-tight font-bold p-1.5 flex flex-col justify-center overflow-hidden shadow-xs hover:scale-[1.02] active:scale-[0.99] transition-all duration-150 cursor-pointer select-none",
                          apptColor
                        )}
                      >
                        <span className="truncate">{activeAppt.patient}</span>
                        <span className="text-[7px] font-medium opacity-85 truncate mt-0.5">
                          {activeAppt.doctor.split(' ').pop()}
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
      <div 
        className="p-3 border-t text-center flex items-center justify-between shrink-0 bg-[var(--bg-page)]"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <span className="text-[10px] text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
          <RefreshCw className="h-3 w-3 animate-spin-slow text-[var(--text-secondary)]" />
          <span>Last synced: Just now</span>
        </span>
        <button 
          onClick={() => connectCalendar()}
          className="text-[10px] font-extrabold text-blue-500 hover:underline cursor-pointer"
        >
          Manage Calendar
        </button>
      </div>
    </Card>
  )
}
