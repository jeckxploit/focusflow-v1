import { useState } from 'react'
import { supabase } from '../services/supabase'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      toast.error(error.message)
      setLoading(false)
    } else {
      toast.success('Selamat datang kembali!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-[2.5rem] w-full max-w-md border border-zinc-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter mb-2">MASUK</h1>
          <p className="text-zinc-500 text-sm">Akses panel produksi PWA Factory</p>
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

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Authenticating...' : 'LOGIN SYSTEM'}
        </Button>

        <p className="mt-6 text-center text-zinc-500 text-sm">
          Belum punya akun? <Link to="/register" className="text-white underline font-bold">Daftar Sekarang</Link>
        </p>
      </form>
    </div>
  )
}