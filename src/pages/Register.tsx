import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { ArrowLeft } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Cek email kamu untuk verifikasi!')
      navigate('/login')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 md:p-12 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black italic">Return to Origin</span>
        </button>

        <form onSubmit={handleRegister} className="bg-zinc-900/50 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] w-full border border-zinc-800/50 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black tracking-tighter mb-3 uppercase italic">INITIALIZE ACCOUNT</h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Mulai perjalanan fokus bersama FocusFlow</p>
          </div>

          <div className="space-y-4 mb-8">
            <Input
              type="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-14 rounded-2xl font-black tracking-widest" disabled={loading}>
            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </Button>

          <p className="mt-8 text-center text-zinc-500 text-[11px] font-bold uppercase tracking-widest">
            Sudah punya akun? <Link to="/login" className="text-white underline">Masuk</Link>
          </p>
        </form>
      </div>
    </div>
  )
}