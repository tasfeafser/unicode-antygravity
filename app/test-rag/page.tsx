'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft, BookOpen, Search, Library, Sparkles, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function TestRAGPage() {
  const { isSignedIn, isLoaded } = useUser()
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [courseId, setCourseId] = useState('')
  const [indexing, setIndexing] = useState(false)

  const handleRAGChat = async () => {
    if (!message) return
    
    setLoading(true)
    setResponse('')
    
    try {
      const res = await fetch('/api/ai/rag-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          courseId: courseId || undefined,
          stream: true
        })
      })

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break
            try {
              const parsed = JSON.parse(data)
              setResponse(prev => prev + parsed.chunk)
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error)
      setResponse('Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleIndexSampleCourse = async () => {
    setIndexing(true)
    try {
      const sampleSections = [
        {
          title: "Introduction to Python",
          content: "Python is a high-level, interpreted programming language known for its simplicity and readability. It supports multiple programming paradigms including object-oriented, imperative, and functional programming."
        },
        {
          title: "Variables and Data Types",
          content: "Python supports various data types including integers (int), floating-point numbers (float), strings (str), booleans (bool), lists, tuples, and dictionaries. Variables are dynamically typed."
        },
        {
          title: "Control Flow",
          content: "Python uses if/elif/else for conditional execution, for loops for iteration, and while loops for repeated execution. Indentation is used to define code blocks."
        }
      ]

      const res = await fetch('/api/ai/index-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'python-101',
          title: 'Python Programming 101',
          description: 'Introduction to Python programming',
          sections: sampleSections
        })
      })
      
      const data = await res.json()
      alert(`Indexed ${data.indexedCount} vectors successfully!`)
      setCourseId('python-101')
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to index course')
    } finally {
      setIndexing(false)
    }
  }

  if (!isLoaded) return null

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md backdrop-blur-xl">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={32} />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">Please sign in to test the Advanced RAG Course Library features.</p>
          <Link href="/" className="px-6 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
           <Link href="/" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-all border border-border group">
            <ArrowLeft size={20} className="text-gray-400 group-hover:text-foreground transition-colors" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold mb-1">Course Library & RAG</h1>
            <p className="text-gray-400">Searchable vector-indexed Computer Science curriculum.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/[0.03] border border-border rounded-2xl p-6 backdrop-blur-md">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Library size={18} className="text-[#ef233c]" />
                1. Index Content
              </h2>
              <p className="text-sm text-gray-400 mb-6">Create vector embeddings for courses in Pinecone to enable semantic search.</p>
              <button
                onClick={handleIndexSampleCourse}
                disabled={indexing}
                className="w-full py-3 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(239,35,60,0.3)] disabled:opacity-50 disabled:shadow-none"
              >
                {indexing ? 'Indexing...' : 'Index Python 101'}
              </button>
            </div>

            <div className="bg-white/[0.03] border border-border rounded-2xl p-6 backdrop-blur-md">
              <h3 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-wider">How it works</h3>
              <ul className="space-y-4">
                {[
                  { icon: <Search size={14} />, text: "Embeddings generate vectors" },
                  { icon: <Library size={14} />, text: "Pinecone performs vector search" },
                  { icon: <Sparkles size={14} />, text: "AI answers using course context" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-gray-400">
                      {item.icon}
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111] border border-border rounded-2xl overflow-hidden flex flex-col min-h-[500px]">
              <div className="p-4 border-b border-border bg-white/[0.02] flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Search size={16} className="text-[#ef233c]" />
                  Semantic Query
                </span>
                <input
                  type="text"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="Course ID (optional)"
                  className="bg-transparent border border-border text-xs rounded px-2 py-1 focus:outline-none focus:border-[#ef233c]/50"
                />
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {response ? (
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-white/[0.02] border border-border p-6 rounded-xl font-mono text-sm leading-relaxed text-red-100">
                      {response}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                    <BookOpen size={48} className="mb-4" />
                    <p>Ask a question about the indexed course (e.g., "What are Python data types?") and the AI will use RAG to find relevant sections.</p>
                  </div>
                )}
                {loading && (
                  <div className="mt-4 flex items-center gap-3 text-sm text-[#ef233c] animate-pulse">
                    <Sparkles size={16} /> Retrieving context and generating answer...
                  </div>
                )}
              </div>

              <div className="p-6 bg-white/[0.02] border-t border-border">
                <div className="relative group">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about Python concepts..."
                    className="w-full bg-[#18181b] border border-border focus:border-[#ef233c]/50 rounded-xl p-4 pr-16 focus:ring-1 focus:ring-[#ef233c]/50 transition-all resize-none h-24"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault(); handleRAGChat();
                      }
                    }}
                  />
                  <button
                    onClick={handleRAGChat}
                    disabled={loading || !message}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg flex items-center justify-center disabled:opacity-30 transition-all"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
