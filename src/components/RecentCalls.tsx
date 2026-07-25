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

  // Detailed Modal state
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
    <Card 
      className="border custom-shadow w-full overflow-hidden rounded-2xl"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
    >
      <CardHeader className="pb-3 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5" style={{ borderColor: 'var(--border-color)' }}>
        <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
          <PhoneCall className="h-4.5 w-4.5 text-blue-500" />
          <span>Call History & Transcripts</span>
        </CardTitle>

        {/* Filters and search action tools */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search patients, phones..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-9 pr-4 py-1.5 w-full bg-[var(--bg-page)] text-xs border rounded-xl"
              style={{ borderColor: 'var(--border-color)' }}
            />
          </div>

          {/* Outcome Filter */}
          <select
            value={filterOutcome}
            onChange={(e) => {
              setFilterOutcome(e.target.value)
              setCurrentPage(1)
            }}
            className="px-3 py-1.5 text-xs rounded-xl border bg-[var(--bg-page)] cursor-pointer text-[var(--text-primary)]"
            style={{ borderColor: 'var(--border-color)' }}
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
              <tr className="border-b text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-page)' }}>
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
            <tbody className="divide-y text-xs" style={{ borderColor: 'var(--border-color)' }}>
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[var(--text-secondary)] font-medium">
                    No matching call logs found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="hover:bg-[var(--hover-color)] transition-colors"
                  >
                    <td className="p-4 pl-6 font-bold text-[var(--text-primary)]">
                      {log.patient}
                    </td>
                    <td className="p-4 font-mono text-[var(--text-secondary)]">
                      {log.phone}
                    </td>
                    <td className="p-4 text-[var(--text-secondary)]">
                      <span className="font-semibold">{log.date}</span>
                      <span className="block text-[10px] font-mono mt-0.5">{log.time}</span>
                    </td>
                    <td className="p-4 font-mono text-[var(--text-secondary)]">
                      {log.duration}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        log.outcome === 'Booked' && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
                        log.outcome === 'Inquiry Only' && "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
                        log.outcome === 'Rescheduled' && "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25",
                        log.outcome === 'Missed' && "bg-gray-500/10 text-gray-600 dark:text-zinc-400 border-gray-500/25",
                        log.outcome === 'Cancelled' && "bg-rose-500/10 text-rose-600 dark:text-rose-455 border-rose-500/25"
                      )}>
                        {log.outcome}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => playRecording(log.patient)}
                        className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-500 bg-blue-500/10 hover:bg-blue-500/15 px-2 py-1 rounded-lg border border-blue-500/20 cursor-pointer"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Play</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--text-primary)] border bg-transparent hover:bg-[var(--hover-color)] px-2 py-1 rounded-lg shadow-xs cursor-pointer"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        <FileText className="h-3.5 w-3.5 text-[var(--text-secondary)]" />
                        <span>Transcript</span>
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
                        <span>{log.calendarStatus}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination and page summaries footer */}
        <div 
          className="p-5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-[var(--text-secondary)] bg-[var(--bg-page)]"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <span>
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} calls
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border bg-transparent hover:bg-[var(--hover-color)] text-[var(--text-primary)] disabled:opacity-40 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center border font-bold transition-all cursor-pointer",
                  currentPage === page 
                    ? "bg-blue-500 text-white border-blue-500" 
                    : "bg-transparent text-[var(--text-primary)] hover:bg-[var(--hover-color)]"
                )}
                style={{ borderColor: currentPage === page ? '#3b82f6' : 'var(--border-color)' }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg border bg-transparent hover:bg-[var(--hover-color)] text-[var(--text-primary)] disabled:opacity-40 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>

      {/* Transcript Viewer Overlay Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <Card 
            className="w-full max-w-lg border shadow-2xl animate-scaleUp rounded-2xl"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
          >
            <CardHeader className="border-b pb-3 flex flex-row items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
              <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2 uppercase tracking-wide">
                <FileText className="h-4.5 w-4.5 text-blue-500" />
                <span>Transcript: {selectedLog.patient}</span>
              </CardTitle>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {selectedLog.date}
              </span>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div 
                className="p-4 rounded-xl border max-h-[220px] overflow-y-auto font-medium text-xs leading-relaxed text-[var(--text-primary)]"
                style={{ backgroundColor: 'var(--bg-page)', borderColor: 'var(--border-color)' }}
              >
                {selectedLog.transcript}
              </div>

              <div className="flex justify-between gap-4 pt-2">
                <button
                  onClick={() => playRecording(selectedLog.patient)}
                  className="py-2 px-4 border border-blue-500/20 text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>Listen recording</span>
                </button>
                
                <button
                  onClick={() => setSelectedLog(null)}
                  className="py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md shadow-blue-500/10"
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
