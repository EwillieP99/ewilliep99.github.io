import { Html } from '@react-three/drei'
import { motion } from 'framer-motion'

interface EchoAIProps {
  terminalOpen: boolean
}

export default function EchoAI({ terminalOpen }: EchoAIProps) {
  if (terminalOpen) return null   // hide when terminal is open

  return (
    <Html
      position={[3.8, 2.2, -0.5]}
      style={{ pointerEvents: 'auto' }}
      distanceFactor={7}
      occlude
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ 
          opacity: 1, 
          scale: [1, 1.04, 1],
          y: [0, -10, 0]
        }}
        transition={{ duration: 3.8, repeat: Infinity }}
        className="bg-black/90 backdrop-blur-2xl border border-[#00f3ff] rounded-3xl p-6 shadow-[0_0_40px_-5px] shadow-cyan-400 w-72 cursor-pointer hover:border-cyan-300"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
          <div className="text-cyan-400 font-mono text-xs tracking-widest">ECHO AI • ONLINE</div>
        </div>
        
        <div className="text-white text-lg font-bold mb-2">Hello, Operator.</div>
        <p className="text-zinc-400 text-sm">
          I'm Echo. The guardian of the Neon Nexus.<br />
          How can I assist you today?
        </p>
        
        <div className="mt-5 text-[10px] font-mono text-cyan-500/70">
          NEURAL LINK • STABLE • 99.8%
        </div>
      </motion.div>
    </Html>
  )
}