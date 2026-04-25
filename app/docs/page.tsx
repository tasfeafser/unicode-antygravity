'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft, Sparkles, BookOpen } from 'lucide-react'

const PPTGenerator = dynamic(
  () => import('@/components/ppt/PPTGenerator').then(m => m.PPTGenerator),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-500 text-sm">
        <div className="w-5 h-5 border-2 border-[#ef233c] border-t-transparent rounded-full animate-spin" />
        Loading generator...
      </div>
    )
  }
)

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      {/* Nav */}
      <div className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-muted border border-white/8 flex items-center justify-center hover:bg-[#ef233c]/15 hover:border-[#ef233c]/30 transition-all"
            >
              <ArrowLeft size={14} className="text-slate-400" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#ef233c]/10 border border-[#ef233c]/20 rounded-lg flex items-center justify-center">
                <Sparkles size={15} className="text-[#ef233c]" />
              </div>
              <span className="font-bold text-foreground">Docs & Slides</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <BookOpen size={12} />
            <span>AI-Powered Generation</span>
          </div>
        </div>
      </div>

      {/* PPT Generator — client only */}
      <PPTGenerator />
    </div>
  )
}
