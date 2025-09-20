'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  HelpCircle,
  BookOpen,
  Users,
  FileText,
  Scale,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function HelpPage() {
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
      icon: <HelpCircle className="h-5 w-5" />,
    },
    {
      id: 'legal',
      name: language === 'hi' ? 'कानूनी' : 'Legal',
      icon: <Scale className="h-5 w-5" />,
    },
    {
      id: 'documents',
      name: language === 'hi' ? 'दस्तावेज़' : 'Documents',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 'lawyers',
      name: language === 'hi' ? 'वकील' : 'Lawyers',
      icon: <Users className="h-5 w-5" />,
    },
    {
      id: 'account',
      name: language === 'hi' ? 'खाता' : 'Account',
      icon: <BookOpen className="h-5 w-5" />,
    },
  ]

  const faqs = [
    {
      id: 1,
      category: 'legal',
      question:
        language === 'hi'
          ? 'कानूनी सलाह कैसे प्राप्त करें?'
          : 'How to get legal advice?',
      answer:
        language === 'hi'
          ? 'आप हमारे वकील खोज पेज पर जाकर अपने क्षेत्र के वकीलों को खोज सकते हैं और उनसे सीधे संपर्क कर सकते हैं।'
          : 'You can search for lawyers in your area on our lawyer search page and contact them directly.',
    },
    {
      id: 2,
      category: 'documents',
      question:
        language === 'hi'
          ? 'दस्तावेज़ कैसे अपलोड करें?'
          : 'How to upload documents?',
      answer:
        language === 'hi'
          ? 'दस्तावेज़ पेज पर जाकर "नया दस्तावेज़ अपलोड करें" बटन पर क्लिक करें और अपनी फ़ाइल चुनें।'
          : 'Go to the documents page and click "Upload New Document" button to select your file.',
    },
    {
      id: 3,
      category: 'account',
      question:
        language === 'hi' ? 'खाता कैसे बनाएं?' : 'How to create an account?',
      answer:
        language === 'hi'
          ? 'साइन अप पेज पर जाकर अपनी जानकारी भरें और खाता बनाएं।'
          : 'Go to the sign up page and fill in your information to create an account.',
    },
    {
      id: 4,
      category: 'legal',
      question:
        language === 'hi'
          ? 'कानूनी दस्तावेज़ों का विश्लेषण कैसे करें?'
          : 'How to analyze legal documents?',
      answer:
        language === 'hi'
          ? 'दस्तावेज़ अपलोड करने के बाद, हमारा AI सिस्टम आपके दस्तावेज़ का विश्लेषण करेगा और महत्वपूर्ण जानकारी प्रदान करेगा।'
          : 'After uploading documents, our AI system will analyze your documents and provide important insights.',
    },
    {
      id: 5,
      category: 'lawyers',
      question:
        language === 'hi'
          ? 'वकीलों की रेटिंग कैसे देखें?'
          : 'How to view lawyer ratings?',
      answer:
        language === 'hi'
          ? 'वकील खोज पेज पर प्रत्येक वकील की रेटिंग और समीक्षाएं दिखाई जाती हैं।'
          : 'Lawyer ratings and reviews are displayed on the lawyer search page for each lawyer.',
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: language === 'hi' ? 'फोन सहायता' : 'Phone Support',
      description: language === 'hi' ? '24/7 फोन सहायता' : '24/7 Phone Support',
      contact: '+91-9876543210',
      available: language === 'hi' ? 'सुबह 9 बजे - शाम 6 बजे' : '9 AM - 6 PM',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: language === 'hi' ? 'ईमेल सहायता' : 'Email Support',
      description:
        language === 'hi' ? 'ईमेल के माध्यम से सहायता' : 'Support via Email',
      contact: 'support@nyaymitra.com',
      available: language === 'hi' ? '24 घंटे' : '24 Hours',
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: language === 'hi' ? 'लाइव चैट' : 'Live Chat',
      description: language === 'hi' ? 'तत्काल सहायता' : 'Instant Support',
      contact: language === 'hi' ? 'चैट शुरू करें' : 'Start Chat',
      available: language === 'hi' ? 'सुबह 9 बजे - शाम 6 बजे' : '9 AM - 6 PM',
    },
  ]

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
            {language === 'hi' ? 'सहायता केंद्र' : 'Help Center'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने प्रश्नों के उत्तर खोजें या हमसे संपर्क करें'
              : 'Find answers to your questions or contact us'}
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
                  language === 'hi' ? 'सहायता खोजें...' : 'Search help...'
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

          {/* FAQ */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'hi'
                    ? 'अक्सर पूछे जाने वाले प्रश्न'
                    : 'Frequently Asked Questions'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <h3 className="mb-2 text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <HelpCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
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
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {language === 'hi' ? 'हमसे संपर्क करें' : 'Contact Support'}
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <Card key={index} className="transition-shadow hover:shadow-lg">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 inline-flex rounded-lg bg-indigo-100 p-3 text-indigo-600">
                    {method.icon}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {method.title}
                  </h3>
                  <p className="mb-4 text-gray-600">{method.description}</p>
                  <div className="space-y-2">
                    <p className="font-medium text-indigo-600">
                      {method.contact}
                    </p>
                    <p className="text-sm text-gray-500">
                      <Clock className="mr-1 inline h-4 w-4" />
                      {method.available}
                    </p>
                  </div>
                  <Button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700">
                    {language === 'hi' ? 'संपर्क करें' : 'Contact'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
