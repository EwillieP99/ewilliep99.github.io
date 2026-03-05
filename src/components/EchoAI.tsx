import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Send } from 'lucide-react';

const QUICK_PROMPTS = [
  "Pitch me on Perplexity campus strategy like I'm a skeptical recruiter",
  "How would you sell Verdant Siege to a VC in 60 seconds?",
  "Build me a 67% conversion GTM playbook for AI tools",
  "Help me improve my Neon Operator resume for Perplexity AI roles"
];

export default function EchoAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "ECHO AI v1.0 ONLINE.\nI'm your digital twin, Ethan. Ask me anything — pitches, playbooks, game ideas, or just vibe in the matrix." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (userMessage?: string) => {
    const messageToSend = userMessage || input.trim();
    if (!messageToSend || loading) return;

    const newMessages = [...messages, { role: 'user', content: messageToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/echo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.role === 'user' || m.role === 'ai')
            .map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
        })
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      const data = await response.json();
      const aiReply = data.message || "SIGNAL LOST. TRY AGAIN OPERATOR.";

      setMessages([...newMessages, { role: 'ai', content: aiReply }]);
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', content: "TRANSMISSION ERROR. CHECK YOUR API KEY OR TRY AGAIN." }]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Neon Orb */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[9999] w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_50px_#22f0ff,0_0_80px_#c026d3] border-4 border-black hover:scale-110 active:scale-95 transition-all"
        whileHover={{ scale: 1.15, rotate: 12 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bot size={34} className="text-black drop-shadow-lg" />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="w-full max-w-3xl bg-black border-2 border-cyan-400/60 rounded-2xl overflow-hidden shadow-[0_0_80px_#22f0ff]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-zinc-950 border-b border-cyan-400 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                  <div>
                    <div className="font-mono text-xl tracking-[6px] text-cyan-400">ECHO AI v1.0</div>
                    <div className="text-[10px] text-cyan-400/60">NEON CORE • NAVIGATOR POWERED</div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-cyan-400 hover:text-white">
                  <X size={28} />
                </button>
              </div>

              {/* Messages */}
              <div className="h-[420px] overflow-y-auto p-6 font-mono text-cyan-200 space-y-6 scrollbar-thin scrollbar-thumb-cyan-500">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] px-5 py-4 rounded-xl border ${
                        msg.role === 'user'
                          ? 'border-purple-400/40 bg-purple-950/40'
                          : 'border-cyan-400/30 bg-black/60'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-cyan-400 font-mono">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                    ECHO THINKING...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              <div className="px-6 pb-4 flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-[10px] px-4 py-2 bg-black border border-cyan-400/30 hover:border-cyan-400 rounded-full text-cyan-300 hover:text-white transition-all"
                  >
                    {prompt.length > 45 ? prompt.slice(0, 42) + '...' : prompt}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <div className="p-5 border-t border-cyan-400/30 bg-black">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-black border border-cyan-400/50 focus:border-cyan-400 px-5 py-4 font-mono text-cyan-200 placeholder:text-cyan-400/50 outline-none rounded-xl"
                    placeholder="TYPE COMMAND... (or click a prompt above)"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="neon-button px-8 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={20} /> SEND
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
