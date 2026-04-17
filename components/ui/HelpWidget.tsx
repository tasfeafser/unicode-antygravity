'use client'

import { useState } from 'react'
import { HelpCircle, X, Send, MessageCircle, Bug, Phone } from 'lucide-react'

export function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    // In a real app, this would send to a backend/email
    console.log('Support message submitted:', message)
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      setMessage('')
      setIsOpen(false)
    }, 2000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-over Message Option */}
      {isOpen && (
        <div className="mb-4 w-80 glass-morphism-light dark:glass-morphism rounded-2xl shadow-2xl overflow-hidden border border-purple-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-purple-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-white" />
              <span className="text-sm font-semibold text-white">Unicode Support</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-4 bg-white/50 dark:bg-[#121212]/50 backdrop-blur-sm">
            {isSubmitted ? (
              <div className="py-8 text-center animate-in zoom-in duration-300">
                <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Send size={20} />
                </div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Message Sent!</p>
                <p className="text-xs text-gray-500 mt-1">Our team will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  How can we help you today? Whether it's a bug, a feature request, or just a question, we're here for you.
                </p>
                
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-xs text-gray-700 dark:text-gray-300 border border-transparent hover:border-purple-500/30 transition-all">
                    <Bug size={14} className="text-red-400" /> Bug Report
                  </button>
                  <button type="button" className="flex items-center gap-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-xs text-gray-700 dark:text-gray-300 border border-transparent hover:border-purple-500/30 transition-all">
                    <Phone size={14} className="text-blue-400" /> Sales/Demo
                  </button>
                </div>

                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none h-24 placeholder:text-gray-400"
                />

                <button 
                  type="submit"
                  disabled={!message.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2.5 text-xs font-semibold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'bg-white dark:bg-gray-800 text-purple-600 rotate-90 scale-90' 
            : 'bg-purple-600 text-white help-widget-pulse'
        }`}
      >
        {isOpen ? <X size={24} /> : <HelpCircle size={28} />}
      </button>
    </div>
  )
}
