'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Clock,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LawyerReportsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Redirect if not authenticated or not a lawyer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'lawyer')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user?.role, router])

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

  if (!isAuthenticated || user?.role !== 'lawyer') {
    return null
  }

  // Mock report data
  const reportData = {
    totalClients: 25,
    activeCases: 12,
    completedCases: 8,
    totalRevenue: 150000,
    monthlyRevenue: 25000,
    averageCaseDuration: 45,
    clientSatisfaction: 4.8,
    caseTypes: [
      { type: 'Criminal Law', count: 8, percentage: 40 },
      { type: 'Family Law', count: 6, percentage: 30 },
      { type: 'Corporate Law', count: 4, percentage: 20 },
      { type: 'Property Law', count: 2, percentage: 10 },
    ],
    monthlyStats: [
      { month: 'Jan', cases: 3, revenue: 20000 },
      { month: 'Feb', cases: 5, revenue: 25000 },
      { month: 'Mar', cases: 4, revenue: 30000 },
      { month: 'Apr', cases: 6, revenue: 35000 },
    ],
  }

  // const getPeriodText = (period: string) => {
  //   switch (period) {
  //     case 'week':
  //       return language === 'hi' ? 'सप्ताह' : 'Week'
  //     case 'month':
  //       return language === 'hi' ? 'महीना' : 'Month'
  //     case 'quarter':
  //       return language === 'hi' ? 'तिमाही' : 'Quarter'
  //     case 'year':
  //       return language === 'hi' ? 'वर्ष' : 'Year'
  //     default:
  //       return period
  //   }
  // }

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
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                aria-label={language === 'hi' ? 'समय अवधि' : 'Time Period'}
              >
                <option value="week">
                  {language === 'hi' ? 'सप्ताह' : 'Week'}
                </option>
                <option value="month">
                  {language === 'hi' ? 'महीना' : 'Month'}
                </option>
                <option value="quarter">
                  {language === 'hi' ? 'तिमाही' : 'Quarter'}
                </option>
                <option value="year">
                  {language === 'hi' ? 'वर्ष' : 'Year'}
                </option>
              </select>
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
            {language === 'hi' ? 'रिपोर्ट्स' : 'Reports'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने प्रैक्टिस की विस्तृत रिपोर्ट्स देखें'
              : 'View detailed reports of your practice'}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'hi' ? 'कुल क्लाइंट्स' : 'Total Clients'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.totalClients}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'hi' ? 'सक्रिय केस' : 'Active Cases'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.activeCases}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'hi' ? 'मासिक आय' : 'Monthly Revenue'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{reportData.monthlyRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {language === 'hi' ? 'संतुष्टि दर' : 'Satisfaction Rate'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reportData.clientSatisfaction}/5
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Case Types Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>
                  {language === 'hi'
                    ? 'केस प्रकार वितरण'
                    : 'Case Types Distribution'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.caseTypes.map((caseType, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-indigo-600"></div>
                      <span className="text-sm font-medium text-gray-900">
                        {caseType.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {caseType.count} {language === 'hi' ? 'केस' : 'cases'}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {caseType.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>
                  {language === 'hi' ? 'मासिक प्रदर्शन' : 'Monthly Performance'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.monthlyStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {stat.month}
                      </p>
                      <p className="text-xs text-gray-600">
                        {stat.cases} {language === 'hi' ? 'केस' : 'cases'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ₹{stat.revenue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">
                        {language === 'hi' ? 'राजस्व' : 'revenue'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {language === 'hi' ? 'औसत केस अवधि' : 'Average Case Duration'}
              </h3>
              <p className="text-3xl font-bold text-indigo-600">
                {reportData.averageCaseDuration}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'दिन' : 'days'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {language === 'hi' ? 'पूर्ण केस' : 'Completed Cases'}
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {reportData.completedCases}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'इस साल' : 'this year'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {language === 'hi' ? 'कुल राजस्व' : 'Total Revenue'}
              </h3>
              <p className="text-3xl font-bold text-purple-600">
                ₹{reportData.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {language === 'hi' ? 'इस साल' : 'this year'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <div className="mt-8 flex justify-center">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Download className="mr-2 h-4 w-4" />
            {language === 'hi' ? 'रिपोर्ट डाउनलोड करें' : 'Download Report'}
          </Button>
        </div>
      </main>
    </div>
  )
}
