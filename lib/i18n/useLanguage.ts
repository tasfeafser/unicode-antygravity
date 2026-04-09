'use client'

import { useState, useEffect } from 'react'
import { translations, Language } from './translations'

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en')
  
  useEffect(() => {
    // Read from localStorage on mount
    const savedLang = localStorage.getItem('unicode-lang') as Language
    if (savedLang && ['en', 'zh'].includes(savedLang)) {
      setLanguage(savedLang)
    }

    // Optional: listen to storage events if changed in another tab
    const handleStorage = () => {
      const current = localStorage.getItem('unicode-lang') as Language
      if (current && ['en', 'zh'].includes(current) && current !== language) {
        setLanguage(current)
      }
    }
    
    // We can also poll or set up an interval if standard events aren't fast enough in some Next.js app setups
    const interval = setInterval(() => {
      const current = localStorage.getItem('unicode-lang') as Language
      if (current && ['en', 'zh'].includes(current)) {
        setLanguage(current)
      }
    }, 1000)

    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      clearInterval(interval)
    }
  }, [language])

  const setLanguageGlobal = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('unicode-lang', lang)
  }

  return { language, t: translations[language], setLanguage: setLanguageGlobal }
}
