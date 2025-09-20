'use client'

import { useState, useEffect } from 'react'
import { Search, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiClient } from '@/lib/api'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  language: string
  tags: string[]
  created_at: string
}

interface FAQSectionProps {
  language?: 'en' | 'hi'
}

export default function FAQSection({ language = 'en' }: FAQSectionProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<
    { category: string; count: number }[]
  >([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<FAQ[]>([])

  useEffect(() => {
    loadFAQs()
    loadCategories()
  }, [selectedCategory, language])

  const loadFAQs = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getFAQs({
        category: selectedCategory || undefined,
        language,
        limit: 20,
      })

      if (response && (response as any).success) {
        setFaqs((response as any).data?.faqs || [])
      }
    } catch (error) {
      console.error('Error loading FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const response = await apiClient.getFAQCategories(language)
      if (response && (response as any).success) {
        setCategories((response as any).data || [])
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)

    if (query.trim()) {
      try {
        const response = await apiClient.searchFAQs(query, language, 10)
        if (response && (response as any).success) {
          setSearchResults((response as any).data || [])
        }
      } catch (error) {
        console.error('Error searching FAQs:', error)
      }
    } else {
      setSearchResults([])
    }
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const getCategoryLabel = (category: string) => {
    if (language === 'hi') {
      const categoryMap: Record<string, string> = {
        'Criminal Law': 'आपराधिक कानून',
        'Consumer Rights': 'उपभोक्ता अधिकार',
        'Property Law': 'संपत्ति कानून',
        'Family Law': 'पारिवारिक कानून',
        General: 'सामान्य',
      }
      return categoryMap[category] || category
    }
    return category
  }

  const displayFAQs = searchQuery.trim() ? searchResults : faqs

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi'
            ? 'अक्सर पूछे जाने वाले प्रश्न'
            : 'Frequently Asked Questions'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'कानूनी सहायता के बारे में सामान्य प्रश्नों के उत्तर'
            : 'Common questions and answers about legal assistance'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <input
            type="text"
            placeholder={
              language === 'hi' ? 'प्रश्न खोजें...' : 'Search questions...'
            }
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            size="sm"
          >
            {language === 'hi' ? 'सभी' : 'All'}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.category}
              variant={
                selectedCategory === category.category ? 'default' : 'outline'
              }
              onClick={() => setSelectedCategory(category.category)}
              size="sm"
            >
              {getCategoryLabel(category.category)} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">
              {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
            </p>
          </div>
        ) : displayFAQs.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <HelpCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">
                {searchQuery.trim()
                  ? language === 'hi'
                    ? 'कोई प्रश्न नहीं मिला'
                    : 'No questions found'
                  : language === 'hi'
                    ? 'कोई प्रश्न उपलब्ध नहीं है'
                    : 'No questions available'}
              </p>
            </CardContent>
          </Card>
        ) : (
          displayFAQs.map((faq) => (
            <Card key={faq.id} className="transition-shadow hover:shadow-md">
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="pr-4 text-left text-lg">
                    {faq.question}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                      {getCategoryLabel(faq.category)}
                    </span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {expandedFAQ === faq.id && (
                <CardContent className="pt-0">
                  <div className="prose max-w-none">
                    <p className="leading-relaxed text-gray-700">
                      {faq.answer}
                    </p>
                  </div>

                  {faq.tags && faq.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {faq.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Submit Question CTA */}
      <Card className="border-indigo-200 bg-indigo-50">
        <CardContent className="py-8 text-center">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 text-indigo-600" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            {language === 'hi' ? 'अपना प्रश्न पूछें' : 'Ask Your Question'}
          </h3>
          <p className="mb-4 text-gray-600">
            {language === 'hi'
              ? 'अगर आपको अपना जवाब नहीं मिला, तो हमसे पूछें'
              : "Couldn't find your answer? Ask us directly"}
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            {language === 'hi' ? 'प्रश्न भेजें' : 'Submit Question'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
