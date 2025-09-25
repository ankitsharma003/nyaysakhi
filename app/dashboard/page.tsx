'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Scale,
  User,
  FileText,
  Search,
  MessageCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Upload,
  BookOpen,
  Users,
  BarChart3,
  Bot,
} from 'lucide-react'
// import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'
import { useChatbot } from '@/lib/chatbot-context'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const { isChatbotEnabled, toggleChatbot } = useChatbot()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/landing')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <p className="text-lg font-medium text-gray-900">
            {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Different quick actions based on user role
  const getQuickActions = () => {
    if (user?.role === 'lawyer') {
      return [
        {
          icon: <Users className="h-6 w-6" />,
          title: language === 'hi' ? 'मेरे क्लाइंट' : 'My Clients',
          description:
            language === 'hi'
              ? 'अपने क्लाइंट्स को देखें और प्रबंधित करें'
              : 'View and manage your clients',
          href: '/lawyer/clients',
          color: 'bg-blue-500',
        },
        {
          icon: <FileText className="h-6 w-6" />,
          title: language === 'hi' ? 'केस प्रबंधन' : 'Case Management',
          description:
            language === 'hi'
              ? 'अपने केसों को ट्रैक और प्रबंधित करें'
              : 'Track and manage your cases',
          href: '/lawyer/cases',
          color: 'bg-green-500',
        },
        {
          icon: <BarChart3 className="h-6 w-6" />,
          title: language === 'hi' ? 'रिपोर्ट्स' : 'Reports',
          description:
            language === 'hi'
              ? 'अपने प्रैक्टिस की रिपोर्ट्स देखें'
              : 'View your practice reports',
          href: '/lawyer/reports',
          color: 'bg-purple-500',
        },
        {
          icon: <Settings className="h-6 w-6" />,
          title: language === 'hi' ? 'प्रोफ़ाइल सेटिंग्स' : 'Profile Settings',
          description:
            language === 'hi'
              ? 'अपनी प्रोफ़ाइल और सेटिंग्स अपडेट करें'
              : 'Update your profile and settings',
          href: '/lawyer/profile',
          color: 'bg-orange-500',
        },
      ]
    } else {
      return [
        {
          icon: <Upload className="h-6 w-6" />,
          title: language === 'hi' ? 'दस्तावेज़ अपलोड करें' : 'Upload Document',
          description:
            language === 'hi'
              ? 'कानूनी दस्तावेज़ अपलोड करें और विश्लेषण प्राप्त करें'
              : 'Upload legal documents and get analysis',
          href: '/documents/upload',
          color: 'bg-blue-500',
        },
        {
          icon: <Search className="h-6 w-6" />,
          title: language === 'hi' ? 'वकील खोजें' : 'Find Lawyers',
          description:
            language === 'hi'
              ? 'अपने क्षेत्र में सत्यापित वकीलों को खोजें'
              : 'Find verified lawyers in your area',
          href: '/lawyers',
          color: 'bg-green-500',
        },
        {
          icon: <MessageCircle className="h-6 w-6" />,
          title: language === 'hi' ? 'कानूनी सहायता' : 'Legal Help',
          description:
            language === 'hi'
              ? 'सामान्य कानूनी प्रश्नों के उत्तर प्राप्त करें'
              : 'Get answers to common legal questions',
          href: '/help',
          color: 'bg-purple-500',
        },
        {
          icon: <BookOpen className="h-6 w-6" />,
          title: language === 'hi' ? 'ज्ञान आधार' : 'Knowledge Base',
          description:
            language === 'hi'
              ? 'कानूनी ज्ञान और संसाधनों का अन्वेषण करें'
              : 'Explore legal knowledge and resources',
          href: '/knowledge',
          color: 'bg-orange-500',
        },
      ]
    }
  }

  const quickActions = getQuickActions()

  const recentActivities = [
    {
      type: 'document',
      title:
        language === 'hi' ? 'दस्तावेज़ अपलोड किया गया' : 'Document uploaded',
      time: '2 hours ago',
      status: 'completed',
    },
    {
      type: 'lawyer',
      title: language === 'hi' ? 'वकील से संपर्क किया' : 'Contacted lawyer',
      time: '1 day ago',
      status: 'pending',
    },
    {
      type: 'help',
      title: language === 'hi' ? 'कानूनी सहायता मांगी' : 'Requested legal help',
      time: '3 days ago',
      status: 'completed',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 lg:hidden"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex items-center space-x-2">
                <Scale className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  <span className="hindi-text">न्याय सखी</span>
                  <span className="ml-2 text-indigo-600">Dashboard</span>
                </h1>
              </div>  
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
              >
                {language === 'en' ? 'हिंदी' : 'English'}
              </button>
              <button
                onClick={toggleChatbot}
                className={`p-2 transition-colors ${
                  isChatbotEnabled
                    ? 'text-indigo-600 hover:text-indigo-700'
                    : 'text-gray-400 hover:text-gray-500'
                }`}
                title={language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
              >
                <Bot className="h-6 w-6" />
              </button>
              <div className="relative">
                <button
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title={language === 'hi' ? 'सूचनाएं' : 'Notifications'}
                >
                  <Bell className="h-6 w-6" />
                </button>
                <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0`}
        >
          <div className="flex h-full flex-col">
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600"
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>{language === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
                </Link>

                {user?.role === 'lawyer' ? (
                  // Lawyer-specific navigation
                  <>
                    <Link
                      href="/lawyer/clients"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Users className="h-5 w-5" />
                      <span>{language === 'hi' ? 'क्लाइंट्स' : 'Clients'}</span>
                    </Link>
                    <Link
                      href="/lawyer/cases"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <FileText className="h-5 w-5" />
                      <span>{language === 'hi' ? 'केस' : 'Cases'}</span>
                    </Link>
                    <Link
                      href="/lawyer/reports"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <BarChart3 className="h-5 w-5" />
                      <span>{language === 'hi' ? 'रिपोर्ट्स' : 'Reports'}</span>
                    </Link>
                    <Link
                      href="/lawyer/profile"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Settings className="h-5 w-5" />
                      <span>{language === 'hi' ? 'प्रोफ़ाइल' : 'Profile'}</span>
                    </Link>
                  </>
                ) : (
                  // Regular user navigation
                  <>
                    <Link
                      href="/documents"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <FileText className="h-5 w-5" />
                      <span>
                        {language === 'hi' ? 'दस्तावेज़' : 'Documents'}
                      </span>
                    </Link>
                    <Link
                      href="/lawyers"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Users className="h-5 w-5" />
                      <span>{language === 'hi' ? 'वकील' : 'Lawyers'}</span>
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                      <span>{language === 'hi' ? 'सहायता' : 'Help'}</span>
                    </Link>
                    <Link
                      href="/knowledge"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>
                        {language === 'hi' ? 'ज्ञान आधार' : 'Knowledge'}
                      </span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                      <Settings className="h-5 w-5" />
                      <span>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
            <div className="border-t px-4 py-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                <span>{language === 'hi' ? 'लॉग आउट' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {language === 'hi' ? 'स्वागत है' : 'Welcome back'}, {user?.name}
                !
              </h2>
              <p className="mt-2 text-gray-600">
                {user?.role === 'lawyer'
                  ? language === 'hi'
                    ? 'अपने क्लाइंट्स और केसों के साथ काम करने के लिए तैयार हैं'
                    : 'Ready to work with your clients and cases'
                  : language === 'hi'
                    ? 'आपके कानूनी दस्तावेज़ों और वकीलों के साथ काम करने के लिए तैयार हैं'
                    : 'Ready to work with your legal documents and lawyers'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="mb-4 text-xl font-semibold text-gray-900">
                {language === 'hi' ? 'त्वरित कार्य' : 'Quick Actions'}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href}>
                    <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                      <CardContent className="p-6">
                        <div
                          className={`inline-flex rounded-lg p-3 ${action.color} mb-4 text-white`}
                        >
                          {action.icon}
                        </div>
                        <h4 className="mb-2 text-lg font-semibold text-gray-900">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'हाल की गतिविधि' : 'Recent Activity'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            activity.status === 'completed'
                              ? 'bg-green-500'
                              : 'bg-yellow-500'
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* User Profile Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi' ? 'प्रोफ़ाइल सारांश' : 'Profile Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">0</p>
                        <p className="text-sm text-gray-500">
                          {language === 'hi' ? 'दस्तावेज़' : 'Documents'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">0</p>
                        <p className="text-sm text-gray-500">
                          {language === 'hi'
                            ? 'वकील संपर्क'
                            : 'Lawyer Contacts'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
