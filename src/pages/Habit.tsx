import { useCallback, useEffect, useState } from "react"
import { supabase } from "../services/supabase"
import { Plus, Trash2, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

interface HabitLog {
  id: string
  habit_id: string
  date: string
}

interface Habit {
  id: string
  title: string
}

export default function Habit() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logs, setLogs] = useState<HabitLog[]>([])
  const [newHabit, setNewHabit] = useState("")

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase
      .from("habit_logs")
      .select("*")

    if (data) setLogs(data)
  }, [])

  const fetchHabits = useCallback(async () => {
    const { data } = await supabase
      .from("habits")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) setHabits(data)
  }, [])

  const addHabit = async () => {
    if (!newHabit.trim()) return

    const loadingToast = toast.loading('Synchronizing...')
    try {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) throw new Error("Unauthorized")

      const { error } = await supabase.from("habits").insert([
        {
          title: newHabit,
          user_id: user.id,
        },
      ])

      if (error) throw error

      setNewHabit("")
      toast.success('Habit Initialized', { id: loadingToast })
      fetchHabits()
    } catch (error: unknown) {
      console.error("[Habit] Add Error:", error)
      toast.error('Initialization Failed', { id: loadingToast })
    }
  }

  const deleteHabit = async (id: string) => {
    const loadingToast = toast.loading('Terminating...')
    try {
      const { error } = await supabase.from("habits").delete().eq("id", id)
      if (error) throw error
      toast.success('Protocol Terminated', { id: loadingToast })
      fetchHabits()
    } catch (error: unknown) {
      console.error("[Habit] Delete Error:", error)
      toast.error('Termination Failed', { id: loadingToast })
    }
  }

  const markDone = async (habitId: string) => {
    const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
    const existingLog = logs.find(l => l.habit_id === habitId && l.date === today)

    const loadingToast = toast.loading('Updating Core...')
    try {
      if (existingLog) {
        const { error } = await supabase.from("habit_logs").delete().eq("id", existingLog.id)
        if (error) throw error
      } else {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) throw new Error("Unauthorized")

        const { error } = await supabase.from("habit_logs").insert([
          {
            habit_id: habitId,
            date: today,
            user_id: userData.user.id
          }
        ])
        if (error) throw error
      }
      toast.success('Sync Complete', { id: loadingToast })
      fetchLogs()
    } catch (error: unknown) {
      console.error("[Habit] Log Error:", error)
      toast.error('Sync Failed', { id: loadingToast })
    }
  }

  const calculateStreak = (habitId: string) => {
    const habitLogs = logs
      .filter(l => l.habit_id === habitId)
      .map(l => l.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    if (habitLogs.length === 0) return 0

    const today = new Date().toLocaleDateString('en-CA')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toLocaleDateString('en-CA')

    // If no log today or yesterday, streak is broken
    if (habitLogs[0] !== today && habitLogs[0] !== yesterdayStr) return 0

    let streak = 1
    for (let i = 1; i < habitLogs.length; i++) {
      const current = new Date(habitLogs[i - 1])
      const previous = new Date(habitLogs[i])

      const diffTime = current.getTime() - previous.getTime()
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  useEffect(() => {
    const init = async () => {
      await fetchHabits()
      await fetchLogs()
    }
    init()
  }, [fetchHabits, fetchLogs])

  const todayStr = new Date().toLocaleDateString('en-CA')
  const doneTodayCount = habits.filter(h => logs.some(l => l.habit_id === h.id && l.date === todayStr)).length
  const totalHabits = habits.length
  const completionPercentage = totalHabits > 0 ? Math.round((doneTodayCount / totalHabits) * 100) : 0

  return (
    <div className="px-3 xs:px-4 sm:px-6">
      <header className="mb-10 xs:mb-12 sm:mb-16">
        <div className="flex justify-between items-end mb-6 xs:mb-8">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 xs:gap-2 text-emerald-500 text-[8px] xs:text-[10px] font-bold uppercase tracking-[0.3em] mb-2 xs:mb-3">
              <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-emerald-500 animate-pulse" /> System Operational
            </div>
            <h1 className="text-5xl xs:text-6xl sm:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
              HABIT<br /><span className="text-zinc-800">ENGINE</span>
            </h1>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-3xl xs:text-4xl sm:text-5xl font-black tracking-tighter text-emerald-500 italic leading-none">{completionPercentage}%</div>
            <div className="text-[8px] xs:text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5 xs:mt-1">Daily Opt.</div>
          </div>
        </div>

        <div className="h-1.5 xs:h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          />
        </div>
      </header>

      <section className="mb-10 xs:mb-12 sm:mb-16">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-zinc-950 border border-zinc-800 p-1.5 xs:p-2 rounded-[2rem] flex gap-1.5 xs:gap-2">
            <input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Inject new behavior..."
              className="flex-1 bg-transparent border-none px-4 xs:px-6 py-3 xs:py-4 text-white placeholder:text-zinc-800 focus:outline-none font-bold uppercase tracking-tight text-sm xs:text-base"
            />
            <button
              onClick={addHabit}
              className="bg-zinc-100 text-black px-6 xs:px-8 rounded-xl xs:rounded-2xl font-black uppercase tracking-widest text-[9px] xs:text-xs hover:bg-emerald-500 hover:text-white transition-all active:scale-95 flex items-center gap-1.5 xs:gap-2 flex-shrink-0"
            >
              <Plus size={16} strokeWidth={3} /> <span className="hidden xs:inline">Execute</span>
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => {
            const isDoneToday = logs.some(l => l.habit_id === habit.id && l.date === todayStr)
            const streak = calculateStreak(habit.id)

            return (
              <motion.div
                key={habit.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative group p-0.5 xs:p-1 rounded-[2rem] xs:rounded-[2.5rem] transition-all duration-500 ${isDoneToday ? "bg-emerald-500/10" : "bg-zinc-900/50"
                  }`}
              >
                <div className="bg-zinc-950 border border-zinc-800/50 p-4 xs:p-6 sm:p-8 rounded-[1.9rem] xs:rounded-[2.4rem] h-full flex flex-col justify-between group-hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-4 xs:mb-6">
                    <div className="min-w-0 flex-1">
                      <h3 className={`text-lg xs:text-xl sm:text-2xl font-black tracking-tighter uppercase italic mb-1 transition-all truncate ${isDoneToday ? "text-emerald-500" : "text-white"
                        }`}>
                        {habit.title}
                      </h3>
                      <div className="flex items-center gap-2 xs:gap-3">
                        <span className="text-[8px] xs:text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] flex items-center gap-1 whitespace-nowrap">
                          🔥 {streak} Day
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1.5 xs:p-2 text-zinc-800 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <button
                    onClick={() => markDone(habit.id)}
                    className={`w-full py-2.5 xs:py-3 sm:py-4 rounded-xl xs:rounded-2xl font-black uppercase tracking-[0.15em] text-[8px] xs:text-[10px] transition-all duration-500 border flex items-center justify-center gap-1.5 xs:gap-2 ${isDoneToday
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-500"
                      : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-white hover:text-black hover:border-white"
                      }`}
                  >
                    {isDoneToday ? (
                      <><span className="hidden xs:inline">Protocol Active</span><span className="xs:hidden">Active</span> <Activity size={12} className="animate-pulse" /></>
                    ) : (
                      <><span className="hidden sm:inline">Commit to Protocol</span><span className="sm:hidden">Commit</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <footer className="mt-24 pt-8 border-t border-zinc-900 flex justify-between items-center text-[10px] font-bold text-zinc-800 uppercase tracking-widest">
        <div>&copy; 2026 Habit Forge Core</div>
        <div className="flex gap-6">
          <span>Latency: 24ms</span>
          <span>Status: Optimized</span>
        </div>
      </footer>
    </div>
  )
}
