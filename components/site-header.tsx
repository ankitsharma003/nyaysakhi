'use client'

import Link from 'next/link'
import { Scale } from 'lucide-react'
import LanguageSwitcher from './language-switcher'
import { useTranslation } from '@/lib/i18n'

export default function SiteHeader() {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Scale className="h-8 w-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              <span className="indian-text">
                {t('appName') || 'Nyāy Mitra'}
              </span>
              <span className="ml-2 text-indigo-600">Nyāy Mitra</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <nav className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className="text-sm text-gray-700 hover:text-indigo-600"
              >
                {t('signIn')}
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                {t('signUp')}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
