import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import Vapi from '@vapi-ai/web'
import confetti from 'canvas-confetti'

const VapiClient: typeof Vapi = (Vapi as any).default || Vapi

export interface Message {
  id: string
  sender: 'patient' | 'ai'
  message: string
  timestamp: string
  isPartial?: boolean
}

export interface Appointment {
  patientName: string
  phoneNumber: string
  doctor: string
  date: string
  time: string
  reason: string
  status: 'Idle' | 'Typing' | 'Confirmed' | 'Failed'
}

export interface CallLog {
  id: string
  patient: string
  phone: string
  date: string
  time: string
  duration: string
  outcome: 'Booked' | 'Inquiry Only' | 'Rescheduled' | 'Missed' | 'Cancelled'
  recordingUrl: string
  transcript: string
  calendarStatus: 'Synced' | 'Pending' | 'Failed'
}

export interface Toast {
  id: string
  title: string
  description: string
  type: 'info' | 'success' | 'warning' | 'error'
}

export interface ClinicSettings {
  clinicName: string
  workingHoursStart: string
  workingHoursEnd: string
  appointmentDuration: number
  voiceSelection: string
  language: string
  timezone: string
  enableSmsNotifications: boolean
  enableEmailNotifications: boolean
}

export interface CalendarAppointment {
  day: string
  time: string
  patient: string
  doctor: string
  color: string
}

interface CallContextType {
  isCallActive: boolean
  isMuted: boolean
  volume: number
  callDuration: number
  agentState: 'offline' | 'connecting' | 'connected' | 'listening' | 'speaking' | 'processing' | 'call-ended' | 'error'
  messages: Message[]
  appointment: Appointment
  isCalendarConnected: boolean
  toasts: Toast[]
  callLogs: CallLog[]
  calendarAppointments: CalendarAppointment[]
  stats: {
    totalCalls: number
    appointmentsBooked: number
    missedCalls: number
    successRate: number
    avgDuration: string
  }
  insights: {
    bookingAccuracy: number
    avgResponseTime: number
    conversationQuality: number
    successfulBookings: number
    failedBookings: number
  }
  startCall: () => void
  endCall: () => void
  setMuted: (muted: boolean) => void
  setVolume: (volume: number) => void
  addToast: (title: string, description: string, type?: Toast['type']) => void
  removeToast: (id: string) => void
  resetBooking: () => void
  connectCalendar: () => void
  disconnectCalendar: () => void
  clearConversation: () => void
  clinicSettings: ClinicSettings
  updateSettings: (settings: Partial<ClinicSettings>) => void
  liveAudioLevel: number
  networkStatus: 'stable' | 'weak' | 'disconnected'
  speakerEnabled: boolean
  setSpeakerEnabled: (enabled: boolean) => void
}

const defaultSettings: ClinicSettings = {
  clinicName: 'Teal Dental Studio',
  workingHoursStart: '09:00',
  workingHoursEnd: '17:00',
  appointmentDuration: 30,
  voiceSelection: 'Sarah (Teal-Receptionist-F)',
  language: 'English (US)',
  timezone: 'EST (GMT-5)',
  enableSmsNotifications: true,
  enableEmailNotifications: true
}

const CallContext = createContext<CallContextType | undefined>(undefined)

const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: '1',
    patient: 'Sarah Jenkins',
    phone: '(555) 234-5678',
    date: '2026-07-22',
    time: '14:30',
    duration: '2m 15s',
    outcome: 'Booked',
    recordingUrl: '#',
    transcript: 'Patient requested appointment for annual checkup. Scheduled with Dr. Sarah Smith for Friday 2 PM.',
    calendarStatus: 'Synced'
  },
  {
    id: '2',
    patient: 'Robert Chen',
    phone: '(555) 876-5432',
    date: '2026-07-22',
    time: '11:15',
    duration: '1m 45s',
    outcome: 'Inquiry Only',
    recordingUrl: '#',
    transcript: 'Inquired about pricing structure for teeth whitening. No booking requested.',
    calendarStatus: 'Pending'
  },
  {
    id: '3',
    patient: 'Emily Rodriguez',
    phone: '(555) 456-7890',
    date: '2026-07-22',
    time: '09:05',
    duration: '3m 10s',
    outcome: 'Booked',
    recordingUrl: '#',
    transcript: 'Urgent call regarding chipped tooth. Fitted into emergency slot with Dr. Davies today at 4 PM.',
    calendarStatus: 'Synced'
  }
]

