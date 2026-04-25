'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Download, Plus, Trash2, Edit3, Wand2, ArrowLeft, Eye, GripVertical, FileText } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Slide {
  id: string
  title: string
  content: string
}

const DEMO_SLIDES: Slide[] = [
  { id: '1', title: 'Introduction to Artificial Intelligence', content: '• AI is the simulation of human intelligence by machines\n• Key branches: Machine Learning, Deep Learning, NLP, Computer Vision\n• AI systems can learn, reason, and self-correct\n• Applications span healthcare, finance, transportation, and education' },
  { id: '2', title: 'History & Evolution of AI', content: '• 1950: Alan Turing proposes the Turing Test\n• 1956: "Artificial Intelligence" coined at Dartmouth Conference\n• 1997: IBM Deep Blue defeats world chess champion\n• 2012: Deep Learning revolution begins with AlexNet\n• 2022-2024: Large Language Models (GPT, Gemini) transform the field' },
  { id: '3', title: 'Machine Learning Fundamentals', content: '• Supervised Learning: labeled data → predictions (classification, regression)\n• Unsupervised Learning: finding patterns in unlabeled data (clustering)\n• Reinforcement Learning: learning through rewards and penalties\n• Key algorithms: Linear Regression, Decision Trees, Random Forests, SVMs' },
  { id: '4', title: 'Neural Networks & Deep Learning', content: '• Inspired by biological neurons in the human brain\n• Layers: Input → Hidden Layers → Output\n• Activation functions: ReLU, Sigmoid, Softmax\n• Convolutional Neural Networks (CNNs) for images\n• Recurrent Neural Networks (RNNs) for sequences\n• Transformers for language understanding' },
  { id: '5', title: 'Natural Language Processing (NLP)', content: '• Enables machines to understand and generate human language\n• Applications: chatbots, translation, sentiment analysis, summarization\n• Key techniques: tokenization, embeddings, attention mechanisms\n• Large Language Models: GPT-4, Gemini, Claude, LLaMA\n• RAG (Retrieval-Augmented Generation) for knowledge-grounded AI' },
  { id: '6', title: 'AI Ethics & Future Challenges', content: '• Bias in AI systems and training data\n• Privacy concerns with data collection\n• Job displacement and economic impact\n• AI safety and alignment research\n• Responsible AI development principles\n• The path to Artificial General Intelligence (AGI)' },
]

function generateId() { return Math.random().toString(36).substring(2, 9) }

