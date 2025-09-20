'use client'

import { useState } from 'react'
import {
  Scale,
  Upload,
  Search,
  Users,
  MessageCircle,
  ArrowLeft,
  Gavel,
  Bot,
  BookOpen,
  Brain,
  CheckCircle,
  Calendar,
  User,
} from 'lucide-react'
import AIChatBot from '@/components/ai-chat-bot'
import { ExtractedData } from '@/types'
import { DocumentProcessor } from '@/utils/document-processor'
import { useAuth } from '@/lib/auth-context'
import AuthGuard from '@/components/auth-guard'

// Single source of truth for step union
type Step =
  | 'home'
  | 'upload'
  | 'analyze'
  | 'faq'
  | 'lawyers'
  | 'ai-chat'
  | 'knowledge'
  | 'search'
  | 'conversations'
  | 'lawyer-profile'
  | 'lawyer-matcher'
  | 'lawyer-verification'
  | 'appointment-booking'
  | 'lawyer-dashboard'

export default function AppPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [currentStep, setCurrentStep] = useState<Step>('home')
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Upload & process document (keeps DocumentProcessor usage as in your original code)
  const handleUpload = async (files: File[]) => {
    if (!files || files.length === 0) return

    setIsProcessing(true)
    setCurrentStep('analyze')

    try {
      const processor = new DocumentProcessor()
      const results = await processor.processDocument(files[0], {
        language: language === 'hi' ? 'hin' : 'eng',
      })

      setExtractedData(results)
    } catch (error) {
      console.error('Error processing document:', error)
      setExtractedData(null)
    } finally {
      setIsProcessing(false)
    }
  }

  // Save extracted data (uses extractedData so it is not unused)
  const handleSave = async () => {
    try {
      console.log('Saving extracted data:', extractedData)
      // TODO: replace with real API call, e.g.
      // await fetch('/api/save-extracted-data', { method: 'POST', body: JSON.stringify(extractedData) })
      alert('Saved (stub). Check console for data.')
    } catch (err) {
      console.error('Save failed', err)
      alert('Save failed, see console.')
    }
  }

  const resetToHome = () => {
    setCurrentStep('home')
    setExtractedData(null)
    setIsProcessing(false)
  }

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents',
      description:
        language === 'hi'
          ? 'अपने कानूनी दस्तावेज़ अपलोड करें और तुरंत विश्लेषण प्राप्त करें'
          : 'Upload your legal documents and get instant analysis',
      requiresAuth: true,
      role: 'user',
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: language === 'hi' ? 'स्मार्ट विश्लेषण' : 'Smart Analysis',
      description:
        language === 'hi'
          ? 'AI द्वारा मुकदमे की जानकारी, तारीखें और स्थिति निकालें'
          : 'Extract case information, dates, and status using AI',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'hi' ? 'वकील खोजें' : 'Find Lawyers',
      description:
        language === 'hi'
          ? 'अपने क्षेत्र में सत्यापित वकीलों से जुड़ें'
          : 'Connect with verified lawyers in your area',
      requiresAuth: false,
      role: 'user',
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: language === 'hi' ? 'कानूनी सहायता' : 'Legal Help',
      description:
        language === 'hi'
          ? 'सामान्य कानूनी प्रश्नों के उत्तर प्राप्त करें'
          : 'Get answers to common legal questions',
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: language === 'hi' ? 'AI चैटबॉट' : 'AI Chatbot',
      description:
        language === 'hi'
          ? 'कृत्रिम बुद्धिमत्ता से कानूनी सलाह प्राप्त करें'
          : 'Get legal advice from artificial intelligence',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: language === 'hi' ? 'ज्ञान आधार' : 'Knowledge Base',
      description:
        language === 'hi'
          ? 'व्यापक कानूनी ज्ञान और संसाधनों का अन्वेषण करें'
          : 'Explore comprehensive legal knowledge and resources',
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: language === 'hi' ? 'बुद्धिमान खोज' : 'Smart Search',
      description:
        language === 'hi'
          ? 'अपने प्रश्नों के लिए सबसे प्रासंगिक उत्तर खोजें'
          : 'Find the most relevant answers to your questions',
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: language === 'hi' ? 'बातचीत इतिहास' : 'Conversation History',
      description:
        language === 'hi'
          ? 'अपनी पिछली कानूनी चर्चाएं देखें और जारी रखें'
          : 'View and continue your previous legal discussions',
    },
    {
      icon: <Gavel className="h-8 w-8" />,
      title: language === 'hi' ? 'वकील प्रोफाइल' : 'Lawyer Profile',
      description:
        language === 'hi'
          ? 'वकीलों की विस्तृत प्रोफाइल और रेटिंग देखें'
          : 'View detailed lawyer profiles and ratings',
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: language === 'hi' ? 'वकील मैचिंग' : 'Lawyer Matching',
      description:
        language === 'hi'
          ? 'अपने मामले के लिए सही वकील खोजें'
          : 'Find the right lawyer for your case',
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: language === 'hi' ? 'वकील सत्यापन' : 'Lawyer Verification',
      description:
        language === 'hi'
          ? 'वकीलों के प्रमाणपत्र और सत्यापन देखें'
          : 'View lawyer certificates and verification',
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: language === 'hi' ? 'अपॉइंटमेंट बुकिंग' : 'Appointment Booking',
      description:
        language === 'hi'
          ? 'वकीलों के साथ अपॉइंटमेंट बुक करें'
          : 'Book appointments with lawyers',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: language === 'hi' ? 'वकील डैशबोर्ड' : 'Lawyer Dashboard',
      description:
        language === 'hi'
          ? 'वकीलों के लिए मामला प्रबंधन डैशबोर्ड'
          : 'Case management dashboard for lawyers',
      requiresAuth: true,
      role: 'lawyer',
    },
  ]

  // mapping values MUST match Step type and features order
  const featureIndexToStep: Record<number, Step> = {
    0: 'upload', // Upload Documents
    1: 'upload', // Smart Analysis -> upload/analyze
    2: 'lawyers', // Find Lawyers
    3: 'faq', // Legal Help
    4: 'ai-chat', // AI Chatbot
    5: 'knowledge', // Knowledge Base
    6: 'search', // Smart Search
    7: 'conversations', // Conversation History
    8: 'lawyer-profile', // Lawyer Profile
    9: 'lawyer-matcher', // Lawyer Matching
    10: 'lawyer-verification', // Lawyer Verification
    11: 'appointment-booking', // Appointment Booking
    12: 'lawyer-dashboard', // Lawyer Dashboard
  }

  // ANALYZE VIEW: show minimal extractedData + Save so variables are used
  if (currentStep === 'analyze') {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gray-50">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-indigo-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    Nyāy Mitra
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
                    type="button"
                  >
                    {language === 'en' ? 'हिंदी' : 'English'}
                  </button>
                  <button
                    onClick={resetToHome}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-indigo-600"
                    type="button"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-4xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {language === 'hi' ? 'विश्लेषण परिणाम' : 'Analysis Results'}
              </h2>
              <div className="flex items-center gap-3">
                {isProcessing ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      />
                      <path
                        d="M4 12a8 8 0 018-8"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-75"
                      />
                    </svg>
                    <span>
                      {language === 'hi'
                        ? 'प्रोसेस हो रहा है...'
                        : 'Processing...'}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    {language === 'hi' ? 'तैयार' : 'Ready'}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm">
              {extractedData ? (
                <>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap text-sm text-gray-800">
                    {JSON.stringify(extractedData, null, 2)}
                  </pre>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleSave}
                      className="rounded bg-indigo-600 px-4 py-2 text-white"
                      type="button"
                    >
                      {language === 'hi'
                        ? 'निष्कर्ष सहेजें'
                        : 'Save extracted data'}
                    </button>
                    <button
                      onClick={resetToHome}
                      className="rounded border px-4 py-2"
                      type="button"
                    >
                      {language === 'hi' ? 'मुखपृष्ठ पर जाएँ' : 'Back to home'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-600">
                  {language === 'hi'
                    ? 'कोई डेटा नहीं मिला। कृपया दस्तावेज़ अपलोड करें।'
                    : 'No data found — please upload a document.'}
                  <div className="mt-4">
                    <label className="inline-flex cursor-pointer items-center rounded bg-indigo-50 px-4 py-2 text-indigo-600">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.png,.jpeg,.docx"
                        onChange={(e) => {
                          if (e.target.files)
                            handleUpload(Array.from(e.target.files))
                        }}
                        className="sr-only"
                      />
                      {language === 'hi'
                        ? 'दस्तावेज़ चुनें'
                        : 'Choose document'}
                    </label>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </AuthGuard>
    )
  }

  // If user chose AI chat, render that view
  if (currentStep === 'ai-chat') {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gray-50">
          <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-2">
                  <Scale className="h-8 w-8 text-indigo-600" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    <span className="hindi-text">न्याय मित्र</span>
                    <span className="ml-2 text-indigo-600">Nyāy Mitra</span>
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                    className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
                    type="button"
                  >
                    {language === 'en' ? 'हिंदी' : 'English'}
                  </button>
                  <button
                    onClick={resetToHome}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-indigo-600"
                    type="button"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <main className="px-4 py-12 sm:px-6 lg:px-8">
            <AIChatBot language={language} />
          </main>
        </div>
      </AuthGuard>
    )
  }

  // Main home / dashboard view
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center space-x-2">
                <Scale className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="hindi-text">न्याय मित्र</span>
                  <span className="ml-2 text-indigo-600">Nyāy Mitra</span>
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                  className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
                  type="button"
                >
                  {language === 'en' ? 'हिंदी' : 'English'}
                </button>

                {isAuthenticated && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {user?.name}
                        </div>
                        <div className="capitalize text-gray-500">
                          {user?.role}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                      type="button"
                    >
                      {language === 'hi' ? 'लॉगआउट' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <div className="legal-pattern absolute inset-0 opacity-5" />
            <div className="relative">
              <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
                <span className="hindi-text mb-2 block text-4xl md:text-5xl">
                  न्याय मित्र
                </span>
                <span className="text-indigo-600">
                  {language === 'hi'
                    ? 'आपका AI कानूनी सहायक'
                    : 'Your AI Legal Assistant'}
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
                {language === 'hi'
                  ? 'अपने कानूनी दस्तावेज़ अपलोड करें, तुरंत विश्लेषण प्राप्त करें, और अपने क्षेत्र में सत्यापित वकीलों से जुड़ें।'
                  : 'Upload your legal documents, get instant analysis, and connect with verified lawyers in your area.'}
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => setCurrentStep('upload')}
                  className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700"
                  type="button"
                >
                  {language === 'hi'
                    ? 'अपना मुकदमा स्कैन करें'
                    : 'Scan Your Case'}
                </button>
                <button
                  onClick={() => setCurrentStep('lawyers')}
                  className="rounded-lg border-2 border-indigo-600 px-8 py-4 text-lg font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
                  type="button"
                >
                  {language === 'hi' ? 'वकील खोजें' : 'Find Lawyers'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-900">
                {language === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
              </h2>
              <p className="text-xl text-gray-600">
                {language === 'hi'
                  ? 'सरल चरणों में आपकी कानूनी समस्याओं का समाधान'
                  : 'Simple steps to solve your legal problems'}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl bg-gray-50 p-6 text-center transition-all duration-300 hover:bg-white hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mb-4 text-gray-600">{feature.description}</p>
                  <button
                    onClick={() => {
                      const selected = features[index]

                      if (selected.requiresAuth && !isAuthenticated) {
                        window.location.href = '/login'
                        return
                      }

                      if (selected.role && user?.role !== selected.role) {
                        if (
                          selected.role === 'lawyer' &&
                          user?.role !== 'lawyer'
                        ) {
                          window.location.href = '/signup'
                          return
                        }
                      }

                      const next = featureIndexToStep[index] ?? 'home'
                      setCurrentStep(next)
                    }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    type="button"
                  >
                    {language === 'hi' ? 'शुरू करें' : 'Get Started'} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-indigo-600 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              {language === 'hi' ? 'आज ही शुरू करें' : 'Get Started Today'}
            </h2>
            <p className="mb-8 text-xl text-indigo-100">
              {language === 'hi'
                ? 'अपनी कानूनी यात्रा शुरू करें और न्याय मित्र के साथ सशक्त बनें'
                : 'Start your legal journey and empower yourself with Nyāy Mitra'}
            </p>
            <button
              onClick={() => setCurrentStep('upload')}
              className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-colors hover:bg-gray-100"
              type="button"
            >
              {language === 'hi' ? 'अभी शुरू करें' : 'Start Now'}
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 px-4 py-12 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center space-x-2">
                  <Scale className="h-6 w-6" />
                  <span className="text-xl font-bold">न्याय मित्र</span>
                </div>
                <p className="text-gray-400">
                  {language === 'hi'
                    ? 'AI-संचालित कानूनी सहायता प्लेटफॉर्म'
                    : 'AI-powered legal assistance platform'}
                </p>
              </div>
              <div>
                <h3 className="mb-4 font-semibold">
                  {language === 'hi' ? 'सुविधाएं' : 'Features'}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    {language === 'hi'
                      ? 'दस्तावेज़ विश्लेषण'
                      : 'Document Analysis'}
                  </li>
                  <li>{language === 'hi' ? 'वकील खोज' : 'Lawyer Search'}</li>
                  <li>{language === 'hi' ? 'कानूनी सहायता' : 'Legal Help'}</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold">
                  {language === 'hi' ? 'समर्थन' : 'Support'}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>{language === 'hi' ? 'सहायता केंद्र' : 'Help Center'}</li>
                  <li>{language === 'hi' ? 'संपर्क करें' : 'Contact Us'}</li>
                  <li>
                    {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-semibold">
                  {language === 'hi' ? 'कानूनी' : 'Legal'}
                </h3>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    {language === 'hi' ? 'उपयोग की शर्तें' : 'Terms of Use'}
                  </li>
                  <li>
                    {language === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                  </li>
                  <li>{language === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
              <p>
                &copy; 2025 न्याय मित्र (Nyāy Mitra).{' '}
                {language === 'hi'
                  ? 'सभी अधिकार सुरक्षित।'
                  : 'All rights reserved.'}
              </p>
            </div>
          </div>
        </footer>

        {/* Floating AI Chat Bot */}
        <AIChatBot
          language={language}
          className="fixed bottom-4 right-4 z-50"
          isMinimized={false}
        />
      </div>
    </AuthGuard>
  )
}
