'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search,
  Lightbulb,
  BookOpen,
  MessageCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface SearchResult {
  id: string
  title: string
  content: string
  type: 'faq' | 'article' | 'lawyer' | 'case'
  relevanceScore: number
  category: string
  language: 'en' | 'hi'
  tags: string[]
  source?: string
}

interface SemanticSearchProps {
  language?: 'en' | 'hi'
  onResultSelect?: (result: SearchResult) => void
  placeholder?: string
  className?: string
}

export default function SemanticSearch({
  language = 'en',
  onResultSelect,
  placeholder,
  className = '',
}: SemanticSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Load suggestions based on query
  useEffect(() => {
    if (query.length > 2) {
      loadSuggestions(query)
    } else {
      setSuggestions([])
    }
  }, [query])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadSuggestions = async (searchQuery: string) => {
    // Mock suggestions based on common legal queries
    const commonQueries = {
      en: [
        'How to get bail?',
        'What is FIR?',
        'Divorce process in India',
        'Property dispute resolution',
        'Consumer rights protection',
        'Labor law violations',
        'Tax filing requirements',
        'Criminal procedure code',
        'Family court procedures',
        'Constitutional rights',
      ],
      hi: [
        'जमानत कैसे मिलेगी?',
        'एफआईआर क्या है?',
        'भारत में तलाक की प्रक्रिया',
        'संपत्ति विवाद समाधान',
        'उपभोक्ता अधिकार संरक्षण',
        'श्रम कानून उल्लंघन',
        'कर दाखिल करने की आवश्यकताएं',
        'आपराधिक प्रक्रिया संहिता',
        'पारिवारिक अदालत प्रक्रिया',
        'संवैधानिक अधिकार',
      ],
    }

    const langQueries = commonQueries[language]
    const filtered = langQueries
      .filter((q) => q.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5)

    setSuggestions(filtered)
  }

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowSuggestions(false)

    try {
      // Add to recent searches
      const newRecent = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5)
      setRecentSearches(newRecent)
      localStorage.setItem('recentSearches', JSON.stringify(newRecent))

      // Perform semantic search
      const searchResults = await performSemanticSearch(searchQuery)
      setResults(searchResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const performSemanticSearch = async (
    searchQuery: string
  ): Promise<SearchResult[]> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000)
    )

    // Mock semantic search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title:
          language === 'hi'
            ? 'जमानत प्राप्त करने की प्रक्रिया'
            : 'Process to Obtain Bail',
        content:
          language === 'hi'
            ? 'जमानत प्राप्त करने के लिए आपको उपयुक्त अदालत में जमानत आवेदन दाखिल करना होगा...'
            : 'To obtain bail, you need to file a bail application in the appropriate court...',
        type: 'faq',
        relevanceScore: 0.95,
        category: 'criminal',
        language,
        tags: ['bail', 'criminal law', 'arrest'],
        source: 'FAQ Database',
      },
      {
        id: '2',
        title:
          language === 'hi'
            ? 'एफआईआर क्या है और कैसे दर्ज करें?'
            : 'What is FIR and How to File It?',
        content:
          language === 'hi'
            ? 'एफआईआर (प्रथम सूचना रिपोर्ट) एक लिखित दस्तावेज है जो पुलिस तैयार करती है...'
            : 'FIR (First Information Report) is a written document prepared by the police...',
        type: 'article',
        relevanceScore: 0.88,
        category: 'criminal',
        language,
        tags: ['fir', 'police', 'complaint'],
        source: 'Legal Knowledge Base',
      },
      {
        id: '3',
        title:
          language === 'hi'
            ? 'तलाक की कानूनी प्रक्रिया'
            : 'Legal Process of Divorce',
        content:
          language === 'hi'
            ? 'भारत में तलाक आपसी सहमति या विवादित कार्यवाही के माध्यम से प्राप्त किया जा सकता है...'
            : 'Divorce in India can be obtained through mutual consent or contested proceedings...',
        type: 'article',
        relevanceScore: 0.82,
        category: 'family',
        language,
        tags: ['divorce', 'family law', 'marriage'],
        source: 'Family Law Guide',
      },
    ]

    // Filter results based on query relevance
    return mockResults.filter(
      (result) =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
    )
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch(query)
    }
  }

  const getResultIcon = (type: string) => {
    const icons: Record<string, any> = {
      faq: MessageCircle,
      article: BookOpen,
      lawyer: TrendingUp,
      case: Clock,
    }
    const Icon = icons[type] || Search
    return <Icon className="h-4 w-4" />
  }

  const getRelevanceColor = (score: number) => {
    if (score >= 0.9) return 'text-green-600'
    if (score >= 0.7) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className={`mx-auto w-full max-w-4xl space-y-6 ${className}`}>
      {/* Search Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi'
            ? 'बुद्धिमान कानूनी खोज'
            : 'Intelligent Legal Search'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'अपने प्रश्नों के लिए सबसे प्रासंगिक उत्तर खोजें'
            : 'Find the most relevant answers to your questions'}
        </p>
      </div>

      {/* Search Interface */}
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={
              placeholder ||
              (language === 'hi'
                ? 'कानूनी प्रश्न खोजें...'
                : 'Search legal questions...')
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            className="w-full rounded-lg border border-gray-300 py-4 pl-10 pr-4 text-lg focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            onClick={() => handleSearch(query)}
            disabled={!query.trim() || isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 transform bg-indigo-600 hover:bg-indigo-700"
            size="sm"
          >
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions &&
          (suggestions.length > 0 || recentSearches.length > 0) && (
            <Card className="absolute left-0 right-0 top-full z-10 mt-2 max-h-80 overflow-y-auto">
              <CardContent className="p-0">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="border-b p-3">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'हाल की खोजें' : 'Recent Searches'}
                    </h4>
                    <div className="space-y-1">
                      {recentSearches.slice(0, 3).map((search, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(search)}
                          className="w-full rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="p-3">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">
                      {language === 'hi' ? 'सुझाव' : 'Suggestions'}
                    </h4>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="flex w-full items-center space-x-2 rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100"
                        >
                          <Lightbulb className="h-3 w-3 text-yellow-500" />
                          <span>{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'hi' ? 'खोज परिणाम' : 'Search Results'}
            </h3>
            <span className="text-sm text-gray-500">
              {results.length}{' '}
              {language === 'hi' ? 'परिणाम मिले' : 'results found'}
            </span>
          </div>

          <div className="space-y-3">
            {results.map((result) => (
              <Card
                key={result.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
                onClick={() => onResultSelect?.(result)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 flex-shrink-0">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="line-clamp-2 text-lg font-medium text-gray-900">
                          {result.title}
                        </h4>
                        <div className="ml-4 flex items-center space-x-2">
                          <span
                            className={`text-sm font-medium ${getRelevanceColor(result.relevanceScore)}`}
                          >
                            {Math.round(result.relevanceScore * 100)}%
                          </span>
                          <span className="text-xs text-gray-500">
                            {result.type}
                          </span>
                        </div>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {result.content}
                      </p>

                      <div className="mt-3 flex items-center space-x-4">
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        {result.source && (
                          <span className="text-xs text-gray-500">
                            {result.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {query && results.length === 0 && !isSearching && (
        <Card>
          <CardContent className="py-8 text-center">
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">
              {language === 'hi' ? 'कोई परिणाम नहीं मिला' : 'No results found'}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {language === 'hi'
                ? 'कृपया अपने खोज शब्द बदलकर पुनः प्रयास करें'
                : 'Please try again with different search terms'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
