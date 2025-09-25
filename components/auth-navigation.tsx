'use client'

import Link from 'next/link'
import { Scale, ArrowLeft } from 'lucide-react'

interface AuthNavigationProps {
  language: 'en' | 'hi'
  showBackButton?: boolean
  backHref?: string
}

export default function AuthNavigation({
  language,
  showBackButton = true,
  backHref = '/',
}: AuthNavigationProps) {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="hindi-text">न्याय सखी</span>
              <span className="ml-2 text-indigo-600">Nyāy Sakhi</span>
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                // This would need to be passed as a prop or handled by parent
                // For now, we'll just toggle the language in localStorage
                const currentLang = localStorage.getItem('language') || 'en'
                const newLang = currentLang === 'en' ? 'hi' : 'en'
                localStorage.setItem('language', newLang)
                window.location.reload()
              }}
              className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
            {showBackButton && (
              <Link
                href={backHref}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
