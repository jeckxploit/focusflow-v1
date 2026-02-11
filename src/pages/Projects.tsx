import { motion } from 'framer-motion'
import { Plus, Layout, Smartphone, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

export default function Projects() {
  const projects = [
    { id: 1, name: 'Idul Fitri Gallery', status: 'In Production', type: 'Gallery App', progress: 65 },
    { id: 2, name: 'PWA Factory Template', status: 'Completed', type: 'Master Engine', progress: 100 },
  ]

  return (
    <>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Production Line</h1>
          <p className="text-zinc-500 mt-2">Kelola dan bangun aplikasi PWA Anda di sini.</p>
        </div>
        <Button onClick={() => toast.success('Membuka Wizard Produksi...')} className="flex items-center gap-2">
          <Plus size={18} /> Create New App
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <motion.div 
            key={project.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-zinc-500 transition-all group"
          >
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="w-16 h-16 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-white transition-colors">
                <Smartphone size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{project.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">{project.type}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${project.status === 'Completed' ? 'border-green-500/50 text-green-500' : 'border-yellow-500/50 text-yellow-500'}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-64">
              <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
                <span>Production Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  className="h-full bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <Button variant="secondary" className="p-3 rounded-xl">
                <ExternalLink size={18} />
              </Button>
              <Button variant="secondary" className="p-3 rounded-xl text-red-500 hover:bg-red-500/10">
                <Trash2 size={18} />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State Placeholder */}
      <div className="mt-12 p-12 border-2 border-dashed border-zinc-800 rounded-[3rem] flex flex-col items-center justify-center text-center">
        <Layout size={48} className="text-zinc-800 mb-4" />
        <h3 className="text-zinc-500 font-bold uppercase tracking-widest">Slot Produksi Tersedia</h3>
        <p className="text-zinc-700 text-sm mt-2 max-w-xs">Anda memiliki 28 slot aplikasi tersisa untuk tantangan 30 hari ini.</p>
      </div>
    </>
  )
}