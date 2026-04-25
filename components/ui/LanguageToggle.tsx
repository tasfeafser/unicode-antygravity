'use client'

import { Languages } from 'lucide-react'
import { useLanguage } from '@/components/providers/LanguageProvider'

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage()

  return (
    <button 
      onClick={toggleLang}
      className="p-2 rounded-full bg-muted/20 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
      title="Translate to Chinese / English"
    >
      <Languages className="w-5 h-5" />
      <span className="text-xs font-bold uppercase">{lang === 'en' ? 'ZH' : 'EN'}</span>
    </button>
  )
}
