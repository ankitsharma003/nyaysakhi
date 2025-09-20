'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User, Star, Edit, Camera } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

export default function LawyerProfilePage() {
  const router = useRouter()
  const { user, lawyerProfile, isAuthenticated, isLoading } = useAuth()
  const [language, setLanguage] = useState<'en' | 'hi'>('en')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: lawyerProfile?.bio || '',
    barCouncilNumber: lawyerProfile?.barCouncilNumber || '',
    experience: lawyerProfile?.experience || 0,
    consultationFee: lawyerProfile?.consultationFee || 0,
    practiceAreas: lawyerProfile?.practiceAreas || [],
    languages: lawyerProfile?.languages || [],
    districts: lawyerProfile?.districts || [],
  })

  // Redirect if not authenticated or not a lawyer
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'lawyer')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user?.role, router])

  // Update profile data when user/lawyerProfile changes
  useEffect(() => {
    if (user && lawyerProfile) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: lawyerProfile.bio || '',
        barCouncilNumber: lawyerProfile.barCouncilNumber || '',
        experience: lawyerProfile.experience || 0,
        consultationFee: lawyerProfile.consultationFee || 0,
        practiceAreas: lawyerProfile.practiceAreas || [],
        languages: lawyerProfile.languages || [],
        districts: lawyerProfile.districts || [],
      })
    }
  }, [user, lawyerProfile])

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

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
    // Show success message
  }

  const practiceAreasOptions = [
    'Criminal Law',
    'Family Law',
    'Corporate Law',
    'Property Law',
    'Constitutional Law',
    'Tax Law',
    'Labor Law',
    'Intellectual Property',
  ]

  const languageOptions = [
    'Hindi',
    'English',
    'Marathi',
    'Gujarati',
    'Bengali',
    'Tamil',
    'Telugu',
    'Kannada',
  ]

  // const districtOptions = [
  //   'Delhi',
  //   'Mumbai',
  //   'Bangalore',
  //   'Chennai',
  //   'Kolkata',
  //   'Hyderabad',
  //   'Pune',
  //   'Ahmedabad',
  // ]

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

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'hi' ? 'प्रोफ़ाइल सेटिंग्स' : 'Profile Settings'}
          </h1>
          <p className="mt-2 text-gray-600">
            {language === 'hi'
              ? 'अपनी प्रोफ़ाइल और सेटिंग्स अपडेट करें'
              : 'Update your profile and settings'}
          </p>
        </div>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100">
                  <User className="h-12 w-12 text-indigo-600" />
                </div>
                <button
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                  title={
                    language === 'hi'
                      ? 'प्रोफ़ाइल फोटो अपलोड करें'
                      : 'Upload profile photo'
                  }
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.name}
                </h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {lawyerProfile?.rating || 4.8}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {lawyerProfile?.totalReviews || 0}{' '}
                    {language === 'hi' ? 'समीक्षाएं' : 'reviews'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {lawyerProfile?.experience || 0}{' '}
                    {language === 'hi' ? 'वर्ष अनुभव' : 'years experience'}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
              >
                <Edit className="mr-2 h-4 w-4" />
                {isEditing
                  ? language === 'hi'
                    ? 'रद्द करें'
                    : 'Cancel'
                  : language === 'hi'
                    ? 'संपादित करें'
                    : 'Edit'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {language === 'hi' ? 'मूल जानकारी' : 'Basic Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'नाम' : 'Name'}
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  aria-label={language === 'hi' ? 'नाम' : 'Name'}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'ईमेल' : 'Email'}
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  aria-label={language === 'hi' ? 'ईमेल' : 'Email'}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  aria-label={language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi'
                    ? 'बार काउंसिल नंबर'
                    : 'Bar Council Number'}
                </label>
                <input
                  type="text"
                  value={profileData.barCouncilNumber}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      barCouncilNumber: e.target.value,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  aria-label={
                    language === 'hi'
                      ? 'बार काउंसिल नंबर'
                      : 'Bar Council Number'
                  }
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {language === 'hi' ? 'बायो' : 'Bio'}
              </label>
              <textarea
                value={profileData.bio}
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
                disabled={!isEditing}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                placeholder={
                  language === 'hi'
                    ? 'अपने बारे में कुछ बताएं...'
                    : 'Tell us about yourself...'
                }
                aria-label={language === 'hi' ? 'बायो' : 'Bio'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {language === 'hi'
                ? 'व्यावसायिक जानकारी'
                : 'Professional Information'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (Years)'}
                </label>
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      experience: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  aria-label={
                    language === 'hi' ? 'अनुभव (वर्ष)' : 'Experience (Years)'
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {language === 'hi'
                    ? 'परामर्श शुल्क (₹)'
                    : 'Consultation Fee (₹)'}
                </label>
                <input
                  type="number"
                  value={profileData.consultationFee}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      consultationFee: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
                  aria-label={
                    language === 'hi'
                      ? 'परामर्श शुल्क (₹)'
                      : 'Consultation Fee (₹)'
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Practice Areas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {language === 'hi' ? 'अभ्यास क्षेत्र' : 'Practice Areas'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {practiceAreasOptions.map((area) => (
                <label key={area} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profileData.practiceAreas.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfileData({
                          ...profileData,
                          practiceAreas: [...profileData.practiceAreas, area],
                        })
                      } else {
                        setProfileData({
                          ...profileData,
                          practiceAreas: profileData.practiceAreas.filter(
                            (a) => a !== area
                          ),
                        })
                      }
                    }}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{language === 'hi' ? 'भाषाएं' : 'Languages'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {languageOptions.map((lang) => (
                <label key={lang} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={profileData.languages.includes(lang)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setProfileData({
                          ...profileData,
                          languages: [...profileData.languages, lang],
                        })
                      } else {
                        setProfileData({
                          ...profileData,
                          languages: profileData.languages.filter(
                            (l) => l !== lang
                          ),
                        })
                      }
                    }}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-700">{lang}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving
                ? language === 'hi'
                  ? 'सेव हो रहा है...'
                  : 'Saving...'
                : language === 'hi'
                  ? 'सेव करें'
                  : 'Save Changes'}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
