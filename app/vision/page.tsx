'use client'

import { ArrowLeft, Sparkles, BrainCircuit, ShieldAlert, Terminal, Code2 } from 'lucide-react'
import Link from 'next/link'

export default function VisionPage() {
  return (
    <div className="min-h-screen p-6 md:p-20 relative z-10">
      <div className="max-w-4xl mx-auto rounded-3xl bg-white/[0.02] border border-border p-8 md:p-12 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#ef233c]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </Link>

        <div className="relative z-10 font-serif">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            The Vision: Unicode Academic OS
          </h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
            <p className="italic text-gray-400 text-xl border-l-4 border-[#ef233c] pl-6 py-2">
              "Distinguished guests and fellow innovators, Most students enter Computer Science with a dream, but many are immediately met with a wall."
            </p>
            
            <p>
              Imagine being a freshman with zero background, suddenly expected to navigate a Linux terminal, document complex software architectures, and master the syntax of three different languages at once. The drop-out rate in CS isn't due to a lack of talent; it’s due to a lack of a bridge.
            </p>
            <p>
              Today, I am introducing a platform that is that bridge. This isn't just another 'AI chatbot.' This is a unified <strong className="text-foreground">Academic OS</strong> designed to take a student from 'Hello World' to 'Software Engineer.'
            </p>

            <div className="py-6 space-y-12">
              <section>
                <h4 className="text-xl font-medium text-foreground mb-3 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded bg-[#ef233c]/20 text-[#ef233c] text-sm">1</span> 
                  The Core Philosophy: Symmetry in Learning
                </h4>
                <p className="pl-11 text-gray-400">
                  Our platform is built on the principle of symmetry. We have integrated every disparate tool a student needs—the IDE, the documentation suite, the presentation builder, and the security lab—into one seamless environment.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-medium text-foreground mb-3 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded bg-orange-500/20 text-orange-400 text-sm">2</span> 
                  The Intelligence Layer
                </h4>
                <div className="pl-11 text-gray-400 space-y-4">
                  <p>At the heart of this platform is a specialized AI engine.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Software Management:</strong> Generates industry-standard documentation (SRS, UML) to teach structural design.</li>
                    <li><strong>Academic Performance:</strong> Transforms raw technical notes into high-impact presentations instantly.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h4 className="text-xl font-medium text-foreground mb-3 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded bg-yellow-500/20 text-yellow-400 text-sm">3</span> 
                  The Integrated Sandbox
                </h4>
                <p className="pl-11 text-gray-400">
                  A full In-Browser IDE and Terminal. Whether it's Python, C++, or Rust, students can execute code directly within the interface with zero local setup.
                </p>
              </section>

              <section>
                <h4 className="text-xl font-medium text-foreground mb-3 flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded bg-red-500/20 text-red-400 text-sm">4</span> 
                  Cyber Security & Linux
                </h4>
                <div className="pl-11 text-gray-400 space-y-4">
                   <p>Lowering the barrier to command-line mastery:</p>
                   <ul className="list-disc pl-5 space-y-2">
                     <li><strong>Guided Simulations:</strong> Safely learn Linux without breaking your own machine.</li>
                     <li><strong>Security Lab:</strong> Practice ethical hacking and network security through guided RAG walkthroughs.</li>
                   </ul>
                </div>
              </section>

              <section>
                <h4 className="text-xl font-medium text-foreground mb-3 flex items-center gap-3">
                   <span className="flex items-center justify-center w-8 h-8 rounded bg-pink-500/20 text-pink-400 text-sm">5</span>
                   The Academic Concierge
                </h4>
                <p className="pl-11 text-gray-400">
                  The AI tracks your syllabus, anticipates hurdles, and maps every course from Discrete Math to OS. It is a mentor that never sleeps.
                </p>
              </section>
            </div>

            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-[#ef233c]/10 to-orange-500/10 border border-border text-center">
               <h3 className="text-2xl font-bold mb-4">A Success Engine</h3>
               <p className="text-gray-400">
                 We are ensuring the next generation of tech leaders isn't defined by what they knew before college, but by how fast they can learn during it.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
