import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, TranslationResult } from '../types';

interface DocumentChatProps {
  isOpen: boolean;
  onClose: () => void;
  result: TranslationResult;
}

export const DocumentChat: React.FC<DocumentChatProps> = ({ isOpen, onClose, result }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'ai',
      text: `Hello! I have thoroughly analyzed **${result.fileName}**. Ask me any specific questions, clarification on clauses, or requests to explain complex points in detail!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentContext: `ORIGINAL TEXT:\n${result.originalText}\n\nTRANSLATED TEXT (${result.targetLanguage}):\n${result.translatedDocument}\n\nSUMMARY:\n${result.summary}`,
          question: userMsg.text,
          history: messages
        })
      });

      const data = await response.json();
      if (data.success && data.answer) {
        setMessages(prev => [
          ...prev,
          {
            id: 'ai_' + Date.now(),
            sender: 'ai',
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'Failed to answer');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'ai',
          text: 'Sorry, I ran into an error reading this document section. Please try asking again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900 z-40"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white border-l border-slate-200 shadow-2xl flex flex-col text-slate-800"
          >
            
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
                >
                  <Bot className="w-5 h-5" />
                </motion.div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Ask AI Assistant</h3>
                  <p className="text-[11px] text-slate-500 truncate max-w-[220px] font-medium">{result.fileName}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-slate-50/30">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}>
                    {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none font-medium shadow-xs'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none shadow-xs'
                  }`}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`block text-[10px] mt-1 ${
                      msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400 text-left'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200/80 w-fit shadow-xs"
                >
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing document details...</span>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-700 custom-scrollbar">
              <button
                onClick={() => setInput('What are the main obligations mentioned?')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap font-medium text-slate-700 cursor-pointer transition-all hover:scale-[1.02]"
              >
                Key obligations?
              </button>
              <button
                onClick={() => setInput('Are there any critical deadlines or dates?')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap font-medium text-slate-700 cursor-pointer transition-all hover:scale-[1.02]"
              >
                Important dates?
              </button>
              <button
                onClick={() => setInput('Explain Section 1 in simpler terms')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap font-medium text-slate-700 cursor-pointer transition-all hover:scale-[1.02]"
              >
                Simplify Section 1
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything about this document..."
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </form>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
