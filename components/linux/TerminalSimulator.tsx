'use client'

import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import { CanvasAddon } from 'xterm-addon-canvas'
import 'xterm/css/xterm.css'
import { VirtualFileSystem } from '@/lib/linux/filesystem'
import { CommandParser } from '@/lib/linux/parser'

interface TerminalSimulatorProps {
  onCommandRun: (cmd: string, output: string) => void
}

export function TerminalSimulator({ onCommandRun }: TerminalSimulatorProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerminal | null>(null)
  const [isReady, setIsReady] = useState(false)
  
  const stateRef = useRef({
    input: '',
    fs: new VirtualFileSystem(),
    parser: null as CommandParser | null
  })

  useEffect(() => {
    if (!terminalRef.current) return

    // Ensure state is initialized
    if (!stateRef.current.parser) {
      stateRef.current.parser = new CommandParser(stateRef.current.fs)
    }

    const term = new XTerminal({
      theme: { background: '#0F172A', foreground: '#E2E8F0', cursor: '#10B981' },
      fontFamily: 'var(--font-mono), monospace',
      fontSize: 15,
      cursorBlink: true,
      convertEol: true,
      // Disable cursor blinking if it's contributing to refresh crashes
      allowProposedApi: true
    })

    const fitAddon = new FitAddon()
    const canvasAddon = new CanvasAddon()
    
    // IMPORTANT: Delay open until next tick to ensure container is fully ready
    const openTimeout = setTimeout(() => {
      if (!terminalRef.current) return
      
      try {
        term.open(terminalRef.current)
        term.loadAddon(fitAddon)
        term.loadAddon(canvasAddon)
        
        xtermRef.current = term
        setIsReady(true)

        // Initial fit
        setTimeout(() => {
          if (terminalRef.current?.offsetHeight && terminalRef.current?.offsetWidth) {
            fitAddon.fit()
            term.focus() // Auto-focus ensures keystrokes are grabbed immediately
          }
        }, 100)
      } catch (err) {
        console.error('Xterm open failed:', err)
      }
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      if (xtermRef.current && terminalRef.current?.offsetHeight && terminalRef.current?.offsetWidth) {
        try {
          fitAddon.fit()
        } catch (e) {
          // Silence dimensions errors
        }
      }
    })
    
    resizeObserver.observe(terminalRef.current)
    
    // Key event listener
    const keyHandler = term.onKey(({ key, domEvent }) => {
      const state = stateRef.current
      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey

      if (domEvent.keyCode === 13) {
        term.write('\r\n')
        if (state.input.trim()) {
          const result = state.parser!.execute(state.input)
          if (result.output) {
            if (result.error) term.write('\x1b[31m')
            term.write(result.output.replace(/\n/g, '\r\n') + '\r\n')
            if (result.error) term.write('\x1b[0m')
          }
          onCommandRun(state.input, result.output)
        }
        state.input = ''
        promptUser(term)

      } else if (domEvent.keyCode === 8) {
        if (state.input.length > 0) {
          state.input = state.input.substring(0, state.input.length - 1)
          term.write('\b \b')
        }
      } else if (printable) {
        state.input += key
        term.write(key)
      }
    })

    // Initial greeting after a small delay
    const greetingTimeout = setTimeout(() => {
      term.writeln('\x1b[1;36mWelcome to Unicode OS v1.0 LTS (GNU/Linux 5.15.0 x86_64)\x1b[0m')
      term.writeln(' * Documentation:  man intro')
      term.writeln(' * Management:     https://unicode.platform')
      term.writeln(' * Support:        https://unicode.help')
      term.writeln('')
      promptUser(term)
    }, 200)

    return () => {
      clearTimeout(openTimeout)
      clearTimeout(greetingTimeout)
      keyHandler.dispose()
      resizeObserver.disconnect()
      if (xtermRef.current) {
        try {
          xtermRef.current.dispose()
        } catch (e) {}
        xtermRef.current = null
      } else {
        try {
          term.dispose()
        } catch (e) {}
      }
    }
  }, [])

  const promptUser = (term: XTerminal) => {
    const state = stateRef.current
    let pwd = state.fs.getPwd()
    if (pwd === '/home/student') pwd = '~'
    term.write(`\x1b[1;32mstudent@unicode\x1b[0m:\x1b[1;34m${pwd}\x1b[0m$ `)
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-slate-700">
      <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-xs font-mono text-slate-400">student@unicode: ~</span>
      </div>
      <div ref={terminalRef} className="h-[calc(100%-40px)] w-full p-4 bg-[#0F172A]" />
    </div>
  )
}
