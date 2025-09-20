'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Scale,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function TwoFactorAuthPage() {
  const router = useRouter()
  const { verify2FA, isLoading, isAuthenticated } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [formData, setFormData] = useState({
    email: '',
    twoFactorCode: '',
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await verify2FA(formData.email, formData.twoFactorCode)
      setSuccess(
        language === 'hi'
          ? '2FA सफलतापूर्वक सत्यापित'
          : '2FA successfully verified'
      )
      setTimeout(() => {
        router.push('/app')
      }, 1000)
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'hi'
            ? '2FA सत्यापन में त्रुटि'
            : '2FA verification failed')
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="hindi-text">न्याय मित्र</span>
                <span className="ml-2 text-indigo-600">Nyāy Mitra</span>
              </h1>
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              <Link
                href="/login"
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 transition-colors hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{language === 'hi' ? 'वापस' : 'Back'}</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">
                {language === 'hi'
                  ? 'दो-कारक प्रमाणीकरण'
                  : 'Two-Factor Authentication'}
              </CardTitle>
              <p className="mt-2 text-gray-600">
                {language === 'hi'
                  ? 'अपने ऑथेंटिकेटर ऐप में दिखाई गई 6-अंकीय कोड दर्ज करें'
                  : 'Enter the 6-digit code from your authenticator app'}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Error/Success Messages */}
              {error && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-100 p-3">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 rounded-lg border border-green-200 bg-green-100 p-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">{success}</span>
                </div>
              )}

              {/* 2FA Form */}
              <form onSubmit={handle2FA} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'ईमेल' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    placeholder={
                      language === 'hi'
                        ? 'अपना ईमेल दर्ज करें'
                        : 'Enter your email address'
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'सत्यापन कोड' : 'Verification Code'}
                  </label>
                  <input
                    type="text"
                    value={formData.twoFactorCode}
                    onChange={(e) =>
                      handleInputChange('twoFactorCode', e.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-3 text-center text-2xl tracking-widest focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {language === 'hi'
                      ? 'अपने ऑथेंटिकेटर ऐप में दिखाई गई 6-अंकीय कोड दर्ज करें'
                      : 'Enter the 6-digit code from your authenticator app'}
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 py-3 text-base font-semibold hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Shield className="mr-2 h-5 w-5" />
                  )}
                  {language === 'hi' ? 'सत्यापित करें' : 'Verify Code'}
                </Button>
              </form>

              {/* Help Section */}
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-900">
                  {language === 'hi' ? 'मदद चाहिए?' : 'Need Help?'}
                </h3>
                <p className="text-xs text-gray-600">
                  {language === 'hi' ? (
                    <>
                      यदि आपको अपना ऑथेंटिकेटर ऐप नहीं मिल रहा है, तो कृपया{' '}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        सहायता केंद्र
                      </a>{' '}
                      से संपर्क करें।
                    </>
                  ) : (
                    <>
                      If you can&apos;t find your authenticator app, please
                      contact{' '}
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-500"
                      >
                        support
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  {language === 'hi' ? 'लॉगिन पर वापस जाएं' : 'Back to Login'}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