// Read Vapi configuration from environment
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || ''
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID || ''

const INITIAL_CALENDAR_APPOINTMENTS: CalendarAppointment[] = [
  { day: 'Wed', time: '11:00 AM', patient: 'Robert Chen', doctor: 'Dr. Marcus Davies', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60' },
  { day: 'Wed', time: '04:00 PM', patient: 'Emily Rodriguez', doctor: 'Dr. Marcus Davies', color: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900/60' },
  { day: 'Thu', time: '02:00 PM', patient: 'Sarah Jenkins', doctor: 'Dr. Sarah Smith', color: 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60' },
  { day: 'Fri', time: '02:00 PM', patient: 'Amanda White', doctor: 'Dr. Sarah Smith', color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60' }
]

const getDayAbbreviation = (dateStr: string): string => {
  const lowercase = dateStr.toLowerCase()
  if (lowercase.includes('mon')) return 'Mon'
  if (lowercase.includes('tue')) return 'Tue'
  if (lowercase.includes('wed')) return 'Wed'
  if (lowercase.includes('thu')) return 'Thu'
  if (lowercase.includes('fri')) return 'Fri'
  if (lowercase.includes('sat')) return 'Sat'
  if (lowercase.includes('sun')) return 'Sun'
  return 'Wed' // Default baseline
}

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setMutedState] = useState(false)
  const [volume, setVolume] = useState(80)
  const [callDuration, setCallDuration] = useState(0)
  const [agentState, setAgentState] = useState<CallContextType['agentState']>('offline')
  const [messages, setMessages] = useState<Message[]>([])
  const [appointment, setAppointment] = useState<Appointment>({
    patientName: '',
    phoneNumber: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    status: 'Idle'
  })
  const [isCalendarConnected, setIsCalendarConnected] = useState(true)
  const [toasts, setToasts] = useState<Toast[]>([])
  
  // Persistent States
  const [callLogs, setCallLogs] = useState<CallLog[]>(() => {
    const stored = localStorage.getItem('teal_dental_call_logs')
    return stored ? JSON.parse(stored) : INITIAL_CALL_LOGS
  })

  const [calendarAppointments, setCalendarAppointments] = useState<CalendarAppointment[]>(() => {
    const stored = localStorage.getItem('teal_dental_calendar_appointments')
    return stored ? JSON.parse(stored) : INITIAL_CALENDAR_APPOINTMENTS
  })

  const [clinicSettings, setClinicSettings] = useState<ClinicSettings>(defaultSettings)
  const [liveAudioLevel, setLiveAudioLevel] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<CallContextType['networkStatus']>('stable')
  const [speakerEnabled, setSpeakerEnabled] = useState(true)

  const vapiRef = useRef<Vapi | null>(null)
  const timerIntervalRef = useRef<number | null>(null)

  // Statistics State
  const [stats, setStats] = useState<CallContextType['stats']>(() => {
    const stored = localStorage.getItem('teal_dental_stats')
    return stored ? JSON.parse(stored) : {
      totalCalls: 34,
      appointmentsBooked: 18,
      missedCalls: 3,
      successRate: 85,
      avgDuration: '2m 04s'
    }
  })

  // Insights State
  const [insights, setInsights] = useState<CallContextType['insights']>(() => {
    const stored = localStorage.getItem('teal_dental_insights')
    return stored ? JSON.parse(stored) : {
      bookingAccuracy: 98,
      avgResponseTime: 1.2,
      conversationQuality: 95,
      successfulBookings: 18,
      failedBookings: 1
    }
  })

  // Synchronize dynamic states to localStorage for persistent storage
  useEffect(() => {
    localStorage.setItem('teal_dental_call_logs', JSON.stringify(callLogs))
  }, [callLogs])

  useEffect(() => {
    localStorage.setItem('teal_dental_calendar_appointments', JSON.stringify(calendarAppointments))
  }, [calendarAppointments])

  useEffect(() => {
    localStorage.setItem('teal_dental_stats', JSON.stringify(stats))
  }, [stats])

  useEffect(() => {
    localStorage.setItem('teal_dental_insights', JSON.stringify(insights))
  }, [insights])

  // Custom Toast helper
  const addToast = (title: string, description: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, type }])
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const connectCalendar = () => {
    setIsCalendarConnected(true)
    addToast('Google Calendar Connected', 'Syncing real-time schedule with clinic calendar.', 'success')
  }

  const disconnectCalendar = () => {
    setIsCalendarConnected(false)
    addToast('Google Calendar Disconnected', 'Calendar synchronization is paused.', 'warning')
  }

  const updateSettings = (settings: Partial<ClinicSettings>) => {
    setClinicSettings((prev) => ({ ...prev, ...settings }))
    addToast('Settings Saved', 'Clinic configuration has been updated successfully.', 'success')
  }

  const resetBooking = () => {
    setAppointment({
      patientName: '',
      phoneNumber: '',
      doctor: '',
      date: '',
      time: '',
      reason: '',
      status: 'Idle'
    })
  }

  const clearConversation = () => {
    setMessages([])
    addToast('Conversation Cleared', 'Live transcript has been reset.', 'info')
  }

  // Set Mute
  const setMuted = (muted: boolean) => {
    setMutedState(muted)
    if (vapiRef.current) {
      vapiRef.current.setMuted(muted)
    }
  }

  // Initialize Vapi SDK Client
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (VAPI_PUBLIC_KEY) {
        try {
          vapiRef.current = new VapiClient(VAPI_PUBLIC_KEY)
          console.log('Vapi Web SDK client initialized successfully with key:', VAPI_PUBLIC_KEY)
        } catch (err) {
          console.error('Failed to initialize Vapi Web SDK:', err)
          setAgentState('error')
        }
      } else {
        console.warn('VITE_VAPI_PUBLIC_KEY is not defined. Dashboard will run in simulated mode.')
      }
    }

    // Monitor network changes
    const handleOnline = () => setNetworkStatus('stable')
    const handleOffline = () => setNetworkStatus('disconnected')
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    }
  }, [])

  // Start Call Handler
  const startCall = () => {
    if (!VAPI_PUBLIC_KEY || !VAPI_ASSISTANT_ID) {
      addToast(
        'Call Key Missing',
        'Vapi environment credentials not found. Defaulting to Simulated Call Mode.',
        'warning'
      )
      runDemoSimulation()
      return
    }

    resetBooking()
    setMessages([])
    setCallDuration(0)
    setAgentState('connecting')
    setIsCallActive(true)

    addToast('Connecting Voice Agent', 'Requesting microphone access...', 'info')

    try {
      // Connect actual Vapi Client
      if (!vapiRef.current) {
        vapiRef.current = new VapiClient(VAPI_PUBLIC_KEY)
      }

      vapiRef.current.start(VAPI_ASSISTANT_ID)
      setMutedState(false)
    } catch (error: any) {
      console.error('Vapi Call Start Error:', error)
      setAgentState('error')
      setIsCallActive(false)
      addToast('Connection Failed', error.message || 'Check your mic permissions.', 'error')
    }
  }

  // End Call Handler
  const endCall = () => {
    setIsCallActive(false)
    setAgentState('call-ended')
    setLiveAudioLevel(0)

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current)
      timerIntervalRef.current = null
    }

    if (vapiRef.current) {
      vapiRef.current.stop()
    }

    addToast('Call Ended', 'Voice Agent Session disconnected.', 'info')
    
    setTimeout(() => {
      setAgentState('offline')
    }, 2500)
  }

  // Bind Vapi Event Listeners
  useEffect(() => {
    const vapi = vapiRef.current
    if (!vapi) return

    const handleCallStart = () => {
      setAgentState('connected')
      addToast('Agent Connected', 'Dental Receptionist is listening.', 'success')

      // Start timer
      setCallDuration(0)
      timerIntervalRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }

    const handleCallEnd = () => {
      setIsCallActive(false)
      setAgentState('call-ended')
      setLiveAudioLevel(0)
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
      setTimeout(() => {
        setAgentState('offline')
      }, 2500)
    }

    const handleSpeechStart = () => {
      setAgentState('speaking')
    }

    const handleSpeechEnd = () => {
      setAgentState('listening')
    }

    const handleVolumeLevel = (level: number) => {
      // level ranges from 0 to 1
      setLiveAudioLevel(level)
    }

    const handleError = (err: any) => {
      console.error('Vapi Web SDK error event:', err)
      setAgentState('error')
      addToast('Connection Error', err.message || 'WebRTC socket connection failed.', 'error')
    }

    const handleMessage = (msg: any) => {
      // 1. Handle Realtime Transcript Messages
      if (msg.type === 'transcript') {
        const isAI = msg.role === 'assistant'
        const text = msg.transcript.trim()
        if (!text) return

        // Update transcripts dynamically using partial/final flags
        setMessages((prev) => {
          // Check if there is already a partial message matching this sender at the end
          const lastMsg = prev[prev.length - 1]
          const parsedTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

          if (lastMsg && lastMsg.sender === (isAI ? 'ai' : 'patient') && lastMsg.isPartial) {
            // Replace the last partial message
            if (msg.transcriptType === 'partial') {
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, message: text }
              ]
            } else {
              // Commit as final
              return [
                ...prev.slice(0, -1),
                { ...lastMsg, message: text, isPartial: false }
              ]
            }
          } else {
            // Append a new message bubble
            return [
              ...prev,
              {
                id: Math.random().toString(36).substring(2, 9),
                sender: isAI ? 'ai' : 'patient',
                message: text,
                timestamp: parsedTimestamp,
                isPartial: msg.transcriptType === 'partial'
              }
            ]
          }
        })

        // Fire heuristic content parsing on transcripts as fallback
        if (msg.transcriptType === 'final') {
          extractFieldsFromText(text, isAI)
        }
      }

      // 2. Handle Structured Function Call Tools
      // Check for tool calls or function-calls when Vapi invokes backend tools
      if (msg.type === 'tool-calls' || msg.type === 'function-call') {
        const toolCalls = msg.toolCalls || [msg.functionCall]
        toolCalls.forEach((tool: any) => {
          const fn = tool.function || tool
          if (fn && (fn.name === 'bookAppointment' || fn.name === 'scheduleAppointment' || fn.name === 'book_appointment')) {
            try {
              const args = typeof fn.arguments === 'string' ? JSON.parse(fn.arguments) : fn.arguments
              console.log('Captured structured booking tool call:', args)
              
              setAppointment((prev) => ({
                ...prev,
                patientName: args.name || args.patientName || prev.patientName,
                phoneNumber: args.phone || args.phoneNumber || prev.phoneNumber,
                doctor: args.doctor || prev.doctor,
                date: args.date || prev.date,
                time: args.time || prev.time,
                reason: args.reason || args.reasonForVisit || prev.reason,
                status: 'Confirmed'
              }))

              triggerSuccessfulBookingEffect(args)
            } catch (err) {
              console.error('Failed to parse tool call arguments:', err)
            }
          }
        })
      }
    }

    // Register all callbacks
    vapi.on('call-start', handleCallStart)
    vapi.on('call-end', handleCallEnd)
    vapi.on('speech-start', handleSpeechStart)
    vapi.on('speech-end', handleSpeechEnd)
    vapi.on('volume-level', handleVolumeLevel)
    vapi.on('message', handleMessage)
    vapi.on('error', handleError)

    return () => {
      vapi.removeListener('call-start', handleCallStart)
      vapi.removeListener('call-end', handleCallEnd)
      vapi.removeListener('speech-start', handleSpeechStart)
      vapi.removeListener('speech-end', handleSpeechEnd)
      vapi.removeListener('volume-level', handleVolumeLevel)
      vapi.removeListener('message', handleMessage)
      vapi.removeListener('error', handleError)
    }
  }, [callLogs])

  // Trigger Booking Confirmation UI, Confetti and updates
  const triggerSuccessfulBookingEffect = (details: any) => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#14B8A6', '#3B82F6', '#10B981']
    })

    addToast('Appointment Booked', `${details.name || 'John'} - Confirmed`, 'success')
    addToast('✓ Appointment Booked Successfully', 'Google Calendar Updated', 'success')

    // Increment Analytics
    setStats((prev) => ({
      ...prev,
      appointmentsBooked: prev.appointmentsBooked + 1,
      totalCalls: prev.totalCalls + 1,
      successRate: Math.round(((prev.appointmentsBooked + 1) / (prev.totalCalls + 1)) * 100)
    }))

    setInsights((prev) => ({
      ...prev,
      successfulBookings: prev.successfulBookings + 1
    }))

    // Parse date into a day code (e.g. Fri)
    const parsedDay = getDayAbbreviation(details.date || 'Friday')
    const isSmith = (details.doctor || '').toLowerCase().includes('smith')
    const color = isSmith 
      ? 'bg-teal-100 text-teal-705 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60'
      : 'bg-blue-100 text-blue-705 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60'

    const newAppt: CalendarAppointment = {
      day: parsedDay,
      time: details.time || '10:00 AM',
      patient: details.name || details.patientName || 'John',
      doctor: isSmith ? 'Dr. Sarah Smith' : 'Dr. Marcus Davies',
      color
    }

    // Add to persistent calendar view
    setCalendarAppointments((prev) => {
      // Avoid duplicates for the exact same slot
      const filtered = prev.filter((a) => !(a.day === newAppt.day && a.time === newAppt.time))
      return [...filtered, newAppt]
    })

    // Prepend to Call Logs List
    const newLog: CallLog = {
      id: (callLogs.length + 1).toString(),
      patient: details.name || details.patientName || 'Vapi Client',
      phone: details.phone || details.phoneNumber || '(555) Call-In',
      date: new Date().toISOString().split('T')[0],
      time: details.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: '1m 30s',
      outcome: 'Booked',
      recordingUrl: '#',
      transcript: `Patient successfully booked appointment with ${details.doctor || 'Dr. Smith'} on ${details.date || 'Friday'} at ${details.time || '10:00 AM'}.`,
      calendarStatus: 'Synced'
    }
    setCallLogs((prev) => [newLog, ...prev])
  }

  // Regex Heuristics to capture fields in real time when function calls are not fired
  const extractFieldsFromText = (text: string, isAI: boolean) => {
    setAppointment((prev) => {
      const updates: Partial<Appointment> = {}

      if (!isAI) {
        // 1. Patient Name capturing
        const nameMatch = text.match(/(?:my name is|i am|this is)\s+([A-Z][a-z]+)/i)
        if (nameMatch && nameMatch[1]) {
          updates.patientName = nameMatch[1]
          updates.status = 'Typing'
        }

        // 2. Phone capturing
        const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
        if (phoneMatch && phoneMatch[0]) {
          updates.phoneNumber = phoneMatch[0]
        }

        // 3. Reason capturing
        if (text.toLowerCase().includes('cleaning') || text.toLowerCase().includes('routine checkup')) {
          updates.reason = 'Routine Cleaning'
        } else if (text.toLowerCase().includes('pain') || text.toLowerCase().includes('chipped') || text.toLowerCase().includes('broke')) {
          updates.reason = 'Emergency Consultation'
        } else if (text.toLowerCase().includes('whitening') || text.toLowerCase().includes('cosmetic')) {
          updates.reason = 'Teeth Whitening'
        }
      } else {
        // AI response capturing: Dentist preferences
        if (text.toLowerCase().includes('smith')) {
          updates.doctor = 'Dr. Sarah Smith'
        } else if (text.toLowerCase().includes('davies')) {
          updates.doctor = 'Dr. Marcus Davies'
        }

        // Dates/Times Capturing from options
        if (text.toLowerCase().includes('friday, july 24') || text.toLowerCase().includes('friday at 10')) {
          updates.date = 'Friday, July 24, 2026'
        }
        if (text.toLowerCase().includes('10:00 am')) {
          updates.time = '10:00 AM'
        } else if (text.toLowerCase().includes('2:30 pm')) {
          updates.time = '2:30 PM'
        }
      }

      if (Object.keys(updates).length > 0) {
        return { ...prev, ...updates }
      }
      return prev
    })
  }

  // --- Fallback Demo Mode Simulator (When credentials aren't active) ---
  const simulationStepRef = useRef(0)
  const simulationTimeoutRef = useRef<number | null>(null)

  const runDemoSimulation = () => {
    setIsCallActive(true)
    setAgentState('connecting')
    setCallDuration(0)
    setMessages([])
    resetBooking()
    simulationStepRef.current = 0

    // Connect trigger
    setTimeout(() => {
      setAgentState('connected')
      addToast('Agent Connected (Demo Mode)', 'Simulating speech synthesis connection.', 'success')
      
      // Start digital timer
      timerIntervalRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)

      runSimulationDialogStep()
    }, 1500)
  }

  const simScript = [
    { 
      sender: 'ai' as const, 
      message: 'Thank you for calling Teal Dental Studio. This is Sarah, your AI dental receptionist. How can I help you today?', 
      delay: 1500, 
      state: 'speaking' as const 
    },
    { 
      sender: 'patient' as const, 
      message: "Hi Sarah, my name is John. I'd like to book an appointment with Dr. Sarah Smith for a teeth cleaning, please.", 
      delay: 3500, 
      state: 'listening' as const, 
      update: { patientName: 'John', doctor: 'Dr. Sarah Smith', reason: 'Routine Cleaning', status: 'Typing' as const } 
    },
    { 
      sender: 'ai' as const, 
      message: 'I can certainly help you with that, John. To proceed with the reservation, could you please provide your phone number?', 
      delay: 4000, 
      state: 'speaking' as const 
    },
    { 
      sender: 'patient' as const, 
      message: 'Yes, it is (555) 765-4321.', 
      delay: 3000, 
      state: 'listening' as const, 
      update: { phoneNumber: '(555) 765-4321' } 
    },
    { 
      sender: 'ai' as const, 
      message: 'Thank you. And do you have a preferred date and time in mind for your visit with Dr. Smith?', 
      delay: 4500, 
      state: 'speaking' as const 
    },
    { 
      sender: 'patient' as const, 
      message: "I'd prefer this Friday, July 24th at 10:00 AM, if that is possible.", 
      delay: 3500, 
      state: 'listening' as const, 
      update: { date: 'Friday, July 24, 2026', time: '10:00 AM' } 
    },
    { 
      sender: 'ai' as const, 
      message: "Let me check our calendar to see if Dr. Smith is available on Friday, July 24th at 10:00 AM. One moment, please.", 
      delay: 3000, 
      state: 'speaking' as const 
    },
    { 
      sender: 'ai' as const, 
      message: '[Tool Call: Google Calendar Check Availability...]', 
      delay: 2000, 
      state: 'processing' as const 
    },
    { 
      sender: 'ai' as const, 
      message: '[Tool Success: Slot Available. Registering event in Google Calendar...]', 
      delay: 2500, 
      state: 'processing' as const 
    },
    { 
      sender: 'ai' as const, 
      message: 'Your appointment has been successfully booked for Friday, July 24th at 10:00 AM. We look forward to seeing you.', 
      delay: 5000, 
      state: 'speaking' as const, 
      confirm: true 
    },
    { 
      sender: 'patient' as const, 
      message: 'Perfect! Thank you so much, Sarah. See you on Friday.', 
      delay: 3000, 
      state: 'listening' as const 
    },
    { 
      sender: 'ai' as const, 
      message: 'You are very welcome, John. Have a wonderful day. Goodbye!', 
      delay: 2000, 
      state: 'speaking' as const, 
      hangup: true 
    }
  ]

  const runSimulationDialogStep = () => {
    const idx = simulationStepRef.current
    if (idx >= simScript.length) {
      endCall()
      return
    }

    const current = simScript[idx]
    setAgentState(current.state)

    // Simulate volume bar bounce
    const bounceInterval = setInterval(() => {
      setLiveAudioLevel(current.state === 'speaking' ? 0.3 + Math.random() * 0.5 : 0.05 + Math.random() * 0.15)
    }, 150)

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), sender: current.sender, message: current.message, timestamp }
    ])

    if (current.update) {
      setAppointment((prev) => ({ ...prev, ...current.update }))
    }

    if (current.confirm) {
      setAppointment((prev) => ({ ...prev, status: 'Confirmed' }))
      triggerSuccessfulBookingEffect({
        name: 'John',
        phone: '(555) 765-4321',
        doctor: 'Dr. Sarah Smith',
        date: 'Friday, July 24, 2026',
        time: '10:00 AM',
        reason: 'Routine Cleaning'
      })
    }

    simulationStepRef.current += 1

    simulationTimeoutRef.current = window.setTimeout(() => {
      clearInterval(bounceInterval)
      if (current.hangup) {
        endCall()
      } else {
        runSimulationDialogStep()
      }
    }, current.delay)
  }

  return (
    <CallContext.Provider
      value={{
        isCallActive,
        isMuted,
        volume,
        callDuration,
        agentState,
        messages,
        appointment,
        isCalendarConnected,
        toasts,
        callLogs,
        calendarAppointments,
        stats,
        insights,
        startCall,
        endCall,
        setMuted,
        setVolume,
        addToast,
        removeToast,
        resetBooking,
        connectCalendar,
        disconnectCalendar,
        clearConversation,
        clinicSettings,
        updateSettings,
        liveAudioLevel,
        networkStatus,
        speakerEnabled,
        setSpeakerEnabled
      }}
    >
      {children}
    </CallContext.Provider>
  )
}

export const useCall = () => {
  const context = useContext(CallContext)
  if (!context) {
    throw new Error('useCall must be used within a CallProvider')
  }
  return context
}
