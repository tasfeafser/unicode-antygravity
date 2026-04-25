'use client'

import React, { useState, useRef, useEffect } from 'react'
import { BrainCircuit, Send, Calendar, Clock, Book, Trash2, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface ScheduleItem {
  id: string
  day: string
  time: string
  title: string
  course: string
  color: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  action?: { type: 'schedule_added' | 'schedule_removed'; items?: ScheduleItem[] }
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { id: '1', day: 'Monday', time: '10:00 AM', title: 'Data Structures Lecture', course: 'CS201', color: '#ef233c' },
  { id: '2', day: 'Wednesday', time: '2:00 PM', title: 'Algorithm Lab', course: 'CS201', color: '#3b82f6' },
  { id: '3', day: 'Friday', time: '9:00 AM', title: 'AI & ML Seminar', course: 'CS401', color: '#8b5cf6' },
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function parseScheduleFromAI(text: string, existingSchedule: ScheduleItem[]): { newItems: ScheduleItem[], removedIds: string[], cleanedText: string } {
  const newItems: ScheduleItem[] = []
  const removedIds: string[] = []
  let cleanedText = text

  // Parse ADD commands: [ADD: Day, Time, Title, Course]
  const addRegex = /\[ADD:\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^\]]+)\]/gi
  let match
  while ((match = addRegex.exec(text)) !== null) {
    const day = match[1].trim()
    const time = match[2].trim()
    const title = match[3].trim()
    const course = match[4].trim()
    const colors = ['#ef233c', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899']
    newItems.push({
      id: generateId(),
      day,
      time,
      title,
      course,
      color: colors[Math.floor(Math.random() * colors.length)]
    })
    cleanedText = cleanedText.replace(match[0], '')
  }

  // Parse REMOVE commands: [REMOVE: id or title keyword]
  const removeRegex = /\[REMOVE:\s*([^\]]+)\]/gi
  while ((match = removeRegex.exec(text)) !== null) {
    const keyword = match[1].trim().toLowerCase()
    existingSchedule.forEach(item => {
      if (item.title.toLowerCase().includes(keyword) || item.course.toLowerCase().includes(keyword) || item.day.toLowerCase().includes(keyword)) {
        removedIds.push(item.id)
      }
    })
    cleanedText = cleanedText.replace(match[0], '')
  }

  return { newItems, removedIds, cleanedText: cleanedText.trim() }
}

