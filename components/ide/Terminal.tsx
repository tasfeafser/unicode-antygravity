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

export function Terminal({ output, isExecuting }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const xtermRef = useRef<XTerminal | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!terminalRef.current) return

    const term = new XTerminal({
      theme: {
        background: '#1e1e1e',
        foreground: '#e0e0e0',
        cursor: '#ffffff'
      },
      fontFamily: 'var(--font-mono), monospace',
      fontSize: 14,
      convertEol: true,
      cursorBlink: true,
      allowProposedApi: true
    })

    const fitAddon = new FitAddon()
    const canvasAddon = new CanvasAddon()
    
    // IMPORTANT: Use setTimeout to ensure container is fully ready in DOM
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
          }
        }, 100)
      } catch (err) {
        console.error('IDE Terminal open failed:', err)
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

    return () => {
      clearTimeout(openTimeout)
      resizeObserver.disconnect()
      term.dispose()
      xtermRef.current = null
    }
  }, [])

  // Write new output to terminal
  useEffect(() => {
    const term = xtermRef.current
    if (term && isReady) {
      if (output) {
        term.clear()
        term.write(output)
        if (!isExecuting) {
          term.write('\r\n\x1b[32municode-vm ~ $\x1b[0m ')
        }
      } else if (!isExecuting) {
        term.clear()
        term.write('\x1b[32municode-vm ~ $\x1b[0m ')
      } else if (isExecuting) {
        term.clear()
        term.write('Executing code...\x1b[5m_\x1b[0m')
      }
    }
  }, [output, isExecuting, isReady])

  return (
    <div className="w-full h-full bg-[#1e1e1e] p-4 text-white">
      <div className="text-xs text-gray-500 mb-2 font-mono">Terminal Output</div>
      <div ref={terminalRef} className="h-[calc(100%-24px)] w-full" />
    </div>
  )
}
