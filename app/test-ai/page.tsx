'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, SquareTerminal, Image as ImageIcon, Sparkles, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { user } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      // Create empty assistant message
      const assistantId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          context: { skillLevel: 'beginner', topic: 'general' },
          stream: true
        })
      })

      if (!response.body) throw new Error('No response body')
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(5))
              if (data.chunk) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantId ? { ...msg, content: msg.content + data.chunk } : msg
                ))
              }
            } catch (e) {
              console.error('Error parsing stream data', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Connection error. Please ensure API keys are set.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-white overflow-hidden">
      
      {/* Sidebar (DeepSeek/Gemini Style) */}
      <div className="w-[260px] bg-[#111] border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Link href="/" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft size={16} className="text-gray-400" />
          </Link>
          <span className="font-semibold text-gray-200">Unicode Chat</span>
        </div>
        
        <div className="p-3">
          <button className="flex items-center gap-2 w-full px-3 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors border border-purple-500/20 text-sm font-medium">
            <Plus size={16} /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-2">
          <div className="text-xs font-semibold text-gray-500 mb-2 px-1">Recent</div>
          {['Debugging Fibonacci', 'React Hooks Explanation', 'Linux Commands Exam'].map(chat => (
            <button key={chat} className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 truncate transition-colors flex items-center gap-2">
              <MessageSquare size={14} className="text-gray-500 shrink-0" />
              {chat}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
            {user?.firstName?.charAt(0) || 'U'}
          </div>
          <div className="text-sm font-medium">{user?.firstName || 'User'}</div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#111]">
          <Link href="/" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center">
             <ArrowLeft size={16} className="text-gray-400" />
          </Link>
          <span className="font-semibold px-2">Unicode Chat</span>
        </div>

        {/* Scrollable Transcript */}
        <div className="flex-1 overflow-y-auto w-full px-4 pt-10 pb-36">
          <div className="max-w-3xl mx-auto flex flex-col gap-8">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center animate-fade-in-up">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
                  <Sparkles size={32} className="text-purple-400" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Hello, {user?.firstName || 'Developer'}</h1>
                <p className="text-gray-400 max-w-md">I am Unicode, your Academic Co-Pilot. I can help explain code, debug issues, or guide you through Linux.</p>
                
                <div className="grid grid-cols-2 gap-3 mt-10 w-full">
                  {['Explain Dependency Inversion', 'How to exit Vim?', 'Debug a React useEffect', 'Teach me basic Python'].map(suggestion => (
                    <button 
                      key={suggestion}
                      onClick={() => { setInput(suggestion); document.getElementById('chat-input')?.focus() }}
                      className="p-3 text-sm text-left bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] rounded-xl text-gray-300 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30 shrink-0 mt-1">
                      <Sparkles size={14} className="text-purple-400" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#1E1E2E] text-white border border-white/5' 
                      : 'bg-transparent text-gray-200 prose prose-invert max-w-none'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Dock */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B] to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative group">
            <form 
              onSubmit={handleSend}
              className="relative bg-[#18181B] border border-white/10 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 rounded-2xl flex items-end shadow-2xl transition-all"
            >
              <div className="p-3 flex items-center gap-2">
                <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  <ImageIcon size={20} />
                </button>
                <button type="button" className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                  <SquareTerminal size={20} />
                </button>
              </div>
              <textarea
                id="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault(); handleSend(e);
                  }
                }}
                placeholder="Message Unicode AI..."
                className="flex-1 max-h-48 min-h-[56px] bg-transparent border-none text-white focus:outline-none resize-none py-4 px-2 placeholder-gray-500 placeholder:text-[15px]"
                rows={1}
                style={{ height: input ? 'auto' : '56px' }}
              />
              <div className="p-3">
                <button 
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center disabled:opacity-30 disabled:bg-gray-700 disabled:text-gray-400 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
            <div className="text-center mt-3 text-xs text-gray-500">
              Unicode can make mistakes. Verify critical code and advice.
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
