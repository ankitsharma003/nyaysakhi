'use client'

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'
import { useLanguage } from './language-context'

interface ChatbotContextType {
  isChatbotEnabled: boolean
  toggleChatbot: () => void
  language: string
  setLanguage: (lang: string) => void
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined)

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true)

  // Hook into global LanguageProvider
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage()
  const [language, setLanguage] = useState<string>(appLanguage)

  // Keep chatbot language in sync with app language
  useEffect(() => {
    setLanguage(appLanguage)
  }, [appLanguage])

  const toggleChatbot = () => {
    setIsChatbotEnabled((prev) => !prev)
  }

  return (
    <ChatbotContext.Provider
      value={{
        isChatbotEnabled,
        toggleChatbot,
        language,
        setLanguage: (lang: string) => {
          setLanguage(lang)
          setAppLanguage(lang as any) // sync with global
        },
      }}
    >
      {children}
    </ChatbotContext.Provider>
  )
}

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider')
  }
  return context
}
