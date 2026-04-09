'use client'

import { useState } from 'react'
import Split from 'react-split'
import { TerminalSimulator } from '@/components/linux/TerminalSimulator'
import { ArrowLeft, ShieldAlert, Cpu, Network, FileKey2 } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/useLanguage'

export default function SecurityLabPage() {
  const { t, language } = useLanguage()
  const [activeScenario, setActiveScenario] = useState('nmap')
  
  const handleCommandRun = (cmd: string, output: string) => {
    // We can add hooks here to detect when a student successfully completes a challenge
  }

  const scenarios = [
    {
      id: 'nmap',
      title: language === 'en' ? 'Network Reconnaissance' : '网络侦察',
      desc: language === 'en' 
        ? 'Use nmap to discover open ports on the target database server (192.168.1.1).'
        : '使用 nmap 发现目标数据库服务器 (192.168.1.1) 上的开放端口。',
      icon: <Network className="w-5 h-5 text-blue-400" />
    },
    {
      id: 'ssh',
      title: language === 'en' ? 'SSH Brute Force' : 'SSH 暴力破解',
      desc: language === 'en'
        ? 'Simulate a dictionary attack against an exposed SSH service.'
        : '针对暴露的 SSH 服务模拟字典攻击。',
      icon: <FileKey2 className="w-5 h-5 text-red-400" />
    },
    {
      id: 'privesc',
      title: language === 'en' ? 'Privilege Escalation' : '权限提升',
      desc: language === 'en'
        ? 'Find misconfigured SUID binaries to gain root access.'
        : '查找配置错误的 SUID 二进制文件以获取 root 访问权限。',
      icon: <Cpu className="w-5 h-5 text-purple-400" />
    }
  ]

  return (
    <div className="flex flex-col h-screen bg-[#0A0A0B] text-white overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#111]">
        <div className="flex items-center gap-4">
          <Link href="/" className="w-8 h-8 rounded bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10">
            <ArrowLeft size={16} className="text-gray-400" />
          </Link>
          <div className="h-6 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-red-500" />
            <h1 className="font-bold text-lg cursor-pointer hover:text-red-400 transition-colors">
              {language === 'en' ? 'Cybersecurity Virtual Lab' : '网络安全虚拟实验室'}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-[calc(100vh-56px)] overflow-hidden">
        <style jsx global>{`
          .split { display: flex; flex-direction: row; height: 100%; }
          .gutter { background-color: rgba(255,255,255,0.05); cursor: col-resize; transition: background-color 0.2s; border-left: 1px solid rgba(255,255,255,0.02); }
          .gutter:hover { background-color: rgba(239, 68, 68, 0.2); }
        `}</style>
        
        <Split 
          className="split"
          sizes={[35, 65]}
          minSize={[300, 400]}
          gutterSize={4}
        >
          {/* Sidebar: Scenarios */}
          <div className="h-full bg-gradient-to-b from-[#111] to-[#0A0A0B] border-r border-white/5 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold font-mono text-red-500 mb-6 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              {language === 'en' ? 'Active Missions' : '活跃任务'}
            </h2>
            
            <div className="space-y-4">
              {scenarios.map(scenario => (
                <div 
                  key={scenario.id}
                  onClick={() => setActiveScenario(scenario.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === scenario.id 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {scenario.icon}
                    <h3 className="font-semibold text-gray-200">{scenario.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{scenario.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 className="font-mono text-red-400 mb-2">
                {language === 'en' ? 'Target Information' : '目标信息'}
              </h4>
              <ul className="text-sm text-gray-400 space-y-1 font-mono">
                <li>IP: 192.168.1.1</li>
                <li>OS: Linux 5.4.0</li>
                <li>Status: Online</li>
              </ul>
            </div>
          </div>

          {/* Terminal Workspace */}
          <div className="h-full bg-[#0A0A0B] p-4 flex flex-col relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.03),transparent_70%)] pointer-events-none" />
            <div className="flex-1 relative z-10 w-full h-full max-w-5xl mx-auto shadow-[0_0_50px_rgba(239,68,68,0.05)] rounded-xl">
              <TerminalSimulator onCommandRun={handleCommandRun} />
            </div>
          </div>
        </Split>
      </div>
    </div>
  )
}
