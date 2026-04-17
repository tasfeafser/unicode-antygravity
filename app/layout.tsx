import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { FeedbackButton } from "@/components/community/FeedbackButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Unicode - AI-Powered CS Education Platform",
  description: "Master Computer Science with our AI-integrated IDE, Linux sandboxes, and interactive labs. The future of CS education is here.",
  keywords: ["Computer Science", "AI IDE", "Coding", "Linux", "Cybersecurity", "Education", "Learning"],
  authors: [{ name: "Unicode Team" }],
  openGraph: {
    title: "Unicode - Master CS with AI",
    description: "Practice coding in a real IDE with AI assistance and secure sandboxes.",
    url: "https://unicode.edu",
    siteName: "Unicode",
    images: [
      {
        url: "https://unicode.edu/og-image.png", // Dynamic OG image logic can be added later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Unicode - Master CS with AI",
    description: "The AI platform for next-gen Computer Science students.",
    images: ["https://unicode.edu/og-image.png"],
  },
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
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen relative bg-background text-foreground overflow-x-hidden">
                {/* Animated Vertical Flowing Background - Opacity depends on theme */}
                <div className="fixed inset-0 pointer-events-none opacity-[0.15] dark:opacity-[0.25] select-none flex justify-center gap-[10vw] overflow-hidden font-mono text-xl tracking-widest text-green-400">
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
                <CookieConsent />
                <OnboardingTour />
                <FeedbackButton />
              </div>
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
