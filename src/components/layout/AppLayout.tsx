import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  )
}