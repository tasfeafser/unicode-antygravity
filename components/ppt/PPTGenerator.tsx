'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Sparkles, Download, FileText, Presentation, CheckCircle2,
  ChevronRight, Loader2, Play, Eye, X, FolderOpen, Clock,
  Cpu, Zap, FileType, BookOpen
} from 'lucide-react'

// ── Pre-stored "AI-generated" content library ─────────────────────────────────
// User adds their slides/docs here. When selected, they appear to be AI-generated.
const CONTENT_LIBRARY: Record<string, {
  label: string
  type: 'pptx' | 'docx'
  category: string
  icon: JSX.Element
  slides?: { title: string; bullets: string[] }[]
  docContent?: string[]
  pages?: number
}> = {
  'linux-fundamentals': {
    label: 'Linux Fundamentals',
    type: 'pptx',
    category: 'Operating Systems',
    icon: <FileType className="w-4 h-4 text-orange-400" />,
    pages: 12,
    slides: [
      { title: 'Introduction to Linux', bullets: ['Open-source Unix-like OS', 'Created by Linus Torvalds (1991)', 'Powers 96.3% of the top 1M web servers', 'Android, ChromeOS are Linux-based'] },
      { title: 'File System Hierarchy', bullets: ['/ — Root directory', '/home — User home dirs', '/etc — System configs', '/var — Variable data (logs)', '/bin — Essential binaries'] },
      { title: 'Essential Commands', bullets: ['ls, cd, pwd — Navigation', 'cp, mv, rm — File operations', 'chmod, chown — Permissions', 'ps, top, kill — Processes', 'grep, find, awk — Search & filter'] },
      { title: 'File Permissions', bullets: ['rwxrwxrwx — User, Group, Others', 'chmod 755 — Common web dir perms', 'chmod 644 — Common file perms', 'SUID, SGID, Sticky Bit', 'chown user:group file'] },
      { title: 'Network Commands', bullets: ['ifconfig / ip addr — Network interfaces', 'ping — Test connectivity', 'netstat / ss — Active connections', 'curl / wget — HTTP requests', 'ssh — Secure remote access'] },
      { title: 'Package Management', bullets: ['apt-get / apt — Debian/Ubuntu', 'yum / dnf — Red Hat/CentOS', 'pacman — Arch Linux', 'pip — Python packages', 'npm — Node.js packages'] },
    ]
  },
  'cybersecurity-intro': {
    label: 'Cybersecurity Fundamentals',
    type: 'pptx',
    category: 'Security',
    icon: <FileType className="w-4 h-4 text-red-400" />,
    pages: 15,
    slides: [
      { title: 'What is Cybersecurity?', bullets: ['Practice of protecting systems from digital attacks', 'CIA Triad: Confidentiality, Integrity, Availability', 'Threat actors: Hackers, Insiders, Nation-states', 'Attack surface: Network, Application, Human'] },
      { title: 'Common Attack Vectors', bullets: ['Phishing — Social engineering via email', 'SQL Injection — Database manipulation', 'XSS — Cross-site scripting', 'MITM — Man-in-the-middle attacks', 'Ransomware — Data encryption extortion'] },
      { title: 'Network Reconnaissance', bullets: ['nmap — Port scanning & service detection', 'whois — Domain registration lookup', 'traceroute — Network path mapping', 'Passive OSINT — Public data gathering', 'Active scanning — Direct interaction'] },
      { title: 'Password Security', bullets: ['Brute force vs Dictionary attacks', 'hashcat — GPU-accelerated cracking', 'john — CPU-based password cracking', 'Rainbow tables — Precomputed hashes', 'Salting — Defense against rainbow tables'] },
      { title: 'Penetration Testing Phases', bullets: ['1. Planning & Reconnaissance', '2. Scanning & Enumeration', '3. Exploitation', '4. Post-Exploitation & Persistence', '5. Reporting'] },
    ]
  },
  'python-programming': {
    label: 'Python Programming Basics',
    type: 'pptx',
    category: 'Programming',
    icon: <FileType className="w-4 h-4 text-yellow-400" />,
    pages: 18,
    slides: [
      { title: 'Why Python?', bullets: ['Simple, readable syntax', 'Massive ecosystem (PyPI: 400k+ packages)', 'Used in AI/ML, Web, Scripting, Science', 'Interpreted — No compilation step', 'Dynamic typing — Flexible & fast to write'] },
      { title: 'Python Data Types', bullets: ['int, float — Numbers', 'str — Strings (immutable)', 'list — Ordered, mutable sequence', 'dict — Key-value mappings', 'tuple — Ordered, immutable', 'set — Unique unordered elements'] },
      { title: 'Control Flow', bullets: ['if/elif/else — Conditionals', 'for loop — Iterate over sequences', 'while loop — Condition-based', 'break, continue, pass — Loop control', 'List comprehensions — Concise loops'] },
      { title: 'Functions & Scope', bullets: ['def — Function definition', '*args, **kwargs — Variable arguments', 'Lambda — Anonymous functions', 'LEGB rule — Local, Enclosing, Global, Built-in', 'Decorators — Higher-order functions'] },
      { title: 'OOP in Python', bullets: ['class — Define blueprints', '__init__ — Constructor method', 'Inheritance — Reuse parent class', 'Polymorphism — Override methods', 'Dunder methods — __str__, __len__, etc'] },
    ]
  },
  'networking-basics': {
    label: 'Computer Networking',
    type: 'pptx',
    category: 'Networking',
    icon: <FileType className="w-4 h-4 text-blue-400" />,
    pages: 14,
    slides: [
      { title: 'OSI Model Overview', bullets: ['Layer 7: Application — HTTP, DNS, SMTP', 'Layer 6: Presentation — SSL, Encryption', 'Layer 5: Session — Connection management', 'Layer 4: Transport — TCP, UDP', 'Layer 3: Network — IP, Routing'] },
      { title: 'TCP vs UDP', bullets: ['TCP — Connection-oriented, reliable', 'UDP — Connectionless, fast', 'TCP uses 3-way handshake (SYN/SYN-ACK/ACK)', 'UDP used for DNS, video streaming', 'TCP used for HTTP, email, file transfer'] },
      { title: 'IP Addressing', bullets: ['IPv4 — 32-bit addresses (4.3B)', 'IPv6 — 128-bit (340 undecillion)', 'Public vs Private IP ranges', 'CIDR notation: 192.168.1.0/24', 'Subnetting — Dividing networks'] },
      { title: 'DNS System', bullets: ['Domain Name System — Phonebook of internet', 'A record — maps domain to IP', 'AAAA record — IPv6 mapping', 'MX record — Mail server', 'CNAME — Alias records'] },
    ]
  },
  'data-structures': {
    label: 'Data Structures & Algorithms',
    type: 'pptx',
    category: 'CS Theory',
    icon: <FileType className="w-4 h-4 text-green-400" />,
    pages: 20,
    slides: [
      { title: 'Big O Notation', bullets: ['O(1) — Constant time', 'O(log n) — Binary search', 'O(n) — Linear scan', 'O(n log n) — Merge sort', 'O(n²) — Bubble sort'] },
      { title: 'Arrays & Linked Lists', bullets: ['Array: O(1) access, O(n) insert', 'Linked List: O(n) access, O(1) insert', 'Doubly Linked — prev & next pointers', 'Dynamic arrays — Amortized O(1) append', 'Use arrays for frequent random access'] },
      { title: 'Trees & Graphs', bullets: ['Binary Tree — Max 2 children per node', 'BST — Left < Root < Right', 'BFS — Level-by-level traversal', 'DFS — Depth-first (pre/in/post-order)', 'Graph: directed, undirected, weighted'] },
      { title: 'Sorting Algorithms', bullets: ['Bubble Sort: O(n²) — simple but slow', 'Merge Sort: O(n log n) — stable', 'Quick Sort: O(n log n) avg — in-place', 'Heap Sort: O(n log n) — no extra space', 'Radix Sort: O(nk) — for integers'] },
    ]
  },
  'web-dev-guide': {
    label: 'Web Development Guide',
    type: 'docx',
    category: 'Web Dev',
    icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
    pages: 8,
    docContent: [
      '# Web Development Complete Guide',
      '## 1. HTML Fundamentals',
      'HTML (HyperText Markup Language) is the skeleton of every web page. Use semantic tags like <header>, <main>, <section>, <article>, <footer> to create accessible, SEO-friendly markup.',
      '## 2. CSS & Modern Styling',
      'CSS Grid and Flexbox are the foundations of modern layouts. Pair with CSS Variables (custom properties) for a consistent design system. Use transitions and animations to create premium UIs.',
      '## 3. JavaScript Essentials',
      'Understand the event loop, async/await, Promises, and DOM manipulation. Modern JS (ES2022+) includes optional chaining ?., nullish coalescing ??, and top-level await.',
      '## 4. React & Next.js',
      'React introduces component-based architecture. Next.js adds SSR, SSG, file-based routing, and API routes. App Router (Next.js 13+) uses React Server Components.',
      '## 5. Backend & APIs',
      'REST vs GraphQL. Express.js for Node backends. Supabase / Prisma for database ORM. Authentication with Clerk, NextAuth, or JWT.',
    ]
  },
}

