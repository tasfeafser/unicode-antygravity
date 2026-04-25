'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, BookOpen, Search, Sparkles, Send, GraduationCap, Code2, Shield, Cpu, Globe, Database } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const COURSES = [
  { id: 'python', name: 'Python Programming', icon: <Code2 className="w-5 h-5" />, color: '#f59e0b', topics: 'Variables, Control Flow, OOP, Data Structures, File I/O, Libraries' },
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: <Database className="w-5 h-5" />, color: '#10b981', topics: 'Arrays, Trees, Graphs, Sorting, Searching, Dynamic Programming' },
  { id: 'web', name: 'Web Development', icon: <Globe className="w-5 h-5" />, color: '#3b82f6', topics: 'HTML, CSS, JavaScript, React, Next.js, APIs, Databases' },
  { id: 'security', name: 'Cybersecurity', icon: <Shield className="w-5 h-5" />, color: '#ef233c', topics: 'Network Security, Cryptography, Pen Testing, Vulnerabilities, OWASP' },
  { id: 'ai', name: 'AI & Machine Learning', icon: <Cpu className="w-5 h-5" />, color: '#8b5cf6', topics: 'Neural Networks, NLP, Computer Vision, Reinforcement Learning, LLMs' },
  { id: 'os', name: 'Operating Systems', icon: <Code2 className="w-5 h-5" />, color: '#ec4899', topics: 'Processes, Threads, Memory Management, File Systems, Linux, Scheduling' },
]

export default function TestRAGPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (overrideInput?: string) => {
    const msg = overrideInput || input
    if (!msg.trim() || loading) return

    const userMsg: ChatMessage = { role: 'user', content: msg }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const course = selectedCourse ? COURSES.find(c => c.id === selectedCourse) : null
      const courseContext = course
        ? `The user is asking about the course "${course.name}" which covers: ${course.topics}.`
        : 'The user has not selected a specific course. Answer about any CS topic they ask about.'

      const systemPrompt = `You are a knowledgeable Computer Science teaching assistant for the Unicode education platform. You help students understand concepts across all CS courses.

${courseContext}

INSTRUCTIONS:
- Give clear, concise, educational answers
- Use code examples when appropriate (wrap in markdown code blocks)
- Break complex topics into digestible steps
- If asked about a topic outside the selected course, still answer helpfully but note which course it relates to
- Use bullet points and headers for readability
- Be encouraging and supportive
- Keep answers focused and under 400 words unless the topic requires more detail`

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: [
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: msg }
          ]
        })
      })

      const data = await res.json()
      const aiText = data.response || 'Sorry, I had trouble generating an answer. Please try again.'

      setMessages(prev => [...prev, { role: 'assistant', content: aiText }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const suggestedQuestions = selectedCourse
    ? {
      python: ['What are Python decorators?', 'Explain list comprehensions', 'How does OOP work in Python?'],
      dsa: ['What is Big O notation?', 'Explain binary search trees', 'How does quicksort work?'],
      web: ['What is the Virtual DOM in React?', 'Explain REST vs GraphQL', 'How does Next.js routing work?'],
      security: ['What is SQL injection?', 'Explain the CIA triad', 'How does encryption work?'],
      ai: ['What is a neural network?', 'Explain gradient descent', 'How do transformers work?'],
      os: ['What is a process vs thread?', 'Explain virtual memory', 'How does CPU scheduling work?'],
    }[selectedCourse] || []
    : ['What is Big O notation?', 'Explain how React works', 'What are SQL injections?']

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-all border border-border">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <Image src="/logo.png" alt="Unicode" width={32} height={32} className="rounded-lg" />
          <div>
            <h1 className="text-xl font-bold font-manrope flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#ef233c]" />
              Course Library & AI Tutor
            </h1>
            <p className="text-xs text-muted-foreground">Ask anything about any CS course — powered by AI</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)]">
        {/* Course Selector Sidebar */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
            <GraduationCap className="w-4 h-4" /> Select Course
          </div>
          <button
            onClick={() => { setSelectedCourse(null); setMessages([]) }}
            className={`w-full text-left p-3 rounded-xl border transition-all text-sm font-medium ${
              !selectedCourse ? 'bg-[#ef233c]/10 border-[#ef233c]/30 text-[#ef233c]' : 'bg-muted/20 border-border hover:border-white/20'
            }`}
          >
            🌐 All Courses
          </button>
          {COURSES.map(course => (
            <button
              key={course.id}
              onClick={() => { setSelectedCourse(course.id); setMessages([]) }}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${
                selectedCourse === course.id
                  ? 'border-white/30 shadow-lg'
                  : 'bg-muted/20 border-border hover:border-white/20'
              }`}
              style={selectedCourse === course.id ? { backgroundColor: `${course.color}15`, borderColor: `${course.color}50` } : {}}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                {course.icon}
              </div>
              <div>
                <div className="text-sm font-medium">{course.name}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">{course.topics}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white/[0.02] border border-border rounded-2xl overflow-hidden min-h-0">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-[#ef233c]" />
                </div>
                <h3 className="text-xl font-bold font-manrope mb-2">
                  {selectedCourse ? `Ask about ${COURSES.find(c => c.id === selectedCourse)?.name}` : 'Ask about any CS topic'}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                  I can explain concepts, provide code examples, and help you understand complex topics across all computer science courses.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestedQuestions.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-4 py-2 text-xs bg-muted border border-border rounded-full hover:border-[#ef233c]/50 hover:text-[#ef233c] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[#ef233c]' : 'bg-zinc-700'}`}>
                      {msg.role === 'assistant' ? <Sparkles className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white">ME</span>}
                    </div>
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                      msg.role === 'assistant'
                        ? 'bg-muted border border-border rounded-tl-none prose prose-invert prose-sm max-w-none whitespace-pre-wrap'
                        : 'bg-[#ef233c]/10 border border-[#ef233c]/20 rounded-tr-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#ef233c] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="bg-muted border border-border rounded-2xl rounded-tl-none p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-[#ef233c] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-[#ef233c] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-[#ef233c] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-background">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={selectedCourse ? `Ask about ${COURSES.find(c => c.id === selectedCourse)?.name}...` : 'Ask any CS question...'}
                className="w-full bg-muted border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#ef233c] text-foreground"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#ef233c] rounded-lg text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
