import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Zap, ArrowRight, ShieldCheck, BarChart3, Clock, Brain, Coffee } from 'lucide-react'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 overflow-x-hidden font-sans">

      {/* Background Glows Rendering an Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* HEADER / NAV */}
      <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 md:py-8 max-w-7xl mx-auto backdrop-blur-md bg-black/20 rounded-2xl md:rounded-full mt-4 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center shadow-2xl">
            <Target size={18} className="text-black" />
          </div>
          <span className="font-black tracking-tighter text-xl md:text-2xl uppercase italic">FocusFlow</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          <a href="#philosophy" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Philosophy</a>
          <a href="#outcomes" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Transformation</a>
          <a href="#pro" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Pricing</a>
          <Link to="/login" className="px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Member Login</Link>
          <Link to="/register" className="px-8 py-3 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-emerald-500/20">Get Started Free</Link>
        </div>

        {/* Mobile Mini Nav */}
        <div className="flex lg:hidden items-center gap-3">
          <Link to="/login" className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest">Login</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-[9px] font-black uppercase tracking-widest">Join</Link>
        </div>
      </nav>

      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative z-10 flex flex-col items-center justify-center text-center pt-24 md:pt-40 pb-32 md:pb-56 px-6 max-w-6xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-zinc-900/50 border border-white/5 mb-8 md:mb-10 backdrop-blur-xl"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Join the Deep Work Revolution</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-[10rem] font-black tracking-tighter mb-8 md:mb-10 italic leading-[0.9] md:leading-[0.8] mix-blend-difference"
        >
          MASTER <br />
          <span className="text-emerald-500/90 glow-text">CONTROL</span>.
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-zinc-400 text-lg md:text-2xl max-w-3xl mb-12 md:text-2xl md:mb-16 leading-relaxed font-medium"
        >
          Visual rewards for cognitive stamina. FocusFlow is the high-performance workspace designed to help developers and remote creators reclaim their attention and build lasting focus habits.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-6 md:gap-8">
          <Link
            to="/dashboard"
            className="group flex items-center justify-center gap-4 bg-white text-black px-10 md:px-12 py-5 md:py-6 rounded-2xl md:rounded-3xl font-black uppercase text-[10px] md:text-xs tracking-[0.3em] hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-white/10 w-full sm:w-auto text-center"
          >
            Enter The Flow State
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-black bg-zinc-800 flex items-center justify-center text-[10px] font-bold">U{i}</div>
            ))}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 md:border-4 border-black bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">+43</div>
          </div>
        </motion.div>
      </motion.section>

      {/* OUTCOME GRID */}
      <section id="outcomes" className="relative z-10 py-24 md:py-48 px-6 max-w-7xl mx-auto overflow-visible">
        <div className="text-center mb-20 md:mb-32">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] md:tracking-[1em] text-zinc-600 mb-6">Outcome Engineering</h2>
          <p className="text-3xl md:text-6xl font-black italic tracking-tighter uppercase leading-tight md:leading-none">Designed for High-Cognitive Professionals.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">

          <OutcomeCard
            icon={<Clock size={28} className="text-emerald-500" />}
            title="Stop Procrastinating"
            desc="Our 'Deep Sprint' protocol initiates momentum instantly. No more dreading the first 5 minutes of your work."
          />

          <OutcomeCard
            icon={<Brain size={28} className="text-blue-500" />}
            title="Neural Rewiring"
            desc="Consistent focus cycles retrain your prefrontal cortex to resist distractions like Slack and Social Media."
          />

          <OutcomeCard
            icon={<BarChart3 size={28} className="text-purple-500" />}
            title="Visual Recognition"
            desc="High-resolution data feedback loops provide the dopamine hit you need to keep your streak alive."
          />

          <OutcomeCard
            icon={<ShieldCheck size={28} className="text-orange-500" />}
            title="Privacy First"
            desc="Your focus data is yours. Local-first PWA architecture with Supabase RLS ensures zero unauthorized access."
          />

          <OutcomeCard
            icon={<Zap size={28} className="text-yellow-500" />}
            title="Flow State Trigger"
            desc="AI-driven work phase suggestions based on your peak cognitive hours. Optimize your day for results."
          />

          <OutcomeCard
            icon={<Coffee size={28} className="text-zinc-500" />}
            title="Recovery Logic"
            desc="Burnout prevention built-in. Integrated break protocols ensure sustained productivity across 12-hour windows."
          />

        </div>
      </section>

      {/* PRICING / PRO MODE */}
      <section id="pro" className="relative z-10 py-48 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto glass-panel p-16 rounded-[4rem] flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl shadow-emerald-500/20">
            <Zap size={40} className="text-black" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-6 leading-none">Activate <br /> PRO Mode</h2>
          <p className="text-zinc-500 text-lg mb-12 max-w-xl font-medium">
            Unlock the full potential of the FocusFlow Engine. Unlimited sprints, ultra-premium heatmaps, and AI-powered habit coaching.
          </p>
          <div className="flex flex-col items-center gap-6">
            <Link to="/register" className="bg-emerald-500 text-black px-16 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20">
              Go Pro for $3
            </Link>
            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Early access pricing — Limited to first 50 users</p>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY SEPARATOR */}
      <section id="philosophy" className="relative z-10 py-32 md:py-64 px-6 text-center max-w-4xl mx-auto">
        <p className="text-2xl md:text-5xl font-black tracking-tight text-white italic leading-tight uppercase opacity-60 hover:opacity-100 transition-opacity duration-1000">
          "Deep work is the superpower of the 21st century."
        </p>
        <div className="mt-8 md:mt-12 text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">— CORE PHILOSOPHY</div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-32 px-12 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-xs">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Target size={16} className="text-black" />
              </div>
              <span className="font-black tracking-tighter text-xl uppercase italic">FocusFlow</span>
            </div>
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
              Engineered in the pursuit of cognitive excellence. Designed for those who build the future.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-8">Navigation</h4>
              <ul className="space-y-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Workspace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Manifesto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">The Vault</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-8">Connect</h4>
              <ul className="space-y-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">X / Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-8">Legal</h4>
              <ul className="space-y-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                <li><a href="#" className="hover:text-white transition-colors">Privacy OS</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Flow</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-32 pt-16 border-t border-white/5 text-center text-[10px] font-black text-zinc-800 uppercase tracking-[0.8em]">
          FocusFlow Engine © 2026 — Built with Intent
        </div>
      </footer>

    </div>
  )
}

function OutcomeCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] bg-zinc-900/10 border border-white/5 hover:border-emerald-500/20 hover:bg-zinc-900/30 transition-all duration-700"
    >
      <div className="w-12 h-12 md:w-16 md:h-16 bg-white/[0.03] rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-10 group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all duration-700">
        {icon}
      </div>
      <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 uppercase italic leading-none">{title}</h3>
      <p className="text-zinc-500 text-[13px] md:text-sm font-medium leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
        {desc}
      </p>
    </motion.div>
  )
}
