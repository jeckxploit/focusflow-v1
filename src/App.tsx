import { Toaster } from 'react-hot-toast'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import CreatePost from './pages/CreatePost'
import PublicBlog from './pages/PublicBlog'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Habit from "./pages/Habit"

function App() {
  return (
    <>
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
          {/* Dashboard removed from here to avoid double layout */}
          <Route path="/create" element={<CreatePost />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/habit" element={<Habit />} />
          <Route path="/analytics" element={<div className="p-12 text-zinc-500 uppercase font-black italic">Analytics Module Coming Soon...</div>} />
          <Route path="/settings" element={<div className="p-12 text-zinc-500 uppercase font-black italic">System Settings Coming Soon...</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App