import { motion } from "framer-motion"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="engine-container">
      <Sidebar />
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="lg:pl-80 min-h-screen transition-all duration-500"
      >
        <div className="p-6 lg:p-12 xl:p-20 max-w-[1600px] mx-auto">
          {children || <Outlet />}
        </div>
      </motion.main>
    </div>
  )
}