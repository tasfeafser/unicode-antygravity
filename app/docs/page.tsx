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
        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        Loading generator...
      </div>
    )
  }
)

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#08080f] text-white">
      {/* Nav */}
      <div className="border-b border-white/5 bg-[#0a0a16]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center hover:bg-purple-500/15 hover:border-purple-500/30 transition-all"
            >
              <ArrowLeft size={14} className="text-slate-400" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center">
                <Sparkles size={15} className="text-purple-400" />
              </div>
              <span className="font-bold text-white">Docs & Slides</span>
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
