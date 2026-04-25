import React from 'react'
import { Layers, Plus, Settings, Play, Smartphone, Monitor } from 'lucide-react'

export default function AppBuilderPage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-inter pt-24 px-6 flex flex-col h-screen">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ef233c]/20 rounded-lg text-[#ef233c]">
                        <Layers className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold font-manrope">AppBuilder Studio</h1>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 rounded-lg flex items-center gap-2 text-sm"><Monitor className="w-4 h-4"/> Desktop</button>
                    <button className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 rounded-lg flex items-center gap-2 text-sm"><Smartphone className="w-4 h-4"/> Mobile</button>
                    <button className="px-6 py-2 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg flex items-center gap-2 font-bold"><Play className="w-4 h-4"/> Run App</button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 pb-6 overflow-hidden">
                {/* Components Panel */}
                <div className="w-64 bg-white/[0.02] border border-border rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-sm text-muted-foreground mb-4 uppercase tracking-wider">UI Components</h3>
                    <div className="space-y-2">
                        {['Navigation Bar', 'Hero Section', 'Feature Grid', 'Data Table', 'Form Input', 'Button'].map((comp, i) => (
                            <div key={i} className="p-3 bg-background border border-border hover:border-[#ef233c]/50 rounded-lg cursor-grab flex items-center gap-2 text-sm">
                                <Plus className="w-4 h-4 text-muted-foreground" />
                                {comp}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Canvas Canvas */}
                <div className="flex-1 bg-[url('/grid-pattern.svg')] bg-center bg-[#050505] border border-border rounded-xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    
                    {/* Simulated Canvas Box */}
                    <div className="w-[800px] h-[600px] bg-background border border-white/20 shadow-2xl rounded-lg relative z-10 flex flex-col">
                        <div className="h-14 border-b border-border flex items-center px-6">
                            <div className="text-xl font-bold font-manrope">My App Demo</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <div className="w-16 h-16 border-2 border-dashed border-zinc-600 rounded-xl flex items-center justify-center mb-4">
                                <Plus className="w-6 h-6" />
                            </div>
                            <p>Drag and drop components here</p>
                        </div>
                    </div>
                </div>

                {/* Properties Panel */}
                <div className="w-72 bg-white/[0.02] border border-border rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-sm text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Properties
                    </h3>
                    <div className="p-4 bg-background border border-border rounded-lg flex flex-col gap-4 text-sm text-muted-foreground">
                        <p className="text-center italic text-xs">Select a component to edit properties</p>
                        <hr className="border-border"/>
                        <div className="flex justify-between items-center"><span className="text-xs uppercase">Width</span> <span className="text-foreground">100%</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs uppercase">Height</span> <span className="text-foreground">Auto</span></div>
                        <div className="flex justify-between items-center"><span className="text-xs uppercase">Background</span> <div className="w-4 h-4 bg-background border border-white/20 rounded-sm"></div></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
