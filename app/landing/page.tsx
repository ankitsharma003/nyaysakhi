'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Scale,
  Upload,
  Search,
  Users,
  MessageCircle,
  Bot,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

import { useLanguage } from '@/lib/language-context'

export default function LandingPage() {
  const { language, setLanguage } = useLanguage()

  // initialize localLang from provider language, fallback to 'en'
  const [localLang, setLocalLang] = useState<'en' | 'hi'>(() =>
    language === 'hi' ? 'hi' : 'en'
  )

  useEffect(() => {
    // keep localLang in sync with provider
    setLocalLang(language === 'hi' ? 'hi' : 'en')

    // set document lang on client for accessibility/SEO
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language ?? 'en'
    }
  }, [language])

  const features = [
    {
      icon: <Upload className="h-8 w-8" />,
      title: localLang === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents',
      description:
        localLang === 'hi'
          ? 'अपने कानूनी दस्तावेज़ अपलोड करें और तुरंत विश्लेषण प्राप्त करें'
          : 'Upload your legal documents and get instant analysis',
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: localLang === 'hi' ? 'स्मार्ट विश्लेषण' : 'Smart Analysis',
      description:
        localLang === 'hi'
          ? 'AI द्वारा मुकदमे की जानकारी, तारीखें और स्थिति निकालें'
          : 'Extract case information, dates, and status using AI',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: localLang === 'hi' ? 'वकील खोजें' : 'Find Lawyers',
      description:
        localLang === 'hi'
          ? 'अपने क्षेत्र में सत्यापित वकीलों से जुड़ें'
          : 'Connect with verified lawyers in your area',
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: localLang === 'hi' ? 'कानूनी सहायता' : 'Legal Help',
      description:
        localLang === 'hi'
          ? 'सामान्य कानूनी प्रश्नों के उत्तर प्राप्त करें'
          : 'Get answers to common legal questions',
    },
    {
      icon: <Bot className="h-8 w-8" />,
      title: localLang === 'hi' ? 'AI चैटबॉट' : 'AI Chatbot',
      description:
        localLang === 'hi'
          ? 'कृत्रिम बुद्धिमत्ता से कानूनी सलाह प्राप्त करें'
          : 'Get legal advice from artificial intelligence',
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: localLang === 'hi' ? 'ज्ञान आधार' : 'Knowledge Base',
      description:
        localLang === 'hi'
          ? 'व्यापक कानूनी ज्ञान और संसाधनों का अन्वेषण करें'
          : 'Explore comprehensive legal knowledge and resources',
    },
  ]

  return (
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
              >
                {localLang === 'en' ? 'हिंदी' : 'English'}
              </button>

              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                >
                  {localLang === 'hi' ? 'लॉग इन करें' : 'Sign In'}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {localLang === 'hi' ? 'रजिस्टर करें' : 'Sign Up'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="legal-pattern absolute inset-0 opacity-5"></div>
          <div className="relative">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl">
              <span className="hindi-text mb-2 block text-4xl md:text-5xl">
                न्याय मित्र
              </span>
              <span className="text-indigo-600">
                {localLang === 'hi'
                  ? 'आपका AI कानूनी सहायक'
                  : 'Your AI Legal Assistant'}
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              {localLang === 'hi'
                ? 'अपने कानूनी दस्तावेज़ अपलोड करें, तुरंत विश्लेषण प्राप्त करें, और अपने क्षेत्र में सत्यापित वकीलों से जुड़ें।'
                : 'Upload your legal documents, get instant analysis, and connect with verified lawyers in your area.'}
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-indigo-700"
              >
                {localLang === 'hi' ? 'अभी शुरू करें' : 'Get Started Now'}
                <ArrowRight className="ml-2 inline h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="rounded-lg border-2 border-indigo-600 px-8 py-4 text-lg font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                {localLang === 'hi' ? 'लॉगिन करें' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              {localLang === 'hi' ? 'कैसे काम करता है' : 'How It Works'}
            </h2>
            <p className="text-xl text-gray-600">
              {localLang === 'hi'
                ? 'सरल चरणों में आपकी कानूनी समस्याओं का समाधान'
                : 'Simple steps to solve your legal problems'}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">
            {localLang === 'hi' ? 'आज ही शुरू करें' : 'Get Started Today'}
          </h2>
          <p className="mb-8 text-xl text-indigo-100">
            {localLang === 'hi'
              ? 'अपनी कानूनी यात्रा शुरू करें और न्याय मित्र के साथ सशक्त बनें'
              : 'Start your legal journey and empower yourself with Nyāy Mitra'}
          </p>
          <Link
            href="/signup"
            className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg transition-colors hover:bg-gray-100"
          >
            {localLang === 'hi' ? 'अभी शुरू करें' : 'Start Now'}
          </Link>
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
                {localLang === 'hi'
                  ? 'AI-संचालित कानूनी सहायता प्लेटफॉर्म'
                  : 'AI-powered legal assistance platform'}
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">
                {localLang === 'hi' ? 'सुविधाएं' : 'Features'}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  {localLang === 'hi'
                    ? 'दस्तावेज़ विश्लेषण'
                    : 'Document Analysis'}
                </li>
                <li>{localLang === 'hi' ? 'वकील खोज' : 'Lawyer Search'}</li>
                <li>{localLang === 'hi' ? 'कानूनी सहायता' : 'Legal Help'}</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">
                {localLang === 'hi' ? 'समर्थन' : 'Support'}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>{localLang === 'hi' ? 'सहायता केंद्र' : 'Help Center'}</li>
                <li>{localLang === 'hi' ? 'संपर्क करें' : 'Contact Us'}</li>
                <li>
                  {localLang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">
                {localLang === 'hi' ? 'कानूनी' : 'Legal'}
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  {localLang === 'hi' ? 'उपयोग की शर्तें' : 'Terms of Use'}
                </li>
                <li>
                  {localLang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}
                </li>
                <li>{localLang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 न्याय मित्र (Nyāy Mitra).{' '}
              {localLang === 'hi'
                ? 'सभी अधिकार सुरक्षित।'
                : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
