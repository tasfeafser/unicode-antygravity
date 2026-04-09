'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, Loader2, Code, Bug, Zap, X, ChevronLeft } from 'lucide-react'

interface AIChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  currentCode: string
  currentLanguage: string
  currentFileName: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export function AIChatSidebar({ isOpen, onClose, currentCode, currentLanguage, currentFileName }: AIChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Build context-aware prompt
      const contextPrompt = currentCode
        ? `\n\n[Current File: ${currentFileName} (${currentLanguage})]\n\`\`\`${currentLanguage}\n${currentCode.substring(0, 2000)}\n\`\`\``
        : ''

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: content + contextPrompt }
          ],
          stream: false
        })
      })

      const data = await res.json()
      const assistantContent = data.content || data.error || 'No response received.'
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${String(err)}` }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    { icon: <Code size={13} />, label: 'Explain', prompt: 'Explain this code step by step.' },
    { icon: <Bug size={13} />, label: 'Debug', prompt: 'Find bugs and issues in this code.' },
    { icon: <Zap size={13} />, label: 'Optimize', prompt: 'Suggest optimizations for this code.' },
  ]

  if (!isOpen) return null

  return (
    <div className="h-full bg-[#181818] border-l border-gray-800 flex flex-col w-[320px] shrink-0">
      {/* Header */}
      <div className="px-3 py-2.5 flex items-center justify-between border-b border-gray-800/50">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-purple-400" />
          <span className="text-xs font-semibold text-gray-300">AI Assistant</span>
        </div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 transition-colors">
          <ChevronLeft size={14} className="text-gray-400" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-3 py-2 flex gap-1.5 border-b border-gray-800/30">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => sendMessage(action.prompt)}
            disabled={isLoading || !currentCode}
            className="flex items-center gap-1 px-2.5 py-1 bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white rounded-md text-[10px] font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-600 text-xs py-8">
            <Sparkles size={24} className="mx-auto mb-2 opacity-30" />
            <p>Ask me about your code</p>
            <p className="mt-1 text-[10px]">I can see your current file context</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600/20 text-blue-100 rounded-br-sm'
                : 'bg-gray-800/50 text-gray-300 rounded-bl-sm'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 px-3 py-2 rounded-xl rounded-bl-sm">
              <Loader2 size={14} className="animate-spin text-purple-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-800/50">
        {currentFileName && (
          <div className="text-[10px] text-gray-600 mb-1.5 truncate">
            Context: <span className="text-gray-500">{currentFileName}</span>
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
            placeholder="Ask about your code..."
            className="flex-1 bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-purple-500/50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30"
          >
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
