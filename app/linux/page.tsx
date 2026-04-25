'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const TerminalSimulator = dynamic(
  () => import('@/components/linux/TerminalSimulator').then(mod => mod.TerminalSimulator),
  { ssr: false }
)
import {
  Terminal, Shield, CheckCircle2, Circle, Lightbulb,
  ArrowLeft, Lock, Zap, Trophy, ChevronRight, Cpu,
  Wifi, HardDrive, Code2
} from 'lucide-react'
import Link from 'next/link'

const EXERCISES = [
  {
    id: 1,
    category: 'Basics',
    categoryColor: 'text-blue-400',
    title: 'Explore the Filesystem',
    description: "Use 'ls' and 'cd' to navigate. Try 'ls -la' for detailed listing.",
    validation: (cmd: string) => cmd.startsWith('ls') || cmd.startsWith('cd'),
    hint: "Type 'ls' first, then try 'cd /var/www' or 'ls -la'",
    xp: 50,
  },
  {
    id: 2,
    category: 'Basics',
    categoryColor: 'text-blue-400',
    title: 'Create Files & Directories',
    description: "Use 'mkdir project' to create a directory. Use 'touch index.html' to create a file.",
    validation: (cmd: string) => cmd.includes('mkdir') || cmd.includes('touch'),
    hint: "Run 'mkdir project' then 'touch project/index.html'",
    xp: 50,
  },
  {
    id: 3,
    category: 'Basics',
    categoryColor: 'text-blue-400',
    title: 'System Information',
    description: "Check system info using 'uname -a', 'free -h', and 'df -h'.",
    validation: (cmd: string) => ['uname', 'free', 'df', 'uptime'].some(c => cmd.startsWith(c)),
    hint: "Try 'uname -a' to see kernel info, 'free -h' for memory",
    xp: 75,
  },
  {
    id: 4,
    category: 'Network',
    categoryColor: 'text-cyan-400',
    title: 'Network Reconnaissance',
    description: "Ping google.com and use ifconfig to inspect your network interfaces.",
    validation: (cmd: string) => cmd.startsWith('ping') || cmd.startsWith('ifconfig') || cmd.startsWith('ip'),
    hint: "Type 'ping -c 4 google.com' then 'ifconfig'",
    xp: 100,
  },
  {
    id: 5,
    category: 'Network',
    categoryColor: 'text-cyan-400',
    title: 'Port Scanning with Nmap',
    description: "Scan the local network for open ports using nmap with service detection.",
    validation: (cmd: string) => cmd.startsWith('nmap'),
    hint: "Try 'nmap -sV localhost' or 'nmap -A 192.168.1.1'",
    xp: 150,
  },
  {
    id: 6,
    category: 'Security',
    categoryColor: 'text-red-400',
    title: 'Process Management',
    description: "List running processes with 'ps aux' and check resource usage with 'top'.",
    validation: (cmd: string) => cmd.startsWith('ps') || cmd.startsWith('top') || cmd.startsWith('htop'),
    hint: "Run 'ps aux | grep node' or just 'top'",
    xp: 100,
  },
  {
    id: 7,
    category: 'Security',
    categoryColor: 'text-red-400',
    title: 'SSH Key Generation',
    description: "Generate an RSA keypair with ssh-keygen and inspect the result.",
    validation: (cmd: string) => cmd.startsWith('ssh-keygen') || cmd.startsWith('ssh'),
    hint: "Type 'ssh-keygen -t rsa -b 4096'",
    xp: 200,
  },
]

