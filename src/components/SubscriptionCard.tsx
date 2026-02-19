import { Zap, Check } from 'lucide-react'
import { createCheckoutSession } from '../services/stripe'
import { motion } from 'framer-motion'

export default function SubscriptionCard() {
    const handleUpgrade = async () => {
        await createCheckoutSession()
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-8 rounded-[2.5rem] glass-panel relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={120} className="text-emerald-500" />
            </div>

            <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                    <Zap size={12} className="text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">FocusFlow Pro</span>
                </div>

                <h3 className="text-4xl font-black mb-2 italic">Level Up Your Focus</h3>
                <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                    Remove session limits, get advanced AI deep-work suggestions, and unlock premium data visualization.
                </p>

                <ul className="space-y-4 mb-10">
                    {[
                        'Unlimited Focus Sessions',
                        'Advanced Activity Heatmaps',
                        'Priority AI Suggestions',
                        'Multi-device Sync'
                    ].map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-zinc-300">
                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <Check size={10} className="text-emerald-500" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handleUpgrade}
                    className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase text-[10px] tracking-[0.2em] hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                    Activate Pro Mode — $9/mo
                </button>
            </div>
        </motion.div>
    )
}
