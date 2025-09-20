/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
  language?: 'en' | 'hi'
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login',
  language = 'en',
}: AuthModalProps) {
  const { login, register, isLoading } = useAuth()
  const [mode, setMode] = useState<'login' | 'register' | '2fa'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    district: '',
    state: '',
    role: 'user' as 'user' | 'lawyer',
    twoFactorCode: '',
    // Lawyer specific fields
    barCouncilNumber: '',
    practiceAreas: [] as string[],
    districts: [] as string[],
    languages: ['en'] as string[],
    bio: '',
    consultationFee: 0,
  })

  const practiceAreaOptions = [
    'Criminal Law',
    'Civil Law',
    'Family Law',
    'Corporate Law',
    'Tax Law',
    'Property Law',
    'Constitutional Law',
    'Labor Law',
    'Intellectual Property',
    'Environmental Law',
    'Banking Law',
    'Immigration Law',
    'Personal Injury',
    'Real Estate Law',
    'Consumer Protection',
    'Cyber Law',
    'Medical Malpractice',
    'Estate Planning',
    'Bankruptcy Law',
  ]

  const districtOptions = [
    'Delhi',
    'Mumbai',
    'Bangalore',
    'Chennai',
    'Kolkata',
    'Hyderabad',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Surat',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Pimpri-Chinchwad',
    'Patna',
    'Vadodara',
  ]

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'bn', label: 'বাংলা' },
    { value: 'te', label: 'తెలుగు' },
    { value: 'mr', label: 'मराठी' },
    { value: 'ta', label: 'தமிழ்' },
    { value: 'ur', label: 'اردو' },
    { value: 'gu', label: 'ગુજરાતી' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'ml', label: 'മലയാളം' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ' },
    { value: 'or', label: 'ଓଡ଼ିଆ' },
  ]

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setError('')
      setSuccess('')
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        district: '',
        state: '',
        role: 'user',
        twoFactorCode: '',
        barCouncilNumber: '',
        practiceAreas: [],
        districts: [],
        languages: ['en'],
        bio: '',
        consultationFee: 0,
      })
    }
  }, [isOpen, initialMode])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await login(formData.email, formData.password)
      setSuccess(
        language === 'hi' ? 'सफलतापूर्वक लॉगिन हुआ' : 'Successfully logged in'
      )
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (error: any) {
      if (error.message === '2FA_REQUIRED') {
        setMode('2fa')
      } else {
        setError(
          error.message ||
            (language === 'hi' ? 'लॉगिन में त्रुटि' : 'Login failed')
        )
      }
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password !== formData.confirmPassword) {
      setError(
        language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : 'Passwords do not match'
      )
      return
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        district: formData.district,
        state: formData.state,
        role: formData.role,
        language: 'en', // Default to English for now
      }

      if (formData.role === 'lawyer') {
        Object.assign(userData, {
          barCouncilNumber: formData.barCouncilNumber,
          practiceAreas: formData.practiceAreas,
          districts: formData.districts,
          languages: formData.languages,
          bio: formData.bio,
        })
      }

      await register(userData)
      setSuccess(
        language === 'hi'
          ? 'खाता सफलतापूर्वक बनाया गया'
          : 'Account created successfully'
      )
      setTimeout(() => {
        setMode('login')
      }, 2000)
    } catch (error: any) {
      setError(
        error.message ||
          (language === 'hi' ? 'रजिस्ट्रेशन में त्रुटि' : 'Registration failed')
      )
    }
  }

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const { verify2FA } = useAuth()
      await verify2FA(formData.email, formData.twoFactorCode)
      setSuccess(
        language === 'hi'
          ? '2FA सफलतापूर्वक सत्यापित'
          : '2FA successfully verified'
      )
      setTimeout(() => {
        onClose()
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative mx-4 w-full max-w-md">
        <Card className="max-h-[90vh] overflow-y-auto">
          <CardHeader className="relative">
            <CardTitle className="text-center text-2xl font-bold">
              {mode === 'login' &&
                (language === 'hi' ? 'लॉगिन करें' : 'Sign In')}
              {mode === 'register' &&
                (language === 'hi' ? 'रजिस्टर करें' : 'Sign Up')}
              {mode === '2fa' &&
                (language === 'hi'
                  ? 'दो-कारक प्रमाणीकरण'
                  : 'Two-Factor Authentication')}
            </CardTitle>
            <button
              onClick={onClose}
              title="Close"
              className="absolute right-4 top-4 rounded-full p-2 transition-colors hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>

          <CardContent className="space-y-4">
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

            {/* Login Form */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'ईमेल' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना ईमेल दर्ज करें'
                          : 'Enter your email'
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना पासवर्ड दर्ज करें'
                          : 'Enter your password'
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  {language === 'hi' ? 'लॉगिन' : 'Sign In'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {language === 'hi'
                      ? 'खाता नहीं है? रजिस्टर करें'
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </form>
            )}

            {/* Register Form */}
            {mode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'नाम' : 'Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange('name', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना नाम दर्ज करें'
                          : 'Enter your name'
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'ईमेल' : 'Email'}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना ईमेल दर्ज करें'
                          : 'Enter your email'
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'फोन नंबर' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना फोन नंबर दर्ज करें'
                          : 'Enter your phone number'
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'भूमिका' : 'Role'}
                  </label>
                  <select
                    title="Role"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="user">
                      {language === 'hi' ? 'उपयोगकर्ता' : 'User'}
                    </option>
                    <option value="lawyer">
                      {language === 'hi' ? 'वकील' : 'Lawyer'}
                    </option>
                  </select>
                </div>

                {formData.role === 'lawyer' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {language === 'hi'
                          ? 'बार काउंसिल नंबर'
                          : 'Bar Council Number'}
                      </label>
                      <input
                        type="text"
                        value={formData.barCouncilNumber}
                        onChange={(e) =>
                          handleInputChange('barCouncilNumber', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          language === 'hi'
                            ? 'बार काउंसिल नंबर दर्ज करें'
                            : 'Enter bar council number'
                        }
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {language === 'hi'
                          ? 'अभ्यास क्षेत्र'
                          : 'Practice Areas'}
                      </label>
                      <select
                        title="Practice Areas"
                        multiple
                        value={formData.practiceAreas}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                          handleInputChange('practiceAreas', selected)
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                        size={3}
                      >
                        {practiceAreaOptions.map((area) => (
                          <option key={area} value={area}>
                            {area}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'जिले' : 'Districts'}
                      </label>
                      <select
                        title="Districts"
                        multiple
                        value={formData.districts}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                          handleInputChange('districts', selected)
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                        size={3}
                      >
                        {districtOptions.map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'भाषाएं' : 'Languages'}
                      </label>
                      <select
                        title="Languages"
                        multiple
                        value={formData.languages}
                        onChange={(e) => {
                          const selected = Array.from(
                            e.target.selectedOptions,
                            (option) => option.value
                          )
                          handleInputChange('languages', selected)
                        }}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                        size={3}
                      >
                        {languageOptions.map((lang) => (
                          <option key={lang.value} value={lang.value}>
                            {lang.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        {language === 'hi' ? 'जीवनी' : 'Bio'}
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange('bio', e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                        placeholder={
                          language === 'hi'
                            ? 'अपनी जीवनी दर्ज करें'
                            : 'Enter your bio'
                        }
                        rows={3}
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi' ? 'पासवर्ड' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'अपना पासवर्ड दर्ज करें'
                          : 'Enter your password'
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {language === 'hi'
                      ? 'पासवर्ड की पुष्टि करें'
                      : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange('confirmPassword', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                      placeholder={
                        language === 'hi'
                          ? 'पासवर्ड की पुष्टि करें'
                          : 'Confirm your password'
                      }
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : null}
                  {language === 'hi' ? 'रजिस्टर' : 'Sign Up'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {language === 'hi'
                      ? 'पहले से खाता है? लॉगिन करें'
                      : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            )}

            {/* 2FA Form */}
            {mode === '2fa' && (
              <form onSubmit={handle2FA} className="space-y-4">
                <div className="text-center">
                  <Shield className="mx-auto mb-4 h-12 w-12 text-indigo-600" />
                  <h3 className="mb-2 text-lg font-semibold">
                    {language === 'hi'
                      ? 'दो-कारक प्रमाणीकरण'
                      : 'Two-Factor Authentication'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {language === 'hi'
                      ? 'अपने ऑथेंटिकेटर ऐप में दिखाई गई 6-अंकीय कोड दर्ज करें'
                      : 'Enter the 6-digit code shown in your authenticator app'}
                  </p>
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-center text-lg tracking-widest focus:border-transparent focus:ring-2 focus:ring-indigo-500"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  {isLoading ? (
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Shield className="mr-2 h-4 w-4" />
                  )}
                  {language === 'hi' ? 'सत्यापित करें' : 'Verify'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
