import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const CALLS_BY_DAY_DATA = [
  { day: 'Mon', Incoming: 28, Completed: 24, Missed: 4 },
  { day: 'Tue', Incoming: 35, Completed: 32, Missed: 3 },
  { day: 'Wed', Incoming: 42, Completed: 38, Missed: 4 },
  { day: 'Thu', Incoming: 30, Completed: 27, Missed: 3 },
  { day: 'Fri', Incoming: 48, Completed: 43, Missed: 5 },
  { day: 'Sat', Incoming: 20, Completed: 18, Missed: 2 },
  { day: 'Sun', Incoming: 5, Completed: 5, Missed: 0 }
]

const APPOINTMENT_TRENDS_DATA = [
  { name: 'Jul 16', Appointments: 12 },
  { name: 'Jul 17', Appointments: 15 },
  { name: 'Jul 18', Appointments: 11 },
  { name: 'Jul 19', Appointments: 18 },
  { name: 'Jul 20', Appointments: 22 },
  { name: 'Jul 21', Appointments: 16 },
  { name: 'Jul 22', Appointments: 19 }
]

const CALL_OUTCOMES_DATA = [
  { name: 'Booked', value: 55, color: '#14B8A6' },     // Teal
  { name: 'Inquiry', value: 25, color: '#3B82F6' },    // Blue
  { name: 'Rescheduled', value: 12, color: '#6366F1' }, // Indigo
  { name: 'Cancelled', value: 8, color: '#EF4444' }     // Red
]

// Custom tooltips to replace blocky default tooltips
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200/60 dark:border-zinc-800 p-3 rounded-xl shadow-xl text-[11px] font-semibold">
        <p className="font-extrabold text-gray-900 dark:text-zinc-50 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 text-gray-650 dark:text-zinc-400">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                <span>{item.name}:</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-zinc-100">{item.value} calls</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200/60 dark:border-zinc-800 p-3 rounded-xl shadow-xl text-[11px] font-semibold">
        <p className="font-extrabold text-gray-900 dark:text-zinc-50 mb-1">{label}</p>
        <div className="flex items-center gap-1.5 text-teal-650 dark:text-teal-400">
          <span>Booked:</span>
          <span className="font-bold text-gray-900 dark:text-zinc-100">{payload[0].value} appointments</span>
        </div>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-gray-200/60 dark:border-zinc-800 p-3 rounded-xl shadow-xl text-[11px] font-semibold">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="text-gray-650 dark:text-zinc-400">{data.name}:</span>
          <span className="font-bold text-gray-900 dark:text-zinc-50">{data.value}%</span>
        </div>
      </div>
    )
  }
  return null
}

export const ChartsSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
      {/* Calls by Day Bar Chart */}
      <Card className="lg:col-span-2 border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center justify-between">
            <span>Calls Volume by Day</span>
            <span className="text-xs font-semibold text-gray-400 dark:text-zinc-500 bg-gray-100 dark:bg-zinc-850 px-2 py-0.5 rounded-full">
              Weekly view
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CALLS_BY_DAY_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-850" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 11 }} 
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, fontWeight: 600 }} />
              <Bar dataKey="Incoming" name="Total Calls" fill="url(#colorIncoming)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completed" name="Connected to Agent" fill="url(#colorCompleted)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Call Outcomes Pie Chart */}
      <Card className="border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100">
            Call Outcomes Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 h-[300px] flex flex-col items-center justify-center">
          <div className="w-full h-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={CALL_OUTCOMES_DATA}
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {CALL_OUTCOMES_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner text inside Donut hole */}
            <div className="absolute top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col pointer-events-none">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-zinc-50 leading-none tracking-tight">
                85%
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-450 mt-1.5 dark:text-zinc-500">
                Book Rate
              </span>
            </div>
          </div>

          {/* Custom legend rows */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-[-10px] w-full max-w-[260px]">
            {CALL_OUTCOMES_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-650 dark:text-zinc-400 font-semibold truncate">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Trends Area Chart */}
      <Card className="lg:col-span-3 border border-gray-200/60 bg-white/70 dark:border-zinc-800/60 dark:bg-zinc-900/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center justify-between">
            <span>Appointment Booking Trends</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
              +15.5% Growth
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={APPOINTMENT_TRENDS_DATA}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" className="dark:stroke-zinc-850" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 10 }} 
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area 
                type="monotone" 
                dataKey="Appointments" 
                stroke="#14B8A6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorAppointments)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
