'use client'

import { useState, useEffect } from 'react'
import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import {
    ArrowRight, Bot, Code2, Layers, Star, User, Check, Github, Terminal,
    ShieldAlert, Cpu, BookOpen, BrainCircuit, FileText, Grid3X3, Gamepad2
} from 'lucide-react'
import { HelpWidget } from '@/components/ui/HelpWidget'
import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { PricingCards } from '@/components/ui/PricingCards'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { SearchInput } from '@/components/ui/SearchInput'
import { HoloCheckbox } from '@/components/ui/HoloCheckbox'
import { useLanguage } from '@/components/providers/LanguageProvider'
import { useTheme } from 'next-themes'
import { LightNeoBrutalistHome } from '@/components/home/LightNeoBrutalistHome'

export default function Home() {
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    if (resolvedTheme === 'light') {
        return <LightNeoBrutalistHome />
    }

    return <DarkRedNoirHome />
}

const testimonials = [
    {
        text: "Unicode has completely transformed how I learn computer science. The AI mentor feels like having a senior engineer constantly by my side.",
        name: "Alex Morgan",
        role: "CS Student, Gannan normal  University"
    },
    {
        text: "The Linux Sandbox is incredibly realistic. I was able to practice shell scripting without worrying about breaking my own system.",
        name: "Jordan Lee",
        role: "CS Student, Gannan normal University"
    },
    {
        text: "Building apps visually while seeing the underlying code has bridged the gap between theory and actual software engineering for me.",
        name: "Taylor Reed",
        role: "CS Student, Gannan normal University"
    },
    {
        text: "The cybersecurity lab is mind-blowing. It's one thing to read about vulnerabilities, but hacking the virtual mainframe taught me so much more.",
        name: "Sam Chen",
        role: "CS Student, Gannan normal University"
    }
]

