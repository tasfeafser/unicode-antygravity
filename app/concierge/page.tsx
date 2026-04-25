import React from 'react'
import { BrainCircuit, Send, Calendar, Clock, Book } from 'lucide-react'

export default function ConciergePage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-inter pt-24 px-6 pb-6">
            <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-120px)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#ef233c]/20 rounded-lg text-[#ef233c]">
                        <BrainCircuit className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold font-manrope">Academic Concierge</h1>
                        <p className="text-sm text-muted-foreground">24/7 AI planning and scheduling for your CS degree.</p>
                    </div>
                </div>

                <div className="flex flex-1 gap-6 min-h-0">
                    {/* Chat Section */}
                    <div className="flex-1 flex flex-col bg-white/[0.02] border border-border rounded-2xl overflow-hidden">
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            {/* AI Message */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#ef233c] flex items-center justify-center shrink-0">
                                    <BrainCircuit className="w-4 h-4 text-foreground" />
                                </div>
                                <div className="bg-muted border border-border rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                                    <p className="text-sm">Hello! I'm your academic concierge. Based on your current progress in "Data Structures", I'd recommend allocating 3 hours this week to prepare for the upcoming assessment.</p>
                                    <p className="text-sm mt-2">Would you like me to schedule study sessions in your calendar?</p>
                                </div>
                            </div>
                            
                            {/* User Message */}
                            <div className="flex gap-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                                    <span className="text-xs font-bold">ME</span>
                                </div>
                                <div className="bg-background border border-border rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                    <p className="text-sm">Yes, please schedule 1 hour each on Monday, Wednesday, and Friday evening.</p>
                                </div>
                            </div>

                            {/* AI Action Message */}
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-[#ef233c] flex items-center justify-center shrink-0">
                                    <BrainCircuit className="w-4 h-4 text-foreground" />
                                </div>
                                <div className="bg-muted border border-border rounded-2xl rounded-tl-none p-4 max-w-[80%] border-l-2 border-l-[#ef233c]">
                                    <p className="text-sm font-bold text-[#ef233c] mb-2 flex items-center gap-2"><Calendar className="w-4 h-4" /> Calendar Updated</p>
                                    <p className="text-sm text-muted-foreground">I've added 3 new study blocks for "Binary Trees & Heaps" to your schedule.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 border-t border-border bg-background">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Ask for schedule adjustments, course recommendations..." 
                                    className="w-full bg-muted border border-border rounded-xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-[#ef233c] text-foreground"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#ef233c] rounded-lg text-foreground hover:bg-red-700 transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Schedule Widget */}
                    <div className="w-80 flex flex-col gap-4">
                        <div className="bg-white/[0.02] border border-border rounded-2xl p-6">
                            <h3 className="font-bold font-manrope mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#ef233c]" /> Upcoming Plan
                            </h3>
                            <div className="space-y-4">
                                <div className="border-l-2 border-[#ef233c] pl-3">
                                    <div className="text-xs text-[#ef233c] font-bold mb-1">TODAY, 6:00 PM</div>
                                    <div className="text-sm font-medium">Study: Binary Trees</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> 1 hour</div>
                                </div>
                                <div className="border-l-2 border-zinc-700 pl-3">
                                    <div className="text-xs text-muted-foreground font-bold mb-1">WEDNESDAY, 6:00 PM</div>
                                    <div className="text-sm font-medium">Study: Heaps</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock className="w-3 h-3"/> 1 hour</div>
                                </div>
                                <div className="border-l-2 border-blue-500 pl-3">
                                    <div className="text-xs text-blue-400 font-bold mb-1">FRIDAY, 2:00 PM</div>
                                    <div className="text-sm font-medium">Lab Submission</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Book className="w-3 h-3"/> Data Structures</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
