import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getAllPublicPosts } from "../services/publicPostService"
import { Smartphone, Activity, ArrowRight, Cpu } from "lucide-react"
import type { Post } from "../types/post"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import toast from "react-hot-toast"

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPublicPosts()
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
        console.error("[Home] Error loading feed:", error)
        toast.error("Gagal memuat data feed: " + message)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Public Nav */}
      <nav className="p-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
            <Cpu size={20} className="text-black" />
          </div>
          <span className="font-black tracking-tighter text-2xl uppercase italic">FocusFlow</span>
        </div>
        <Link to="/login">
          <Button variant="outline" size="sm">Access Terminal</Button>
        </Link>
      </nav>

      <main className="p-8 lg:p-24 max-w-7xl mx-auto">
        <header className="mb-24">
          <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
            <Activity size={14} className="animate-pulse text-green-500" /> Global Production Feed
          </div>
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none mb-8">
            FOCUS <span className="text-zinc-900">FLOW</span><br />TIMER
          </h1>
          <p className="text-zinc-500 max-w-xl text-lg uppercase tracking-tight font-medium">
            Smart Pomodoro timer for peak productivity and deep work.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-zinc-900/50 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-950 border border-zinc-900 p-10 rounded-[3rem] hover:border-zinc-700 transition-all group"
              >
                <div className="flex justify-between items-start mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-white transition-colors">
                    <Smartphone size={28} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">Node: {post.id.slice(0, 8)}</span>
                </div>

                <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-4 group-hover:translate-x-2 transition-transform duration-500">
                  {post.title}
                </h2>
                <p className="text-zinc-500 line-clamp-2 mb-10 font-medium uppercase tracking-tight">
                  {post.content}
                </p>

                <Link to={`/post/${post.id}`} className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-white group-hover:gap-6 transition-all">
                  View Detail <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}