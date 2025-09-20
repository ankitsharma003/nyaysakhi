'use client'

import { useState, useEffect } from 'react'
import {
  MessageCircle,
  Clock,
  User,
  Bot,
  Trash2,
  RotateCcw,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Conversation {
  id: string
  title: string
  messages: ConversationMessage[]
  createdAt: Date
  updatedAt: Date
  language: 'en' | 'hi'
  category?: string
}

interface ConversationMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  context?: {
    category?: string
    tags?: string[]
    relatedQuestions?: string[]
  }
}

interface ConversationMemoryProps {
  language?: 'en' | 'hi'
  onConversationSelect?: (conversation: Conversation) => void
  onNewConversation?: () => void
  className?: string
}

export default function ConversationMemory({
  language = 'en',
  onConversationSelect,
  onNewConversation,
  className = '',
}: ConversationMemoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      setLoading(true)
      // Load from localStorage (in a real app, this would be from a database)
      const saved = localStorage.getItem('conversations')
      if (saved) {
        const parsed = JSON.parse(saved).map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }))
        setConversations(parsed)
      } else {
        // Create sample conversations
        const sampleConversations = createSampleConversations()
        setConversations(sampleConversations)
        saveConversations(sampleConversations)
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const createSampleConversations = (): Conversation[] => {
    return [
      {
        id: '1',
        title:
          language === 'hi'
            ? 'जमानत के बारे में प्रश्न'
            : 'Questions about Bail',
        messages: [
          {
            id: '1',
            type: 'user',
            content:
              language === 'hi' ? 'जमानत कैसे मिलेगी?' : 'How can I get bail?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            context: {
              category: 'criminal',
              tags: ['bail', 'arrest', 'criminal law'],
            },
          },
          {
            id: '2',
            type: 'bot',
            content:
              language === 'hi'
                ? 'जमानत प्राप्त करने के लिए आपको उपयुक्त अदालत में जमानत आवेदन दाखिल करना होगा...'
                : 'To obtain bail, you need to file a bail application in the appropriate court...',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000), // 2 hours ago + 30 seconds
            context: {
              category: 'criminal',
              tags: ['bail', 'court', 'application'],
            },
          },
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000),
        language,
        category: 'criminal',
      },
      {
        id: '2',
        title: language === 'hi' ? 'तलाक की प्रक्रिया' : 'Divorce Process',
        messages: [
          {
            id: '3',
            type: 'user',
            content:
              language === 'hi'
                ? 'तलाक कैसे ले सकते हैं?'
                : 'How can I get a divorce?',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            context: {
              category: 'family',
              tags: ['divorce', 'marriage', 'family law'],
            },
          },
          {
            id: '4',
            type: 'bot',
            content:
              language === 'hi'
                ? 'भारत में तलाक आपसी सहमति या विवादित कार्यवाही के माध्यम से प्राप्त किया जा सकता है...'
                : 'Divorce in India can be obtained through mutual consent or contested proceedings...',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45000), // 1 day ago + 45 seconds
            context: {
              category: 'family',
              tags: ['divorce', 'mutual consent', 'contested'],
            },
          },
        ],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45000),
        language,
        category: 'family',
      },
    ]
  }

  const saveConversations = (conversations: Conversation[]) => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation)
    onConversationSelect?.(conversation)
  }

  const handleDeleteConversation = (conversationId: string) => {
    const updated = conversations.filter((conv) => conv.id !== conversationId)
    setConversations(updated)
    saveConversations(updated)

    if (selectedConversation?.id === conversationId) {
      setSelectedConversation(null)
    }
  }

  const handleNewConversation = () => {
    onNewConversation?.()
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return language === 'hi'
        ? `${minutes} मिनट पहले`
        : `${minutes} minutes ago`
    } else if (hours < 24) {
      return language === 'hi' ? `${hours} घंटे पहले` : `${hours} hours ago`
    } else {
      return language === 'hi' ? `${days} दिन पहले` : `${days} days ago`
    }
  }

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      criminal: 'bg-red-100 text-red-800',
      family: 'bg-pink-100 text-pink-800',
      civil: 'bg-green-100 text-green-800',
      property: 'bg-yellow-100 text-yellow-800',
      consumer: 'bg-purple-100 text-purple-800',
    }
    return colors[category || ''] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryName = (category?: string) => {
    const names: Record<string, string> = {
      criminal: language === 'hi' ? 'आपराधिक' : 'Criminal',
      family: language === 'hi' ? 'पारिवारिक' : 'Family',
      civil: language === 'hi' ? 'दीवानी' : 'Civil',
      property: language === 'hi' ? 'संपत्ति' : 'Property',
      consumer: language === 'hi' ? 'उपभोक्ता' : 'Consumer',
    }
    return names[category || ''] || (language === 'hi' ? 'सामान्य' : 'General')
  }

  if (loading) {
    return (
      <div className={`mx-auto w-full max-w-4xl space-y-6 ${className}`}>
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'बातचीत लोड हो रही है...'
              : 'Loading conversations...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`mx-auto w-full max-w-6xl space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'बातचीत का इतिहास' : 'Conversation History'}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {language === 'hi'
              ? 'अपनी पिछली कानूनी चर्चाएं देखें और जारी रखें'
              : 'View and continue your previous legal discussions'}
          </p>
        </div>
        <Button
          onClick={handleNewConversation}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          {language === 'hi' ? 'नई बातचीत' : 'New Conversation'}
        </Button>
      </div>

      {/* Conversations Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className={`cursor-pointer transition-shadow hover:shadow-lg ${
              selectedConversation?.id === conversation.id
                ? 'ring-2 ring-indigo-500'
                : ''
            }`}
            onClick={() => handleConversationSelect(conversation)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2 text-lg">
                    {conversation.title}
                  </CardTitle>
                  <div className="mt-2 flex items-center space-x-2">
                    {conversation.category && (
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(conversation.category)}`}
                      >
                        {getCategoryName(conversation.category)}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {conversation.messages.length}{' '}
                      {language === 'hi' ? 'संदेश' : 'messages'}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteConversation(conversation.id)
                  }}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Last Message Preview */}
              <div className="space-y-2">
                {conversation.messages.slice(-2).map((message) => (
                  <div key={message.id} className="flex items-start space-x-2">
                    {message.type === 'user' ? (
                      <User className="mt-1 h-4 w-4 flex-shrink-0 text-indigo-600" />
                    ) : (
                      <Bot className="mt-1 h-4 w-4 flex-shrink-0 text-gray-600" />
                    )}
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(conversation.updatedAt)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleConversationSelect(conversation)
                  }}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  {language === 'hi' ? 'जारी रखें' : 'Continue'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {conversations.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageCircle className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'कोई बातचीत नहीं' : 'No Conversations'}
            </h3>
            <p className="mb-6 text-gray-600">
              {language === 'hi'
                ? 'अभी तक कोई बातचीत नहीं हुई है। नई बातचीत शुरू करें!'
                : 'No conversations yet. Start a new conversation!'}
            </p>
            <Button
              onClick={handleNewConversation}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {language === 'hi'
                ? 'पहली बातचीत शुरू करें'
                : 'Start First Conversation'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selected Conversation Detail */}
      {selectedConversation && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {selectedConversation.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedConversation(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-4 overflow-y-auto">
              {selectedConversation.messages.map((message) => (
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
                      {message.type === 'user' ? (
                        <User className="mt-1 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <Bot className="mt-1 h-4 w-4 flex-shrink-0" />
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
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
