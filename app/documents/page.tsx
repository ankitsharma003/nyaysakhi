'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, FileText, Search, Filter, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function DocumentsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')

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
            {language === 'hi' ? 'मेरे दस्तावेज़' : 'My Documents'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने कानूनी दस्तावेज़ों को अपलोड करें और प्रबंधित करें'
              : 'Upload and manage your legal documents'}
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>
                {language === 'hi'
                  ? 'नया दस्तावेज़ अपलोड करें'
                  : 'Upload New Document'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Document'}
              </h3>
              <p className="mb-4 text-gray-600">
                {language === 'hi'
                  ? 'PDF, DOC, या IMG फ़ाइलें खींचें और छोड़ें या ब्राउज़ करें'
                  : 'Drag and drop PDF, DOC, or IMG files or browse'}
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" />
                {language === 'hi' ? 'फ़ाइल चुनें' : 'Choose File'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Documents List */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {language === 'hi' ? 'दस्तावेज़ सूची' : 'Document List'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="mr-2 h-4 w-4" />
                    {language === 'hi' ? 'फ़िल्टर' : 'Filter'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="mr-2 h-4 w-4" />
                    {language === 'hi' ? 'खोजें' : 'Search'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {language === 'hi'
                    ? 'कोई दस्तावेज़ नहीं मिला'
                    : 'No documents found'}
                </h3>
                <p className="mb-4 text-gray-600">
                  {language === 'hi'
                    ? 'अपना पहला कानूनी दस्तावेज़ अपलोड करके शुरू करें'
                    : 'Get started by uploading your first legal document'}
                </p>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Upload className="mr-2 h-4 w-4" />
                  {language === 'hi'
                    ? 'दस्तावेज़ अपलोड करें'
                    : 'Upload Document'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
