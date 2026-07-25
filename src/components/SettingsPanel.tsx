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
            <h1 className="text-xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5 uppercase tracking-wide">
              <Settings className="h-5 w-5 text-blue-500" />
              <span>Settings Configuration</span>
            </h1>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mt-1">
              Configure your dental clinic voice agent parameters and active scheduler links.
            </p>
          </div>
          <button
            type="submit"
            className="py-1.5 px-4 rounded-xl font-extrabold text-white bg-blue-500 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center gap-2 shadow-md shadow-blue-500/10 text-xs uppercase tracking-wider cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* General Clinic Settings Card */}
          <Card 
            className="border custom-shadow rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <CardHeader className="p-5 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <CardTitle className="text-xs font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
                <Clock className="h-4.5 w-4.5 text-blue-500" />
                <span>Clinic Profile & Shifts</span>
              </CardTitle>
              <CardDescription className="text-[10px] font-semibold text-[var(--text-secondary)]">
                Manage basic clinic profile details and active office hours.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Clinic Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Clinic Name
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)]"
                  style={{ borderColor: 'var(--border-color)' }}
                  required
                />
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Opening Hour
                  </label>
                  <input
                    type="time"
                    value={formData.workingHoursStart}
                    onChange={(e) => setFormData({ ...formData, workingHoursStart: e.target.value })}
                    className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)]"
                    style={{ borderColor: 'var(--border-color)' }}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    Closing Hour
                  </label>
                  <input
                    type="time"
                    value={formData.workingHoursEnd}
                    onChange={(e) => setFormData({ ...formData, workingHoursEnd: e.target.value })}
                    className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)]"
                    style={{ borderColor: 'var(--border-color)' }}
                    required
                  />
                </div>
              </div>

              {/* Default Slot Duration */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Default Appointment Duration
                </label>
                <select
                  value={formData.appointmentDuration}
                  onChange={(e) => setFormData({ ...formData, appointmentDuration: Number(e.target.value) })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)] cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
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
          <Card 
            className="border custom-shadow rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <CardHeader className="p-5 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <CardTitle className="text-xs font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
                <Mic className="h-4.5 w-4.5 text-blue-500" />
                <span>Voice Agent Settings</span>
              </CardTitle>
              <CardDescription className="text-[10px] font-semibold text-[var(--text-secondary)]">
                Select your preferred AI voice persona and dialect configurations.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Selected Voice */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  AI Voice Persona
                </label>
                <select
                  value={formData.voiceSelection}
                  onChange={(e) => setFormData({ ...formData, voiceSelection: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)] cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <option value="Sarah (Teal-Receptionist-F)">Sarah (Teal-Receptionist-F) - Warm & Professional</option>
                  <option value="David (Teal-Care-M)">David (Teal-Care-M) - Friendly & Helpful</option>
                  <option value="Michael (Teal-Receptionist-M)">Michael (Teal-Receptionist-M) - Assertive & Quick</option>
                  <option value="Elena (Teal-Care-F)">Elena (Teal-Care-F) - Soft Accent</option>
                </select>
              </div>

              {/* Languages */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Primary Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)] cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <option value="English (US)">English (US)</option>
                  <option value="English (UK)">English (UK)</option>
                  <option value="Spanish (ES)">Spanish (ES)</option>
                  <option value="French (FR)">French (FR)</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                  Clinic Timezone
                </label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="px-3.5 py-2.5 text-xs rounded-xl border bg-[var(--bg-page)] text-[var(--text-primary)] cursor-pointer"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <option value="EST (GMT-5)">EST (GMT-5) - Eastern Time</option>
                  <option value="CST (GMT-6)">CST (GMT-6) - Central Time</option>
                  <option value="PST (GMT-8)">PST (GMT-8) - Pacific Time</option>
                  <option value="GMT (GMT+0)">GMT (GMT+0) - Greenwich Time</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Sync Integrations Card */}
          <Card 
            className="border custom-shadow rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <CardHeader className="p-5 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <CardTitle className="text-xs font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
                <Calendar className="h-4.5 w-4.5 text-blue-500" />
                <span>Google Calendar Link</span>
              </CardTitle>
              <CardDescription className="text-[10px] font-semibold text-[var(--text-secondary)]">
                Synchronize bookings automatically to the clinic calendar.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div 
                className="flex items-center justify-between p-4 rounded-xl border"
                style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${isCalendarConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {isCalendarConnected ? 'Google Calendar Active' : 'Calendar Disconnected'}
                    </h5>
                    <p className="text-[9px] text-[var(--text-secondary)] font-semibold mt-0.5 truncate">
                      {isCalendarConnected ? 'clinic-sync@dentalstudio.com' : 'Authorizations required to link'}
                    </p>
                  </div>
                </div>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={handleToggleCalendar}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isCalendarConnected ? 'bg-blue-500' : 'bg-gray-250 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isCalendarConnected ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Card */}
          <Card 
            className="border custom-shadow rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <CardHeader className="p-5 border-b pb-3" style={{ borderColor: 'var(--border-color)' }}>
              <CardTitle className="text-xs font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
                <Bell className="h-4.5 w-4.5 text-blue-500" />
                <span>Notification Channels</span>
              </CardTitle>
              <CardDescription className="text-[10px] font-semibold text-[var(--text-secondary)]">
                Alert clinic managers when appointments are booked.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* SMS Notification */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[var(--text-primary)]">
                    SMS Confirmation Alerts
                  </h5>
                  <p className="text-[9px] text-[var(--text-secondary)] font-semibold mt-0.5">
                    Send SMS updates to patients upon booking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableSmsNotifications: !formData.enableSmsNotifications })}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.enableSmsNotifications ? 'bg-blue-500' : 'bg-gray-250 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.enableSmsNotifications ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div 
                className="flex items-center justify-between border-t pt-4"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <div>
                  <h5 className="text-xs font-bold text-[var(--text-primary)]">
                    Email Sync Reports
                  </h5>
                  <p className="text-[9px] text-[var(--text-secondary)] font-semibold mt-0.5">
                    Email daily call outcome reports to clinic admins.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, enableEmailNotifications: !formData.enableEmailNotifications })}
                  className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formData.enableEmailNotifications ? 'bg-blue-500' : 'bg-gray-250 dark:bg-zinc-800'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      formData.enableEmailNotifications ? 'translate-x-4.5' : 'translate-x-0'
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
