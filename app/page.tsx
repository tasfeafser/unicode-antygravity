'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { 
  Terminal, Code2, Sparkles, BookOpen, ShieldAlert, 
  FileText, BrainCircuit, CreditCard, ChevronRight,
  Layers, Cpu, Grid3X3, Gamepad2, Languages, Sun, Moon,
  Users, Globe, Code
} from 'lucide-react'
import { translations, type Language } from '@/lib/i18n/translations'
import { HelpWidget } from '@/components/ui/HelpWidget'

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [language, setLanguage] = useState<Language>('en')
  const t = translations[language]
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    // Attempt to detect browser language or use saved preference
    const savedLang = localStorage.getItem('unicode-lang') as Language
    if (savedLang && ['en', 'zh'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en'
    setLanguage(newLang)
    localStorage.setItem('unicode-lang', newLang)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % t.hero.descriptions.length)
    }, 3000) // Slightly slower for better readability
    return () => clearInterval(interval)
  }, [t.hero.descriptions.length])

  if (!mounted) return null
  const isDark = theme === 'dark'

  return (
    <main className="min-h-screen relative overflow-x-hidden bg-background text-foreground selection:bg-purple-500/30">
      
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
          <Link href="/vision" className="text-sm text-gray-400 hover:text-white transition-colors">{t.nav.vision}</Link>
          <Link href="/pricing" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 backdrop-blur-sm">
            <CreditCard size={16} /> {t.nav.pricing}
          </Link>

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-3 py-2 rounded-lg border border-purple-500/20 font-mono"
          >
            <Languages size={16} /> {t.nav.languageToggle}
          </button>

          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 transition-colors text-purple-400"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
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

      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full orb-float pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-cyan-600/20 blur-[120px] rounded-full orb-float-delayed pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
        <div className="max-w-3xl mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/30 text-purple-400 text-sm font-bold mb-6 hover-glow cursor-default">
            <Sparkles size={16} className="animate-pulse" /> {t.hero.badges[0]}
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tight mb-8">
            <span className="text-foreground">{t.hero.titlePrefix}</span><br/>
            <span className="gradient-text-animate">{t.hero.titleSuffix}</span>
          </h1>
          <div className="h-20 sm:h-auto">
            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed max-w-2xl transition-all duration-500 min-h-[60px]">
              {t.hero.descriptions[heroIndex]}
            </p>
          </div>
        </div>

        {/* Stats Counter Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32 border-y border-white/5 py-12 glass">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black gradient-text-animate mb-2">50k+</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2"><Users size={14}/> Active Users</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black gradient-text-animate mb-2">10+</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2"><Globe size={14}/> Supported Languages</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black gradient-text-animate mb-2">1M+</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2"><Code size={14}/> Executions</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-black gradient-text-animate mb-2">99.9%</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2"><Sparkles size={14}/> Uptime</div>
          </div>
        </div>

        {/* Feature Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-32">
          {/* 1. IDE */}
          <Link href="/ide" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/20 to-transparent transition-all duration-300 hover-lift hover-glow-green">
            <div className="absolute inset-0 bg-green-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full glass rounded-[15px] p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${isDark ? 'bg-[#1e1e1e] border-gray-800' : 'bg-green-50 border-green-100'}`}>
                  <Code2 className="text-green-500" />
                </div>
                <h3 className="font-mono font-bold text-xl text-green-600 dark:text-green-400 mb-2">{t.features.ide.title}</h3>
                <p className="text-sm text-muted-foreground">{t.features.ide.desc}</p>
              </div>
            </div>
          </Link>

          {/* 2. Linux Simulation */}
          <Link href="/linux" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/20 to-transparent transition-all duration-300 hover-lift hover-glow-orange">
            <div className="absolute inset-0 bg-orange-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-full glass rounded-[15px] p-6 transition-colors flex flex-col justify-between">
              <div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 ${isDark ? 'bg-black border-gray-800' : 'bg-orange-50 border-orange-100'}`}>
                  <Terminal className="text-orange-500" />
                </div>
                <h3 className="font-mono font-bold text-xl text-orange-600 dark:text-orange-400 mb-2">{t.features.linux.title}</h3>
                <p className="text-sm text-muted-foreground">{t.features.linux.desc}</p>
              </div>
            </div>
          </Link>

          {/* 3. AI Code Mentor */}
          <Link href="/test-ai" className="group relative p-[1px] rounded-2xl bg-gradient-to-b from-purple-500/30 to-transparent transition-all duration-300 md:col-span-2 hover-lift hover-glow">
            <div className="absolute inset-0 bg-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className={`relative h-full glass rounded-[15px] p-6 flex flex-col justify-between overflow-hidden transition-colors`}>
              <div className={`absolute right-0 top-0 opacity-10 translate-x-1/3 -translate-y-1/3 ${isDark ? 'text-white' : 'text-purple-600'}`}>
                <BrainCircuit size={200} className="group-hover:rotate-12 transition-transform duration-700" />
              </div>
              <div className="relative z-10 w-2/3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 ${
                  isDark ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-500 border-purple-600 shadow-purple-500/50 shadow-lg'
                }`}>
                  <Sparkles className={isDark ? 'text-purple-400' : 'text-white'} />
                </div>
                <h3 className={`font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-purple-900'}`}>{t.features.aiMentor.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-purple-700/80'}`}>{t.features.aiMentor.desc}</p>
              </div>
            </div>
          </Link>

          {/* 4. Cybersecurity */}
          <Link href="/security" className="group theme-card p-6 glass hover-lift hover-glow-red">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100'}`}>
              <ShieldAlert className="text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.cyber.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.cyber.desc}</p>
          </Link>

          {/* 5. Course & RAG */}
          <Link href="/test-rag" className="group theme-card p-6 glass hover-lift hover-glow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
              <BookOpen className="text-blue-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.course.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.course.desc}</p>
          </Link>

          {/* 6. Documentation */}
          <Link href="/docs" className="group theme-card p-6 glass hover-lift hover-glow-cyan">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-100'}`}>
              <FileText className="text-cyan-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.docs.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.docs.desc}</p>
          </Link>

          {/* 7. Academic Concierge */}
          <Link href="/concierge" className="group theme-card p-6 glass hover-lift hover-glow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-pink-500/10 border-pink-500/20' : 'bg-pink-50 border-pink-100'}`}>
              <BrainCircuit className="text-pink-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.concierge.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.concierge.desc}</p>
          </Link>

          {/* 8. Unicode AppBuilder */}
          <Link href="/app-builder" className="group theme-card p-6 glass hover-lift hover-glow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-purple-500/10 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
              <Layers className="text-purple-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.appBuilder.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.appBuilder.desc}</p>
          </Link>

          {/* 9. EE Simulation */}
          <Link href="https://withdiode.com" target="_blank" className="group theme-card p-6 glass hover-lift hover-glow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-100'}`}>
              <Cpu className="text-yellow-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.ee.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.ee.desc}</p>
          </Link>

          {/* 10. Architecture */}
          <Link href="/architecture" className="group theme-card p-6 glass hover-lift hover-glow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-100'}`}>
              <Grid3X3 className="text-indigo-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.architecture.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.architecture.desc}</p>
          </Link>

          {/* 11. Unigame */}
          <Link href="https://rosebud.ai/#create-from-scratch-section" target="_blank" className="group theme-card p-6 glass hover-lift hover-glow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border mb-6 group-hover:scale-110 transition-transform ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
              <Gamepad2 className="text-emerald-500" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">{t.features.unigame.title}</h3>
            <p className="text-sm text-muted-foreground">{t.features.unigame.desc}</p>
          </Link>

        </div>

        <div className="text-center">
          <Link 
            href="/vision" 
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors group"
          >
            {t.footer.visionLink}
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Help Widget */}
      <HelpWidget />
    </main>
  )
}
