'use client'

import { useState } from 'react'
import { Bot, FileText, Download, Play, Plus, Trash, Edit3, Wand2 } from 'lucide-react'
import { Loader } from '@/components/ui/Loader'
import { SearchInput } from '@/components/ui/SearchInput'

export default function PPTGenPage() {
    const [prompt, setPrompt] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)
    const [hasGenerated, setHasGenerated] = useState(false)
    
    const [slides, setSlides] = useState([
        { id: 1, title: 'Introduction to AI Systems', content: 'Artificial Intelligence encompasses machine learning, deep learning, and neural networks to solve complex computational problems.' },
        { id: 2, title: 'Neural Network Architecture', content: 'A network of artificial neurons organized into layers: input layer, hidden layers, and output layer. Each connection has a weight that adjusts during training.' },
        { id: 3, title: 'Future Applications', content: 'From autonomous vehicles to personalized medicine, AI is transforming every major industry through predictive analytics and automation.' }
    ])

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return
        
        setIsGenerating(true)
        setHasGenerated(false)
        
        // Simulate API call
        setTimeout(() => {
            setIsGenerating(false)
            setHasGenerated(true)
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-inter pt-24 px-6 relative">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative z-10">
                
                {/* Left Panel - Prompt & Settings */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-border backdrop-blur-md">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#ef233c]/20 rounded-lg text-[#ef233c]">
                                <Bot className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold font-manrope">AI Presentation Generator</h2>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-6">Describe the presentation you want to create. The AI will generate a structured slide deck.</p>
                        
                        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Prompt</label>
                                <textarea 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g., A 10-slide presentation on the history of computing, aimed at high school students..."
                                    className="w-full h-32 bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:outline-none focus:border-[#ef233c] transition-colors resize-none"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Theme</label>
                                    <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-[#ef233c]">
                                        <option>Red Noir (Default)</option>
                                        <option>Cyberpunk</option>
                                        <option>Minimalist</option>
                                        <option>Corporate</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Slides</label>
                                    <select className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground focus:outline-none focus:border-[#ef233c]">
                                        <option>Auto</option>
                                        <option>5 Slides</option>
                                        <option>10 Slides</option>
                                        <option>15 Slides</option>
                                    </select>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isGenerating || !prompt.trim()}
                                className="w-full py-4 mt-4 bg-[#ef233c] hover:bg-red-700 disabled:opacity-50 disabled:hover:bg-[#ef233c] text-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <Wand2 className="w-5 h-5" />
                                {isGenerating ? 'Generating...' : 'Generate Presentation'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Panel - Edit & Preview */}
                <div className="w-full lg:w-2/3 flex flex-col gap-6">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-border backdrop-blur-md min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-manrope flex items-center gap-2">
                                <Edit3 className="w-5 h-5 text-[#ef233c]" /> 
                                Editor & Preview
                            </h2>
                            
                            <div className="flex gap-3">
                                <button className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 border border-border rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <Play className="w-4 h-4" /> Preview
                                </button>
                                <button className="px-4 py-2 bg-[#ef233c] hover:bg-red-700 text-foreground rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Export PPTX
                                </button>
                            </div>
                        </div>

                        {isGenerating ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <Loader />
                                <p className="mt-8 text-muted-foreground animate-pulse">AI is synthesizing information and designing slides...</p>
                            </div>
                        ) : hasGenerated || true ? (
                            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
                                {slides.map((slide, index) => (
                                    <div key={slide.id} className="group relative bg-background border border-border rounded-xl p-6 hover:border-white/30 transition-colors">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-muted hover:bg-muted-foreground/20 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 bg-muted hover:bg-red-500/20 hover:text-red-400 rounded-md text-muted-foreground transition-colors">
                                                <Trash className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground shrink-0">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <input 
                                                    type="text" 
                                                    defaultValue={slide.title}
                                                    className="w-full bg-transparent text-xl font-bold font-manrope text-foreground focus:outline-none mb-3"
                                                />
                                                <textarea 
                                                    defaultValue={slide.content}
                                                    className="w-full bg-transparent text-muted-foreground focus:outline-none resize-none h-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                
                                <button className="w-full py-6 border-2 border-dashed border-border hover:border-[#ef233c]/50 rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-[#ef233c] transition-colors">
                                    <Plus className="w-5 h-5" />
                                    <span className="font-medium">Add New Slide</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center px-10">
                                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                                    <FileText className="w-10 h-10 text-zinc-600" />
                                </div>
                                <h3 className="text-xl font-bold font-manrope mb-2">No Presentation Generated Yet</h3>
                                <p className="text-muted-foreground">Enter a prompt on the left to start generating your intelligent presentation.</p>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
            
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[#ef233c]/10 rounded-full blur-[120px]"></div>
            </div>
        </div>
    )
}
