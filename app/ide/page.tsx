'use client'

import { useState } from 'react'
import Split from 'react-split'
import { CodeEditor } from '@/components/ide/Editor'
import { Terminal } from '@/components/ide/Terminal'
import { Play, Save, Share, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_CODE = `def fibonacci(n):
    """
    Returns the nth Fibonacci number
    """
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"Fibonacci({i}) = {fibonacci(i)}")`

export default function IDEPage() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [language, setLanguage] = useState('python')
  const [output, setOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)

  const executeCode = async () => {
    if (!code) return

    setIsExecuting(true)
    setOutput('')

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          source: code,
          input: ''
        })
      })

      const data = await res.json()
      
      if (data.run.stderr) {
        setOutput(`\x1b[31m${data.run.stderr}\x1b[0m`)
      } else {
        setOutput(data.run.stdout)
      }
    } catch (error) {
      setOutput('\x1b[31mError connecting to execution environment.\x1b[0m')
    } finally {
      setIsExecuting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#1e1e1e] text-white overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-[#181818]">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
            <ArrowLeft size={16} className="text-gray-400" />
          </Link>
          <div className="h-6 w-px bg-gray-800 mx-1" />
          <h1 className="font-bold text-lg cursor-pointer hover:text-blue-400 transition-colors">Unicode IDE</h1>
          <div className="h-6 w-px bg-gray-700 mx-2" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 border-none rounded text-sm py-1 px-3 outline-none"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded transition-colors text-sm text-gray-300">
            <Save size={16} /> Save
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded transition-colors text-sm text-gray-300">
            <Share size={16} /> Share
          </button>
          <button 
            onClick={executeCode}
            disabled={isExecuting}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-colors disabled:opacity-50 text-sm"
          >
            <Play size={16} fill="white" /> {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Main Split Pane */}
      <div className="flex-1 h-[calc(100vh-56px)]">
        {/* We use global jsx styling to ensure Split.js handles the height properly */}
        <style jsx global>{`
          .split { display: flex; flex-direction: row; height: 100%; }
          .gutter { background-color: #333; cursor: col-resize; transition: background-color 0.2s; }
          .gutter:hover { background-color: #555; }
        `}</style>
        
        <Split 
          className="split"
          sizes={[60, 40]}
          minSize={[300, 300]}
          gutterSize={4}
          snapOffset={30}
        >
          {/* Editor Side */}
          <div className="h-full relative shrink-0">
            <CodeEditor
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
            />
          </div>

          {/* Terminal / Output Side */}
          <div className="h-full bg-[#1e1e1e] border-l border-gray-800 shrink-0">
            <Terminal output={output} isExecuting={isExecuting} />
          </div>
        </Split>
      </div>
    </div>
  )
}
