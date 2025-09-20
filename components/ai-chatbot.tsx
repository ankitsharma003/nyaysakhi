// components/ai-chatbot.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { detectLanguage, translateText } from '@/lib/multilingual-api'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  language: string
}

interface ChatbotProps {
  language: string
  onLanguageChange: (lang: string) => void
}

export default function AIChatbot({
  language,
  onLanguageChange,
}: ChatbotProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  // Focus input when chat opens (client only)
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Initialize welcome message when language or messages cleared
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: `welcome-${language}-${Date.now()}`,
        text:
          language === 'hi'
            ? 'नमस्ते! मैं आपकी कानूनी सहायता के लिए यहाँ हूँ। आप कैसे मदद कर सकता हूँ?'
            : "Hello! I'm here to help you with legal assistance. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        language,
      }
      setMessages([welcomeMessage])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    // optimistic UI: add user message first
    const userMsgId = `user-${Date.now()}`
    const userMessage: Message = {
      id: userMsgId,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      language,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // Determine message language (try to detect)
    let messageLanguage = language
    try {
      // detectLanguage is synchronous in our lib, but keep try/catch for robustness
      const detected = detectLanguage(inputText)
      if (detected) messageLanguage = detected
    } catch (err) {
      console.warn('Language detection failed, using UI language', err)
    }

    try {
      // Call backend chatbot endpoint (adjust path per your API)
      const payload = {
        message: inputText,
        language: messageLanguage,
        userRole: user?.role ?? 'user',
        context: {
          page: typeof window !== 'undefined' ? window.location.pathname : '',
          userInfo: { name: user?.name, role: user?.role },
        },
      }

      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Request failed (${res.status})`)
      }

      const data = await res.json()
      let responseText: string = data?.response ?? data?.message ?? ''

      // If the chatbot responded in a different language, translate to UI language
      if (messageLanguage !== language && responseText) {
        try {
          responseText = await translateText(
            responseText,
            messageLanguage as any,
            language as any
          )
        } catch (err) {
          console.warn('Translation failed, using original response', err)
        }
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text:
          responseText ||
          (language === 'hi'
            ? 'मुझे उत्तर नहीं मिला।'
            : "I didn't get an answer."),
        sender: 'bot',
        timestamp: new Date(),
        language: messageLanguage,
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err: any) {
      console.error('Chatbot error:', err)
      const errorText =
        language === 'hi'
          ? 'क्षमा करें, एक त्रुटि हुई है। कृपया बाद में पुनः प्रयास करें।'
          : 'Sorry, an error occurred. Please try again later.'

      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
        language,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (language === 'hi') {
      if (hour < 12) return 'सुप्रभात'
      if (hour < 17) return 'नमस्कार'
      return 'शुभ संध्या'
    } else {
      if (hour < 12) return 'Good morning'
      if (hour < 17) return 'Good afternoon'
      return 'Good evening'
    }
  }

  const getQuickActions = () => {
    if (language === 'hi') {
      return [
        'दस्तावेज़ अपलोड कैसे करें?',
        'वकील कैसे खोजें?',
        'कानूनी सलाह चाहिए',
        'मेरे अधिकार क्या हैं?',
      ]
    } else {
      return [
        'How to upload documents?',
        'How to find lawyers?',
        'Need legal advice',
        'What are my rights?',
      ]
    }
  }

  return (
    <>
      {/* Chat Button (collapsed) */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-indigo-600 shadow-lg hover:bg-indigo-700"
            size="lg"
            aria-label={language === 'hi' ? 'चैट खोलें' : 'Open chat'}
            title={language === 'hi' ? 'चैट खोलें' : 'Open chat'}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className={`w-80 shadow-2xl ${isMinimized ? 'h-16' : 'h-96'}`}>
            <CardContent className="flex h-full flex-col p-0">
              {/* Header */}
              <div className="flex items-center justify-between border-b bg-indigo-600 p-4 text-white">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span className="font-semibold">
                    {language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      onLanguageChange(language === 'en' ? 'hi' : 'en')
                    }
                    className="rounded bg-white bg-opacity-20 px-2 py-1 text-xs hover:bg-opacity-30"
                    aria-label={
                      language === 'hi'
                        ? 'Switch to English'
                        : 'Switch to Hindi'
                    }
                    title={
                      language === 'hi'
                        ? 'Switch to English'
                        : 'Switch to Hindi'
                    }
                  >
                    {language === 'en' ? 'हिंदी' : 'English'}
                  </button>

                  <button
                    onClick={() => setIsMinimized((s) => !s)}
                    className="rounded p-1 hover:bg-white hover:bg-opacity-20"
                    aria-label={isMinimized ? 'Maximize chat' : 'Minimize chat'}
                    title={isMinimized ? 'Maximize chat' : 'Minimize chat'}
                  >
                    {isMinimized ? (
                      <Maximize2 className="h-4 w-4" />
                    ) : (
                      <Minimize2 className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded p-1 hover:bg-white hover:bg-opacity-20"
                    aria-label={language === 'hi' ? 'बंद करें' : 'Close chat'}
                    title={language === 'hi' ? 'बंद करें' : 'Close chat'}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              {!isMinimized && (
                <>
                  <div
                    className="flex-1 space-y-4 overflow-y-auto p-4"
                    role="log"
                    aria-live="polite"
                  >
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${message.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-900'}`}
                        >
                          <div className="flex items-start space-x-2">
                            {message.sender === 'bot' ? (
                              <Bot className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            ) : (
                              <User className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p
                                className={`text-sm ${message.language?.startsWith('hi') ? 'hindi-text' : ''}`}
                              >
                                {message.text}
                              </p>
                              <p className="mt-1 text-xs opacity-70">
                                {message.timestamp instanceof Date
                                  ? message.timestamp.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })
                                  : String(message.timestamp)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="rounded-lg bg-gray-100 p-3">
                          <div className="flex items-center space-x-2">
                            <Bot className="h-4 w-4" />
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-gray-600">
                              {language === 'hi'
                                ? 'टाइप कर रहा है...'
                                : 'Typing...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  {/* Quick Actions (only when conversation is short) */}
                  {messages.length <= 1 && (
                    <div className="px-4 pb-2">
                      <p className="mb-2 text-xs text-gray-500">
                        {language === 'hi' ? 'त्वरित कार्य:' : 'Quick actions:'}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {getQuickActions().map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => setInputText(action)}
                            className={`rounded-full bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200 ${language === 'hi' ? 'hindi-text' : ''}`}
                            title={action}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                          language === 'hi'
                            ? 'अपना संदेश टाइप करें...'
                            : 'Type your message...'
                        }
                        className={`flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500 ${language === 'hi' ? 'hindi-text' : ''}`}
                        disabled={isLoading}
                        aria-label={
                          language === 'hi'
                            ? 'अपना संदेश लिखें'
                            : 'Type your message'
                        }
                      />
                      <Button
                        onClick={() => void sendMessage()}
                        disabled={!inputText.trim() || isLoading}
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                        aria-label={language === 'hi' ? 'भेजें' : 'Send'}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={clearChat}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        {language === 'hi' ? 'चैट साफ़ करें' : 'Clear chat'}
                      </button>
                      <span className="text-xs text-gray-500">
                        {getGreeting()},{' '}
                        {user?.name ??
                          (language === 'hi' ? 'उपयोगकर्ता' : 'User')}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
