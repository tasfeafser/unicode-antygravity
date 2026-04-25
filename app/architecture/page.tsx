import React from 'react'
import { Grid3X3, Save, Download, ZoomIn, ZoomOut, Move } from 'lucide-react'

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-inter pt-24 px-6 flex flex-col h-screen">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ef233c]/20 rounded-lg text-[#ef233c]">
                        <Grid3X3 className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold font-manrope">System Architecture Modeler</h1>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 rounded-lg flex items-center gap-2"><Save className="w-4 h-4"/> Save</button>
                    <button className="px-4 py-2 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg flex items-center gap-2 font-bold"><Download className="w-4 h-4"/> Export SVG</button>
                </div>
            </div>

            <div className="flex flex-1 gap-4 pb-6 overflow-hidden">
                {/* Toolbar */}
                <div className="w-16 bg-white/[0.02] border border-border rounded-xl flex flex-col items-center py-4 gap-4">
                    <button className="p-3 bg-muted-foreground/20 rounded-lg text-foreground"><Move className="w-5 h-5"/></button>
                    <div className="w-8 h-px bg-muted-foreground/20"></div>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Database"><div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center text-[10px]">DB</div></button>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Server"><div className="w-6 h-6 border-2 border-current rounded bg-transparent flex items-center justify-center text-[10px]">API</div></button>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Client"><div className="w-6 h-6 border-2 border-current rounded-sm flex items-center justify-center text-[10px]">WEB</div></button>
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground" title="Queue"><div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center text-[10px] scale-y-50">Q</div></button>
                </div>

                {/* Canvas */}
                <div className="flex-1 bg-[#0a0a0a] border border-border rounded-xl relative overflow-hidden">
                    {/* Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                    
                    {/* View Controls */}
                    <div className="absolute bottom-4 right-4 flex bg-background border border-border rounded-lg overflow-hidden">
                        <button className="p-2 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"><ZoomOut className="w-4 h-4"/></button>
                        <div className="w-px bg-muted-foreground/20"></div>
                        <div className="px-3 py-2 text-xs font-mono flex items-center">100%</div>
                        <div className="w-px bg-muted-foreground/20"></div>
                        <button className="p-2 hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground"><ZoomIn className="w-4 h-4"/></button>
                    </div>

                    {/* Nodes Simulation */}
                    <div className="absolute inset-0 pointer-events-none">
                        <svg className="w-full h-full">
                            <path d="M 250 200 L 400 150" stroke="white" strokeWidth="2" strokeDasharray="5,5" className="opacity-20 animate-[dash_20s_linear_infinite]" />
                            <path d="M 250 200 L 400 250" stroke="#ef233c" strokeWidth="2" className="opacity-50" />
                            <path d="M 400 150 L 550 200" stroke="white" strokeWidth="2" className="opacity-20" />
                            <path d="M 400 250 L 550 200" stroke="white" strokeWidth="2" className="opacity-20" />
                        </svg>
                    </div>

                    <div className="absolute top-[170px] left-[150px] w-32 h-16 bg-background border-2 border-blue-500/50 rounded-lg flex items-center justify-center font-mono text-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        Load Balancer
                    </div>
                    <div className="absolute top-[120px] left-[400px] w-32 h-16 bg-background border-2 border-zinc-500 rounded-lg flex items-center justify-center font-mono text-sm">
                        App Server 1
                    </div>
                    <div className="absolute top-[220px] left-[400px] w-32 h-16 bg-background border-2 border-[#ef233c]/50 rounded-lg flex items-center justify-center font-mono text-sm shadow-[0_0_15px_rgba(239,35,60,0.2)]">
                        App Server 2
                    </div>
                    <div className="absolute top-[160px] left-[550px] w-32 h-24 bg-background border-2 border-yellow-500/50 rounded-full flex flex-col items-center justify-center font-mono text-sm shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                        <div>PostgreSQL</div>
                        <div className="text-[10px] text-muted-foreground mt-1">Master DB</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
