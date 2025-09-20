'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Save,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    bio: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowLawyerContact: true,
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
        bio: '',
      })
    }
  }, [user])

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

  const handleSaveProfile = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    // Show success message (replace with your toast/notification)
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert(
        language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match'
      )
      return
    }
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
  }

  const handleDeleteAccount = async () => {
    if (
      confirm(
        language === 'hi'
          ? 'क्या आप वाकई अपना खाता हटाना चाहते हैं?'
          : 'Are you sure you want to delete your account?'
      )
    ) {
      await logout()
      router.push('/landing')
    }
  }

  const tabs = [
    {
      id: 'profile',
      name: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile',
      icon: <User className="h-5 w-5" aria-hidden />,
    },
    {
      id: 'security',
      name: language === 'hi' ? 'सुरक्षा' : 'Security',
      icon: <Shield className="h-5 w-5" aria-hidden />,
    },
    {
      id: 'notifications',
      name: language === 'hi' ? 'सूचनाएं' : 'Notifications',
      icon: <Bell className="h-5 w-5" aria-hidden />,
    },
    {
      id: 'privacy',
      name: language === 'hi' ? 'गोपनीयता' : 'Privacy',
      icon: <Globe className="h-5 w-5" aria-hidden />,
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
                title={
                  language === 'hi'
                    ? 'डैशबोर्ड पर वापस जाएं'
                    : 'Back to Dashboard'
                }
              >
                <ArrowLeft className="h-5 w-5" aria-hidden />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div>
                <label
                  htmlFor="languageSelect"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  {language === 'hi' ? 'भाषा चुनें' : 'Select Language'}
                </label>
                <select
                  id="languageSelect"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as typeof language)
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="ml">മലയാളം</option>
                  <option value="te">తెలుగు</option>
                  <option value="bn">বাংলা</option>
                  <option value="gu">ગુજરાતી</option>
                  <option value="mr">मराठी</option>
                  <option value="pa">ਪੰਜਾਬੀ</option>
                  <option value="or">ଓଡ଼ିଆ</option>
                  <option value="as">অসমীয়া</option>
                  <option value="sd">سنڌي</option>
                  {/* Add more Indian languages if needed */}
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'सेटिंग्स' : 'Settings'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपने खाते की सेटिंग्स प्रबंधित करें'
              : 'Manage your account settings'}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <nav
                  className="space-y-1"
                  aria-label={
                    language === 'hi' ? 'नैविगेशन पैनल' : 'Settings navigation'
                  }
                >
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center space-x-3 px-4 py-3 text-left transition-colors ${
                        activeTab === tab.id
                          ? 'border-r-2 border-indigo-600 bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                      title={tab.name}
                      type="button"
                    >
                      {tab.icon}
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi'
                      ? 'प्रोफ़ाइल जानकारी'
                      : 'Profile Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="nameInput"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {language === 'hi' ? 'नाम' : 'Name'}
                      </label>
                      <input
                        id="nameInput"
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            name: e.target.value,
                          })
                        }
                        placeholder={
                          language === 'hi'
                            ? 'अपना नाम दर्ज करें'
                            : 'Enter your name'
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="emailInput"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {language === 'hi' ? 'ईमेल' : 'Email'}
                      </label>
                      <input
                        id="emailInput"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            email: e.target.value,
                          })
                        }
                        placeholder={
                          language === 'hi'
                            ? 'आपका ईमेल दर्ज करें'
                            : 'Enter your email'
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phoneInput"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                      </label>
                      <input
                        id="phoneInput"
                        name="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            phone: e.target.value,
                          })
                        }
                        placeholder={
                          language === 'hi'
                            ? '10 अंक फोन नंबर'
                            : '10-digit phone number'
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="addressInput"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {language === 'hi' ? 'पता' : 'Address'}
                      </label>
                      <input
                        id="addressInput"
                        name="address"
                        type="text"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            address: e.target.value,
                          })
                        }
                        placeholder={
                          language === 'hi' ? 'आपका पता' : 'Your address'
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="bioInput"
                      className="mb-2 block text-sm font-medium text-gray-700"
                    >
                      {language === 'hi' ? 'बायो' : 'Bio'}
                    </label>
                    <textarea
                      id="bioInput"
                      name="bio"
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows={4}
                      placeholder={
                        language === 'hi'
                          ? 'अपने बारे में कुछ बताएं...'
                          : 'Tell us about yourself...'
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-indigo-600 hover:bg-indigo-700"
                    type="button"
                    title={
                      language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save profile'
                    }
                    aria-label={
                      language === 'hi' ? 'प्रोफ़ाइल सहेजें' : 'Save profile'
                    }
                  >
                    <Save className="mr-2 h-4 w-4" aria-hidden />
                    {isSaving
                      ? language === 'hi'
                        ? 'सेव हो रहा है...'
                        : 'Saving...'
                      : language === 'hi'
                        ? 'सेव करें'
                        : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi'
                      ? 'सुरक्षा सेटिंग्स'
                      : 'Security Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      {language === 'hi' ? 'पासवर्ड बदलें' : 'Change Password'}
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="currentPassword"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          {language === 'hi'
                            ? 'वर्तमान पासवर्ड'
                            : 'Current Password'}
                        </label>
                        <div className="relative">
                          <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showPassword ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            placeholder={
                              language === 'hi'
                                ? 'वर्तमान पासवर्ड दर्ज करें'
                                : 'Enter current password'
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                            title={
                              language === 'hi'
                                ? 'वर्तमान पासवर्ड'
                                : 'Current password'
                            }
                          />
                          <button
                            id="passwordToggle"
                            aria-pressed={showPassword}
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            title={
                              showPassword
                                ? language === 'hi'
                                  ? 'पासवर्ड छिपाएँ'
                                  : 'Hide password'
                                : language === 'hi'
                                  ? 'पासवर्ड दिखाएँ'
                                  : 'Show password'
                            } // boolean, not quoted
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" aria-hidden />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="newPassword"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          {language === 'hi' ? 'नया पासवर्ड' : 'New Password'}
                        </label>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder={
                            language === 'hi'
                              ? 'नया पासवर्ड दर्ज करें'
                              : 'Enter new password'
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="mb-2 block text-sm font-medium text-gray-700"
                        >
                          {language === 'hi'
                            ? 'पासवर्ड की पुष्टि करें'
                            : 'Confirm Password'}
                        </label>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder={
                            language === 'hi'
                              ? 'पुनः पासवर्ड दर्ज करें'
                              : 'Re-enter password'
                          }
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <Button
                        onClick={handleChangePassword}
                        disabled={isSaving}
                        className="bg-indigo-600 hover:bg-indigo-700"
                        type="button"
                        title={
                          language === 'hi'
                            ? 'पासवर्ड बदलें'
                            : 'Change password'
                        }
                      >
                        {isSaving
                          ? language === 'hi'
                            ? 'बदल रहा है...'
                            : 'Changing...'
                          : language === 'hi'
                            ? 'पासवर्ड बदलें'
                            : 'Change Password'}
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="mb-4 text-lg font-semibold text-red-600">
                      {language === 'hi' ? 'खतरनाक क्षेत्र' : 'Danger Zone'}
                    </h3>
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                      <h4 className="mb-2 font-medium text-red-800">
                        {language === 'hi' ? 'खाता हटाएं' : 'Delete Account'}
                      </h4>
                      <p className="mb-4 text-sm text-red-600">
                        {language === 'hi'
                          ? 'एक बार आपका खाता हट जाने के बाद, इसे पुनर्प्राप्त नहीं किया जा सकता।'
                          : 'Once you delete your account, it cannot be recovered.'}
                      </p>
                      <Button
                        onClick={handleDeleteAccount}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        type="button"
                        title={
                          language === 'hi' ? 'खाता हटाएँ' : 'Delete account'
                        }
                      >
                        <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                        {language === 'hi' ? 'खाता हटाएं' : 'Delete Account'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi'
                      ? 'सूचना सेटिंग्स'
                      : 'Notification Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi'
                            ? 'ईमेल सूचनाएं'
                            : 'Email Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'ईमेल के माध्यम से सूचनाएं प्राप्त करें'
                            : 'Receive notifications via email'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="emailNotifications"
                          name="emailNotifications"
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              emailNotifications: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi'
                              ? 'ईमेल सूचनाएं'
                              : 'Email Notifications'
                          }
                          title={
                            language === 'hi'
                              ? 'ईमेल सूचनाएं'
                              : 'Email Notifications'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi'
                            ? 'SMS सूचनाएं'
                            : 'SMS Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'SMS के माध्यम से सूचनाएं प्राप्त करें'
                            : 'Receive notifications via SMS'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="smsNotifications"
                          name="smsNotifications"
                          type="checkbox"
                          checked={notificationSettings.smsNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              smsNotifications: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi'
                              ? 'SMS सूचनाएं'
                              : 'SMS Notifications'
                          }
                          title={
                            language === 'hi'
                              ? 'SMS सूचनाएं'
                              : 'SMS Notifications'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi'
                            ? 'पुश सूचनाएं'
                            : 'Push Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'ब्राउज़र पुश सूचनाएं प्राप्त करें'
                            : 'Receive browser push notifications'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="pushNotifications"
                          name="pushNotifications"
                          type="checkbox"
                          checked={notificationSettings.pushNotifications}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              pushNotifications: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi'
                              ? 'पुश सूचनाएं'
                              : 'Push Notifications'
                          }
                          title={
                            language === 'hi'
                              ? 'पुश सूचनाएं'
                              : 'Push Notifications'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi'
                            ? 'मार्केटिंग ईमेल'
                            : 'Marketing Emails'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'मार्केटिंग और प्रमोशनल ईमेल प्राप्त करें'
                            : 'Receive marketing and promotional emails'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="marketingEmails"
                          name="marketingEmails"
                          type="checkbox"
                          checked={notificationSettings.marketingEmails}
                          onChange={(e) =>
                            setNotificationSettings({
                              ...notificationSettings,
                              marketingEmails: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi'
                              ? 'मार्केटिंग ईमेल'
                              : 'Marketing Emails'
                          }
                          title={
                            language === 'hi'
                              ? 'मार्केटिंग ईमेल'
                              : 'Marketing Emails'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === 'hi'
                      ? 'गोपनीयता सेटिंग्स'
                      : 'Privacy Settings'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="profileVisibility"
                        className="mb-2 block text-sm font-medium text-gray-700"
                      >
                        {language === 'hi'
                          ? 'प्रोफ़ाइल दृश्यता'
                          : 'Profile Visibility'}
                      </label>
                      <select
                        id="profileVisibility"
                        name="profileVisibility"
                        value={privacySettings.profileVisibility}
                        onChange={(e) =>
                          setPrivacySettings({
                            ...privacySettings,
                            profileVisibility: e.target.value,
                          })
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        aria-label={
                          language === 'hi'
                            ? 'प्रोफ़ाइल दृश्यता'
                            : 'Profile Visibility'
                        }
                        title={
                          language === 'hi'
                            ? 'प्रोफ़ाइल दृश्यता चयन करें'
                            : 'Select profile visibility'
                        }
                      >
                        <option value="public">
                          {language === 'hi' ? 'सार्वजनिक' : 'Public'}
                        </option>
                        <option value="private">
                          {language === 'hi' ? 'निजी' : 'Private'}
                        </option>
                        <option value="lawyers">
                          {language === 'hi'
                            ? 'केवल वकीलों के लिए'
                            : 'Lawyers Only'}
                        </option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi' ? 'ईमेल दिखाएं' : 'Show Email'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'अन्य उपयोगकर्ताओं को आपका ईमेल दिखाएं'
                            : 'Show your email to other users'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="showEmail"
                          name="showEmail"
                          type="checkbox"
                          checked={privacySettings.showEmail}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              showEmail: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi' ? 'ईमेल दिखाएं' : 'Show Email'
                          }
                          title={
                            language === 'hi' ? 'ईमेल दिखाएँ' : 'Show email'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi'
                            ? 'फोन नंबर दिखाएं'
                            : 'Show Phone Number'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'अन्य उपयोगकर्ताओं को आपका फोन नंबर दिखाएं'
                            : 'Show your phone number to other users'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="showPhone"
                          name="showPhone"
                          type="checkbox"
                          checked={privacySettings.showPhone}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              showPhone: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi'
                              ? 'फोन नंबर दिखाएं'
                              : 'Show Phone Number'
                          }
                          title={
                            language === 'hi'
                              ? 'फोन नंबर दिखाएँ'
                              : 'Show phone number'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {language === 'hi'
                            ? 'वकील संपर्क की अनुमति दें'
                            : 'Allow Lawyer Contact'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {language === 'hi'
                            ? 'वकीलों को आपसे संपर्क करने की अनुमति दें'
                            : 'Allow lawyers to contact you'}
                        </p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          id="allowLawyerContact"
                          name="allowLawyerContact"
                          type="checkbox"
                          checked={privacySettings.allowLawyerContact}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              allowLawyerContact: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                          aria-label={
                            language === 'hi'
                              ? 'वकील संपर्क की अनुमति दें'
                              : 'Allow Lawyer Contact'
                          }
                          title={
                            language === 'hi'
                              ? 'वकील संपर्क की अनुमति दें'
                              : 'Allow lawyer contact'
                          }
                        />
                        <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