export default function LinuxPage() {
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [activeHint, setActiveHint] = useState<number | null>(null)
  const [totalXP, setTotalXP] = useState(0)
  const [lastCompleted, setLastCompleted] = useState<number | null>(null)

  const handleCommandRun = (cmd: string, _output: string) => {
    EXERCISES.forEach(exercise => {
      if (!completedExercises.includes(exercise.id) && exercise.validation(cmd)) {
        setCompletedExercises(prev => [...prev, exercise.id])
        setTotalXP(prev => prev + exercise.xp)
        setLastCompleted(exercise.id)
        setTimeout(() => setLastCompleted(null), 2500)
      }
    })
  }

  const progress = Math.round((completedExercises.length / EXERCISES.length) * 100)

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden font-inter">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="w-96 shrink-0 border-r border-[#ef233c]/20 bg-gradient-to-b from-[#1a0505] to-black flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 mb-5">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-muted border border-border flex items-center justify-center hover:bg-orange-500/20 hover:border-orange-500/30 transition-all"
            >
              <ArrowLeft size={14} className="text-slate-400" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#ef233c]/10 border border-[#ef233c]/20 rounded-xl flex items-center justify-center">
                <Terminal className="text-[#ef233c] w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-foreground leading-none">Linux Simulator</h1>
                <p className="text-[10px] text-slate-600 mt-0.5">Interactive OS Terminal</p>
              </div>
            </div>
          </div>

          {/* XP + Progress */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Module Progress</span>
              <div className="flex items-center gap-2">
                <Trophy size={12} className="text-yellow-500" />
                <span className="text-yellow-400 font-bold">{totalXP} XP</span>
              </div>
            </div>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ef233c] to-red-400 transition-all duration-700 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-600">
              <span>{completedExercises.length}/{EXERCISES.length} completed</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-border shrink-0">
          {[
            { icon: <Cpu size={13} className="text-[#ef233c]" />, label: 'Sandbox', value: 'Active' },
            { icon: <Wifi size={13} className="text-green-400" />, label: 'Network', value: 'Isolated' },
            { icon: <HardDrive size={13} className="text-blue-400" />, label: 'Storage', value: '10 GB' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center py-2.5 gap-1">
              {stat.icon}
              <span className="text-[9px] text-slate-600 uppercase tracking-wider">{stat.label}</span>
              <span className="text-[10px] text-slate-300 font-medium">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Exercise list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3">Guided Modules</h2>

          {EXERCISES.map((exercise, index) => {
            const isCompleted = completedExercises.includes(exercise.id)
            const isLocked = index > 0 && !completedExercises.includes(EXERCISES[index - 1].id)
            const isJustCompleted = lastCompleted === exercise.id

            return (
              <div
                key={exercise.id}
                className={`rounded-xl border p-3.5 transition-all duration-500 ${
                  isJustCompleted
                    ? 'bg-green-500/12 border-green-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : isCompleted
                    ? 'bg-green-500/6 border-green-500/15'
                    : isLocked
                    ? 'opacity-40 border-border bg-white/2'
                    : 'bg-white/4 border-border hover:border-[#ef233c]/25 hover:bg-[#ef233c]/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4 text-slate-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-[#ef233c]/50 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#ef233c]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-[9px] font-bold uppercase tracking-widest ${exercise.categoryColor}`}>
                        {exercise.category}
                      </span>
                      <span className="text-[9px] text-slate-600">+{exercise.xp} XP</span>
                    </div>
                    <h3 className={`text-sm font-semibold mb-1 ${isCompleted ? 'text-green-300' : 'text-foreground'}`}>
                      {exercise.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{exercise.description}</p>

                    {!isCompleted && !isLocked && (
                      <div className="mt-2.5">
                        <button
                          onClick={() => setActiveHint(activeHint === exercise.id ? null : exercise.id)}
                          className="text-[11px] flex items-center gap-1 text-[#ef233c] hover:text-red-300 transition-colors"
                        >
                          <Zap size={10} />
                          {activeHint === exercise.id ? 'Hide hint' : 'Show hint'}
                        </button>
                        {activeHint === exercise.id && (
                          <div className="mt-2 px-3 py-2 bg-[#ef233c]/8 border border-[#ef233c]/20 rounded-lg">
                            <code className="text-[11px] text-red-200/80 font-mono">$ {exercise.hint}</code>
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

      {/* ── Terminal Area ───────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">

        {/* Terminal top bar */}
        <div className="shrink-0 h-10 flex items-center justify-between px-5 bg-background border-b border-border">
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-600">Session</span>
            <span className="text-[#ef233c]/60">NX-{Math.floor(8000 + Math.random() * 1000)}</span>
            <span className="text-slate-700">·</span>
            <span className="text-green-400/70 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              Sandbox Active
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono">
            <Code2 size={11} />
            <span>root@unicode-os:~</span>
          </div>
        </div>

        {/* XP notification */}
        {lastCompleted && (
          <div className="absolute top-14 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-green-500/15 border border-green-500/30 rounded-xl backdrop-blur-sm scale-in shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={16} className="text-green-400" />
            <span className="text-sm font-bold text-green-300">
              +{EXERCISES.find(e => e.id === lastCompleted)?.xp} XP — Exercise complete!
            </span>
          </div>
        )}

        {/* Terminal */}
        <div className="flex-1 min-h-0">
          <TerminalSimulator onCommandRun={handleCommandRun} />
        </div>
      </div>
    </div>
  )
}
