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
    <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60 overflow-hidden relative flex flex-col justify-between h-[460px]">
      <div>
        <CardHeader className="border-b border-gray-100 dark:border-zinc-800/60 pb-3 p-5">
          <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4.5 w-4.5 text-teal-500" />
              <span>Real-time Booking Extractor</span>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider",
              appointment.status === 'Idle' && "bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-zinc-400",
              appointment.status === 'Typing' && "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 animate-pulse",
              appointment.status === 'Confirmed' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
              appointment.status === 'Failed' && "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-450"
            )}>
              {appointment.status}
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          {!hasData ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 mt-4">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400 dark:text-zinc-500 mb-3 border border-gray-200/20">
                <CalendarRange className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
                Awaiting Stream Input
              </h4>
              <p className="text-xs text-gray-400 dark:text-zinc-500 max-w-[220px] mt-1 font-medium leading-relaxed">
                As parameters are heard, AI will extract them into structural slots.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Patient Name */}
              <div className="flex items-center justify-between border-b border-gray-100/60 dark:border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Patient Name</span>
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  appointment.patientName ? "text-gray-900 dark:text-zinc-155" : "text-gray-300 dark:text-zinc-700 italic"
                )}>
                  {appointment.patientName || 'Extracting...'}
                </span>
              </div>

              {/* Phone Number */}
              <div className="flex items-center justify-between border-b border-gray-100/60 dark:border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
                  <Phone className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Phone Number</span>
                </div>
                <span className={cn(
                  "text-sm font-bold font-mono",
                  appointment.phoneNumber ? "text-gray-900 dark:text-zinc-155" : "text-gray-300 dark:text-zinc-700 italic"
                )}>
                  {appointment.phoneNumber || 'Extracting...'}
                </span>
              </div>

              {/* Doctor */}
              <div className="flex items-center justify-between border-b border-gray-100/60 dark:border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
                  <User className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Dentist</span>
                </div>
                <span className={cn(
                  "text-sm font-bold text-teal-650 dark:text-teal-400",
                  appointment.doctor ? "" : "text-gray-300 dark:text-zinc-700 italic"
                )}>
                  {appointment.doctor || 'Extracting...'}
                </span>
              </div>

              {/* Appointment Date */}
              <div className="flex items-center justify-between border-b border-gray-100/60 dark:border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
                  <CalendarRange className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Schedule Date</span>
                </div>
                <span className={cn(
                  "text-sm font-bold",
                  appointment.date ? "text-gray-900 dark:text-zinc-155" : "text-gray-300 dark:text-zinc-700 italic"
                )}>
                  {appointment.date || 'Extracting...'}
                </span>
              </div>

              {/* Appointment Time */}
              <div className="flex items-center justify-between border-b border-gray-100/60 dark:border-zinc-800/60 pb-2.5">
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
                  <CalendarRange className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Schedule Time</span>
                </div>
                <span className={cn(
                  "text-sm font-bold font-mono",
                  appointment.time ? "text-gray-900 dark:text-zinc-155" : "text-gray-300 dark:text-zinc-700 italic"
                )}>
                  {appointment.time || 'Extracting...'}
                </span>
              </div>

              {/* Reason for Visit */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-zinc-400">
                  <Clipboard className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Reason</span>
                </div>
                <span className={cn(
                  "text-sm font-bold truncate max-w-[200px]",
                  appointment.reason ? "text-gray-900 dark:text-zinc-155" : "text-gray-300 dark:text-zinc-700 italic"
                )}>
                  {appointment.reason || 'Extracting...'}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </div>

      {/* Confirmed Success Indicator */}
      {appointment.status === 'Confirmed' && (
        <div className="m-5 p-4 rounded-xl bg-emerald-50 border border-emerald-250/50 dark:bg-emerald-950/20 dark:border-emerald-900/40 flex items-center gap-3 animate-fadeIn">
          <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <CheckCircle2 className="h-5 w-5 animate-scaleUp" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-450">
              ✓ Appointment Booked Successfully
            </h5>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold mt-0.5">
              ✓ Google Calendar Updated
            </p>
          </div>
        </div>
      )}

      {appointment.status === 'Failed' && (
        <div className="m-5 p-4 rounded-xl bg-rose-50 border border-rose-250/50 dark:bg-rose-950/20 dark:border-rose-900/40 flex items-center gap-3 animate-fadeIn">
          <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-455 shrink-0">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-xs font-extrabold text-rose-800 dark:text-rose-450">
              Booking Failed
            </h5>
            <p className="text-[10px] text-rose-650 dark:text-rose-500 font-semibold mt-0.5">
              Please try again or connect to admin.
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
