import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Projects = lazy(() => import('./pages/Projects'))
const CreatePost = lazy(() => import('./pages/CreatePost'))
const PublicBlog = lazy(() => import('./pages/PublicBlog'))
const Home = lazy(() => import('./pages/Home'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const Habit = lazy(() => import('./pages/Habit'))

// Loading state with premium aesthetics
const PageLoader = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full"
    />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      className="w-14 h-14 border-2 border-white/5 border-t-emerald-500 rounded-full relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
    />
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 flex flex-col items-center gap-2 relative z-10"
    >
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-400">Initializing Engine</p>
      <div className="w-24 h-[1px] bg-zinc-800 relative overflow-hidden">
        <motion.div
          animate={{ x: [-100, 100] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-emerald-500"
        />
      </div>
    </motion.div>
  </div>
)

// In App component wrap Routes in <Suspense fallback={<PageLoader />}>

import AppLayout from './components/layout/AppLayout'
import OfflineIndicator from './components/ui/OfflineIndicator'

function App() {
  return (
    <>
      <OfflineIndicator />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#18181b',
            color: '#fff',
            border: '1px solid #27272a',
            borderRadius: '1rem',
            fontSize: '14px'
          }
        }}
      />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/blog/:userId" element={<PublicBlog />} />
          <Route path="/post/:slug" element={<PostDetail />} />

          {/* Standardized App Factory Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/create" element={<CreatePost />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/habit" element={<Habit />} />
            <Route path="/analytics" element={<div className="p-12 text-zinc-500 uppercase font-black italic">Analytics Module Coming Soon...</div>} />
            <Route path="/settings" element={<div className="p-12 text-zinc-500 uppercase font-black italic">System Settings Coming Soon...</div>} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

export default App