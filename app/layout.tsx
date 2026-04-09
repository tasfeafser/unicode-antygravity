import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unicode - CS Education Platform",
  description: "Learn Computer Science with AI-powered tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const BACKGROUND_TEXT_1 = "function init() { return true; } const x = 42; 逻辑 循环 函数 数据 SELECT * FROM users; import { auth } from '@clerk/nextjs'; 状态 变量 异步 并发 def fibonacci(n): ∑(n=1 to ∞) 1/n² = π²/6 ∫e^x dx = e^x + C O(N log N) ".repeat(3)
  const BACKGROUND_TEXT_2 = "class Unicode { constructor() { this.active = true } } 算法 结构 系统 架构 git commit -m 'initial commit' chmod 777 /var/www E = mc² 🚀 💻 🌐 ∇ × B = μ₀J + μ₀ε₀(∂E/∂t) { JSON: 'Data' } ".repeat(3)

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="min-h-screen relative bg-[#0A0A0B] text-white overflow-x-hidden">
            {/* Animated Vertical Flowing Background */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.25] select-none flex justify-center gap-[10vw] overflow-hidden font-mono text-xl tracking-widest text-green-400">
              <div className="bg-float-vertical">
                <div className="writing-vertical">{BACKGROUND_TEXT_1}</div>
                <div className="writing-vertical">{BACKGROUND_TEXT_1}</div>
              </div>
              <div className="bg-float-vertical-reverse text-blue-400">
                <div className="writing-vertical">{BACKGROUND_TEXT_2}</div>
                <div className="writing-vertical">{BACKGROUND_TEXT_2}</div>
              </div>
              <div className="bg-float-vertical text-purple-400">
                <div className="writing-vertical">{BACKGROUND_TEXT_1}</div>
                <div className="writing-vertical">{BACKGROUND_TEXT_1}</div>
              </div>
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
