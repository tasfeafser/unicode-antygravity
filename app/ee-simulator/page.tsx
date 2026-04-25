import React from 'react'
import { Cpu, Zap, Activity, Play, Plus } from 'lucide-react'

export default function EESimulatorPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-inter pt-24 px-6 flex flex-col h-screen">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ef233c]/20 rounded-lg text-[#ef233c]">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold font-manrope">EE Hardware Simulator</h1>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg border border-border">
                        <Activity className="w-4 h-4 text-green-400" />
                        5V Source Active
                    </div>
                    <button className="px-6 py-2 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg flex items-center gap-2 font-bold"><Play className="w-4 h-4"/> Run Simulation</button>
                </div>
            </div>

            <div className="flex flex-1 gap-4 pb-6 overflow-hidden">
                {/* Components Drawer */}
                <div className="w-64 bg-white/[0.02] border border-border rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Cpu className="w-4 h-4" /> Components
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['Resistor', 'Capacitor', 'Diode', 'Transistor', 'LED', 'Battery', 'Switch', 'Ground'].map((comp, i) => (
                            <div key={i} className="p-3 bg-background border border-border hover:border-[#ef233c]/50 rounded-lg cursor-grab flex flex-col items-center justify-center gap-2 text-xs text-center h-20">
                                <Plus className="w-4 h-4 text-muted-foreground" />
                                {comp}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Circuit Canvas */}
                <div className="flex-1 bg-[url('/grid-pattern.svg')] bg-[#050505] border border-border rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
                    
                    {/* Simulated Circuit drawing */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <svg width="400" height="200" className="opacity-50">
                            {/* Simple circuit mock */}
                            <path d="M 50 100 L 150 100 M 150 100 L 170 90 L 190 110 L 210 90 L 230 110 L 250 100 L 350 100 M 350 100 L 350 150 L 50 150 L 50 100" fill="none" stroke="#ef233c" strokeWidth="2" />
                            {/* Battery */}
                            <path d="M 40 100 L 60 100 M 30 105 L 70 105" fill="none" stroke="white" strokeWidth="2" />
                            {/* Ground */}
                            <path d="M 190 150 L 210 150 M 195 155 L 205 155 M 198 160 L 202 160" fill="none" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                    
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="text-muted-foreground bg-background/50 px-4 py-2 rounded-full border border-border backdrop-blur text-sm">
                            Drag components to build your circuit
                        </div>
                    </div>
                </div>

                {/* Oscilloscope */}
                <div className="w-72 bg-white/[0.02] border border-border rounded-xl flex flex-col overflow-hidden">
                    <div className="h-48 bg-background border-b border-border relative p-4">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:10px_10px]"></div>
                        {/* Sine wave */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M 0 50 Q 25 10 50 50 T 100 50" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-[dash_2s_linear_infinite]" strokeDasharray="200" strokeDashoffset="200" />
                        </svg>
                        <div className="absolute top-2 left-2 text-[10px] text-green-500 font-mono">CH1 1.0V 1ms</div>
                    </div>
                    <div className="p-4 flex-1 bg-background">
                        <h3 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider">Measurements</h3>
                        <div className="space-y-3 font-mono text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">V_rms</span> <span className="text-foreground">3.54 V</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">I_max</span> <span className="text-foreground">12.0 mA</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Freq</span> <span className="text-foreground">1.0 kHz</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Power</span> <span className="text-foreground">42.5 mW</span></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes dash {
                    to { stroke-dashoffset: 0; }
                }
            `}} />
        </div>
    )
}
