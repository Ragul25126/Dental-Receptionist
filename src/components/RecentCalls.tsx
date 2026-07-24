import React, { useState } from 'react'
import { Search, FileText, PhoneCall, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useCall } from '../context/CallContext'
import type { CallLog } from '../context/CallContext'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '../lib/utils'

export const RecentCalls: React.FC = () => {
  const { callLogs, addToast } = useCall()
  
  // Search & Filtering States
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOutcome, setFilterOutcome] = useState<string>('All')
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Detailed Modal / Slide-out state
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null)

  // Filter call logs based on search and outcome filter
  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch = 
      log.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.phone.includes(searchTerm) ||
      log.transcript.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterOutcome === 'All' || log.outcome === filterOutcome

    return matchesSearch && matchesFilter
  })

  // Pagination indexing
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const playRecording = (patient: string) => {
    addToast('Playing Recording', `Streaming call audio for ${patient}...`, 'success')
  }

  return (
    <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60 w-full overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100 dark:border-zinc-800/60 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-2">
          <PhoneCall className="h-4.5 w-4.5 text-teal-500" />
          <span>Call History & Transcripts</span>
        </CardTitle>

        {/* Filters and search action tools */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search patients, phones..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-teal-500 w-full sm:w-[200px]"
            />
          </div>

          {/* Outcome Filter */}
          <select
            value={filterOutcome}
            onChange={(e) => {
              setFilterOutcome(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="All">All Outcomes</option>
            <option value="Booked">Booked</option>
            <option value="Inquiry Only">Inquiry Only</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Missed">Missed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-950/10 text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 tracking-wider">
                <th className="p-4 pl-6">Patient</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Outcome</th>
                <th className="p-4">Recording</th>
                <th className="p-4">Transcript</th>
                <th className="p-4 pr-6">Sync Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/60 dark:divide-zinc-800/40 text-xs">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 dark:text-zinc-500 font-medium">
                    No matching call logs found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-gray-50/40 dark:hover:bg-zinc-850/20 transition-colors"
                  >
                    <td className="p-4 pl-6 font-bold text-gray-900 dark:text-zinc-55">
                      {log.patient}
                    </td>
                    <td className="p-4 font-mono text-gray-600 dark:text-zinc-400">
                      {log.phone}
                    </td>
                    <td className="p-4 text-gray-550 dark:text-zinc-450">
                      <span className="font-semibold">{log.date}</span>
                      <span className="block text-[10px] font-mono mt-0.5">{log.time}</span>
                    </td>
                    <td className="p-4 font-mono text-gray-600 dark:text-zinc-400">
                      {log.duration}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        log.outcome === 'Booked' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
                        log.outcome === 'Inquiry Only' && "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
                        log.outcome === 'Rescheduled' && "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
                        log.outcome === 'Missed' && "bg-gray-150 text-gray-550 dark:bg-zinc-800 dark:text-zinc-400",
                        log.outcome === 'Cancelled' && "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-455"
                      )}>
                        {log.outcome}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => playRecording(log.patient)}
                        className="inline-flex items-center gap-1 text-[11px] font-extrabold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline bg-teal-50 dark:bg-teal-950/30 px-2 py-1 rounded-lg border border-teal-100 dark:border-teal-900/50"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        Play
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-950 dark:hover:text-zinc-50 border border-gray-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1 rounded-lg shadow-sm"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Transcript
                      </button>
                    </td>
                    <td className="p-4 pr-6">
                      <span className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-bold",
                        log.calendarStatus === 'Synced' && "text-emerald-600 dark:text-emerald-400",
                        log.calendarStatus === 'Pending' && "text-blue-500 dark:text-blue-400",
                        log.calendarStatus === 'Failed' && "text-rose-500 dark:text-rose-400"
                      )}>
                        {log.calendarStatus === 'Synced' ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        ) : log.calendarStatus === 'Pending' ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        )}
                        {log.calendarStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination and page summaries footer */}
        <div className="p-5 border-t border-gray-100 dark:border-zinc-800/60 bg-gray-50/50 dark:bg-zinc-950/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 dark:text-zinc-400">
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} calls
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-850 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center border font-bold transition-all",
                  currentPage === page 
                    ? "bg-teal-500 text-white border-teal-500" 
                    : "border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-850"
                )}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-zinc-850 disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>

      {/* Transcript Viewer Overlay Drawer (High Fidelity Modal) */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <Card className="w-full max-w-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 shadow-2xl animate-scaleUp">
            <CardHeader className="border-b border-gray-100 dark:border-zinc-800 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-teal-500" />
                <span>Call Transcript: {selectedLog.patient}</span>
              </CardTitle>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-650">
                {selectedLog.date}
              </span>
            </CardHeader>

            <CardContent className="p-6">
              <div className="bg-gray-50 dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 max-h-[220px] overflow-y-auto font-medium text-xs leading-relaxed text-gray-700 dark:text-zinc-350">
                {selectedLog.transcript}
              </div>

              <div className="mt-6 flex justify-between gap-4">
                <button
                  onClick={() => playRecording(selectedLog.patient)}
                  className="py-2 px-4 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/30 hover:bg-teal-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  Listen to call
                </button>
                
                <button
                  onClick={() => setSelectedLog(null)}
                  className="py-2 px-5 bg-gray-900 dark:bg-zinc-50 hover:bg-gray-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 rounded-xl text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  )
}
