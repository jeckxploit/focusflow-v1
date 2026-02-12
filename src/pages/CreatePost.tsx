import { useState } from "react"
import { createPost } from "../services/postService"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, Save, FileText, Type, AlignLeft, Globe, Lock } from "lucide-react"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import toast from "react-hot-toast"

export default function CreatePost() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) {
      toast.error("Judul dan konten harus diisi!")
      return
    }

    setLoading(true)
    const loadingToast = toast.loading("Menyimpan data produksi...")
    
    try {
      await createPost(title, content, status)
      toast.success("Data berhasil disimpan!", { id: loadingToast })
      navigate("/dashboard")
    } catch (error: any) {
      toast.error("Gagal menyimpan data: " + error.message, { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-12">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm uppercase tracking-widest font-bold">Kembali</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-black">
              <FileText size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">Create Post</h1>
              <p className="text-zinc-500 text-sm">Tambahkan data baru ke mesin produksi.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
                <Type size={12} /> Judul Produksi
              </label>
              <Input
                placeholder="Masukkan judul..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-black border-zinc-800 focus:border-zinc-500 h-14 text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold ml-1">
                <AlignLeft size={12} /> Konten / Deskripsi
              </label>
              <textarea
                placeholder="Tuliskan detail produksi di sini..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[200px] bg-black border border-zinc-800 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${status === 'draft' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800'}`}
              >
                <Lock size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Draft</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${status === 'published' ? 'bg-white text-black border-white' : 'bg-black text-zinc-500 border-zinc-800'}`}
              >
                <Globe size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Public</span>
              </button>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl text-sm uppercase tracking-widest font-black flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {loading ? "Saving..." : "Save Production Data"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}