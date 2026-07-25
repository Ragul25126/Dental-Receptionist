import React from 'react'
import { CalendarCheck, CalendarRange, User, Phone, Clipboard, CheckCircle2, AlertCircle } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { cn } from '../../lib/utils'

export const BookingSummary: React.FC = () => {
  const { appointment } = useCall()

  const hasData = 
    appointment.patientName || 
    appointment.phoneNumber || 
    appointment.doctor || 
    appointment.date || 
    appointment.time || 
    appointment.reason

  return (
    <Card 
      className="border custom-shadow overflow-hidden relative flex flex-col justify-between h-[460px] rounded-2xl"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <div>
        <CardHeader className="border-b pb-3 p-5" style={{ borderColor: 'var(--border-color)' }}>
          <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] flex items-center justify-between uppercase tracking-wide">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4.5 w-4.5 text-blue-500" />
              <span>Real-time CRM Intake</span>
            </div>
            <span className={cn(
              "text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider",
              appointment.status === 'Idle' && "bg-[var(--hover-color)] text-[var(--text-secondary)] border border-[var(--border-color)]",
              appointment.status === 'Typing' && "bg-blue-500/10 text-blue-500 border border-blue-500/25 animate-pulse",
              appointment.status === 'Confirmed' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25",
              appointment.status === 'Failed' && "bg-rose-500/10 text-rose-600 dark:text-rose-455 border border-rose-500/25"
            )}>
              {appointment.status}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {!hasData ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 mt-4">
              <div className="h-10 w-10 rounded-xl bg-[var(--hover-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] mb-3 shadow-inner">
                <CalendarRange className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold text-[var(--text-primary)]">
                Awaiting Dialogue Stream
              </h4>
              <p className="text-[10px] text-[var(--text-secondary)] max-w-[200px] mt-1 font-semibold leading-relaxed">
                As Sarah detects booking parameters, they will populate here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Patient Name */}
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Patient Name</span>
                </div>
                <span className={cn(
                  "text-xs font-black",
                  appointment.patientName ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] italic"
                )}>
                  {appointment.patientName || 'Listening...'}
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Phone Number</span>
                </div>
                <span className={cn(
                  "text-xs font-black font-mono",
                  appointment.phoneNumber ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] italic"
                )}>
                  {appointment.phoneNumber || 'Listening...'}
                </span>
              </div>

              {/* Doctor */}
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Dentist</span>
                </div>
                <span className={cn(
                  "text-xs font-black text-blue-500",
                  appointment.doctor ? "" : "text-[var(--text-secondary)] italic"
                )}>
                  {appointment.doctor || 'Listening...'}
                </span>
              </div>

              {/* Appointment Date */}
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                  <CalendarRange className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Schedule Date</span>
                </div>
                <span className={cn(
                  "text-xs font-black",
                  appointment.date ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] italic"
                )}>
                  {appointment.date || 'Listening...'}
                </span>
              </div>

              {/* Appointment Time */}
              <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                  <CalendarRange className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Schedule Time</span>
                </div>
                <span className={cn(
                  "text-xs font-black font-mono",
                  appointment.time ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] italic"
                )}>
                  {appointment.time || 'Listening...'}
                </span>
              </div>

              {/* Reason for Visit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                  <Clipboard className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Reason</span>
                </div>
                <span className={cn(
                  "text-xs font-black truncate max-w-[160px]",
                  appointment.reason ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] italic"
                )}>
                  {appointment.reason || 'Listening...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Confirmed Success Indicator */}
      {appointment.status === 'Confirmed' && (
        <div 
          className="m-5 p-3.5 rounded-xl border flex items-center gap-3 animate-fadeIn bg-emerald-500/5"
          style={{ borderColor: 'rgba(16, 185, 129, 0.2)' }}
        >
          <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-4.5 w-4.5 animate-scaleUp" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              Booking Confirmed
            </h5>
            <p className="text-[9px] text-emerald-600 dark:text-emerald-500 font-semibold mt-0.5 leading-snug truncate">
              Google Calendar updated successfully.
            </p>
          </div>
        </div>
      )}

      {appointment.status === 'Failed' && (
        <div 
          className="m-5 p-3.5 rounded-xl border flex items-center gap-3 animate-fadeIn bg-rose-500/5"
          style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}
        >
          <div className="h-8 w-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-455 shrink-0">
            <AlertCircle className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-[10px] font-black text-rose-700 dark:text-rose-400 uppercase tracking-wide">
              Extraction Failed
            </h5>
            <p className="text-[9px] text-rose-600 dark:text-rose-500 font-semibold mt-0.5 leading-snug truncate">
              Failed to connect with scheduler tools.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
