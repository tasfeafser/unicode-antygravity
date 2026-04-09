'use client'

import { useState, useCallback } from 'react'
import { CodeEditor } from '@/components/ide/Editor'
import { Terminal } from '@/components/ide/Terminal'
import { FileExplorer, VirtualFile } from '@/components/ide/FileExplorer'
import { FileTabs } from '@/components/ide/FileTabs'
import { AIChatSidebar } from '@/components/ide/AIChatSidebar'
import { 
  Play, Save, Share, ArrowLeft, Sparkles, Sun, Moon, 
  PanelRightOpen, PanelRightClose, ChevronUp, ChevronDown,
  Copy, Download
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/useLanguage'

// Language detection from file extension
const EXT_TO_LANG: Record<string, string> = {
  '.py': 'python', '.js': 'javascript', '.ts': 'typescript',
  '.java': 'java', '.cpp': 'cpp', '.c': 'cpp', '.h': 'cpp',
  '.sql': 'sql', '.json': 'json', '.rs': 'rust',
  '.html': 'html', '.css': 'css',
}

function detectLanguage(filename: string): string {
  const ext = filename.substring(filename.lastIndexOf('.'))
  return EXT_TO_LANG[ext] || 'python'
}

// Default starter files
const DEFAULT_FILES: VirtualFile[] = [
  {
    id: 'main-py',
    name: 'main.py',
    language: 'python',
    content: `def fibonacci(n):
    """Returns the nth Fibonacci number"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"Fibonacci({i}) = {fibonacci(i)}")`,
  },
  {
    id: 'app-js',
    name: 'app.js',
    language: 'javascript',
    content: `// Node.js Express Server Example
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Unicode!' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
  },
  {
    id: 'query-sql',
    name: 'query.sql',
    language: 'sql',
    content: `-- Sample SQL Query
SELECT 
    u.name,
    u.email,
    COUNT(o.id) AS order_count,
    SUM(o.total) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.name, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;`,
  },
]

let fileIdCounter = 100

export default function IDEPage() {
  const { language: uiLang } = useLanguage()

  // File management state
  const [files, setFiles] = useState<VirtualFile[]>(DEFAULT_FILES)
  const [openFileIds, setOpenFileIds] = useState<string[]>(['main-py'])
  const [activeFileId, setActiveFileId] = useState<string>('main-py')

  // Editor state
  const [theme, setTheme] = useState<'vs-dark' | 'light'>('vs-dark')
  const [output, setOutput] = useState('')
  const [isExecuting, setIsExecuting] = useState(false)

  // Panel state
  const [showAI, setShowAI] = useState(false)
  const [showTerminal, setShowTerminal] = useState(true)
  const [explorerWidth] = useState(220)

  // Derived
  const activeFile = files.find(f => f.id === activeFileId)
  const openFiles = files.filter(f => openFileIds.includes(f.id))

  // File operations
  const handleSelectFile = useCallback((id: string) => {
    setActiveFileId(id)
    if (!openFileIds.includes(id)) {
      setOpenFileIds(prev => [...prev, id])
    }
  }, [openFileIds])

  const handleCloseFile = useCallback((id: string) => {
    setOpenFileIds(prev => {
      const next = prev.filter(fid => fid !== id)
      if (activeFileId === id && next.length > 0) {
        setActiveFileId(next[next.length - 1])
      }
      return next
    })
  }, [activeFileId])

  const handleCreateFile = useCallback((name: string) => {
    const id = `file-${++fileIdCounter}`
    const lang = detectLanguage(name)
    const newFile: VirtualFile = {
      id,
      name,
      language: lang,
      content: lang === 'python' ? '# New file\n' : lang === 'sql' ? '-- New query\n' : '// New file\n',
    }
    setFiles(prev => [...prev, newFile])
    setOpenFileIds(prev => [...prev, id])
    setActiveFileId(id)
  }, [])

  const handleDeleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
    setOpenFileIds(prev => prev.filter(fid => fid !== id))
    if (activeFileId === id) {
      const remaining = files.filter(f => f.id !== id)
      setActiveFileId(remaining.length > 0 ? remaining[0].id : '')
    }
  }, [activeFileId, files])

  const handleRenameFile = useCallback((id: string, newName: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, name: newName, language: detectLanguage(newName) } : f
    ))
  }, [])

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!activeFileId) return
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, content: value || '', isUnsaved: true } : f
    ))
  }, [activeFileId])

  // Code execution
  const executeCode = async () => {
    if (!activeFile) return
    setIsExecuting(true)
    setOutput('')
    setShowTerminal(true)

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: activeFile.language,
          source: activeFile.content,
          input: ''
        })
      })

      const data = await res.json()
      if (data && data.run) {
        setOutput(data.run.stderr 
          ? `\x1b[31m${data.run.stderr}\x1b[0m` 
          : data.run.stdout || '')
      } else if (data?.error) {
        setOutput(`\x1b[31m${data.error}\x1b[0m`)
      } else {
        setOutput(`\x1b[31mUnexpected response\x1b[0m\n${JSON.stringify(data)}`)
      }
    } catch (error) {
      setOutput(`\x1b[31mExecution error: ${String(error)}\x1b[0m`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleSave = () => {
    if (!activeFileId) return
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, isUnsaved: false } : f
    ))
    // TODO: Save to Supabase
  }

  const handleCopyCode = () => {
    if (activeFile) navigator.clipboard.writeText(activeFile.content)
  }

  const isDark = theme === 'vs-dark'

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDark ? 'bg-[#1e1e1e] text-white' : 'bg-white text-gray-900'}`}>
      {/* Top Toolbar */}
      <div className={`h-12 flex items-center justify-between px-4 shrink-0 ${isDark ? 'bg-[#181818] border-b border-gray-800' : 'bg-gray-100 border-b border-gray-300'}`}>
        <div className="flex items-center gap-3">
          <Link href="/" className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'}`}>
            <ArrowLeft size={14} className="text-gray-400" />
          </Link>
          <div className={`h-5 w-px ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`} />
          <h1 className="font-bold text-sm">
            {uiLang === 'en' ? 'Unicode IDE' : 'Unicode 集成开发环境'}
          </h1>
          <div className={`h-5 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />
          
          {/* Language indicator */}
          {activeFile && (
            <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
              {activeFile.language}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'vs-dark')}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            title="Toggle theme"
          >
            {isDark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} className="text-gray-600" />}
          </button>

          {/* Terminal toggle */}
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            title="Toggle terminal"
          >
            {showTerminal ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronUp size={14} className="text-gray-400" />}
          </button>

          <div className={`h-5 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Copy */}
          <button onClick={handleCopyCode} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
            <Copy size={13} /> {uiLang === 'en' ? 'Copy' : '复制'}
          </button>

          {/* Save */}
          <button onClick={handleSave} className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}>
            <Save size={13} /> {uiLang === 'en' ? 'Save' : '保存'}
          </button>

          {/* AI Toggle */}
          <button
            onClick={() => setShowAI(!showAI)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              showAI 
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                : isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
            }`}
          >
            {showAI ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
            <Sparkles size={11} />
            AI
          </button>

          <div className={`h-5 w-px ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

          {/* Run */}
          <button 
            onClick={executeCode}
            disabled={isExecuting || !activeFile}
            className="flex items-center gap-1.5 px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-medium rounded text-xs transition-colors disabled:opacity-40 whitespace-nowrap"
          >
            <Play size={13} fill="white" /> 
            {isExecuting 
              ? (uiLang === 'en' ? 'Running...' : '运行中...') 
              : (uiLang === 'en' ? 'Run' : '运行')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        <div style={{ width: explorerWidth }} className="shrink-0">
          <FileExplorer
            files={files}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onCreateFile={handleCreateFile}
            onDeleteFile={handleDeleteFile}
            onRenameFile={handleRenameFile}
          />
        </div>

        {/* Center: Editor + Terminal */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* File Tabs */}
          <FileTabs
            files={openFiles}
            activeFileId={activeFileId}
            onSelectFile={handleSelectFile}
            onCloseFile={handleCloseFile}
          />

          {/* Editor */}
          <div className={`flex-1 min-h-0 ${!showTerminal ? 'h-full' : ''}`}>
            {activeFile ? (
              <CodeEditor
                language={activeFile.language}
                theme={theme}
                value={activeFile.content}
                onChange={handleCodeChange}
                fileName={activeFile.name}
              />
            ) : (
              <div className={`flex items-center justify-center h-full text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {uiLang === 'en' ? 'Select or create a file to start coding' : '选择或创建文件开始编码'}
              </div>
            )}
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className={`h-[200px] shrink-0 border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
              <Terminal output={output} isExecuting={isExecuting} />
            </div>
          )}
        </div>

        {/* AI Chat Sidebar */}
        {showAI && (
          <AIChatSidebar
            isOpen={showAI}
            onClose={() => setShowAI(false)}
            currentCode={activeFile?.content || ''}
            currentLanguage={activeFile?.language || 'python'}
            currentFileName={activeFile?.name || ''}
          />
        )}
      </div>

      {/* Status Bar */}
      <div className={`h-6 flex items-center justify-between px-4 text-[10px] shrink-0 ${isDark ? 'bg-[#007ACC] text-white' : 'bg-blue-600 text-white'}`}>
        <div className="flex items-center gap-3">
          <span>{files.length} {uiLang === 'en' ? 'files' : '文件'}</span>
          {activeFile && <span>{activeFile.language}</span>}
        </div>
        <div className="flex items-center gap-3">
          {activeFile?.isUnsaved && <span>● {uiLang === 'en' ? 'Unsaved' : '未保存'}</span>}
          <span>UTF-8</span>
          <span>Unicode IDE v2.0</span>
        </div>
      </div>
    </div>
  )
}
