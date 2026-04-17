'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import Split from 'react-split'

const TerminalSimulator = dynamic(
  () => import('@/components/linux/TerminalSimulator').then(mod => mod.TerminalSimulator),
  { ssr: false }
)
import {
  ArrowLeft, ShieldAlert, Cpu, Network, FileKey2, Lock,
  CheckCircle2, Circle, ChevronRight, Trophy, AlertTriangle,
  Terminal, Zap, Target, Eye, Wifi, Database, Bug
} from 'lucide-react'
import Link from 'next/link'

// ── Mission Data ─────────────────────────────────────────────────────────────
const MISSIONS = [
  {
    id: 'recon',
    title: 'Network Reconnaissance',
    badge: 'RECON',
    badgeColor: 'text-blue-400 bg-blue-900/30 border-blue-500/30',
    icon: <Network className="w-5 h-5 text-blue-400" />,
    xp: 100,
    difficulty: 'Easy',
    difficultyColor: 'text-green-400',
    description: 'Discover the target network topology and open services using nmap. Scan all ports and identify service versions.',
    objective: 'Find all open ports on 192.168.1.1',
    steps: [
      {
        id: 1, label: 'Basic port scan',
        instruction: 'Run a basic nmap scan to discover open ports on the target.',
        hint: 'nmap 192.168.1.1',
        command: 'nmap',
        expectedOutput: 'open',
      },
      {
        id: 2, label: 'Version detection',
        instruction: 'Add service version detection to get more details about each open port.',
        hint: 'nmap -sV -A 192.168.1.1',
        command: 'nmap',
        expectedOutput: 'VERSION',
      },
      {
        id: 3, label: 'Target identified',
        instruction: 'Use whois to gather OSINT information about the target.',
        hint: 'whois 192.168.1.1',
        command: 'whois',
        expectedOutput: 'Domain',
      },
    ]
  },
  {
    id: 'web-enum',
    title: 'Web Enumeration',
    badge: 'WEB',
    badgeColor: 'text-yellow-400 bg-yellow-900/30 border-yellow-500/30',
    icon: <Eye className="w-5 h-5 text-yellow-400" />,
    xp: 150,
    difficulty: 'Medium',
    difficultyColor: 'text-yellow-400',
    description: 'Enumerate hidden directories and vulnerabilities on the target web server running on port 80.',
    objective: 'Find /admin and /backup directories',
    steps: [
      {
        id: 1, label: 'Nikto web scan',
        instruction: 'Run nikto to find common web vulnerabilities on the target.',
        hint: 'nikto -h 192.168.1.1',
        command: 'nikto',
        expectedOutput: 'phpMyAdmin',
      },
      {
        id: 2, label: 'Directory busting',
        instruction: 'Use gobuster to brute-force hidden directories.',
        hint: 'gobuster dir -u http://192.168.1.1 -w /usr/share/wordlists/dirb/common.txt',
        command: 'gobuster',
        expectedOutput: '/admin',
      },
      {
        id: 3, label: 'Fetch login page',
        instruction: 'Retrieve the admin login page source code.',
        hint: 'curl http://192.168.1.1/admin',
        command: 'curl',
        expectedOutput: 'html',
      },
    ]
  },
  {
    id: 'ssh-brute',
    title: 'SSH Brute Force',
    badge: 'EXPLOIT',
    badgeColor: 'text-red-400 bg-red-900/30 border-red-500/30',
    icon: <FileKey2 className="w-5 h-5 text-red-400" />,
    xp: 200,
    difficulty: 'Medium',
    difficultyColor: 'text-yellow-400',
    description: 'The SSH service (port 22) is exposed. Use hydra to brute-force credentials with a common wordlist.',
    objective: 'Crack SSH credentials for user admin',
    steps: [
      {
        id: 1, label: 'Confirm SSH is open',
        instruction: 'Verify SSH port 22 is accessible with a targeted nmap scan.',
        hint: 'nmap -p 22 192.168.1.1',
        command: 'nmap',
        expectedOutput: '22/tcp',
      },
      {
        id: 2, label: 'Brute-force SSH',
        instruction: 'Launch hydra with the rockyou wordlist to crack the SSH password.',
        hint: 'hydra -l admin -P /usr/share/wordlists/rockyou.txt 192.168.1.1 ssh',
        command: 'hydra',
        expectedOutput: 'password123',
      },
      {
        id: 3, label: 'Generate SSH key',
        instruction: 'Generate an RSA key pair for persistent access.',
        hint: 'ssh-keygen -t rsa -b 4096',
        command: 'ssh-keygen',
        expectedOutput: 'SHA256',
      },
    ]
  },
  {
    id: 'password-crack',
    title: 'Password Cracking',
    badge: 'CRACK',
    badgeColor: 'text-orange-400 bg-orange-900/30 border-orange-500/30',
    icon: <Database className="w-5 h-5 text-orange-400" />,
    xp: 250,
    difficulty: 'Hard',
    difficultyColor: 'text-orange-400',
    description: 'You found a shadow file with hashed passwords. Use john the ripper and wordlists to crack them offline.',
    objective: 'Crack all 3 password hashes in hashes.txt',
    steps: [
      {
        id: 1, label: 'View shadow file',
        instruction: 'Examine the captured password hashes file.',
        hint: 'cat /etc/passwd',
        command: 'cat',
        expectedOutput: 'root',
      },
      {
        id: 2, label: 'Run John the Ripper',
        instruction: 'Use john with the rockyou wordlist to crack password hashes.',
        hint: 'john --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt',
        command: 'john',
        expectedOutput: 'password123',
      },
      {
        id: 3, label: 'Verify with hashcat',
        instruction: 'Confirm cracked passwords using hashcat.',
        hint: 'hashcat -m 0 hashes.txt /usr/share/wordlists/rockyou.txt',
        command: 'hashcat',
        expectedOutput: 'password',
      },
    ]
  },
  {
    id: 'priv-esc',
    title: 'Privilege Escalation',
    badge: 'ROOT',
    badgeColor: 'text-purple-400 bg-purple-900/30 border-purple-500/30',
    icon: <Cpu className="w-5 h-5 text-purple-400" />,
    xp: 300,
    difficulty: 'Hard',
    difficultyColor: 'text-red-400',
    description: 'You are logged in as student. Find misconfigurations in SUID binaries and sudo rules to escalate to root.',
    objective: 'Gain root access on the target system',
    steps: [
      {
        id: 1, label: 'Check current privileges',
        instruction: 'Check your current user and group membership.',
        hint: 'id',
        command: 'id',
        expectedOutput: 'uid',
      },
      {
        id: 2, label: 'Find SUID binaries',
        instruction: 'Search for SUID binaries that could be exploited.',
        hint: 'find / -perm -u=s -type f 2>/dev/null',
        command: 'find',
        expectedOutput: 'index',
      },
      {
        id: 3, label: 'Check sudo rights',
        instruction: 'List sudo permissions for the current user.',
        hint: 'sudo -l',
        command: 'sudo',
        expectedOutput: 'sudoers',
      },
    ]
  },
]

