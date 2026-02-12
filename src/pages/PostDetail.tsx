import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getPostById } from "../services/publicPostService"
import { motion } from "framer-motion"
import { ArrowLeft, Smartphone, Activity, Box, Calendar } from "lucide-react"

export default function PostDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      getPostById(slug)
        .then(data => {
          if (!data) throw new Error("Not found")
          setPost(data)
          setLoading(false)
        })
        .catch(() => navigate('/'))
    }
  }, [slug, navigate])

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 uppercase tracking-widest font-black italic">Accessing Node...</div>
  if (!post) return null

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-24">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-16 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-widest font-bold">Back to Feed</span>
        </button>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <header className="mb-16">
            <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-8">
              <Activity size={14} className="text-green-500" /> Node Detail View
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-none mb-12">
              {post.title}
            </h1>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
                <Box size={16} className="text-zinc-700 mb-3" />
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Status</p>
                <p className="text-xs font-black uppercase italic">Operational</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl">
                <Calendar size={16} className="text-zinc-700 mb-3" />
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Initialized</p>
                <p className="text-xs font-black uppercase italic">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl col-span-2 md:col-span-1">
                <Smartphone size={16} className="text-zinc-700 mb-3" />
                <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Unit ID</p>
                <p className="text-xs font-black uppercase italic truncate">{post.id?.slice(0, 12)}</p>
              </div>
            </div>
          </header>

          <div className="bg-zinc-900/30 border border-zinc-900 p-12 rounded-[3rem] mb-12">
            <p className="text-zinc-400 text-xl leading-relaxed font-medium uppercase tracking-tight">
              {post.content}
            </p>
          </div>

          <footer className="pt-12 border-t border-zinc-900 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white font-black italic">
                {post.profiles?.email?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-[10px] text-zinc-600 uppercase font-bold">Operator</p>
                <p className="text-xs font-black uppercase italic">{post.profiles?.email?.split('@')[0] || 'Unknown'}</p>
              </div>
            </div>
          </footer>
        </motion.article>
      </div>
    </div>
  )
}