export default function ConciergePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(DEFAULT_SCHEDULE)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your Academic Concierge 🎓. I can help you manage your class schedule, plan study sessions, and organize your academic life.\n\nTry saying things like:\n• \"Add a class on Sunday at 3 PM for Web Development\"\n• \"Remove the AI seminar on Friday\"\n• \"What's my schedule this week?\"\n• \"Add study time on Saturday morning for exam prep\""
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const scheduleStr = schedule.map(s => `- ${s.day} ${s.time}: "${s.title}" (${s.course})`).join('\n')

      const systemPrompt = `You are the Unicode Academic Concierge, an AI assistant for university students managing their class schedules and study plans.

CURRENT SCHEDULE:
${scheduleStr || 'Empty schedule'}

AVAILABLE DAYS: ${DAYS.join(', ')}

INSTRUCTIONS:
- When the user asks to ADD a class/study session/event, respond conversationally AND include a hidden command in this exact format: [ADD: Day, Time, Title, Course]
- When the user asks to REMOVE something, respond conversationally AND include: [REMOVE: keyword to match]
- The Day must be one of: ${DAYS.join(', ')}
- Time should be in format like "10:00 AM" or "3:30 PM"
- If the user asks what their schedule looks like, list it nicely.
- Be friendly, helpful, and proactive with suggestions.
- You can add multiple items at once with multiple [ADD:] commands.
- For the Course field, use a reasonable course code like "CS101", "STUDY", "EXAM PREP", etc.

Example: If user says "add a web dev class on Sunday at 3pm", respond with something like:
"Done! I've added your Web Development class for Sunday at 3:00 PM. That's a great time for weekend learning! 📚 [ADD: Sunday, 3:00 PM, Web Development, CS301]"`

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: [...messages.map(m => ({ role: m.role, content: m.content })), { role: 'user', content: input }]
        })
      })

      const data = await res.json()
      const aiText = data.response || data.error || 'Sorry, I had trouble processing that.'

      // Parse schedule commands from AI response
      const { newItems, removedIds, cleanedText } = parseScheduleFromAI(aiText, schedule)

      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: cleanedText,
        action: (newItems.length > 0 || removedIds.length > 0)
          ? {
            type: newItems.length > 0 ? 'schedule_added' : 'schedule_removed',
            items: newItems
          }
          : undefined
      }

      setMessages(prev => [...prev, aiMsg])

      // Apply schedule changes
      if (removedIds.length > 0) {
        setSchedule(prev => prev.filter(s => !removedIds.includes(s.id)))
      }
      if (newItems.length > 0) {
        setSchedule(prev => [...prev, ...newItems])
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error connecting to the AI. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const removeItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id))
  }

  // Group schedule by day
  const groupedSchedule: Record<string, ScheduleItem[]> = {}
  DAYS.forEach(day => {
    const items = schedule.filter(s => s.day === day)
    if (items.length > 0) groupedSchedule[day] = items
  })

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
              <BrainCircuit className="w-5 h-5 text-[#ef233c]" />
              Academic Concierge
            </h1>
            <p className="text-xs text-muted-foreground">AI-powered schedule & study planner</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6 h-[calc(100vh-80px)]">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col bg-white/[0.02] border border-border rounded-2xl overflow-hidden min-h-0">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-[#ef233c]' : 'bg-zinc-700'}`}>
                  {msg.role === 'assistant' ? <BrainCircuit className="w-4 h-4 text-white" /> : <span className="text-xs font-bold text-white">ME</span>}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`rounded-2xl p-4 text-sm whitespace-pre-wrap ${
                    msg.role === 'assistant'
                      ? 'bg-muted border border-border rounded-tl-none'
                      : 'bg-[#ef233c]/10 border border-[#ef233c]/20 rounded-tr-none'
                  }`}>
                    {msg.content}
                  </div>
                  {msg.action && (
                    <div className="mt-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400 shrink-0" />
                      <span className="text-xs text-green-400 font-medium">
                        {msg.action.type === 'schedule_added'
                          ? `✓ ${msg.action.items?.length} item(s) added to your schedule`
                          : '✓ Schedule updated'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ef233c] flex items-center justify-center shrink-0">
                  <BrainCircuit className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-muted border border-border rounded-2xl rounded-tl-none p-4">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
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
                placeholder="e.g. Add a Web Dev class on Sunday at 3 PM..."
                className="w-full bg-muted border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#ef233c] text-foreground"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#ef233c] rounded-lg text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule Panel */}
        <div className="w-full lg:w-96 flex flex-col gap-4 overflow-y-auto">
          <div className="bg-white/[0.02] border border-border rounded-2xl p-6">
            <h3 className="font-bold font-manrope mb-4 flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-[#ef233c]" /> Weekly Schedule
            </h3>
            
            {Object.keys(groupedSchedule).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No classes scheduled yet.</p>
                <p className="text-xs mt-1">Ask me to add some!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {DAYS.map(day => {
                  const items = groupedSchedule[day]
                  if (!items) return null
                  return (
                    <div key={day}>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{day}</div>
                      {items.map(item => (
                        <div key={item.id} className="group flex items-start gap-3 mb-2 p-3 rounded-xl bg-background border border-border hover:border-white/20 transition-colors">
                          <div className="w-1 h-full min-h-[40px] rounded-full" style={{ backgroundColor: item.color }}></div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Book className="w-3 h-3" />{item.course}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="bg-white/[0.02] border border-border rounded-2xl p-6">
            <h3 className="font-bold font-manrope mb-3 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#ef233c]" /> Quick Add
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Add study time Saturday 10 AM', 'Add lab session Tuesday 4 PM', 'Add office hours Thursday 1 PM'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => { setInput(suggestion); }}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-full hover:border-[#ef233c]/50 hover:text-[#ef233c] transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