export default function PPTGenPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [slides, setSlides] = useState<Slide[]>(DEMO_SLIDES)
  const [editingSlide, setEditingSlide] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [activePreview, setActivePreview] = useState(0)
  const [generationLog, setGenerationLog] = useState<string[]>([])
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [generationLog])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setGenerationLog(['🧠 Analyzing your prompt...'])

    try {
      const systemPrompt = `You are an AI presentation generator. Given a topic, create a structured slide deck.

INSTRUCTIONS:
- Generate 5-8 slides for the given topic
- Each slide must have a clear title and 4-6 bullet points
- Use concise, impactful bullet points (not full sentences)
- Start each bullet with "• "
- Make it educational and well-structured
- Progress logically from introduction to conclusion

OUTPUT FORMAT (STRICT - follow exactly):
===SLIDE===
TITLE: [slide title]
CONTENT:
• bullet point 1
• bullet point 2
• bullet point 3
• bullet point 4
===SLIDE===
TITLE: [next slide title]
CONTENT:
• bullet point 1
...

Do NOT include any other text outside this format. Just the slides.`

      setGenerationLog(prev => [...prev, '📡 Connecting to AI engine...'])

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: [{ role: 'user', content: `Create a presentation about: ${prompt}` }]
        })
      })

      setGenerationLog(prev => [...prev, '⚡ Generating slide content...'])

      const data = await res.json()
      const aiText = data.response || ''

      // Parse slides from AI response
      const slideBlocks = aiText.split('===SLIDE===').filter((b: string) => b.trim())
      const parsed: Slide[] = []

      for (const block of slideBlocks) {
        const titleMatch = block.match(/TITLE:\s*(.+)/i)
        const contentMatch = block.match(/CONTENT:\s*([\s\S]*?)(?:$)/i)
        if (titleMatch && contentMatch) {
          parsed.push({
            id: generateId(),
            title: titleMatch[1].trim(),
            content: contentMatch[1].trim()
          })
          setGenerationLog(prev => [...prev, `✓ Generated: "${titleMatch![1].trim()}"`])
          // Small delay for visual effect
          await new Promise(r => setTimeout(r, 200))
        }
      }

      if (parsed.length > 0) {
        setSlides(parsed)
        setGenerationLog(prev => [...prev, `✅ Done! ${parsed.length} slides generated.`])
      } else {
        setGenerationLog(prev => [...prev, '⚠️ Parsing issue — using fallback. Try rephrasing your prompt.'])
      }
    } catch (err) {
      setGenerationLog(prev => [...prev, '❌ Error connecting to AI. Please try again.'])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExport = async () => {
    try {
      const pptxgen = (await import('pptxgenjs')).default
      const prs = new pptxgen()

      prs.defineLayout({ name: 'UNICODE', width: 10, height: 5.63 })
      prs.layout = 'UNICODE'

      slides.forEach((slideData, index) => {
        const slide = prs.addSlide()
        slide.background = { fill: '0d0820' }

        // Accent line
        slide.addShape(prs.ShapeType.rect, {
          x: 0, y: 0, w: 0.08, h: 5.63, fill: { color: 'ef233c' }
        })

        // Bottom bar
        slide.addShape(prs.ShapeType.rect, {
          x: 0, y: 5.3, w: 10, h: 0.04, fill: { color: 'ef233c' }
        })

        // Slide number
        slide.addText(`${index + 1}`, {
          x: 9.2, y: 0.1, w: 0.7, h: 0.3, fontSize: 8, color: '9ca3af', align: 'right'
        })

        // Title
        slide.addText(slideData.title, {
          x: 0.4, y: 0.4, w: 9.2, h: 0.9,
          fontSize: 28, bold: true, color: 'ffffff', fontFace: 'Arial'
        })

        // Content
        const lines = slideData.content.split('\n').filter(l => l.trim())
        lines.forEach((line, li) => {
          slide.addText(line.replace(/^[•\-]\s*/, ''), {
            x: 0.6, y: 1.5 + li * 0.6, w: 8.8, h: 0.5,
            fontSize: 14, color: 'cbd5e1', fontFace: 'Arial',
            bullet: { type: 'bullet' }
          })
        })

        // Watermark
        slide.addText('Unicode Platform — AI Generated', {
          x: 0, y: 5.4, w: 10, h: 0.25,
          fontSize: 7, color: '4b5563', align: 'center'
        })
      })

      await prs.writeFile({ fileName: `Unicode_Presentation_${Date.now()}.pptx` })
    } catch (err) {
      console.error('Export error:', err)
      alert('Failed to export. Please try again.')
    }
  }

  const updateSlide = (id: string, field: 'title' | 'content', value: string) => {
    setSlides(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const removeSlide = (id: string) => {
    setSlides(prev => prev.filter(s => s.id !== id))
  }

  const addSlide = () => {
    setSlides(prev => [...prev, { id: generateId(), title: 'New Slide', content: '• Add your content here' }])
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-all border border-border">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Image src="/logo.png" alt="Unicode" width={32} height={32} className="rounded-lg" />
            <div>
              <h1 className="text-xl font-bold font-manrope flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#ef233c]" />
                AI Presentation Generator
              </h1>
              <p className="text-xs text-muted-foreground">{slides.length} slides • Describe your topic, AI generates slides</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-muted hover:bg-muted-foreground/20 border border-border rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4" /> {previewMode ? 'Editor' : 'Preview'}
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-[#ef233c] hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export PPTX
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col lg:flex-row gap-6">
        {/* Left Panel - Prompt */}
        <div className="w-full lg:w-96 flex flex-col gap-4 shrink-0">
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-border">
            <h2 className="text-lg font-bold font-manrope mb-4 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-[#ef233c]" /> AI Prompt
            </h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A presentation about Artificial Intelligence covering history, machine learning, neural networks, and future applications..."
              className="w-full h-32 bg-background border border-border rounded-xl p-4 text-sm focus:outline-none focus:border-[#ef233c] transition-colors resize-none mb-4"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-3 bg-[#ef233c] hover:bg-red-700 disabled:opacity-50 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Wand2 className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Generate Slides'}
            </button>

            {/* Quick prompts */}
            <div className="mt-4 flex flex-wrap gap-2">
              {['Artificial Intelligence', 'Blockchain Technology', 'Cloud Computing', 'Cybersecurity Basics'].map(q => (
                <button
                  key={q}
                  onClick={() => setPrompt(q)}
                  className="px-3 py-1 text-xs bg-muted border border-border rounded-full hover:border-[#ef233c]/50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Generation Log */}
          {generationLog.length > 0 && (
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-border">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Generation Log</h3>
              <div ref={logRef} className="space-y-1 max-h-40 overflow-y-auto font-mono text-xs">
                {generationLog.map((line, i) => (
                  <div key={i} className={`${line.startsWith('✓') ? 'text-green-400' : line.startsWith('❌') ? 'text-red-400' : 'text-muted-foreground'}`}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Editor / Preview */}
        <div className="flex-1">
          {previewMode ? (
            /* Slide Preview Mode */
            <div className="rounded-2xl bg-white/[0.02] border border-border overflow-hidden">
              <div className="flex h-[600px]">
                {/* Thumbnail strip */}
                <div className="w-32 bg-background border-r border-border overflow-y-auto p-2 space-y-2">
                  {slides.map((slide, i) => (
                    <button
                      key={slide.id}
                      onClick={() => setActivePreview(i)}
                      className={`w-full aspect-video rounded-lg border p-2 text-left transition-all ${
                        activePreview === i ? 'border-[#ef233c] bg-[#ef233c]/5' : 'border-border hover:border-white/20'
                      }`}
                    >
                      <div className="text-[8px] font-bold truncate">{slide.title}</div>
                      <div className="text-[6px] text-muted-foreground mt-1 line-clamp-2">{slide.content}</div>
                    </button>
                  ))}
                </div>

                {/* Main preview */}
                <div className="flex-1 p-8 flex items-center justify-center bg-zinc-950">
                  <div className="w-full max-w-3xl aspect-video bg-gradient-to-br from-[#0d0820] to-[#0a0a1a] border border-white/10 rounded-xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#ef233c]"></div>
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ef233c]/40"></div>
                    <div className="absolute top-4 right-4 text-[10px] text-white/20 font-mono">{activePreview + 1}/{slides.length}</div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#ef233c]/5 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-0.5 bg-[#ef233c]"></div>
                        <span className="text-[9px] text-[#ef233c] uppercase tracking-widest font-bold">Unicode AI</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-6">{slides[activePreview]?.title}</h2>
                      <div className="space-y-2">
                        {slides[activePreview]?.content.split('\n').filter(l => l.trim()).map((line, i) => (
                          <div key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#ef233c] shrink-0"></span>
                            {line.replace(/^[•\-]\s*/, '')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Editor Mode */
            <div className="space-y-4">
              {slides.map((slide, index) => (
                <div key={slide.id} className="group relative bg-white/[0.02] border border-border rounded-xl p-6 hover:border-white/20 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditingSlide(editingSlide === slide.id ? null : slide.id)} className="p-2 bg-muted hover:bg-muted-foreground/20 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeSlide(slide.id)} className="p-2 bg-muted hover:bg-red-500/20 hover:text-red-400 rounded-md text-muted-foreground transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground shrink-0">
                        {index + 1}
                      </div>
                      <GripVertical className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                    <div className="flex-1">
                      {editingSlide === slide.id ? (
                        <>
                          <input
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-lg font-bold font-manrope mb-3 focus:outline-none focus:border-[#ef233c]"
                          />
                          <textarea
                            value={slide.content}
                            onChange={(e) => updateSlide(slide.id, 'content', e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground focus:outline-none focus:border-[#ef233c] resize-none h-32"
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="text-lg font-bold font-manrope mb-2">{slide.title}</h3>
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{slide.content}</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addSlide}
                className="w-full py-6 border-2 border-dashed border-border hover:border-[#ef233c]/50 rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-[#ef233c] transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add New Slide</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
