import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  Sun, 
  Moon, 
  History, 
  Settings as SettingsIcon, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  Plus, 
  User as UserIcon 
} from 'lucide-react'
import { CallProvider, useCall } from './context/CallContext'
import { StatsGrid } from './components/StatsGrid'
import { ChartsSection } from './components/ChartsSection'
import { VoiceAgentWidget } from './components/VoiceAgentWidget'
import { BookingSummary } from './components/VoiceAgent/BookingSummary'
import { CalendarPreview } from './components/CalendarPreview'
import { RecentCalls } from './components/RecentCalls'
import { SettingsPanel } from './components/SettingsPanel'
import { FloatingCallControls } from './components/FloatingCallControls'
import { ToastNotification } from './components/ToastNotification'
import { cn } from './lib/utils'

const DashboardContent: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const { isCallActive, clinicSettings, startCall } = useCall()
  const [darkMode, setDarkMode] = useState(true) // Default to dark mode as requested
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Manage Dark Mode class toggles
  useEffect(() => {
    const root = window.document.documentElement
    if (darkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [darkMode])

  // Get current formatted date
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return new Date().toLocaleDateString('en-US', options)
  }

  return (
    <div className="min-h-screen flex text-[var(--text-primary)] transition-colors duration-200" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Toast Manager */}
      <ToastNotification />

      {/* 5. Collapsible Sidebar Redesign */}
      <aside 
        className={cn(
          "sticky top-0 h-screen shrink-0 border-r transition-all duration-300 flex flex-col justify-between z-40",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
        style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}
      >
        <div>
          {/* Sidebar Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-blue-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <Sparkles className="h-5 w-5 fill-current" />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col select-none">
                  <span className="font-extrabold text-xs tracking-tight truncate max-w-[140px] text-[var(--text-primary)]">
                    {clinicSettings.clinicName}
                  </span>
                  <span className="text-[9px] font-bold text-blue-500 tracking-wider uppercase">
                    Healthcare CRM
                  </span>
                </div>
              )}
            </div>

            {/* Collapse Toggle trigger */}
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-[var(--hover-color)] border transition-colors cursor-pointer text-[var(--text-secondary)]"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {isSidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left",
                activeTab === 'dashboard'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/10"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover-color)] hover:text-[var(--text-primary)]"
              )}
            >
              <BarChart2 className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Overview</span>}
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left",
                activeTab === 'history'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/10"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover-color)] hover:text-[var(--text-primary)]"
              )}
            >
              <History className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Call Archives</span>}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer text-left",
                activeTab === 'settings'
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/10"
                  : "text-[var(--text-secondary)] hover:bg-[var(--hover-color)] hover:text-[var(--text-primary)]"
              )}
            >
              <SettingsIcon className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && <span>Settings</span>}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Profile */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shrink-0 font-bold text-sm">
              AD
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate text-[var(--text-primary)]">Admin Staff</span>
                <span className="text-[10px] truncate text-[var(--text-secondary)]">staff@dental.com</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Workspace Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* 6. Dashboard Header Redesign */}
        <header 
          className="sticky top-0 z-30 h-16 border-b flex items-center justify-between px-6 md:px-8 backdrop-blur-md bg-opacity-90"
          style={{ backgroundColor: 'var(--bg-header)', borderColor: 'var(--border-color)' }}
        >
          {/* Header Left Welcome */}
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
              Dental Reception Hub
            </h1>
            <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
              {getFormattedDate()}
            </span>
          </div>

          {/* Header Search Field */}
          <div className="relative max-w-xs w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-secondary)]" />
            <input 
              type="text" 
              placeholder="Search patients, calls, appointments..."
              className="pl-9 pr-4 py-1.5 w-full bg-[var(--bg-page)] text-xs border rounded-xl"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Header Toolbar Actions */}
          <div className="flex items-center gap-3.5 ml-auto sm:ml-0">
            {/* Quick Actions Action */}
            <button 
              onClick={startCall}
              disabled={isCallActive}
              className="py-1.5 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider text-white bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Quick Dial</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button 
                className="h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-[var(--hover-color)] text-[var(--text-secondary)] cursor-pointer"
                style={{ borderColor: 'var(--border-color)' }}
              >
                <Bell className="h-4 w-4" />
              </button>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-[var(--bg-header)]" />
            </div>

            {/* Dark/Light Mode Theme Switcher */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-9 w-9 rounded-xl border flex items-center justify-center hover:bg-[var(--hover-color)] text-[var(--text-secondary)] cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Avatar Visual profile */}
            <div className="h-9 w-9 rounded-xl border bg-[var(--hover-color)] flex items-center justify-center text-[var(--text-secondary)] cursor-pointer shrink-0" style={{ borderColor: 'var(--border-color)' }}>
              <UserIcon className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Content Body Area */}
        <main className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Statistics Grid Rows */}
              <StatsGrid />

              {/* Layout Content Section Splits */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Left Columns (Charts & Tables) */}
                <div className="xl:col-span-8 space-y-8">
                  <ChartsSection />
                  <RecentCalls />
                </div>

                {/* Right Columns (Sarah Widget & Calendar Sync widgets) */}
                <div className="xl:col-span-4 space-y-8">
                  {/* Sarah Voice Agent Widget (Persistent, houses transcript & insights now) */}
                  <VoiceAgentWidget />

                  {/* Context-Aware Bottom Widgets */}
                  {isCallActive ? (
                    <BookingSummary />
                  ) : (
                    <CalendarPreview />
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  Call Archives
                </h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-semibold">
                  View transcripts, booking updates, and calendar operations logs from all patients.
                </p>
              </div>
              <RecentCalls />
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsPanel />
          )}
        </main>
      </div>

      {/* Floating call command shortcut controls */}
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
