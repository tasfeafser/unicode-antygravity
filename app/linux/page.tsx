'use client'

import { useState } from 'react'
import { TerminalSimulator } from '@/components/linux/TerminalSimulator'
import { Terminal, Shield, CheckCircle2, Circle, Lightbulb, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/useLanguage'

// Define progressive Linux exercises
const EXERCISES = [
  {
    id: 1,
    title: "Navigating the Filesystem",
    description: "Use 'ls' to list files, and 'cd <dir>' to move into a directory. Find the hidden secret directory.",
    validation: (cmd: string, output: string) => cmd.startsWith('cd ') || cmd.startsWith('ls'),
    hint: "Try typing 'ls' to see what's in your current folder, then 'cd' followed by the folder name."
  },
  {
    id: 2,
    title: "Creating Files",
    description: "Use the 'mkdir' command to create a new directory called 'project', and 'touch' to create an 'index.html' file inside it.",
    validation: (cmd: string, output: string) => cmd.includes('mkdir project') || cmd.includes('touch index.html'),
    hint: "First run 'mkdir project'. Then run 'touch project/index.html' or 'cd project' and then 'touch index.html'."
  },
  {
    id: 3,
    title: "Network Reconnaissance",
    description: "Perform a basic network ping to 'google.com' to ensure connectivity.",
    validation: (cmd: string, output: string) => cmd.startsWith('ping '),
    hint: "Type 'ping google.com'."
  },
  {
    id: 4,
    title: "Cybersecurity Basics (Nmap)",
    description: "Run an 'nmap localhost' scan to see what open ports your machine has running.",
    validation: (cmd: string, output: string) => cmd.startsWith('nmap '),
    hint: "Type 'nmap localhost' and analyze the output block."
  }
]

export default function LinuxPage() {
  const { language } = useLanguage()
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [activeHint, setActiveHint] = useState<number | null>(null)

  const handleCommandRun = (cmd: string, output: string) => {
    // Validate against exercises
    EXERCISES.forEach(exercise => {
      if (!completedExercises.includes(exercise.id)) {
        if (exercise.validation(cmd, output)) {
          setCompletedExercises(prev => [...prev, exercise.id])
        }
      }
    })
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] text-white">
      {/* Sidebar: Guided Exercises */}
      <div className="w-96 border-r border-slate-800 bg-[#0F172A] p-6 flex flex-col h-full overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors mr-2">
            <ArrowLeft size={16} className="text-slate-400" />
          </Link>
          <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center border border-orange-500/20">
            <Terminal className="text-orange-400" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
            {language === 'en' ? 'Linux Simulator' : 'Linux 模拟器'}
          </h1>
        </div>

        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          {language === 'en' 
            ? 'Welcome to the interactive Unicode OS terminal. Learn command-line fundamentals and basic cybersecurity networking safely in the browser.'
            : '欢迎使用交互式 Unicode OS 终端。在浏览器中安全地学习命令行基础知识和基本网络安全侦察。'}
        </p>

        <div className="flex-1 space-y-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            {language === 'en' ? 'Guided Modules' : '指导模块'}
          </h2>
          
          {EXERCISES.map((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise.id)
            const isLocked = index > 0 && !completedExercises.includes(EXERCISES[index - 1].id)

            return (
              <div 
                key={exercise.id} 
                className={`p-4 rounded-xl border ${isCompleted ? 'bg-green-500/5 border-green-500/20' : isLocked ? 'opacity-50 border-slate-800' : 'bg-slate-800/50 border-slate-700'}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="mt-0.5">
                    {isCompleted ? (
                      <CheckCircle2 className="text-green-500 w-5 h-5" />
                    ) : (
                      <Circle className="text-slate-600 w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${isCompleted ? 'text-green-400' : 'text-slate-200'}`}>
                      {exercise.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1 mb-3">
                      {exercise.description}
                    </p>
                    
                    {!isCompleted && !isLocked && (
                      <div>
                        <button 
                          onClick={() => setActiveHint(activeHint === exercise.id ? null : exercise.id)}
                          className="text-xs flex items-center gap-1 text-orange-400 hover:text-orange-300 transition-colors"
                        >
                          <Lightbulb size={12} /> {activeHint === exercise.id ? 'Hide Hint' : 'Show Hint'}
                        </button>
                        
                        {activeHint === exercise.id && (
                          <div className="mt-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-xs text-orange-200">
                            {exercise.hint}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Area: Terminal */}
      <div className="flex-1 p-6 flex flex-col bg-black">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="font-mono text-sm text-slate-400">root@unicode:~#</div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1 text-green-400"><Shield size={14} /> {language === 'en' ? 'Safe Sandbox Active' : '安全沙盒已激活'}</span>
            <span className="text-slate-500">{language === 'en' ? 'Session' : '会话'} ID: NX-8492</span>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <TerminalSimulator onCommandRun={handleCommandRun} />
        </div>
      </div>
    </div>
  )
}
