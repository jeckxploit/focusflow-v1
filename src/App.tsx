import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import CreatePost from './pages/CreatePost'

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
          path="/projects" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <Projects />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-post" 
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreatePost />
              </AppLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  )
}

export default App