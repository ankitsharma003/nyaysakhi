'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type AppLanguage = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn'

interface LanguageContextType {
  language: AppLanguage
  setLanguage: (lang: AppLanguage) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>('en')

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
