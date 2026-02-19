import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { motion } from 'framer-motion'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            className="p-3 rounded-2xl bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800/50 transition-all active:scale-95 group"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
                {theme === 'dark' ? (
                    <Moon size={18} className="text-zinc-400 group-hover:text-white" />
                ) : (
                    <Sun size={18} className="text-amber-500 group-hover:text-amber-400" />
                )}
            </motion.div>
        </button>
    )
}
