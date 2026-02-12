import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPublicPosts } from "../services/postService"
import { motion } from "framer-motion"
import { Smartphone, Box, Activity } from "lucide-react"
import toast from "react-hot-toast"

export default function PublicBlog() {
  const { userId } = useParams()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      getPublicPosts(userId)
        .then(data => {
          setPosts(data || [])
          setLoading(false)
        })
        .catch((err) => {
          console.error(err)
          toast.error("Gagal sinkronisasi data publik")
          setLoading(false)
        })
    }
  }, [userId])

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 uppercase tracking-widest font-black italic">Syncing...</div>

  return (
    <div className="min-h-screen bg-black text-white p-8 lg:p-24">
      <div className="max-w-4xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-3 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-6">
            <Activity size={14} /> Public Production Feed
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-4">
            ENGINE <span className="text-zinc-800">OUTPUT</span>
          </h1>
          <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold">Terminal ID: {userId?.slice(0, 8)}</p>
        </header>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-20 border border-zinc-900 rounded-[3rem] bg-zinc-950/50">
              <Box size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-600 font-bold uppercase tracking-widest">No Public Nodes Found</p>
            </div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-950 border border-zinc-900 p-10 rounded-[2.5rem] hover:border-zinc-700 transition-all group"
              >
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                    <Smartphone size={24} />
                  </div>
                  <h2 className="text-3xl font-black tracking-tight uppercase italic">{post.title}</h2>
                </div>
                <p className="text-zinc-400 leading-relaxed text-lg">{post.content}</p>
                <div className="mt-8 pt-8 border-t border-zinc-900 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Node Active</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}