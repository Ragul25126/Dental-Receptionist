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
  Cell
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
  { name: 'Booked', value: 55, color: '#3B82F6' },     // Premium Blue
  { name: 'Inquiry', value: 25, color: '#14B8A6' },    // Teal
  { name: 'Rescheduled', value: 12, color: '#6366F1' }, // Indigo
  { name: 'Cancelled', value: 8, color: '#EF4444' }     // Red
]

// Custom tooltips linked to design variables
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div 
        className="p-3 rounded-xl border shadow-xl text-[10px] font-bold"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        <p className="font-extrabold mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((item: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between gap-4 opacity-90">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                <span>{item.name}:</span>
              </div>
              <span className="font-black font-mono">{item.value} calls</span>
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
      <div 
        className="p-3 rounded-xl border shadow-xl text-[10px] font-bold"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        <p className="font-extrabold mb-1">{label}</p>
        <div className="flex items-center gap-1.5 text-blue-500">
          <span>Booked:</span>
          <span className="font-black font-mono">{payload[0].value} appointments</span>
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
      <div 
        className="p-3 rounded-xl border shadow-xl text-[10px] font-bold"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="opacity-90">{data.name}:</span>
          <span className="font-black font-mono">{data.value}%</span>
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
      <Card 
        className="lg:col-span-2 border custom-shadow rounded-2xl"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <CardHeader className="pb-2 p-5">
          <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] flex items-center justify-between uppercase tracking-wide">
            <span>Calls Volume by Day</span>
            <span className="text-[9px] font-black text-[var(--text-secondary)] bg-[var(--bg-page)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-lg">
              Weekly
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={CALLS_BY_DAY_DATA}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.15}/>
                </linearGradient>
                <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.15}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} 
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'var(--hover-color)', opacity: 0.4 }} />
              <Bar dataKey="Incoming" name="Total Calls" fill="url(#colorIncoming)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Completed" name="Connected to Agent" fill="url(#colorCompleted)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Call Outcomes Pie Chart */}
      <Card 
        className="border custom-shadow rounded-2xl"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <CardHeader className="pb-2 p-5">
          <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] uppercase tracking-wide">
            Outcomes Distribution
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
                  innerRadius={62}
                  outerRadius={80}
                  paddingAngle={4}
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
              <span className="text-2xl font-black text-[var(--text-primary)] leading-none tracking-tight font-mono">
                85%
              </span>
              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-secondary)] mt-1.5">
                Book Rate
              </span>
            </div>
          </div>

          {/* Custom legend rows */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-[-10px] w-full max-w-[260px]">
            {CALL_OUTCOMES_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-[var(--text-secondary)] font-extrabold truncate">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appointment Trends Area Chart */}
      <Card 
        className="lg:col-span-3 border custom-shadow rounded-2xl"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
      >
        <CardHeader className="pb-2 p-5">
          <CardTitle className="text-sm font-extrabold text-[var(--text-primary)] flex items-center justify-between uppercase tracking-wide">
            <span>Appointment Booking Trends</span>
            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              +15.5% Growth
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={APPOINTMENT_TRENDS_DATA}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 700 }} 
              />
              <Tooltip content={<CustomAreaTooltip />} />
              <Area 
                type="monotone" 
                dataKey="Appointments" 
                stroke="#3B82F6" 
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
