import { WifiOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function OfflineIndicator() {
    const [isOffline, setIsOffline] = useState(!navigator.onLine)

    useEffect(() => {
        const handleOnline = () => setIsOffline(false)
        const handleOffline = () => setIsOffline(true)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <AnimatePresence>
            {isOffline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 backdrop-blur-2xl flex items-center gap-3 shadow-2xl shadow-red-500/10"
                >
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <WifiOff size={16} className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Workspace Offline</span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
