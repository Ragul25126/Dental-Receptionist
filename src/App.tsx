import React, { useState, useEffect } from 'react'
import { Sparkles, Sun, Moon, History, Settings as SettingsIcon, BarChart2 } from 'lucide-react'
import { CallProvider, useCall } from './context/CallContext'
import { StatsGrid } from './components/StatsGrid'
import { ChartsSection } from './components/ChartsSection'
import { VoiceAgentWidget } from './components/VoiceAgentWidget'
import { TranscriptPanel } from './components/VoiceAgent/TranscriptPanel'
import { BookingSummary } from './components/VoiceAgent/BookingSummary'
import { CalendarPreview } from './components/CalendarPreview'
import { AiInsights } from './components/AiInsights'
import { RecentCalls } from './components/RecentCalls'
import { SettingsPanel } from './components/SettingsPanel'
import { FloatingCallControls } from './components/FloatingCallControls'
import { ToastNotification } from './components/ToastNotification'
import { cn } from './lib/utils'

const DashboardContent: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { isCallActive, clinicSettings } = useCall()
  const [darkMode, setDarkMode] = useState(false)

  // Manage Dark Mode class toggles
  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 transition-colors duration-300 pb-28 relative overflow-x-hidden">
      {/* Ambient Background Gradient Blobs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-300/10 dark:bg-teal-900/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-300/10 dark:bg-blue-900/5 blur-[150px] pointer-events-none" />

      {/* Toast Manager */}
      <ToastNotification />

      {/* Main SaaS Navbar */}
      <nav className="sticky top-0 z-30 border-b border-gray-200/60 bg-white/80 dark:border-zinc-800/60 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-teal-500/10">
              <Sparkles className="h-5 w-5 fill-current" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-zinc-50 block">
                {clinicSettings.clinicName}
              </span>
              <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 tracking-wide uppercase">
                Reception Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Tab Links */}
          <div className="hidden md:flex items-center gap-1.5 bg-gray-100 dark:bg-zinc-800/80 p-1.5 rounded-xl border border-gray-200/10">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'dashboard'
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-zinc-150"
              )}
            >
              <BarChart2 className="h-4 w-4 text-teal-500" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'history'
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-zinc-150"
              )}
            >
              <History className="h-4 w-4 text-blue-500" />
              Call History
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer",
                activeTab === 'settings'
                  ? "bg-white text-gray-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-gray-500 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-zinc-150"
              )}
            >
              <SettingsIcon className="h-4 w-4 text-indigo-500" />
              Settings
            </button>
          </div>

          {/* Right Toolbar */}
          <div className="flex items-center gap-4">
            {/* Mode Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-10 w-10 rounded-xl border border-gray-200/60 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 transition-colors shadow-sm cursor-pointer"
            >
              {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </button>

            {/* Vapi Connection Tag */}
            <div className="hidden sm:flex items-center gap-2 border border-gray-250 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 py-1.5 px-3 rounded-xl shadow-sm">
              <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                Vapi Connected
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Grid Wrapper */}
      <main className="max-w-[1400px] mx-auto px-6 pt-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Welcome Sub-Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/50 dark:border-zinc-800/50 pb-6">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-zinc-50">
                  Dental Reception Hub
                </h1>
                <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                  <span>Welcome back, Admin</span>
                  <span className="h-1 w-1 rounded-full bg-gray-350 dark:bg-zinc-750" />
                  <span>Clinic Status: <span className="text-emerald-500 font-bold">Open</span></span>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-gray-800 dark:text-zinc-200 block">
                    Wednesday, July 22, 2026
                  </span>
                  <span className="text-[10px] font-medium text-gray-400 dark:text-zinc-550">
                    Shift: {clinicSettings.workingHoursStart} - {clinicSettings.workingHoursEnd} ({clinicSettings.timezone})
                  </span>
                </div>
              </div>
            </div>

            {/* Statistics Row */}
            <StatsGrid />

            {/* Split Section Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Column (Main Charts & Tables) */}
              <div className="xl:col-span-8 space-y-8">
                <ChartsSection />
                <RecentCalls />
              </div>

              {/* Right Column (Widget panel stack - call widgets and context widgets) */}
              <div className="xl:col-span-4 space-y-8">
                {/* Voice Agent widget is persistent at the top of the right stack */}
                <VoiceAgentWidget />

                {/* Dynamic context widgets */}
                {isCallActive ? (
                  <>
                    <BookingSummary />
                    <TranscriptPanel />
                  </>
                ) : (
                  <>
                    <CalendarPreview />
                    <AiInsights />
                  </>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-zinc-50">
                Call Archives
              </h1>
              <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 mt-1">
                View detailed transcripts, audio recordings, and Google Calendar sync states for all client calls.
              </p>
            </div>
            <RecentCalls />
          </div>
        )}

        {activeTab === 'settings' && (
          <SettingsPanel />
        )}
      </main>

      {/* Floating command bar */}
      <FloatingCallControls activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <CallProvider>
      <DashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </CallProvider>
  )
}

export default App