// ── Step Tracker Component ────────────────────────────────────────────────────
function StepTracker({
  mission, completedSteps, activeStep, onShowHint, showHint
}: {
  mission: typeof MISSIONS[0]
  completedSteps: number[]
  activeStep: number
  onShowHint: () => void
  showHint: boolean
}) {
  const currentStep = mission.steps[activeStep]

  return (
    <div className="space-y-3">
      {mission.steps.map((step, idx) => {
        const isDone = completedSteps.includes(step.id)
        const isActive = idx === activeStep && !isDone
        const isLocked = idx > activeStep && !isDone

        return (
          <div
            key={step.id}
            className={`rounded-xl border p-3 transition-all duration-300 ${
              isDone
                ? 'bg-green-500/10 border-green-500/25'
                : isActive
                ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                : 'bg-white/3 border-white/8 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isDone
                  ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                  : isActive
                  ? <div className="w-5 h-5 rounded-full border-2 border-red-400 animate-pulse" />
                  : <Lock className="w-4 h-4 text-slate-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-medium ${isDone ? 'text-green-300' : isActive ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                  {isDone && <span className="text-xs text-green-500 font-mono">✓ Done</span>}
                </div>
                {isActive && (
                  <p className="text-xs text-slate-400 mt-1">{step.instruction}</p>
                )}
              </div>
            </div>

            {isActive && (
              <div className="mt-3 space-y-2">
                <button
                  onClick={onShowHint}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                >
                  <Zap size={11} /> {showHint ? 'Hide hint' : 'Show command hint'}
                </button>
                {showHint && (
                  <div className="mt-1 px-3 py-2 bg-black/40 border border-red-500/20 rounded-lg">
                    <span className="font-mono text-xs text-red-300">$ {step.hint}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SecurityLabPage() {
  const [activeMissionId, setActiveMissionId] = useState('recon')
  const [missionProgress, setMissionProgress] = useState<Record<string, { completedSteps: number[], activeStep: number }>>({})
  const [totalXP, setTotalXP] = useState(0)
  const [completedMissions, setCompletedMissions] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [animateXP, setAnimateXP] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const activeMission = MISSIONS.find(m => m.id === activeMissionId)!
  const missionState = missionProgress[activeMissionId] || { completedSteps: [], activeStep: 0 }

  const handleCommandRun = (cmd: string, output: string) => {
    if (!activeMission) return
    const state = missionProgress[activeMissionId] || { completedSteps: [], activeStep: 0 }
    const currentStep = activeMission.steps[state.activeStep]
    if (!currentStep || state.completedSteps.includes(currentStep.id)) return

    const cmdMatches = cmd.toLowerCase().startsWith(currentStep.command.toLowerCase())
    const outMatches = output.toLowerCase().includes(currentStep.expectedOutput.toLowerCase())

    if (cmdMatches || outMatches) {
      const newCompleted = [...state.completedSteps, currentStep.id]
      const allDone = newCompleted.length === activeMission.steps.length
      const newStep = allDone ? state.activeStep : state.activeStep + 1

      setMissionProgress(prev => ({
        ...prev,
        [activeMissionId]: { completedSteps: newCompleted, activeStep: newStep }
      }))
      setShowHint(false)

      if (allDone && !completedMissions.includes(activeMissionId)) {
        setCompletedMissions(prev => [...prev, activeMissionId])
        setTotalXP(prev => prev + activeMission.xp)
        setAnimateXP(true)
        setTimeout(() => setAnimateXP(false), 2000)
      }
    }
  }

  if (!mounted) return null

  const globalProgress = Math.round((completedMissions.length / MISSIONS.length) * 100)

  return (
    <div className="flex flex-col h-screen bg-[#080810] text-white overflow-hidden font-mono">
      {/* Scanline overlay */}
      <div className="scanline pointer-events-none" />

      {/* Top Bar */}
      <div className="h-14 border-b border-red-900/30 flex items-center justify-between px-6 bg-[#0a0a14]/90 backdrop-blur-md shrink-0 z-20">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-all"
          >
            <ArrowLeft size={15} className="text-gray-400" />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-center">
              <ShieldAlert size={16} className="text-red-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Cybersecurity Virtual Lab</h1>
              <p className="text-[10px] text-slate-500">Ethical Hacking Training Environment</p>
            </div>
          </div>
        </div>

        {/* XP + Progress */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="text-xs text-slate-500">Progress</div>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-700"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
            <div className="text-xs text-slate-400">{globalProgress}%</div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-500 ${
            animateXP
              ? 'bg-yellow-500/20 border-yellow-500/40 shadow-[0_0_20px_rgba(234,179,8,0.3)]'
              : 'bg-white/5 border-white/10'
          }`}>
            <Trophy size={14} className={animateXP ? 'text-yellow-400 animate-spin' : 'text-yellow-500/60'} />
            <span className={`text-sm font-bold transition-colors ${animateXP ? 'text-yellow-400' : 'text-slate-300'}`}>
              {totalXP} XP
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400">Sandbox Active</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <style jsx global>{`
          .split { display: flex; flex-direction: row; height: 100%; }
          .gutter { background-color: rgba(239,68,68,0.08); cursor: col-resize; transition: background-color 0.2s; }
          .gutter:hover { background-color: rgba(239,68,68,0.2); }
        `}</style>

        <Split className="split" sizes={[38, 62]} minSize={[320, 400]} gutterSize={4}>

          {/* ── Sidebar ── */}
          <div className="h-full flex flex-col bg-gradient-to-b from-[#0d0d1a] to-[#080810] border-r border-red-900/20 overflow-y-auto">

            {/* Target info */}
            <div className="p-4 border-b border-white/5">
              <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={13} className="text-red-400" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Target System</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono">
                  <span className="text-slate-500">IP:</span>
                  <span className="text-red-300">192.168.1.1</span>
                  <span className="text-slate-500">OS:</span>
                  <span className="text-slate-300">Ubuntu 20.04 LTS</span>
                  <span className="text-slate-500">Firewall:</span>
                  <span className="text-green-400">Disabled ✓</span>
                  <span className="text-slate-500">Status:</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Mission list */}
            <div className="p-4 space-y-3">
              <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1">Active Missions</h2>

              {MISSIONS.map((mission, idx) => {
                const state = missionProgress[mission.id] || { completedSteps: [], activeStep: 0 }
                const isDone = completedMissions.includes(mission.id)
                const isActive = activeMissionId === mission.id
                const isLocked = idx > 0 && !completedMissions.includes(MISSIONS[idx - 1].id)
                const stepsDone = state.completedSteps.length

                return (
                  <button
                    key={mission.id}
                    disabled={isLocked}
                    onClick={() => { setActiveMissionId(mission.id); setShowHint(false) }}
                    className={`w-full text-left p-3 rounded-xl border transition-all duration-300 group ${
                      isActive
                        ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.08)]'
                        : isDone
                        ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                        : isLocked
                        ? 'bg-white/2 border-white/5 opacity-40 cursor-not-allowed'
                        : 'bg-white/4 border-white/8 hover:bg-white/8 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isDone ? 'bg-green-500/15' : isActive ? 'bg-red-500/15' : 'bg-white/5'
                      }`}>
                        {isDone ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : isLocked ? <Lock className="w-4 h-4 text-slate-600" /> : mission.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className={`text-sm font-semibold ${isActive ? 'text-white' : isDone ? 'text-green-300' : 'text-slate-300'}`}>
                            {mission.title}
                          </span>
                          <span className={`text-[9px] font-bold border rounded px-1.5 py-0.5 ${mission.badgeColor}`}>
                            {mission.badge}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] ${mission.difficultyColor}`}>{mission.difficulty}</span>
                          <span className="text-[10px] text-slate-600">+{mission.xp} XP</span>
                        </div>
                        {!isDone && !isLocked && (
                          <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                              style={{ width: `${(stepsDone / mission.steps.length) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active mission steps */}
            {activeMission && (
              <div className="p-4 border-t border-white/5 flex-1">
                <div className="mb-3">
                  <h3 className="text-xs font-bold text-white mb-0.5">{activeMission.title}</h3>
                  <p className="text-[11px] text-slate-500">{activeMission.description}</p>
                </div>
                <div className="mb-3 px-3 py-2 bg-yellow-500/5 border border-yellow-500/15 rounded-lg">
                  <span className="text-[10px] text-yellow-400 font-mono">Objective: {activeMission.objective}</span>
                </div>
                <StepTracker
                  mission={activeMission}
                  completedSteps={missionState.completedSteps}
                  activeStep={missionState.activeStep}
                  onShowHint={() => setShowHint(h => !h)}
                  showHint={showHint}
                />
              </div>
            )}
          </div>

          {/* ── Terminal ── */}
          <div className="h-full bg-[#080810] p-4 flex flex-col relative overflow-hidden">
            {/* Red glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(239,68,68,0.04),transparent_60%)] pointer-events-none" />

            {/* Terminal header */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-red-400" />
                <span className="text-xs font-mono text-red-400">root@target:~#</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Wifi size={10} className="text-green-500" />
                  192.168.1.105 → 192.168.1.1
                </span>
                <span className="flex items-center gap-1.5">
                  <Bug size={10} className="text-red-500" />
                  Mission: {activeMission?.title}
                </span>
              </div>
            </div>

            <div className="flex-1 relative z-10 min-h-0">
              <TerminalSimulator onCommandRun={handleCommandRun} />
            </div>
          </div>
        </Split>
      </div>
    </div>
  )
}
