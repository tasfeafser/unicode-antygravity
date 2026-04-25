import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Manrope, Dela_Gothic_One, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@/components/ui/uiverse.css";
import { ThemeProvider } from "@/components/theme-provider";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { OnboardingTour } from "@/components/onboarding/OnboardingTour";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { FeedbackButton } from "@/components/community/FeedbackButton";
import { LanguageProvider } from "@/components/providers/LanguageProvider";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const manrope = Manrope({ subsets: ["latin"], variable: '--font-manrope' });
const delaGothic = Dela_Gothic_One({ weight: "400", subsets: ["latin"], variable: '--font-dela' });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: '--font-space' });

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
        url: "https://unicode.edu/og-image.png",
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
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${inter.variable} ${manrope.variable} ${delaGothic.variable} ${spaceGrotesk.variable}`}>
        <body className="font-inter selection-red bg-background text-foreground antialiased min-h-screen relative overflow-x-hidden">
          <PostHogProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
            >
              <LanguageProvider>
              {/* Global Background Effects for Red Noir Theme */}
              <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-black"></div>
                  <div className="absolute top-0 left-0 w-[1px] h-[1px] bg-transparent stars-1 animate-[animStar_50s_linear_infinite]"></div>
                  <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-transparent stars-2 animate-[animStar_80s_linear_infinite]"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px]"></div>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,black_40%,transparent_80%)]"></div>
              </div>

              {/* Top Blur Header */}
              <div className="gradient-blur hidden dark:block"></div>

              <div className="relative z-10">
                {children}
              </div>
              
              <CookieConsent />
              <OnboardingTour />
              <FeedbackButton />
              </LanguageProvider>
            </ThemeProvider>
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
