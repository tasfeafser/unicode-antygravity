'use client'

import { useUser, UserButton, SignInButton, SignUpButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { ThemeSwitch } from '@/components/ui/ThemeSwitch'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ArrowRight, Bot, Code2, ShieldAlert } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function LightNeoBrutalistHome() {
  const { isSignedIn, isLoaded } = useUser()
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setMounted(true)
    
    // Custom cursor logic
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F8F4E8] text-[#09090B] font-space relative overflow-x-hidden">
        {/* Custom Interactive Cursor */}
        <div 
          className="neo-cursor"
          style={{ 
            left: mousePos.x - 16, 
            top: mousePos.y - 16,
            transform: `scale(${isHovering ? 2.5 : 1})`
          }}
        ></div>

        {/* Sticky Navigation */}
        <div className="fixed top-0 left-0 w-full z-50 pt-4 px-4">
            <nav className="max-w-7xl mx-auto flex items-center justify-between bg-[#F8F4E8]/90 backdrop-blur-xl border-2 border-[#09090B] rounded-xl px-6 py-4" style={{ boxShadow: '4px 4px 0px 0px #09090B' }}>
                <div className="flex items-center gap-2">
                    <Image src="/logo.png" alt="Unicode" width={32} height={32} className="rounded-md" />
                    <span className="text-2xl font-dela tracking-tighter uppercase glitch-hover">Unicode</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8 font-bold uppercase tracking-wider">
                    <Link href="/ide" className="hover:text-[#D2E823] hover:bg-[#09090B] px-3 py-1 rounded transition-colors" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>{t('nav.ide')}</Link>
                    <Link href="/linux" className="hover:text-[#D2E823] hover:bg-[#09090B] px-3 py-1 rounded transition-colors" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>{t('nav.linux')}</Link>
                    <Link href="/test-rag" className="hover:text-[#D2E823] hover:bg-[#09090B] px-3 py-1 rounded transition-colors" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>{t('nav.courses')}</Link>
                </div>

                <div className="flex items-center gap-4" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                    <LanguageToggle />
                    <ThemeSwitch />
                    {!isLoaded ? (
                      <div className="w-20 h-8 bg-black/10 animate-pulse rounded-full" />
                    ) : isSignedIn ? (
                      <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 rounded-none border-2 border-black" } }}/>
                    ) : (
                      <>
                        <SignInButton mode="modal">
                          <button className="hidden md:block text-sm font-bold uppercase">{t('nav.login')}</button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                          <button className="neo-btn text-xs px-6 py-2">
                            {t('nav.getAccess')}
                          </button>
                        </SignUpButton>
                      </>
                    )}
                </div>
            </nav>
        </div>

        <main className="relative z-10 pt-32 px-6 pb-20 max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-32 items-center">
                {/* Left Side (7 cols) */}
                <div className="lg:col-span-7 flex flex-col items-start relative">
                    <div className="absolute -top-10 -left-10 w-24 h-8 bg-[#D2E823] border-2 border-[#09090B] rounded-full rotate-[-12deg] flex items-center justify-center font-bold text-xs uppercase" style={{ boxShadow: '2px 2px 0px 0px #09090B' }}>
                        Version 3.0
                    </div>
                    
                    <h1 className="text-[5rem] lg:text-[8rem] font-dela leading-[0.85] tracking-tighter uppercase mb-8 glitch-hover">
                        {t('light.hero.title1')}<br/>
                        <span className="text-[#D2E823]" style={{ WebkitTextStroke: '2px #09090B' }}>{t('light.hero.title2')}</span>
                    </h1>
                    
                    <p className="text-xl font-bold mb-10 max-w-lg border-l-4 border-[#09090B] pl-4">
                        {t('light.hero.desc')}
                    </p>
                    
                    <div className="flex gap-4">
                        <Link href="/ide" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <button className="neo-btn flex items-center gap-2 text-xl">
                                {t('light.hero.initiate')} <ArrowRight className="w-6 h-6" />
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Right Side (5 cols) */}
                <div className="lg:col-span-5 relative h-[500px]">
                    <div className="absolute inset-0 bg-[#09090B] rounded-[32px] border-2 border-[#09090B] overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px #09090B' }}>
                        <div className="w-full h-12 border-b-2 border-[#09090B] bg-[#F8F4E8] flex items-center gap-2 px-4">
                            <div className="w-3 h-3 rounded-full bg-[#09090B]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#09090B]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#09090B]"></div>
                        </div>
                        <div className="p-6 font-mono text-[#D2E823] text-sm">
                            <p className="mb-2">$ ./unicode_start.sh</p>
                            <p className="mb-2">Loading core modules...</p>
                            <p className="mb-2">[OK] Syntax highlighting loaded</p>
                            <p className="mb-2">[OK] AI Engine connected</p>
                            <p className="animate-pulse">Waiting for user input_</p>
                        </div>
                    </div>
                    
                    {/* Floating Asset */}
                    <div className="absolute -bottom-8 -left-8 bg-[#D2E823] border-2 border-[#09090B] p-6 w-48 animate-[bounce_4s_ease-in-out_infinite]" style={{ boxShadow: '8px 8px 0px 0px #09090B' }}>
                        <Code2 className="w-12 h-12 mb-4" />
                        <div className="font-dela uppercase text-xl">Raw<br/>Power</div>
                    </div>
                </div>
            </section>

            {/* Marquee */}
            <div className="w-[100vw] relative left-1/2 -translate-x-1/2 bg-[#D2E823] border-y-2 border-[#09090B] py-4 overflow-hidden mb-32 flex whitespace-nowrap" style={{ boxShadow: '0px 4px 0px 0px #09090B' }}>
                <div className="animate-[marquee_20s_linear_infinite] flex items-center gap-8 font-dela text-2xl uppercase tracking-tighter">
                    <span>* NEXT-GEN COMPILER *</span>
                    <span>NEURAL ASSISTANCE *</span>
                    <span>HARDCORE MODE *</span>
                    <span>LINUX SANDBOX *</span>
                    <span>* NEXT-GEN COMPILER *</span>
                    <span>NEURAL ASSISTANCE *</span>
                    <span>HARDCORE MODE *</span>
                    <span>LINUX SANDBOX *</span>
                </div>
            </div>

            {/* Bento Category Grid */}
            <section className="mb-32">
                <h2 className="font-dela text-5xl uppercase tracking-tighter mb-12 glitch-hover">{t('light.features.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                    {/* Large Card */}
                    <Link href="/ide" className="md:col-span-2 neo-card bg-[#09090B] text-[#F8F4E8] p-8 flex flex-col justify-between relative overflow-hidden group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <div className="relative z-10">
                            <h3 className="font-dela text-4xl uppercase mb-4 text-[#D2E823]">{t('light.features.ide')}</h3>
                            <p className="text-lg font-bold max-w-sm">{t('light.features.ideDesc')}</p>
                        </div>
                        <div className="relative z-10 self-end bg-[#D2E823] text-[#09090B] px-4 py-2 font-bold uppercase border-2 border-[#09090B]">{t('light.features.access')}</div>
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070')] bg-cover opacity-40 mix-blend-overlay grayscale"></div>
                    </Link>

                    {/* Small Cards */}
                    <div className="flex flex-col gap-6">
                        <Link href="/linux" className="neo-card p-6 flex-1 flex flex-col justify-between relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <div className="absolute inset-0 bg-[radial-gradient(#09090B_1px,transparent_1px)] bg-[size:20px_20px] opacity-10"></div>
                            <div className="relative z-10">
                                <h3 className="font-dela text-2xl uppercase mb-2">{t('light.features.linux')}</h3>
                                <p className="font-bold text-sm">{t('light.features.linuxDesc')}</p>
                            </div>
                            <ArrowRight className="relative z-10 self-end w-8 h-8" />
                        </Link>
                        
                        <Link href="/security" className="neo-card p-6 flex-1 flex flex-col justify-between bg-[#D2E823] relative" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <div className="relative z-10">
                                <ShieldAlert className="w-8 h-8 mb-4" />
                                <h3 className="font-dela text-2xl uppercase mb-2">{t('light.features.sec')}</h3>
                                <p className="font-bold text-sm">{t('light.features.secDesc')}</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Horizontal Scrolling Product Section */}
            <section className="mb-32">
                <div className="flex justify-between items-end mb-12 border-b-4 border-[#09090B] pb-4">
                    <h2 className="font-dela text-5xl uppercase tracking-tighter">New Drops</h2>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 border-2 border-[#09090B] flex items-center justify-center font-bold hover:bg-[#D2E823] transition-colors" style={{ boxShadow: '2px 2px 0px 0px #09090B' }}>←</button>
                        <button className="w-10 h-10 border-2 border-[#09090B] flex items-center justify-center font-bold hover:bg-[#D2E823] transition-colors" style={{ boxShadow: '2px 2px 0px 0px #09090B' }}>→</button>
                    </div>
                </div>

                <div className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar">
                    {/* Item 1 */}
                    <Link href="/app-builder" className="shrink-0 w-[320px] group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <div className="w-full aspect-square border-2 border-[#09090B] bg-white mb-4 relative overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px #09090B' }}>
                            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(#09090B_2px,transparent_2px)] bg-[size:16px_16px] opacity-20"></div>
                            <h3 className="absolute inset-0 flex items-center justify-center font-dela text-4xl uppercase rotate-[-10deg]">Builder</h3>
                        </div>
                        <div className="flex justify-between items-center font-bold uppercase border-2 border-[#09090B] p-2 bg-[#D2E823]">
                            <span>App Builder</span>
                            <span>v1.0</span>
                        </div>
                    </Link>

                    {/* Item 2 */}
                    <Link href="/ppt-gen" className="shrink-0 w-[320px] group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <div className="w-full aspect-square border-2 border-[#09090B] bg-[#09090B] text-[#F8F4E8] mb-4 relative overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px #09090B' }}>
                            <h3 className="absolute inset-0 flex items-center justify-center font-dela text-4xl uppercase rotate-[5deg] text-[#D2E823]">PPT AI</h3>
                        </div>
                        <div className="flex justify-between items-center font-bold uppercase border-2 border-[#09090B] p-2 bg-white">
                            <span>Slide Gen</span>
                            <span>Beta</span>
                        </div>
                    </Link>

                    {/* Item 3 */}
                    <Link href="https://rosebud.ai/#create-from-scratch-section" target="_blank" className="shrink-0 w-[320px] group" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                        <div className="w-full aspect-square border-2 border-[#09090B] bg-white mb-4 relative overflow-hidden" style={{ boxShadow: '8px 8px 0px 0px #09090B' }}>
                            <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(#09090B_2px,transparent_2px)] bg-[size:16px_16px] opacity-20"></div>
                            <h3 className="absolute inset-0 flex items-center justify-center font-dela text-4xl uppercase rotate-[12deg]">Game Dev</h3>
                        </div>
                        <div className="flex justify-between items-center font-bold uppercase border-2 border-[#09090B] p-2 bg-zinc-300">
                            <span>Unigame Engine</span>
                            <span>v1.0</span>
                        </div>
                    </Link>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="w-full bg-[#09090B] text-[#F8F4E8] border-t-4 border-[#09090B] py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4">
                    <h2 className="font-dela text-4xl uppercase tracking-tighter mb-6 text-[#D2E823]">Unicode</h2>
                    <p className="font-bold max-w-sm mb-8">Neo-brutalist education platform. No fluff. Just hard skills.</p>
                    
                    <form className="flex border-2 border-[#F8F4E8] p-1 bg-transparent max-w-sm">
                        <input type="email" placeholder="JOIN NEWSLETTER" className="flex-1 bg-transparent px-4 font-bold uppercase text-sm focus:outline-none text-[#F8F4E8] placeholder:text-zinc-500" />
                        <button className="bg-[#D2E823] text-[#09090B] font-bold uppercase px-6 py-2 border-2 border-[#09090B]">Submit</button>
                    </form>
                </div>
                
                <div className="md:col-span-2 md:col-start-7">
                    <h4 className="font-mono text-sm text-zinc-500 uppercase mb-6">Store</h4>
                    <ul className="space-y-4 font-bold uppercase tracking-wide">
                        <li><Link href="/pricing" className="hover:text-[#D2E823] transition-colors">Pricing</Link></li>
                        <li><Link href="/docs" className="hover:text-[#D2E823] transition-colors">Docs</Link></li>
                        <li><Link href="/ide" className="hover:text-[#D2E823] transition-colors">IDE</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-mono text-sm text-zinc-500 uppercase mb-6">Info</h4>
                    <ul className="space-y-4 font-bold uppercase tracking-wide">
                        <li><Link href="/vision" className="hover:text-[#D2E823] transition-colors">About</Link></li>
                        <li><Link href="/architecture" className="hover:text-[#D2E823] transition-colors">Architecture</Link></li>
                        <li><Link href="/legal/privacy" className="hover:text-[#D2E823] transition-colors">Privacy</Link></li>
                    </ul>
                </div>

                <div className="md:col-span-2">
                    <h4 className="font-mono text-sm text-zinc-500 uppercase mb-6">Social</h4>
                    <ul className="space-y-4 font-bold uppercase tracking-wide">
                        <li><a href="#" className="hover:text-[#D2E823] transition-colors">Twitter</a></li>
                        <li><a href="#" className="hover:text-[#D2E823] transition-colors">Github</a></li>
                        <li><a href="#" className="hover:text-[#D2E823] transition-colors">Discord</a></li>
                    </ul>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </footer>
    </div>
  )
}
