import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import CreatePost from './pages/CreatePost'
import PublicBlog from './pages/PublicBlog'

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
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/blog/:userId" element={<PublicBlog />} />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreatePost />
              </AppLayout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/projects" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Projects />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  )
}

export default App