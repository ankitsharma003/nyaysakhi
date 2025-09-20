'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Loader2,
  MessageCircle,
  X,
  Minimize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { apiClient } from '@/lib/api'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface AIChatBotProps {
  language?: 'en' | 'hi'
  className?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export default function AIChatBot({
  language = 'en',
  className = '',
  isMinimized = false,
  onToggleMinimize,
}: AIChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'bot',
        content:
          language === 'hi'
            ? 'नमस्ते! मैं आपकी कानूनी सहायता के लिए यहाँ हूँ। आप कोई भी कानूनी प्रश्न पूछ सकते हैं।'
            : "Hello! I'm here to help with your legal questions. Feel free to ask me anything about Indian law.",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [language, messages.length])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Add typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'bot',
      content: language === 'hi' ? 'टाइप कर रहा हूँ...' : 'Typing...',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      // Simulate AI response (replace with actual API call)
      const response = await generateAIResponse(inputValue.trim(), language)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'))

      const botMessage: Message = {
        id: Date.now().toString() + '_bot',
        type: 'bot',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error generating response:', error)

      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.id !== 'typing'))

      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        type: 'bot',
        content:
          language === 'hi'
            ? 'क्षमा करें, मुझे आपके प्रश्न का उत्तर देने में समस्या हो रही है। कृपया पुनः प्रयास करें।'
            : "Sorry, I'm having trouble answering your question. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (
    question: string,
    lang: string
  ): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    )

    // Mock responses based on question content
    const responses = {
      en: {
        bail: 'Bail is a legal mechanism that allows an accused person to be released from custody while awaiting trial. To get bail, you need to file a bail application in the appropriate court. The court considers factors like the nature of the offense, evidence against you, and your criminal history before granting bail.',
        fir: "An FIR (First Information Report) is a written document prepared by the police when they receive information about a cognizable offense. It's the first step in the criminal justice process and contains details about the crime, victim, and accused. You have the right to get a copy of the FIR free of cost.",
        divorce:
          'Divorce in India can be obtained through mutual consent or contested proceedings. The process involves filing a petition, serving notice to the spouse, mediation attempts, and court hearings. The grounds for divorce include cruelty, adultery, desertion, and mental illness.',
        property:
          "Property disputes in India are governed by various laws including the Transfer of Property Act, 1882. Common issues include ownership disputes, partition suits, and inheritance matters. It's advisable to consult a lawyer for property-related legal issues.",
        consumer:
          'Consumer rights in India are protected under the Consumer Protection Act, 2019. You can file a complaint in the appropriate consumer forum based on the value of your claim. The forum will help resolve disputes between consumers and service providers.',
        default:
          'I understand you have a legal question. While I can provide general information about Indian law, I recommend consulting with a qualified lawyer for specific legal advice. You can also browse our FAQ section or search for lawyers in your area using our directory.',
      },
      hi: {
        bail: 'जमानत एक कानूनी तंत्र है जो किसी आरोपी व्यक्ति को मुकदमे की प्रतीक्षा के दौरान हिरासत से रिहा करने की अनुमति देता है। जमानत प्राप्त करने के लिए, आपको उपयुक्त अदालत में जमानत आवेदन दाखिल करना होगा।',
        fir: 'एफआईआर (प्रथम सूचना रिपोर्ट) एक लिखित दस्तावेज है जो पुलिस तैयार करती है जब उन्हें किसी संज्ञेय अपराध की जानकारी मिलती है। यह आपराधिक न्याय प्रक्रिया में पहला कदम है।',
        divorce:
          'भारत में तलाक आपसी सहमति या विवादित कार्यवाही के माध्यम से प्राप्त किया जा सकता है। प्रक्रिया में याचिका दाखिल करना, पति/पत्नी को नोटिस देना, मध्यस्थता के प्रयास और अदालती सुनवाई शामिल है।',
        property:
          'भारत में संपत्ति विवाद विभिन्न कानूनों द्वारा शासित होते हैं। सामान्य मुद्दों में स्वामित्व विवाद, विभाजन मुकदमे और उत्तराधिकार मामले शामिल हैं।',
        consumer:
          'भारत में उपभोक्ता अधिकार उपभोक्ता संरक्षण अधिनियम, 2019 के तहत संरक्षित हैं। आप अपने दावे के मूल्य के आधार पर उपयुक्त उपभोक्ता मंच में शिकायत दर्ज कर सकते हैं।',
        default:
          'मैं समझता हूँ कि आपके पास एक कानूनी प्रश्न है। जबकि मैं भारतीय कानून के बारे में सामान्य जानकारी प्रदान कर सकता हूँ, विशिष्ट कानूनी सलाह के लिए मैं एक योग्य वकील से परामर्श करने की सलाह देता हूँ।',
      },
    }

    const langResponses = responses[lang as keyof typeof responses]
    const questionLower = question.toLowerCase()

    if (questionLower.includes('bail') || questionLower.includes('जमानत')) {
      return langResponses.bail
    } else if (
      questionLower.includes('fir') ||
      questionLower.includes('एफआईआर')
    ) {
      return langResponses.fir
    } else if (
      questionLower.includes('divorce') ||
      questionLower.includes('तलाक')
    ) {
      return langResponses.divorce
    } else if (
      questionLower.includes('property') ||
      questionLower.includes('संपत्ति')
    ) {
      return langResponses.property
    } else if (
      questionLower.includes('consumer') ||
      questionLower.includes('उपभोक्ता')
    ) {
      return langResponses.consumer
    } else {
      return langResponses.default
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-indigo-600 shadow-lg hover:bg-indigo-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-h-[600px] w-96 ${className}`}
    >
      <Card className="border-0 shadow-2xl">
        <CardHeader className="rounded-t-lg bg-indigo-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">
                {language === 'hi' ? 'कानूनी सहायक' : 'Legal Assistant'}
              </CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {onToggleMinimize && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimize}
                  className="text-white hover:bg-indigo-700"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-indigo-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && !message.isTyping && (
                      <Bot className="mt-1 h-4 w-4 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="mt-1 h-4 w-4 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </p>
                      <p
                        className={`mt-1 text-xs ${
                          message.type === 'user'
                            ? 'text-indigo-200'
                            : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg bg-gray-100 p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-gray-600">
                      {language === 'hi'
                        ? 'उत्तर तैयार कर रहा हूँ...'
                        : 'Preparing answer...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  language === 'hi'
                    ? 'अपना प्रश्न टाइप करें...'
                    : 'Type your question...'
                }
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-indigo-600 hover:bg-indigo-700"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