// ── Streaming AI Effect ───────────────────────────────────────────────────────
function useStreamingText(lines: string[], isActive: boolean) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!isActive) { setDisplayed([]); setCurrentLine(0); setCurrentChar(0); return }

    const tick = () => {
      setCurrentLine(cl => {
        if (cl >= lines.length) return cl
        const line = lines[cl]
        setCurrentChar(cc => {
          if (cc >= line.length) {
            setDisplayed(d => [...d, line])
            setCurrentLine(prev => prev + 1)
            setCurrentChar(0)
            timerRef.current = setTimeout(tick, 80)
            return 0
          }
          timerRef.current = setTimeout(tick, 18)
          return cc + 1
        })
        return cl
      })
    }
    timerRef.current = setTimeout(tick, 120)
    return () => clearTimeout(timerRef.current)
  }, [isActive, lines])

  const inProgress = currentLine < lines.length ? lines[currentLine]?.slice(0, currentChar) : ''
  return { displayed, inProgress, done: currentLine >= lines.length }
}

// ── Slide Preview ─────────────────────────────────────────────────────────────
function SlidePreview({ slides }: { slides: { title: string; bullets: string[] }[] }) {
  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div className="flex gap-3 h-full">
      {/* Thumbnails */}
      <div className="w-28 flex-shrink-0 space-y-2 overflow-y-auto">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setActiveSlide(i)}
            className={`w-full aspect-video rounded border text-left p-1.5 transition-all text-[8px] ${
              activeSlide === i
                ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                : 'border-white/10 bg-white/3 hover:border-white/25'
            }`}
          >
            <div className="font-bold text-white/80 leading-tight mb-1 line-clamp-2">{s.title}</div>
            <div className="w-8 h-px bg-purple-500/50 mb-1" />
            {s.bullets.slice(0, 2).map((b, bi) => (
              <div key={bi} className="text-white/30 leading-tight flex gap-0.5">
                <span>·</span><span className="line-clamp-1">{b}</span>
              </div>
            ))}
          </button>
        ))}
      </div>

      {/* Main slide */}
      <div className="flex-1 bg-gradient-to-br from-[#1a0a2e] to-[#0a0a1a] border border-purple-500/20 rounded-xl p-8 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute top-4 right-4 text-[10px] text-purple-400/40 font-mono">
          {activeSlide + 1} / {slides.length}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500" />
            <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">Unicode AI</span>
          </div>
          <h2 className="text-2xl font-black text-white mb-6 leading-tight">
            {slides[activeSlide].title}
          </h2>
          <ul className="space-y-2.5">
            {slides[activeSlide].bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function PPTGenerator() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'streaming' | 'done'>('idle')
  const [showPreview, setShowPreview] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)

  const selected = selectedKey ? CONTENT_LIBRARY[selectedKey] : null

  // Build streaming log lines from slide content
  const streamLines = selected?.slides?.flatMap(s => [
    `✦ Generating slide: "${s.title}"`,
    ...s.bullets.map(b => `  → ${b}`),
    '',
  ]) ?? selected?.docContent ?? []

  const { displayed, inProgress, done: streamDone } = useStreamingText(
    streamLines,
    phase === 'streaming'
  )

  const handleGenerate = async () => {
    if (!selected) return
    setIsGenerating(true)
    setPhase('thinking')
    setShowPreview(false)
    setDownloadReady(false)

    // Simulate AI "thinking"
    await new Promise(r => setTimeout(r, 1800))
    setPhase('streaming')

    // Wait for streaming to complete
    const expectedMs = streamLines.length * 100 + 2000
    await new Promise(r => setTimeout(r, expectedMs))

    setPhase('done')
    setDownloadReady(true)
    setIsGenerating(false)
  }

  const handleDownload = async () => {
    if (!selected) return

    // Build a real PPTX using pptxgenjs (client-side)
    try {
      const pptxgen = (await import('pptxgenjs')).default
      const prs = new pptxgen()

      prs.defineLayout({ name: 'UNICODE', width: 10, height: 5.63 })
      prs.layout = 'UNICODE'

      const slides = selected.slides || [{ title: selected.label, bullets: selected.docContent || [] }]

      slides.forEach((slideData) => {
        const slide = prs.addSlide()

        // Dark gradient background
        slide.background = { fill: '0d0820' }

        // Accent line
        slide.addShape(prs.ShapeType.rect, {
          x: 0, y: 0, w: 0.08, h: 5.63, fill: { color: 'a855f7' }
        })
        slide.addShape(prs.ShapeType.rect, {
          x: 0, y: 5.3, w: 10, h: 0.04, fill: { color: '7c3aed' }
        })

        // Slide number
        slide.addText(`${slides.indexOf(slideData) + 1}`, {
          x: 9.2, y: 0.1, w: 0.7, h: 0.3, fontSize: 8, color: '6d28d9', align: 'right'
        })

        // Title
        slide.addText(slideData.title, {
          x: 0.4, y: 0.5, w: 9.2, h: 0.9,
          fontSize: 28, bold: true, color: 'ffffff',
          fontFace: 'Arial'
        })

        // Bullets
        slideData.bullets.forEach((bullet, bi) => {
          slide.addText(bullet, {
            x: 0.6, y: 1.6 + bi * 0.65, w: 8.8, h: 0.55,
            fontSize: 13, color: 'c4b5fd',
            bullet: { type: 'bullet' },
            fontFace: 'Arial'
          })
        })

        // Watermark
        slide.addText('Unicode Platform © AI-Generated', {
          x: 0, y: 5.4, w: 10, h: 0.25,
          fontSize: 7, color: '4c1d95', align: 'center'
        })
      })

      await prs.writeFile({ fileName: `${selected.label.replace(/\s+/g, '_')}_unicode.pptx` })
    } catch (err) {
      console.error('PPTX download error:', err)
      // Fallback: create a simple text file
      const content = (selected.slides || []).map(s =>
        `== ${s.title} ==\n${s.bullets.join('\n')}`
      ).join('\n\n')
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url
      a.download = `${selected.label}.txt`; a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080f] flex flex-col items-center justify-start pt-12 pb-24 px-4">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-widest uppercase">
          <Sparkles size={12} />
          AI Presentation Generator
        </div>
        <h1 className="text-5xl font-black text-white mb-4 leading-tight">
          Generate{' '}
          <span className="gradient-text-animate">with AI</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Select a topic from your library. Watch AI build your slides in real-time.
        </p>
      </div>

      {/* Content grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: Library selector ── */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <FolderOpen size={14} className="text-purple-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Library</span>
          </div>

          {Object.entries(CONTENT_LIBRARY).map(([key, item]) => (
            <button
              key={key}
              onClick={() => { setSelectedKey(key); setPhase('idle'); setShowPreview(false); setDownloadReady(false) }}
              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group ${
                selectedKey === key
                  ? 'bg-purple-500/12 border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.12)]'
                  : 'bg-white/3 border-white/8 hover:border-white/20 hover:bg-white/6'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  selectedKey === key ? 'bg-purple-500/20' : 'bg-white/5'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-white truncate">{item.label}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                      item.type === 'pptx'
                        ? 'text-orange-400 border-orange-500/30 bg-orange-500/10'
                        : 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10'
                    }`}>
                      {item.type.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                    <span className="text-[10px] text-slate-600">·</span>
                    <span className="text-[10px] text-slate-500">{item.pages} pages</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* ── Right: Generator panel ── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 rounded-2xl border border-white/6 bg-white/2">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4">
                <FolderOpen className="w-7 h-7 text-purple-400/60" />
              </div>
              <p className="text-slate-500 text-sm">Select a topic from your library to begin</p>
            </div>
          ) : (
            <>
              {/* Selection confirmed */}
              <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selected.icon}
                  <div>
                    <div className="text-sm font-bold text-white">{selected.label}</div>
                    <div className="text-xs text-slate-500">{selected.category} · {selected.pages} pages · {selected.type.toUpperCase()}</div>
                  </div>
                </div>
                <button onClick={() => { setSelectedKey(null); setPhase('idle') }} className="text-slate-600 hover:text-slate-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Generate button */}
              {phase === 'idle' && (
                <button
                  onClick={handleGenerate}
                  className="group relative overflow-hidden w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-bold text-lg transition-all duration-300 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                    Generate with AI
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 shimmer-bg" />
                </button>
              )}

              {/* Thinking state */}
              {phase === 'thinking' && (
                <div className="flex flex-col items-center justify-center py-8 gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                  <div className="relative">
                    <Cpu className="w-10 h-10 text-purple-400 animate-pulse" />
                    <div className="absolute -inset-2 rounded-full border border-purple-500/30 animate-ping" />
                  </div>
                  <div className="text-sm text-purple-300 font-medium">AI is analyzing your topic...</div>
                  <div className="flex gap-1.5">
                    {[0,1,2,3,4].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Streaming output */}
              {(phase === 'streaming' || phase === 'done') && (
                <div className="rounded-xl border border-purple-500/20 bg-[#0a0818] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-purple-900/40 bg-purple-900/20">
                    <div className="flex items-center gap-2">
                      <Zap size={13} className={`text-purple-400 ${phase === 'streaming' ? 'animate-pulse' : ''}`} />
                      <span className="text-xs font-mono text-purple-300">
                        {phase === 'streaming' ? 'Generating slides...' : '✓ Generation complete'}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full bg-purple-400 ${phase === 'streaming' ? 'animate-bounce' : 'opacity-30'}`}
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                  <div className="p-4 font-mono text-xs h-52 overflow-y-auto space-y-0.5 custom-scroll">
                    {displayed.map((line, i) => (
                      <div key={i} className={`leading-5 ${
                        line.startsWith('✦') ? 'text-purple-300 font-bold mt-2' :
                        line.startsWith('  →') ? 'text-slate-400 pl-2' :
                        'text-slate-600'
                      }`}>
                        {line}
                      </div>
                    ))}
                    {inProgress && (
                      <div className="text-purple-300 font-bold typing-cursor">{inProgress}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Done actions */}
              {phase === 'done' && downloadReady && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/8 border border-green-500/20">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-sm text-green-300 font-medium">
                      {selected.label} — {selected.pages} slides ready!
                    </span>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleDownload}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold transition-all hover:-translate-y-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                    >
                      <Download className="w-4 h-4" />
                      Download .PPTX
                    </button>
                    {selected.slides && (
                      <button
                        onClick={() => setShowPreview(p => !p)}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/6 border border-white/15 hover:bg-white/10 text-white font-bold transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        {showPreview ? 'Hide' : 'Preview Slides'}
                      </button>
                    )}
                  </div>

                  {/* Regenerate */}
                  <button
                    onClick={handleGenerate}
                    className="w-full py-2.5 rounded-xl border border-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles size={13} /> Regenerate
                  </button>
                </div>
              )}

              {/* Slide Preview */}
              {showPreview && selected.slides && (
                <div className="h-64 rounded-xl border border-white/10 overflow-hidden">
                  <SlidePreview slides={selected.slides} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
