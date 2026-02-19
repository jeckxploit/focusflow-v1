import { usePomodoro } from '../hooks/usePomodoro'
import AppLayout from '../components/layout/AppLayout'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getDailySuggestion } from '../services/aiSuggestion'
import type { FocusSuggestion } from '../services/aiSuggestion'
import { Sparkles, Activity, Clock, LogOut, Zap, Trophy } from 'lucide-react'
import SubscriptionCard from '../components/SubscriptionCard'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

interface WeeklyData {
  date: string
  sessions: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  },
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { minutes, seconds, isRunning, start, pause, reset, mode, sessions } = usePomodoro()
  const [todayCount, setTodayCount] = useState(0)
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([])
  const [suggestion, setSuggestion] = useState<FocusSuggestion | null>(null)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  useEffect(() => {
    setSuggestion(getDailySuggestion())

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

    // Subscribe to sessions changes to update counts in real-time
    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sessions' },
        () => {
          fetchToday()
          fetchWeekly()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const FREE_LIMIT = 5 // Increased limit for demo
  const isLimitReached = todayCount >= FREE_LIMIT
  const totalSeconds = mode === 'focus' ? 25 * 60 : 5 * 60
  const progress = (seconds + minutes * 60) / totalSeconds
  const circumference = 2 * Math.PI * 135
  const strokeDashoffset = circumference - progress * circumference

  return (
    <AppLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="lg:col-span-12 mb-4">
          <h1 className="text-4xl lg:text-5xl premium-gradient-text tracking-tighter">
            System Interface
          </h1>
          <p className="text-zinc-600 dark:text-zinc-500 font-bold tracking-wide uppercase text-[10px] mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Core Status: Operational
          </p>
        </motion.div>

        {/* Main Timer Card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 bento-card min-h-[500px] flex flex-col items-center justify-center group"
        >
          {/* Timer Display */}
          <div className="relative flex items-center justify-center">
            {/* Outer Glow Ring */}
            <div className={`absolute inset-0 blur-[100px] opacity-10 transition-all duration-1000 scale-150 rounded-full ${mode === 'focus' ? 'bg-emerald-500' : 'bg-blue-500'}`} />

            <svg width="340" height="340" className="rotate-[-90deg] relative z-10">
              <circle
                cx="170"
                cy="170"
                r="135"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-white/[0.03]"
              />
              <motion.circle
                cx="170"
                cy="170"
                r="135"
                stroke={mode === 'focus' ? '#10b981' : '#3b82f6'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "linear" }}
                strokeLinecap="round"
                className="drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center z-20">
              <span className="text-zinc-600 dark:text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">T-Minus</span>
              <h2 className="text-6xl lg:text-7xl font-black tracking-tighter tabular-nums italic leading-tight text-zinc-900 dark:text-white drop-shadow-2xl">
                {String(minutes).padStart(2, '0')}
                <span className={isRunning ? 'animate-pulse opacity-50' : 'opacity-20'}>:</span>
                {String(seconds).padStart(2, '0')}
              </h2>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="mt-12 flex items-center gap-6 relative z-30">
            <AnimatePresence mode="wait">
              {!isRunning ? (
                <motion.button
                  key="start"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={start}
                  disabled={isLimitReached}
                  className={`group relative px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] overflow-hidden transition-all ${isLimitReached
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'bg-white text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                    }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLimitReached ? 'Limit Exceeded' : 'Initiate Phase'}
                  </span>
                </motion.button>
              ) : (
                <motion.button
                  key="pause"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={pause}
                  className="px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] bg-amber-500 text-black hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  Suspend Logic
                </motion.button>
              )}
            </AnimatePresence>
            <button
              onClick={reset}
              className="px-10 py-4 rounded-2xl border border-white/10 text-zinc-500 hover:text-white hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest"
            >
              System Reset
            </button>
          </div>
        </motion.div>

        {/* Right Column Bento Cards */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Today Stats Card */}
          <motion.div variants={itemVariants} className="bento-card">
            <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] mb-6 flex items-center gap-2">
              <Clock size={14} className="text-emerald-500" />
              Daily Quota
            </h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black italic text-zinc-900 dark:text-white">{todayCount}</p>
                <p className="text-zinc-600 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">Sessions Today</p>
              </div>
              <div className="text-right">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Total Earned</p>
                <p className="text-xl font-black italic text-emerald-500 flex items-center justify-end gap-1">
                  <Trophy size={16} />
                  {sessions}
                </p>
              </div>
            </div>
            {/* Simple Progress Bar */}
            <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(todayCount / FREE_LIMIT) * 100}%` }}
                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              />
            </div>
          </motion.div>

          {/* AI Suggestion Card */}
          <motion.div variants={itemVariants} className="bento-card flex-1 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-emerald-500/20">
                <Sparkles className="text-emerald-500" size={18} />
              </div>
              <h3 className="text-[10px] font-black text-emerald-400 tracking-[0.3em]">
                Neural Intel
              </h3>
            </div>
            {suggestion && (
              <div className="space-y-3">
                <p className="text-lg font-black italic text-zinc-900 dark:text-white leading-tight">{suggestion.title}</p>
                <p className="text-zinc-700 dark:text-zinc-400 text-xs leading-relaxed font-bold">{suggestion.description}</p>
              </div>
            )}
            {!suggestion && (
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-white/5 rounded w-3/4" />
                <div className="h-4 bg-white/5 rounded w-1/2" />
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/5">
              <button className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 hover:gap-3 transition-all">
                Recalibrate Suggestion <Activity size={10} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Activity Monitor & Subscription */}
        <motion.div variants={itemVariants} className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8 bento-card">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" />
                Performance Metrics
              </h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  Velocity
                </div>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <defs>
                    <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
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
                    tick={{ fill: '#71717a', fontWeight: 'bold' }}
                    dy={10}
                  />
                  <YAxis
                    hide
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px',
                      fontSize: '10px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                    }}
                    itemStyle={{ color: '#10b981' }}
                    cursor={{ stroke: '#27272a', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sessions"
                    stroke="#10b981"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSessions)"
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col">
            {isLimitReached ? (
              <div className="flex-1">
                <SubscriptionCard />
              </div>
            ) : (
              <div className="bento-card flex-1 bg-gradient-to-tr from-blue-500/5 to-transparent border-blue-500/10 justify-between">
                <div>
                  <h3 className="text-[10px] font-black text-blue-400 tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Zap size={14} />
                    Next Objective
                  </h3>
                  <p className="text-lg font-black italic text-zinc-700 dark:text-zinc-300">Unlock the Flow State</p>
                  <p className="text-zinc-500 text-[10px] font-medium leading-relaxed mt-2">
                    Complete 2 more sessions to reach your daily mental peak.
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-red-500 transition-colors group"
                >
                  <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Terminate Session
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  )
}
