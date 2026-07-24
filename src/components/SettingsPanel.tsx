import React, { useState } from 'react'
import { Settings, Save, Calendar, Mic, Bell, Clock } from 'lucide-react'
import { useCall } from '../context/CallContext'
import type { ClinicSettings } from '../context/CallContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'

export const SettingsPanel: React.FC = () => {
  const { clinicSettings, updateSettings, isCalendarConnected, connectCalendar, disconnectCalendar } = useCall()
  
  const [formData, setFormData] = useState<ClinicSettings>({ ...clinicSettings })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formData)
  }

  const handleToggleCalendar = () => {
    if (isCalendarConnected) {
      disconnectCalendar()
    } else {
      connectCalendar()
    }
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-20 animate-fadeIn">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Settings Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-2.5">
              <Settings className="h-6 w-6 text-teal-500" />
              Settings
            </h1>
            <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1">
              Configure your dental clinic voice agent and calendar sync details.
            </p>
          </div>
          <button
            type="submit"
            className="py-2.5 px-6 rounded-xl font-bold text-white bg-teal-500 hover:bg-teal-600 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md shadow-teal-500/10 text-sm cursor-pointer"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Clinic Settings Card */}
          <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <Clock className="h-4.5 w-4.5 text-teal-500" />
                Clinic Profile & Hours
              </CardTitle>
              <CardDescription className="text-xs">
                Manage basic clinic information and operational shifts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Clinic Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                  required
                />
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                    Opening Hour
                  </label>
                  <input
                    type="time"
                    value={formData.workingHoursStart}
                    onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                    Closing Hour
                  </label>
                  <input
                    type="time"
                    value={formData.workingHoursEnd}
                    onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                    className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full"
                    required
                  />
                </div>
              </div>

              {/* Default Slot Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                  Default Appointment Duration
                </label>
                <select
                  value={formData.appointmentDuration}
                  onChange={(e) => setFormData({ ...formData, appointmentDuration: Number(e.target.value) })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* AI Voice Configuration Card */}
          <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <Mic className="h-4.5 w-4.5 text-teal-500" />
                Voice Agent Settings
              </CardTitle>
              <CardDescription className="text-xs">
                Select your preferred AI voice persona and dialect configurations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Selected Voice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                  AI Voice Persona
                </label>
                <select
                  value={formData.voiceSelection}
                  onChange={(e) => setFormData({ ...formData, voiceSelection: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Sarah (Teal-Receptionist-F)">Sarah (Teal-Receptionist-F) - Warm & Professional</option>
                  <option value="David (Teal-Care-M)">David (Teal-Care-M) - Friendly & Helpful</option>
                  <option value="Michael (Teal-Receptionist-M)">Michael (Teal-Receptionist-M) - Assertive & Quick</option>
                  <option value="Elena (Teal-Care-F)">Elena (Teal-Care-F) - Soft Accent</option>
                </select>
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                  Primary Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish (ES)">Spanish (ES)</option>
                  <option value="French (FR)">French (FR)</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-wider">
                  Clinic Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="EST (GMT-5)">EST (GMT-5) - Eastern Standard Time</option>
                  <option value="CST (GMT-6)">CST (GMT-6) - Central Standard Time</option>
                  <option value="PST (GMT-8)">PST (GMT-8) - Pacific Standard Time</option>
                  <option value="GMT (GMT+0)">GMT (GMT+0) - Greenwich Mean Time</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Sync Integrations Card */}
          <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-teal-500" />
                Google Calendar Link
              </CardTitle>
              <CardDescription className="text-xs">
                Synchronize bookings automatically to the clinic calendar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-150 dark:border-zinc-800/60 bg-gray-50/50 dark:bg-zinc-950/20">
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${isCalendarConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                      {isCalendarConnected ? 'Google Calendar Connected' : 'Google Calendar Disconnected'}
                    </h5>
                    <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium mt-0.5">
                      {isCalendarConnected ? 'clinic-appointments@dentalstudio.com' : 'Click toggle to authorize connection'}
                    </p>
                  </div>
                </div>

                {/* Simulated Custom Toggle */}
                <button
                  type="button"
                  onClick={handleToggleCalendar}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isCalendarConnected ? 'bg-teal-500' : 'bg-gray-200 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isCalendarConnected ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
            <CardHeader>
              <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
                <Bell className="h-4.5 w-4.5 text-teal-500" />
                Notification Channels
              </CardTitle>
              <CardDescription className="text-xs">
                Alert clinic managers when appointments are booked.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* SMS Notification */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                    SMS Confirmation Alerts
                  </h5>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium mt-0.5">
                    Send SMS updates to patients upon booking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableSmsNotifications: !formData.enableSmsNotifications })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.enableSmsNotifications ? 'bg-teal-500' : 'bg-gray-200 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.enableSmsNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between border-t border-gray-100/60 dark:border-zinc-800/40 pt-4">
                <div>
                  <h5 className="text-xs font-bold text-gray-800 dark:text-zinc-200">
                    Email Sync Reports
                  </h5>
                  <p className="text-[10px] text-gray-400 dark:text-zinc-500 font-medium mt-0.5">
                    Email daily call outcome reports to clinic admins.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableEmailNotifications: !formData.enableEmailNotifications })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.enableEmailNotifications ? 'bg-teal-500' : 'bg-gray-200 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.enableEmailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
