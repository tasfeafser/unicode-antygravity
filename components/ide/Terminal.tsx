'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { CanvasAddon } from 'xterm-addon-canvas'
import 'xterm/css/xterm.css'

interface TerminalProps {
  output: string
  isExecuting?: boolean
}

const TYPING_SPEED_MS = 4 // ms per char for fast typewriter

export function Terminal({ output, isExecuting }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerminal | null>(null)
  const [isReady, setIsReady] = useState(false)
  const typingTimer = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new XTerminal({
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        selectionBackground: '#264f78',
        black: '#161b22',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: 13,
      lineHeight: 1.5,
      convertEol: true,
      cursorBlink: true,
      cursorStyle: 'block',
      allowProposedApi: true,
    })

    const fitAddon = new FitAddon()

    const openTimeout = setTimeout(() => {
      if (!terminalRef.current || xtermRef.current) return
      try {
        term.open(terminalRef.current)
        term.loadAddon(fitAddon)
        try { term.loadAddon(new CanvasAddon()) } catch (_) {}
        xtermRef.current = term
        setIsReady(true)
        requestAnimationFrame(() => {
          if (terminalRef.current?.offsetHeight) fitAddon.fit()
        })

        // Welcome banner
        term.writeln('\x1b[38;5;57m╔═══════════════════════════════════════╗\x1b[0m')
        term.writeln('\x1b[38;5;57m║\x1b[0m   \x1b[1;36mUnicode IDE\x1b[0m  \x1b[38;5;240mv2.0 — Ready\x1b[0m          \x1b[38;5;57m║\x1b[0m')
        term.writeln('\x1b[38;5;57m╚═══════════════════════════════════════╝\x1b[0m')
        term.writeln('')
        term.write('\x1b[32m▶\x1b[0m \x1b[38;5;240mPress \x1b[1;37mRun\x1b[0m \x1b[38;5;240mto execute your code...\x1b[0m ')
      } catch (err) {
        console.error('IDE Terminal open failed:', err)
      }
    }, 50)

    const ro = new ResizeObserver(() => {
      if (xtermRef.current && terminalRef.current?.offsetHeight) {
        try { fitAddon.fit() } catch (_) {}
      }
    })
    ro.observe(terminalRef.current)

    return () => {
      clearTimeout(openTimeout)
      clearTimeout(typingTimer.current)
      ro.disconnect()
      if (xtermRef.current) { try { xtermRef.current.dispose() } catch (_) {}; xtermRef.current = null }
      try { term.dispose() } catch (_) {}
    }
  }, [])

  // Typewriter output effect
  useEffect(() => {
    const term = xtermRef.current
    if (!term || !isReady) return
    clearTimeout(typingTimer.current)

    if (isExecuting) {
      term.clear()
      term.writeln('\x1b[38;5;240m─────────────────────────────────────\x1b[0m')
      term.write('\x1b[33m⏳ Executing')
      let dots = 0
      const dotTimer = setInterval(() => {
        term.write('.')
        dots++
        if (dots > 5) clearInterval(dotTimer)
      }, 220)
      typingTimer.current = setTimeout(() => clearInterval(dotTimer), 2000)
      return
    }

    if (!output) {
      term.clear()
      term.writeln('\x1b[38;5;57m╔═══════════════════════════════════════╗\x1b[0m')
      term.writeln('\x1b[38;5;57m║\x1b[0m   \x1b[1;36mUnicode IDE\x1b[0m  \x1b[38;5;240mv2.0 — Ready\x1b[0m          \x1b[38;5;57m║\x1b[0m')
      term.writeln('\x1b[38;5;57m╚═══════════════════════════════════════╝\x1b[0m')
      term.writeln('')
      term.write('\x1b[32m▶\x1b[0m \x1b[38;5;240mPress \x1b[1;37mRun\x1b[0m \x1b[38;5;240mto execute your code...\x1b[0m ')
      return
    }

    // Animate output line-by-line
    term.clear()
    term.writeln('')
    term.writeln('\x1b[38;5;240m─────────────── Output ───────────────\x1b[0m')

    const lines = output.split('\n')
    let lineIdx = 0

    const writeNextLine = () => {
      if (!xtermRef.current) return
      if (lineIdx >= lines.length) {
        term.writeln('')
        term.writeln('\x1b[38;5;240m─────────────────────────────────────\x1b[0m')
        term.write(`\x1b[32m✓\x1b[0m \x1b[38;5;240municode-vm ~ $\x1b[0m `)
        return
      }
      const line = lines[lineIdx++]
      term.writeln(line)
      typingTimer.current = setTimeout(writeNextLine, 30)
    }
    typingTimer.current = setTimeout(writeNextLine, 100)

  }, [output, isExecuting, isReady])

  return (
    <div className="w-full h-full flex flex-col">
      {/* Terminal tab bar */}
      <div className="flex items-center gap-0 bg-[#0d1117] border-b border-[#21262d] shrink-0">
        <div className="flex items-center gap-2 px-4 py-1.5 border-r border-[#21262d] bg-[#161b22]">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[11px] font-mono text-slate-400">Terminal</span>
        </div>
      </div>
      <div ref={terminalRef} className="flex-1 w-full bg-[#0d1117]" />
    </div>
  )
}