function DarkRedNoirHome() {
    const { isSignedIn, isLoaded } = useUser()
    const [mounted, setMounted] = useState(false)
    const [currentTestimonial, setCurrentTestimonial] = useState(0)
    const { t } = useLanguage()

    useEffect(() => {
        setMounted(true)
        const interval = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen bg-transparent text-foreground font-inter relative overflow-x-hidden">
            {/* Navbar */}
            <header className="fixed top-0 left-0 w-full z-50 pt-6 px-4">
                <nav className="max-w-5xl mx-auto flex items-center justify-between bg-background/60 backdrop-blur-xl border border-border rounded-full px-6 py-3 shadow-2xl">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45"></div>
                        <span className="text-lg font-bold font-manrope tracking-tight">Unicode</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/ide" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.ide')}</Link>
                        <Link href="/linux" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.linux')}</Link>
                        <Link href="/security" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.security')}</Link>
                        <Link href="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">{t('nav.docs')}</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageToggle />
                        <ThemeSwitch />
                        {!isLoaded ? (
                            <div className="w-20 h-8 bg-muted animate-pulse rounded-full" />
                        ) : isSignedIn ? (
                            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
                        ) : (
                            <>
                                <SignInButton mode="modal">
                                    <button className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground">Log In</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-muted px-6 py-2 transition-transform active:scale-95">
                                        <span className="absolute inset-0 border border-border rounded-full"></span>
                                        <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        <span className="absolute inset-[1px] rounded-full bg-background"></span>
                                        <span className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                            Get Access <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                        </span>
                                    </button>
                                </SignUpButton>
                            </>
                        )}
                    </div>
                </nav>
            </header>

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6">
                    <div className="text-center max-w-5xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border backdrop-blur-md mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]"></span>
                            </span>
                            <span className="text-xs font-medium text-red-100/90 tracking-wide font-manrope">
                                {t('hero.badge')}
                            </span>
                            <ArrowRight className="w-3 h-3 text-red-400" />
                        </div>

                        <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter font-manrope leading-[1.1] mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">{t('hero.title1')}</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
                                {t('hero.title2')}<span className="text-[#ef233c] inline-block relative">
                                    {t('hero.title3')}
                                    <svg className="absolute w-full h-3 -bottom-2 left-0 text-[#ef233c] opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                                        <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                                    </svg>
                                </span>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
                            {t('hero.desc')}
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
                            <Link href="/ide">
                                <button className="shiny-cta group">
                                    <span className="relative z-10 flex items-center gap-2 text-foreground font-medium">
                                        {t('hero.start')} <ArrowRight className="transition-transform group-hover:translate-x-1" />
                                    </span>
                                </button>
                            </Link>

                            <a href="https://github.com/tasfeafser/unicode-antygravity" target="_blank" rel="noreferrer" className="group px-8 py-4 rounded-full bg-zinc-900 border border-zinc-800 text-muted-foreground font-medium hover:text-foreground hover:bg-zinc-800 transition-all flex items-center gap-2">
                                <Github className="w-5 h-5" />
                                {t('hero.github')}
                            </a>
                        </div>
                    </div>

                    {/* Logo Strip */}
                    <div className="w-full mt-32 border-y border-border bg-white/[0.02] backdrop-blur-sm py-10 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                            <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase shrink-0">{t('hero.integrated')}</p>
                            <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center w-full">
                                <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><Bot size={14} /></div>OpenAI</div>
                                <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><Cpu size={14} /></div>Piston</div>
                                <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><Code2 size={14} /></div>Next.js</div>
                                <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><Layers size={14} /></div>Pinecone</div>
                                <div className="flex items-center gap-2 font-manrope font-semibold"><div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center"><ShieldAlert size={14} /></div>Supabase</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-20 text-center max-w-3xl mx-auto animate-fade-up">
                            <h2 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight font-manrope mb-6">
                                {t('features.title1')} <br />
                                <span className="text-[#ef233c]">{t('features.title2')}</span>
                            </h2>
                            <p className="text-lg text-muted-foreground font-light">
                                {t('features.desc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-auto lg:h-[700px] mb-4">
                            {/* Main Feature Card */}
                            <Link href="/ide" className="lg:col-span-2 lg:row-span-2 group relative overflow-hidden p-8 border border-border bg-gradient-to-b from-zinc-900/50 to-black hover:border-white/20 transition-all rounded-xl block">
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="mb-6 inline-flex p-3 rounded-lg bg-muted border border-border text-[#ef233c]">
                                        <Code2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-3xl font-semibold text-foreground font-manrope mb-4 tracking-tight">AI-Powered Cloud IDE</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">Write, execute, and debug code in 10+ languages directly from your browser. Integrated with advanced AI mentoring to explain errors, suggest optimizations, and guide your learning process in real-time.</p>
                                    <div className="mt-auto flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 pt-8">
                                        <span className="text-xs font-mono text-[#ef233c]">EXPLORE IDE</span>
                                        <ArrowRight className="w-4 h-4 text-[#ef233c]" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #ef233c, transparent 70%)' }}></div>
                            </Link>

                            {/* Feature 2 */}
                            <Link href="/linux" className="lg:col-span-2 group relative overflow-hidden p-8 border border-border bg-background hover:border-white/20 transition-all rounded-xl block">
                                <div className="relative z-10 flex flex-col h-full">
                                    <div className="mb-4 inline-flex p-3 rounded-lg bg-muted border border-border text-blue-400">
                                        <Terminal className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-semibold text-foreground font-manrope mb-2">Linux Sandbox</h3>
                                    <p className="text-muted-foreground">Master command-line operations with our realistic web-based terminal simulator featuring 30+ supported commands.</p>
                                </div>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" style={{ background: 'radial-gradient(circle at top right, #3b82f6, transparent 70%)' }}></div>
                            </Link>

                            {/* Feature 3 */}
                            <Link href="/security" className="group relative overflow-hidden p-8 border border-border bg-background hover:border-white/20 transition-all rounded-xl block">
                                <div className="relative z-10">
                                    <div className="mb-4 inline-flex p-3 rounded-lg bg-muted border border-border text-yellow-400">
                                        <ShieldAlert className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground font-manrope mb-2">Cybersecurity Lab</h3>
                                    <p className="text-sm text-muted-foreground">Complete 5 structured hacking missions in a safe, guided virtual environment.</p>
                                </div>
                            </Link>

                            {/* Feature 4 */}
                            <Link href="/test-rag" className="group relative overflow-hidden p-8 border border-border bg-background hover:border-white/20 transition-all rounded-xl block">
                                <div className="relative z-10">
                                    <div className="mb-4 inline-flex p-3 rounded-lg bg-muted border border-border text-purple-400">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground font-manrope mb-2">Interactive Courses</h3>
                                    <p className="text-sm text-muted-foreground">Learn algorithms, data structures, and architecture through dynamic RAG AI generation.</p>
                                </div>
                            </Link>
                        </div>

                        {/* Secondary Features Grid (All other tools) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            <Link href="/test-ai" className="block w-full h-full">
                                <FeatureCard
                                    prompt="AI Code Mentor"
                                    title="Mentor"
                                    icon={<BrainCircuit className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/docs" className="block w-full h-full">
                                <FeatureCard
                                    prompt="Documentation"
                                    title="Docs"
                                    icon={<FileText className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/concierge" className="block w-full h-full">
                                <FeatureCard
                                    prompt="Concierge"
                                    title="Support"
                                    icon={<BrainCircuit className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/app-builder" className="block w-full h-full">
                                <FeatureCard
                                    prompt="AppBuilder"
                                    title="Build"
                                    icon={<Layers className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/ee-simulator" className="block w-full h-full">
                                <FeatureCard
                                    prompt="EE Simulation"
                                    title="Hardware"
                                    icon={<Cpu className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/architecture" className="block w-full h-full">
                                <FeatureCard
                                    prompt="Architecture"
                                    title="Design"
                                    icon={<Grid3X3 className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/game-builder" className="block w-full h-full">
                                <FeatureCard
                                    prompt="Unigame"
                                    title="Game Dev"
                                    icon={<Gamepad2 className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>

                            <Link href="/ppt-gen" className="block w-full h-full">
                                <FeatureCard
                                    prompt="PPT Generator"
                                    title="AI Slides"
                                    icon={<Bot className="w-12 h-12 text-[#ef233c] mb-4 mx-auto" />}
                                />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonial Banner */}
                <div className="w-full bg-[#ef233c] py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center gap-1 text-black mb-6">
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                            <Star className="w-6 h-6 fill-current" />
                        </div>
                        <div className="relative min-h-[200px] md:min-h-[160px] flex flex-col items-center">
                            <div key={currentTestimonial} className="animate-fade-up flex flex-col items-center w-full">
                                <h3 className="text-3xl md:text-5xl font-bold text-black font-manrope leading-tight mb-8 w-full">
                                    "{testimonials[currentTestimonial].text}"
                                </h3>
                                <div className="flex items-center justify-center gap-4">
                                    <div className="w-12 h-12 bg-background rounded-full overflow-hidden flex items-center justify-center shrink-0">
                                        <User className="text-foreground w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-black font-bold text-lg">{testimonials[currentTestimonial].name}</div>
                                        <div className="text-black/70 font-medium">{testimonials[currentTestimonial].role}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <section className="py-32 px-6 bg-background relative border-t border-border">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-5xl font-semibold text-foreground font-manrope mb-4">Simple, Transparent Pricing</h2>
                            <p className="text-muted-foreground mb-10">Start for free, unlock unlimited power when you need it.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Starter */}
                            <div className="p-8 border border-zinc-800 bg-background hover:border-zinc-700 transition-all rounded-xl flex flex-col">
                                <h3 className="text-xl font-bold font-manrope mb-2">Basic</h3>
                                <p className="text-muted-foreground text-sm mb-8 h-10">For students exploring programming basics.</p>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-muted-foreground">$</span>
                                    <span className="text-5xl font-bold text-foreground">0</span>
                                    <span className="text-muted-foreground text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Limited Code Executions</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Basic AI Mentoring</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Community Access</li>
                                </ul>
                                <button className="w-full py-3 px-4 bg-muted hover:bg-muted-foreground/20 text-foreground border border-border rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Get Started</button>
                            </div>

                            {/* Pro */}
                            <div className="relative p-8 border border-[#ef233c] bg-zinc-900/40 shadow-[0_0_30px_rgba(239,35,60,0.1)] rounded-xl flex flex-col scale-105 z-10">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ef233c] text-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Recommended</div>
                                <h3 className="text-xl font-bold font-manrope mb-2">Pro</h3>
                                <p className="text-muted-foreground text-sm mb-8 h-10">For serious learners and aspiring engineers.</p>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-muted-foreground">$</span>
                                    <span className="text-5xl font-bold text-foreground">15</span>
                                    <span className="text-muted-foreground text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Unlimited Executions</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Advanced GPT-4 Mentoring</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Cybersecurity Labs Access</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Priority Support</li>
                                </ul>
                                <button className="w-full py-3 px-4 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Go Pro</button>
                            </div>

                            {/* Team */}
                            <div className="p-8 border border-zinc-800 bg-background hover:border-zinc-700 transition-all rounded-xl flex flex-col">
                                <h3 className="text-xl font-bold font-manrope mb-2">University</h3>
                                <p className="text-muted-foreground text-sm mb-8 h-10">For academic institutions and bootcamps.</p>
                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-muted-foreground">$</span>
                                    <span className="text-5xl font-bold text-foreground">499</span>
                                    <span className="text-muted-foreground text-sm">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> 100+ Student Licenses</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Custom Curriculum Integration</li>
                                    <li className="flex items-center gap-3 text-sm text-muted-foreground"><Check className="w-4 h-4 text-[#ef233c]" /> Analytics Dashboard</li>
                                </ul>
                                <button className="w-full py-3 px-4 bg-muted hover:bg-muted-foreground/20 text-foreground border border-border rounded-lg text-sm font-bold uppercase tracking-wider transition-all">Contact Sales</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Waitlist */}
                <section className="py-32 px-6 text-center bg-zinc-950/40">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-bold font-manrope mb-8 tracking-tighter">Ready to <span className="text-[#ef233c]">Build?</span></h2>
                        <p className="text-xl text-muted-foreground mb-12">Create an account today and get instant access to our next generation of learning tools.</p>

                        <form className="max-w-md mx-auto flex flex-col gap-6 items-center" onSubmit={(e) => e.preventDefault()}>
                            <div className="w-full flex justify-center">
                                <SearchInput placeholder="Enter your email to join..." />
                            </div>
                            <div className="flex items-center gap-2 mt-4 scale-75 origin-top">
                                <HoloCheckbox checked={true} />
                                <span className="text-sm text-muted-foreground">Subscribe to beta updates</span>
                            </div>
                            <button className="bg-[#ef233c] hover:bg-red-700 text-foreground font-bold rounded-full px-8 py-4 transition-all whitespace-nowrap mt-4">Join Now</button>
                        </form>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-background border-t border-zinc-900 pt-20 pb-10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-24 relative z-10">
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-5 h-5 bg-[#ef233c] rounded-sm rotate-45"></div>
                            <span className="text-2xl font-bold font-manrope tracking-tight">Unicode</span>
                        </div>
                        <p className="text-muted-foreground max-w-xs leading-relaxed">Pioneering the future of computer science education with artificial intelligence and hands-on environments.</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-[#ef233c] uppercase tracking-widest mb-6">Platform</h4>
                        <ul className="space-y-4 text-muted-foreground text-sm">
                            <li><Link href="/ide" className="hover:text-foreground transition-colors">Cloud IDE</Link></li>
                            <li><Link href="/linux" className="hover:text-foreground transition-colors">Linux Sim</Link></li>
                            <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                            <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-[#ef233c] uppercase tracking-widest mb-6">Company</h4>
                        <ul className="space-y-4 text-muted-foreground text-sm">
                            <li><Link href="/vision" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/architecture" className="hover:text-foreground transition-colors">Architecture</Link></li>
                            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Huge Footer Text */}
                <div className="flex justify-center items-center py-10 opacity-[0.03] pointer-events-none">
                    <h1 className="text-[15vw] leading-none font-bold font-manrope tracking-tighter select-none">UNICODE</h1>
                </div>

                <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-zinc-600 text-[10px] uppercase tracking-widest">
                    <p>&copy; 2026 Unicode Platform Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-muted-foreground">Twitter</a>
                        <a href="#" className="hover:text-muted-foreground">LinkedIn</a>
                        <a href="#" className="hover:text-muted-foreground">GitHub</a>
                    </div>
                </div>
            </footer>

            {/* Help Widget */}
            <HelpWidget />
        </div>
    )
}
