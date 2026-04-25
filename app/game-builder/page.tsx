import React from 'react'
import { Gamepad2, Play, Square, Settings, Box, Layers } from 'lucide-react'

export default function GameBuilderPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-foreground font-inter pt-24 px-6 flex flex-col h-screen">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#ef233c]/20 rounded-lg text-[#ef233c]">
                        <Gamepad2 className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold font-manrope">Unigame Engine</h1>
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-2 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg flex items-center gap-2 font-bold"><Play className="w-4 h-4"/> Play Scene</button>
                    <button className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 rounded-lg flex items-center gap-2"><Square className="w-4 h-4"/> Stop</button>
                </div>
            </div>

            <div className="flex flex-1 gap-4 pb-6 overflow-hidden">
                {/* Hierarchy */}
                <div className="w-64 bg-background border border-border rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Hierarchy
                    </h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                        <li className="p-2 bg-muted rounded-md flex items-center gap-2"><Box className="w-3 h-3"/> Main Camera</li>
                        <li className="p-2 hover:bg-muted rounded-md flex items-center gap-2"><Box className="w-3 h-3"/> Directional Light</li>
                        <li className="p-2 hover:bg-muted rounded-md flex items-center gap-2"><Box className="w-3 h-3 text-[#ef233c]"/> Player Character</li>
                        <li className="p-2 hover:bg-muted rounded-md flex items-center gap-2 pl-6"><Box className="w-3 h-3"/> Mesh</li>
                        <li className="p-2 hover:bg-muted rounded-md flex items-center gap-2 pl-6"><Box className="w-3 h-3"/> Collider</li>
                        <li className="p-2 hover:bg-muted rounded-md flex items-center gap-2"><Box className="w-3 h-3"/> Ground Plane</li>
                    </ul>
                </div>

                {/* Viewport */}
                <div className="flex-1 bg-zinc-900 border border-border rounded-xl relative overflow-hidden flex items-center justify-center">
                    <div className="absolute top-4 left-4 flex gap-2">
                        <button className="px-3 py-1 bg-background/50 backdrop-blur text-xs rounded border border-border">3D</button>
                        <button className="px-3 py-1 bg-background/50 backdrop-blur text-xs rounded border border-border">2D</button>
                    </div>
                    
                    {/* Simulated 3D Environment */}
                    <div className="relative w-full h-full perspective-[1000px] flex items-center justify-center">
                        <div className="w-64 h-64 border border-zinc-700 transform rotate-x-60 rotate-z-45 flex items-center justify-center bg-zinc-800/20">
                            {/* Player Cube */}
                            <div className="w-8 h-8 bg-[#ef233c] absolute shadow-[0_0_15px_#ef233c]"></div>
                            {/* Grid */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                        </div>
                    </div>
                </div>

                {/* Inspector */}
                <div className="w-72 bg-background border border-border rounded-xl p-4 flex flex-col">
                    <h3 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Inspector
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="text-sm font-bold border-b border-border pb-2 mb-2">Transform</div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                                <div className="flex flex-col"><span className="text-muted-foreground mb-1">X</span><input className="bg-muted border border-border rounded p-1 text-center" defaultValue="0" /></div>
                                <div className="flex flex-col"><span className="text-muted-foreground mb-1">Y</span><input className="bg-muted border border-border rounded p-1 text-center" defaultValue="1" /></div>
                                <div className="flex flex-col"><span className="text-muted-foreground mb-1">Z</span><input className="bg-muted border border-border rounded p-1 text-center" defaultValue="0" /></div>
                            </div>
                        </div>
                        <div>
                            <div className="text-sm font-bold border-b border-border pb-2 mb-2">Rigidbody</div>
                            <div className="flex items-center justify-between text-xs">
                                <span>Use Gravity</span>
                                <input type="checkbox" defaultChecked className="accent-[#ef233c]" />
                            </div>
                            <div className="flex items-center justify-between text-xs mt-2">
                                <span>Mass</span>
                                <input className="w-16 bg-muted border border-border rounded p-1 text-center" defaultValue="1.0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
