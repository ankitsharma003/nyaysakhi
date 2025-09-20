'use client'
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  BookOpen,
  FileText,
  Scale,
  Users,
  Clock,
  Tag,
  Download,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function KnowledgePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-lg font-medium text-gray-900">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const categories = [
    {
      id: 'all',
      name: language === 'hi' ? 'सभी' : 'All',
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      id: 'constitution',
      name: language === 'hi' ? 'संविधान' : 'Constitution',
      icon: <Scale className="h-5 w-5" />,
    },
    {
      id: 'criminal',
      name: language === 'hi' ? 'आपराधिक कानून' : 'Criminal Law',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 'civil',
      name: language === 'hi' ? 'दीवानी कानून' : 'Civil Law',
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 'family',
      name: language === 'hi' ? 'पारिवारिक कानून' : 'Family Law',
      icon: <Users className="h-5 w-5" />,
    },
  ]

  const knowledgeItems = [
    {
      id: 1,
      title:
        language === 'hi'
          ? 'भारतीय संविधान - मौलिक अधिकार'
          : 'Indian Constitution - Fundamental Rights',
      category: 'constitution',
      description:
        language === 'hi'
          ? 'भारतीय संविधान के मौलिक अधिकारों की विस्तृत जानकारी'
          : 'Detailed information about fundamental rights in the Indian Constitution',
      type: 'document',
      size: '2.5 MB',
      views: 1250,
      downloads: 340,
      tags: ['constitution', 'rights', 'fundamental'],
      lastUpdated: '2024-01-15',
    },
    {
      id: 2,
      title:
        language === 'hi'
          ? 'आपराधिक कानून - IPC की मुख्य धाराएं'
          : 'Criminal Law - Main Sections of IPC',
      category: 'criminal',
      description:
        language === 'hi'
          ? 'भारतीय दंड संहिता की महत्वपूर्ण धाराओं का विवरण'
          : 'Description of important sections of the Indian Penal Code',
      type: 'guide',
      size: '1.8 MB',
      views: 980,
      downloads: 220,
      tags: ['criminal', 'ipc', 'sections'],
      lastUpdated: '2024-01-10',
    },
    {
      id: 3,
      title:
        language === 'hi'
          ? 'दीवानी प्रक्रिया संहिता - CPC'
          : 'Civil Procedure Code - CPC',
      category: 'civil',
      description:
        language === 'hi'
          ? 'दीवानी प्रक्रिया संहिता के नियम और प्रक्रियाएं'
          : 'Rules and procedures of the Civil Procedure Code',
      type: 'document',
      size: '3.2 MB',
      views: 750,
      downloads: 180,
      tags: ['civil', 'cpc', 'procedure'],
      lastUpdated: '2024-01-08',
    },
    {
      id: 4,
      title: language === 'hi' ? 'हिंदू विवाह अधिनियम' : 'Hindu Marriage Act',
      category: 'family',
      description:
        language === 'hi'
          ? 'हिंदू विवाह अधिनियम की धाराएं और प्रावधान'
          : 'Sections and provisions of the Hindu Marriage Act',
      type: 'guide',
      size: '1.5 MB',
      views: 650,
      downloads: 150,
      tags: ['family', 'marriage', 'hindu'],
      lastUpdated: '2024-01-05',
    },
    {
      id: 5,
      title:
        language === 'hi'
          ? 'भारतीय संविधान - निर्देशक सिद्धांत'
          : 'Indian Constitution - Directive Principles',
      category: 'constitution',
      description:
        language === 'hi'
          ? 'संविधान के निर्देशक सिद्धांतों की व्याख्या'
          : 'Explanation of directive principles of the constitution',
      type: 'document',
      size: '2.1 MB',
      views: 890,
      downloads: 200,
      tags: ['constitution', 'directive', 'principles'],
      lastUpdated: '2024-01-12',
    },
    {
      id: 6,
      title:
        language === 'hi'
          ? 'आपराधिक प्रक्रिया संहिता - CrPC'
          : 'Criminal Procedure Code - CrPC',
      category: 'criminal',
      description:
        language === 'hi'
          ? 'आपराधिक प्रक्रिया संहिता के प्रावधान'
          : 'Provisions of the Criminal Procedure Code',
      type: 'guide',
      size: '2.8 MB',
      views: 720,
      downloads: 160,
      tags: ['criminal', 'crpc', 'procedure'],
      lastUpdated: '2024-01-07',
    },
  ]

  const filteredItems = knowledgeItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'guide':
        return <BookOpen className="h-5 w-5 text-green-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'document':
        return language === 'hi' ? 'दस्तावेज़' : 'Document'
      case 'guide':
        return language === 'hi' ? 'गाइड' : 'Guide'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'ज्ञान आधार' : 'Knowledge Base'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'कानूनी ज्ञान और संसाधनों का अन्वेषण करें'
              : 'Explore legal knowledge and resources'}
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder={
                  language === 'hi'
                    ? 'ज्ञान आधार में खोजें...'
                    : 'Search knowledge base...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Categories */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'hi' ? 'श्रेणियां' : 'Categories'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Items */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="transition-shadow hover:shadow-lg"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-3 flex items-center space-x-3">
                            {getTypeIcon(item.type)}
                            <span className="text-sm font-medium text-gray-500">
                              {getTypeLabel(item.type)}
                            </span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-400">
                              {item.size}
                            </span>
                          </div>

                          <h3 className="mb-2 text-xl font-semibold text-gray-900">
                            {item.title}
                          </h3>

                          <p className="mb-4 text-gray-600">
                            {item.description}
                          </p>

                          <div className="mb-4 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-4 w-4" />
                              <span>
                                {item.views}{' '}
                                {language === 'hi' ? 'देखे गए' : 'views'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Download className="h-4 w-4" />
                              <span>
                                {item.downloads}{' '}
                                {language === 'hi' ? 'डाउनलोड' : 'downloads'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>
                                {language === 'hi' ? 'अपडेट' : 'Updated'}{' '}
                                {item.lastUpdated}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col space-y-2">
                          <Button
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {language === 'hi' ? 'देखें' : 'View'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            {language === 'hi' ? 'डाउनलोड' : 'Download'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      {language === 'hi'
                        ? 'कोई परिणाम नहीं मिला'
                        : 'No results found'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'hi'
                        ? 'कृपया अपना खोज शब्द बदलें या अन्य श्रेणी आज़माएं'
                        : 'Please try changing your search term or try another category'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
