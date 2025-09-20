'use client'

import { useAuth } from '@/lib/auth-context'
import { useChatbot } from '@/lib/chatbot-context'
import AIChatbot from './ai-chatbot'

export function ChatbotWrapper() {
  const { isAuthenticated } = useAuth()
  const { isChatbotEnabled, language, setLanguage } = useChatbot()

  // Only show chatbot for authenticated users
  if (!isAuthenticated || !isChatbotEnabled) {
    return null
  }

  return <AIChatbot language={language} onLanguageChange={setLanguage} />
}
