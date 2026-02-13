import { usePomodoro } from '../hooks/usePomodoro'
import AppLayout from '../components/layout/AppLayout'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'


interface WeeklyData {
  date: string
  sessions: number
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { minutes, seconds, isRunning, start, pause, reset, mode, sessions } = usePomodoro()
  const [todayCount, setTodayCount] = useState(0)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  useEffect(() => {
    const fetchToday = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('completed_at', today.toISOString())

      setTodayCount(count || 0)
    }

    const fetchWeekly = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      const { data } = await supabase
        .from('sessions')
        .select('completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', sevenDaysAgo.toISOString())

      if (!data) return

      const grouped: Record<string, number> = {}

      for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        grouped[key] = 0
      }

      data.forEach((item) => {
        const key = item.completed_at.split('T')[0]
        if (grouped[key] !== undefined) {
          grouped[key]++
        }
      })

      const chartData = Object.entries(grouped)
        .map(([date, count]) => ({
          date: date.slice(5),
          sessions: count,
        }))
        .reverse()

      setWeeklyData(chartData)
    }

    fetchToday()
    fetchWeekly()
  }, [])

  const FREE_LIMIT = 3
  const isLimitReached = todayCount >= FREE_LIMIT
  const totalSeconds = mode === 'focus' ? 25 * 60 : 5 * 60
  const progress = (seconds + minutes * 60) / totalSeconds
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - progress * circumference

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-12">
        {/* Session & Mode Indicator */}
        <div className="flex flex-col items-center gap-4">
          <div className={`px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${mode === 'focus'
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
            }`}>
            {mode === 'focus' ? 'Deep Work Phase' : 'Recovery Phase'}
          </div>
          <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest flex flex-col items-center gap-2">
            <div>Sessions Completed: <span className="text-white ml-2">{sessions}</span></div>
            <div className="text-zinc-600">Today sessions: <span className="text-zinc-400">{todayCount}</span></div>
          </div>

          {isLimitReached && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-center backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="font-semibold text-red-200 text-sm">
                Free limit reached (3 sessions per day)
              </p>
              <button className="mt-4 bg-white text-black px-6 py-2 rounded-lg font-bold text-xs hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-white/5">
                Upgrade to Pro 🚀
              </button>
            </div>
          )}

          <div className="w-full max-w-md mt-8 p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Activity Monitor
            </h3>
            <div className="h-[180px] w-full mr-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#3f3f46"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#71717a' }}
                    dy={10}
                  />
                  <YAxis
                    stroke="#3f3f46"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#71717a' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em'
                    }}
                    itemStyle={{ color: '#10b981' }}
                    cursor={{ stroke: '#27272a', strokeWidth: 1 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ fill: '#10b981', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#18181b' }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Timer Display with Progress Ring */}
        <div className="relative flex items-center justify-center group">
          {/* Outer Glow */}
          <div className={`absolute inset-0 blur-[100px] opacity-20 transition-colors duration-1000 rounded-full ${mode === 'focus' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

          <svg width="340" height="340" className="rotate-[-90deg] relative z-10">
            {/* Background Track */}
            <circle
              cx="170"
              cy="170"
              r="140"
              stroke="white"
              strokeWidth="4"
              fill="none"
              className="opacity-[0.03]"
            />
            {/* Progress Ring */}
            <circle
              cx="170"
              cy="170"
              r="140"
              stroke={mode === 'focus' ? '#10b981' : '#3b82f6'}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 linear drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              style={{
                filter: mode === 'focus'
                  ? 'drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))'
                  : 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))'
              }}
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center z-20">
            <h2 className="text-7xl md:text-8xl font-black tracking-tighter tabular-nums italic leading-none">
              {String(minutes).padStart(2, '0')}
              <span className={isRunning ? 'animate-pulse text-zinc-800' : 'text-zinc-800'}>:</span>
              {String(seconds).padStart(2, '0')}
            </h2>
          </div>
        </div>


        {/* Controls */}
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-6">
            {!isRunning ? (
              <button
                onClick={start}
                disabled={isLimitReached}
                className={`px-4 py-2 rounded font-bold ${isLimitReached
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-500 text-white'
                  }`}
              >
                {isLimitReached ? 'Limit Reached' : 'Start'}
              </button>
            ) : (
              <button
                onClick={pause}
                className="bg-yellow-500 text-black px-4 py-2 rounded font-bold"
              >
                Pause
              </button>
            )}

            <button
              onClick={reset}
              className="px-8 py-4 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              Reset
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="text-[10px] font-bold text-zinc-700 hover:text-red-500 transition-colors uppercase tracking-[0.3em] mt-12"
          >
            Terminate Session
          </button>
        </div>
      </div>
    </AppLayout>
  )
}