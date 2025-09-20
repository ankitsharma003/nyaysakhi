'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  BookOpen,
  FileText,
  Scale,
  Users,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { apiClient } from '@/lib/api'

interface LegalArticle {
  id: string
  title: string
  content: string
  category: string
  subcategory?: string
  language: 'en' | 'hi'
  tags: string[]
  source: string
  lastUpdated: string
  relevanceScore?: number
}

interface LegalKnowledgeBaseProps {
  language?: 'en' | 'hi'
  onArticleSelect?: (article: LegalArticle) => void
}

export default function LegalKnowledgeBase({
  language = 'en',
  onArticleSelect,
}: LegalKnowledgeBaseProps) {
  const [articles, setArticles] = useState<LegalArticle[]>([])
  const [filteredArticles, setFilteredArticles] = useState<LegalArticle[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<LegalArticle | null>(
    null
  )

  const categories = [
    {
      id: 'constitutional',
      name: language === 'hi' ? 'संवैधानिक कानून' : 'Constitutional Law',
    },
    {
      id: 'criminal',
      name: language === 'hi' ? 'आपराधिक कानून' : 'Criminal Law',
    },
    { id: 'civil', name: language === 'hi' ? 'दीवानी कानून' : 'Civil Law' },
    {
      id: 'family',
      name: language === 'hi' ? 'पारिवारिक कानून' : 'Family Law',
    },
    {
      id: 'property',
      name: language === 'hi' ? 'संपत्ति कानून' : 'Property Law',
    },
    {
      id: 'consumer',
      name: language === 'hi' ? 'उपभोक्ता कानून' : 'Consumer Law',
    },
    { id: 'labor', name: language === 'hi' ? 'श्रम कानून' : 'Labor Law' },
    { id: 'tax', name: language === 'hi' ? 'कर कानून' : 'Tax Law' },
  ]

  useEffect(() => {
    loadKnowledgeBase()
  }, [language])

  useEffect(() => {
    filterArticles()
  }, [articles, searchQuery, selectedCategory])

  const loadKnowledgeBase = async () => {
    try {
      setLoading(true)
      // Load from Constitution of India data
      const constitutionData = await loadConstitutionData()
      setArticles(constitutionData)
    } catch (error) {
      console.error('Error loading knowledge base:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadConstitutionData = async (): Promise<LegalArticle[]> => {
    // This would typically load from a real API or database
    // For now, we'll create sample data based on the Constitution
    const sampleArticles: LegalArticle[] = [
      {
        id: '1',
        title:
          language === 'hi'
            ? 'अनुच्छेद 21: जीवन और व्यक्तिगत स्वतंत्रता का अधिकार'
            : 'Article 21: Right to Life and Personal Liberty',
        content:
          language === 'hi'
            ? 'कोई भी व्यक्ति कानून द्वारा स्थापित प्रक्रिया के अतिरिक्त अपने जीवन या व्यक्तिगत स्वतंत्रता से वंचित नहीं किया जाएगा। यह भारतीय संविधान का सबसे महत्वपूर्ण मौलिक अधिकार है।'
            : 'No person shall be deprived of his life or personal liberty except according to procedure established by law. This is the most important fundamental right in the Indian Constitution.',
        category: 'constitutional',
        language,
        tags: ['fundamental rights', 'life', 'liberty', 'constitution'],
        source: 'Constitution of India',
        lastUpdated: '2024-01-01',
      },
      {
        id: '2',
        title:
          language === 'hi'
            ? 'अनुच्छेद 14: समानता का अधिकार'
            : 'Article 14: Right to Equality',
        content:
          language === 'hi'
            ? 'राज्य किसी व्यक्ति को कानून के समक्ष समानता या कानूनों के समान संरक्षण से वंचित नहीं करेगा।'
            : 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
        category: 'constitutional',
        language,
        tags: ['equality', 'fundamental rights', 'constitution'],
        source: 'Constitution of India',
        lastUpdated: '2024-01-01',
      },
      {
        id: '3',
        title: language === 'hi' ? 'जमानत का अधिकार' : 'Right to Bail',
        content:
          language === 'hi'
            ? 'जमानत एक कानूनी तंत्र है जो किसी आरोपी व्यक्ति को मुकदमे की प्रतीक्षा के दौरान हिरासत से रिहा करने की अनुमति देता है।'
            : 'Bail is a legal mechanism that allows an accused person to be released from custody while awaiting trial.',
        category: 'criminal',
        language,
        tags: ['bail', 'criminal law', 'arrest', 'trial'],
        source: 'Code of Criminal Procedure, 1973',
        lastUpdated: '2024-01-01',
      },
      {
        id: '4',
        title: language === 'hi' ? 'तलाक की प्रक्रिया' : 'Divorce Process',
        content:
          language === 'hi'
            ? 'भारत में तलाक आपसी सहमति या विवादित कार्यवाही के माध्यम से प्राप्त किया जा सकता है।'
            : 'Divorce in India can be obtained through mutual consent or contested proceedings under various personal laws.',
        category: 'family',
        language,
        tags: ['divorce', 'family law', 'marriage', 'personal law'],
        source: 'Hindu Marriage Act, 1955',
        lastUpdated: '2024-01-01',
      },
    ]

    return sampleArticles
  }

  const filterArticles = () => {
    let filtered = articles

    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      )
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.content.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    setFilteredArticles(filtered)
  }

  const handleArticleClick = (article: LegalArticle) => {
    setSelectedArticle(article)
    onArticleSelect?.(article)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      constitutional: Scale,
      criminal: AlertCircle,
      civil: FileText,
      family: Users,
      property: BookOpen,
      consumer: CheckCircle,
      labor: Users,
      tax: FileText,
    }
    const Icon = icons[category] || FileText
    return <Icon className="h-5 w-5" />
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      constitutional: 'bg-blue-100 text-blue-800',
      criminal: 'bg-red-100 text-red-800',
      civil: 'bg-green-100 text-green-800',
      family: 'bg-pink-100 text-pink-800',
      property: 'bg-yellow-100 text-yellow-800',
      consumer: 'bg-purple-100 text-purple-800',
      labor: 'bg-orange-100 text-orange-800',
      tax: 'bg-gray-100 text-gray-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="py-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'ज्ञान आधार लोड हो रहा है...'
              : 'Loading knowledge base...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          {language === 'hi' ? 'कानूनी ज्ञान आधार' : 'Legal Knowledge Base'}
        </h2>
        <p className="text-lg text-gray-600">
          {language === 'hi'
            ? 'भारतीय कानून के बारे में व्यापक जानकारी'
            : 'Comprehensive information about Indian law'}
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
              language === 'hi'
                ? 'कानूनी जानकारी खोजें...'
                : 'Search legal information...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
              className="flex items-center space-x-2"
            >
              {getCategoryIcon(category.id)}
              <span>{category.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {language === 'hi'
            ? `${filteredArticles.length} लेख मिले`
            : `${filteredArticles.length} articles found`}
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="cursor-pointer transition-shadow hover:shadow-lg"
            onClick={() => handleArticleClick(article)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="line-clamp-2 text-lg">
                    {article.title}
                  </CardTitle>
                  <div className="mt-2 flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(article.category)}`}
                    >
                      {
                        categories.find((cat) => cat.id === article.category)
                          ?.name
                      }
                    </span>
                    <span className="text-xs text-gray-500">
                      {article.source}
                    </span>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
              </div>
            </CardHeader>

            <CardContent>
              <p className="mb-4 line-clamp-3 text-sm text-gray-600">
                {article.content}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {article.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
                {article.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{article.tags.length - 3}{' '}
                    {language === 'hi' ? 'और' : 'more'}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">
              {language === 'hi' ? 'कोई लेख नहीं मिला' : 'No articles found'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <Card className="max-h-[80vh] w-full max-w-4xl overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {selectedArticle.title}
                  </CardTitle>
                  <div className="mt-2 flex items-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryColor(selectedArticle.category)}`}
                    >
                      {
                        categories.find(
                          (cat) => cat.id === selectedArticle.category
                        )?.name
                      }
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedArticle.source}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="prose max-w-none">
                <p className="mb-6 leading-relaxed text-gray-700">
                  {selectedArticle.content}
                </p>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {selectedArticle.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-gray-500">
                  {language === 'hi' ? 'अंतिम अपडेट:' : 'Last updated:'}{' '}
                  {selectedArticle.lastUpdated}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
