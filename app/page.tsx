'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import { 
  Terminal, Code2, Sparkles, BookOpen, ShieldAlert, 
  FileText, BrainCircuit, CreditCard, ChevronRight,
  Layers, Cpu, Grid3X3, Gamepad2
} from 'lucide-react'

const HERO_TEXTS = [
  "Unicode acts as a co-pilot for someone diving into the deep end of Computer Science without a life jacket.",
  "Master Linux, Cybersecurity, and Software Engineering in one unified Academic OS.",
  "Bridge the gap from student to engineer with AI-guided walkthroughs and integrated tools.",
  "The ultimate success engine for the next generation of Computer Science leaders."
]

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_TEXTS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-[#0A0A0B] text-white selection:bg-purple-500/30">
      
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            U
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Unicode
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/vision" className="text-sm text-gray-400 hover:text-white transition-colors">Our Vision</Link>
          <Link href="/pricing" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 backdrop-blur-sm">
            <CreditCard size={16} /> Subscription
          </Link>
          
          {!isLoaded ? (
            <div className="w-20 h-10 bg-white/5 animate-pulse rounded-lg" />
          ) : isSignedIn ? (
            <UserButton afterSignOutUrl="/" appearance={{
              elements: { avatarBox: "w-10 h-10 ring-2 ring-purple-500/50" }
            }}/>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="text-sm text-gray-300 hover:text-white transition-colors">Log In</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="text-sm bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Get Started
                </button>
              </SignUpButton>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="max-w-3xl mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
            <Sparkles size={14} /> Unified Academic OS
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-8">
            From "Hello World"<br/>
            <span className="text-gray-500">to Software Engineer.</span>
          </h1>
          <div className="h-20 sm:h-auto">
            <p className="text-xl text-gray-400 leading-relaxed mb-10 max-w-2xl transition-all duration-500 min-h-[60px]">
              {HERO_TEXTS[heroIndex]}
            </p>
          </div>
        </div>

        {/* Feature Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {/* 1. IDE */}
          <Link href="/ide" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-green-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-[#1e1e1e] rounded-lg flex items-center justify-center border border-gray-800 mb-6 group-hover:scale-110 transition-transform">
                  <Code2 className="text-green-400" />
                </div>
                <h3 className="font-mono font-semibold text-lg text-green-400 mb-2">{`{ In-Browser IDE }`}</h3>
                <p className="text-sm text-gray-400 font-mono">Write, compile, and execute code directly. No local setup required.</p>
              </div>
            </div>
          </Link>

          {/* 2. Linux Simulation */}
          <Link href="/linux" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-orange-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-gray-800 mb-6 group-hover:scale-110 transition-transform">
                  <Terminal className="text-orange-400" />
                </div>
                <h3 className="font-mono font-semibold text-lg text-orange-400 mb-2">root@unicode:~#</h3>
                <p className="text-sm text-gray-400 font-mono">A safe space to learn the command line without breaking your OS.</p>
              </div>
            </div>
          </Link>

          {/* 3. AI Code Mentor */}
          <Link href="/test-ai" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/50 transition-all duration-300 md:col-span-2">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-gradient-to-br from-[#1a1025] to-[#111] backdrop-blur-md rounded-[15px] p-6 border border-white/5 flex flex-col justify-between overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 translate-x-1/3 -translate-y-1/3">
                <BrainCircuit size={200} />
              </div>
              <div className="relative z-10 w-2/3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-xl text-white mb-2">AI Code Mentor</h3>
                <p className="text-sm text-gray-300">Intelligent pair-programming powered by Groq and Gemini. Explains logic, debugging, and CS fundamentals.</p>
              </div>
            </div>
          </Link>

          {/* 4. Cybersecurity */}
          <Link href="/security" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-red-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-red-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center border border-red-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="text-red-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Cybersecurity Lab</h3>
                <p className="text-sm text-gray-400">Practice ethical hacking and understand vulnerabilities safely.</p>
              </div>
            </div>
          </Link>

          {/* 5. Course & RAG */}
          <Link href="/test-rag" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-blue-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Course Library</h3>
                <p className="text-sm text-gray-400">Searchable vector-indexed CS courses with RAG comprehension.</p>
              </div>
            </div>
          </Link>

          {/* 6. Documentation */}
          <Link href="/docs" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-cyan-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-cyan-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="text-cyan-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Docs & Slides</h3>
                <p className="text-sm text-gray-400">Auto-generate professional documentation and presentations.</p>
              </div>
            </div>
          </Link>

          {/* 7. Academic Concierge */}
          <Link href="/concierge" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-pink-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-pink-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-pink-500/10 rounded-lg flex items-center justify-center border border-pink-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="text-pink-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Academic Concierge</h3>
                <p className="text-sm text-gray-400">Upload PDFs. The AI tracks syllabus and extracts pure knowledge.</p>
              </div>
            </div>
          </Link>

          {/* 8. Unicode AppBuilder */}
          <Link href="/app-builder" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-purple-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center border border-purple-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <Layers className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">AppBuilder</h3>
                <p className="text-sm text-gray-400">Build and deploy full-stack apps with AI assistance. Low-code to pro-code.</p>
              </div>
            </div>
          </Link>

          {/* 9. EE Simulation */}
          <Link href="https://withdiode.com" target="_blank" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-yellow-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-yellow-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <Cpu className="text-yellow-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Electrical Engineering</h3>
                <p className="text-sm text-gray-400">Advanced circuit simulation and logic design. Powered by withdiode.com.</p>
              </div>
            </div>
          </Link>

          {/* 10. Architecture */}
          <Link href="/architecture" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-indigo-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <Grid3X3 className="text-indigo-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Arcstructure</h3>
                <p className="text-sm text-gray-400">Complex software systems design. Mapping out the skeleton of your ideas.</p>
              </div>
            </div>
          </Link>

          {/* 11. Unigame */}
          <Link href="https://rosebud.ai/#create-from-scratch-section" target="_blank" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-white/10 to-transparent hover:from-emerald-500/50 transition-all duration-300">
            <div className="absolute inset-0 bg-emerald-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full bg-[#111] backdrop-blur-md rounded-[15px] p-6 hover:bg-[#151515] transition-colors border border-white/5 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <Gamepad2 className="text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">Unigame</h3>
                <p className="text-sm text-gray-400">Create games from scratch with AI. Powered by Rosebud AI.</p>
              </div>
            </div>
          </Link>

        </div>

        <div className="text-center">
          <Link 
            href="/vision" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors group"
          >
            Read our vision for the future of CS education
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  )
}
